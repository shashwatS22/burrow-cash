

import { BigInt, log, near,json,JSONValue, BigDecimal, TypedMap } from "@graphprotocol/graph-ts";

import { Borrow, Withdraw, Token, Market,Deposit,Liquidate,Repay } from "../../generated/schema";
import { ContractAddress, ONE_YOCTO, TokenData, TOKENS_CONTRACT_DATA } from "../common/constants";
import { ProtocolName, ProtocolType } from "../common/constants";
import { getOrCreateBorrow, getOrCreateDeposit, getOrCreateLiquidate, getOrCreateMarket, getOrCreateRepay, getOrCreateWithdraw } from "./initializers";
import { getOrCreateToken } from "./initializers";
import { updateIntererstRate } from "./market";
import { updateSnapshots } from "./snapshots";
export function handleWithdraw(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>): void { 
  
  let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  

  
  let withdraw = getOrCreateWithdraw(functionCallAction,receipt,outcome,block,eventObject,index,eventData);
   
    withdraw.hash = receipt.id.toBase58();
    withdraw.from = ContractAddress.BURROW_MAIN;
    withdraw.to = (eventData.get("account_id") as JSONValue).toString();
    withdraw.timestamp = BigInt.fromU64(block.header.timestampNanosec);
    withdraw.amount = BigInt.fromString((eventData.get("amount") as JSONValue).toString());
    withdraw.blockNumber = BigInt.fromU64(block.header.height);
  
    withdraw.logIndex = index;
    withdraw.protocol =ContractAddress.BURROW_MAIN;
    withdraw.amountUSD = (asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO);
    withdraw.asset = (eventData.get("token_id") as JSONValue).toString();
    withdraw.market =(eventData.get("token_id") as JSONValue).toString();
    withdraw.save();
 
    let market = Market.load((eventData.get("token_id") as JSONValue).toString()) as Market;

    let withdrawsList = market.withdraws as string[];
    withdrawsList.push(withdraw.id);

    market.withdraws = withdrawsList;
    market.inputTokenBalance = market.inputTokenBalance.minus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    market.totalDepositBalanceUSD = market.totalBorrowBalanceUSD.minus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
    updateIntererstRate(functionCallAction, receipt, outcome, block,  eventObject, index,eventData);
    market.save();
    updateSnapshots(functionCallAction, receipt, outcome, block, eventObject, index, eventData);
  
}
export function handleRepay(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>): void  { 
    
    let repay = getOrCreateRepay(functionCallAction,receipt,outcome,block,eventObject,index,eventData);
   let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  
    repay.hash =receipt.id.toBase58();
    repay.logIndex = index;
    repay.protocol = ContractAddress.BURROW_MAIN;
    repay.to = ContractAddress.BURROW_MAIN;
    repay.from = (eventData.get("account_id") as JSONValue).toString();
    repay.blockNumber =BigInt.fromString (block.header.height.toString());
    repay.timestamp = BigInt.fromString(block.header.timestampNanosec.toString());
    repay.market = (eventData.get("token_id") as JSONValue).toString();
    repay.asset = (eventData.get("token_id") as JSONValue).toString();
    repay.amount = BigInt.fromString((eventData.get("amount") as JSONValue).toString());
    repay.amountUSD =  (asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO);
    repay.save();
        //inputTokenBalance: BigInt!
//cumulativeLiquidateUSD: BigDecimal!
    // cumulativeBorrowUSD: BigDecimal!
    //  totalBorrowBalanceUSD: BigDecimal!
    //cumulativeDepositUSD: BigDecimal!
    //totalDepositBalanceUSD: BigDecimal!
    //totalValueLockedUSD: BigDecimal!
    //rates: [InterestRate!]!
    let market = Market.load((eventData.get("token_id") as JSONValue).toString()) as Market;
    let repaysList = market.repays as string[];
    repaysList.push(repay.id);
    market.repays = repaysList;
    market.inputTokenBalance = market.inputTokenBalance.plus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    market.totalDepositBalanceUSD = market.totalBorrowBalanceUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
//TODO calculate and add interest to reserved supplied and total balance

    updateIntererstRate(functionCallAction, receipt, outcome, block,  eventObject, index,eventData);
    market.save();





}
export function handleLiquidate(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>): void  { 
    let liquidate = getOrCreateLiquidate(functionCallAction, receipt, outcome, block, eventObject, index, eventData);
    let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  
    liquidate.hash = receipt.id.toBase58();
    liquidate.logIndex = index;
    liquidate.protocol = ContractAddress.BURROW_MAIN;
    liquidate.to = "";
    liquidate.from = "";
    liquidate.blockNumber =BigInt.fromString (block.header.height.toString());
    liquidate.timestamp = BigInt.fromString(block.header.timestampNanosec.toString());
    liquidate.market = "";
    liquidate.asset = "";
    liquidate.amount = "";
    liquidate.amountUSD =  (asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO);
    liquidate.profitUSD = "";
    liquidate.save();
    // &account_id,
    //         &liquidation_account_id,
    //         &collateral_taken_sum,
    //         &borrowed_repaid_sum,

}
export function handleDeposit(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>): void  {
 let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
 let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  
    let deposit = getOrCreateDeposit(functionCallAction, receipt, outcome, block, eventObject, index, eventData);
    deposit.hash = receipt.id.toBase58();
    deposit.logIndex = index;
    deposit.protocol = ContractAddress.BURROW_MAIN;
    deposit.to = ContractAddress.BURROW_MAIN;
    deposit.from = (eventData.get("account_id") as JSONValue).toString();
    deposit.blockNumber =BigInt.fromString (block.header.height.toString());
    deposit.timestamp = BigInt.fromString(block.header.timestampNanosec.toString());
    deposit.market = (eventData.get("token_id") as JSONValue).toString();
    deposit.asset = (eventData.get("token_id") as JSONValue).toString();
    deposit.amount = BigInt.fromString((eventData.get("amount") as JSONValue).toString());
    deposit.amountUSD = (asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO);

    deposit.save();
    let market = Market.load((eventData.get("token_id") as JSONValue).toString()) as Market;
    let depositsList = market.repays as string[];
    depositsList.push(deposit.id);
    market.deposits = depositsList;
    market.inputTokenBalance = market.inputTokenBalance.plus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    updateIntererstRate(functionCallAction, receipt, outcome, block,  eventObject, index,eventData);
  
    market.totalDepositBalanceUSD = market.totalDepositBalanceUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
    market.cumulativeDepositUSD = market.cumulativeDepositUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
      
    market.save();
    updateSnapshots(functionCallAction, receipt, outcome, block, eventObject, index, eventData);

 }
export function handleBorrow(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>): void {
     let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
 let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
 
    let borrow = getOrCreateBorrow(functionCallAction, receipt, outcome, block, eventObject, index, eventData);
    borrow.hash = receipt.id.toBase58();
    borrow.logIndex = index;
    borrow.protocol = ContractAddress.BURROW_MAIN;
    borrow.to = (eventData.get("account_id") as JSONValue).toString();
    borrow.from = ContractAddress.BURROW_MAIN;
    borrow.blockNumber =BigInt.fromString (block.header.height.toString());
    borrow.timestamp = BigInt.fromString(block.header.timestampNanosec.toString());
    borrow.market = (eventData.get("token_id") as JSONValue).toString();
    borrow.asset = (eventData.get("token_id") as JSONValue).toString();
    borrow.amount = BigInt.fromString((eventData.get("amount") as JSONValue).toString());;
    borrow.amountUSD = (asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO);
    borrow.save();
    let market = Market.load((eventData.get("token_id") as JSONValue).toString()) as Market;
    let borrowsList = market.repays as string[];
    borrowsList.push(borrow.id);
    market.repays = borrowsList;
    market.cumulativeBorrowUSD = market.cumulativeBorrowUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
    market.totalBorrowBalanceUSD = market.totalBorrowBalanceUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
    market.inputTokenBalance = market.inputTokenBalance.minus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    updateIntererstRate(functionCallAction, receipt, outcome, block,  eventObject, index,eventData);
    market.save();
    updateSnapshots(functionCallAction, receipt, outcome, block, eventObject, index, eventData);

}

export function handleDepositToReserve(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>): void{
    let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
    
}


export function handleIncreaseCollateral(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>) :void{
      let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
}

export function handleDecreaseCollateral(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>) :void{
      let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
}
export function handleForceClose(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>) :void{
      let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
}
// const args = json.fromBytes(functionCall.args).toObject();
//   const ownerId = (args.get("owner_id") as JSONValue).toString();
//   const exchangeFee = (args.get("exchange_fee") as JSONValue).toBigInt();
//   const referralFee = (args.get("referral_fee") as JSONValue).toBigInt();
// let parsed = outcomeLog.replace('EVENT_JSON:', '')

//       let jsonData = json.try_fromString(parsed)
//       const jsonObject = jsonData.value.toObject()

//       let eventData = jsonObject.get('data')
//       if (eventData) {
//         let eventArray:JSONValue[] = eventData.toArray()

//         let data = eventArray[0].toObject()
//         const tokenIds = data.get('token_ids')
//         const owner_id = data.get('owner_id')
//         if (!tokenIds || !owner_id) return

//         let ids:JSONValue[] = tokenIds.toArray()
