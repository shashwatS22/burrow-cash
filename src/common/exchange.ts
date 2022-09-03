

import { BigInt, log, near,json,JSONValue, BigDecimal, TypedMap } from "@graphprotocol/graph-ts";
import { Borrow, Withdraw, Token, Market,Deposit,Liquidate,Repay, Supplied } from "../../generated/schema";
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO, ContractAddress, ONE_YOCTO, TokenData, TOKENS_CONTRACT_DATA } from "../common/constants";
import { ProtocolName, ProtocolType } from "../common/constants";
import { getOrCreateAccount, getOrCreateBorrow, getOrCreateBorrowed, getOrCreateCollateral, getOrCreateDeposit, getOrCreateLiquidate, getOrCreateMarket, getOrCreateRepay, getOrCreateSupplied, getOrCreateWithdraw } from "./initializers";
import { getOrCreateToken } from "./initializers";
// import { updateIntererstRate } from "./market";
import { updateSnapshots } from "./snapshots";
export function handleWithdraw(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, index: number,eventData:TypedMap<string, JSONValue>): void { 
  
  let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  

  
  let withdraw = getOrCreateWithdraw(receipt,index,eventData);
   
    withdraw.hash = receipt.id.toBase58();
    withdraw.from = ContractAddress.BURROW_MAIN;
    withdraw.to = (eventData.get("account_id") as JSONValue).toString();
    withdraw.timestamp = BigInt.fromU64(block.header.timestampNanosec);
    withdraw.amount = BigInt.fromString((eventData.get("amount") as JSONValue).toString());
    withdraw.blockNumber = BigInt.fromU64(block.header.height);
  
    withdraw.logIndex = index;
    withdraw.protocol =ContractAddress.BURROW_MAIN;
    withdraw.amountUSD = (asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO);
    withdraw.asset = (eventData.get ("token_id") as JSONValue).toString();
    withdraw.market =(eventData.get("token_id") as JSONValue).toString();
    withdraw.save();
 
    let market = Market.load((eventData.get("token_id") as JSONValue).toString()) as Market;

    let withdrawsList = market.withdraws as string[];
    withdrawsList.push(withdraw.id);

    market.withdraws = withdrawsList;
    market.inputTokenBalance = market.inputTokenBalance.minus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    market.totalDepositBalanceUSD = market.totalBorrowBalanceUSD.minus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
    // updateIntererstRate(functionCallAction, receipt, outcome, block,  eventObject, index,eventData);
    market.save();
    updateSnapshots(functionCallAction, receipt, outcome, block,  index, eventData);

    let supplied = getOrCreateSupplied((eventData.get("account_id") as JSONValue).toString(), (eventData.get("token_id") as JSONValue).toString())
    supplied.balance = supplied.balance.minus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    supplied.save();
  
}
export function handleRepay(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, index: number,eventData:TypedMap<string, JSONValue>): void  { 
    
    let repay = getOrCreateRepay(receipt,index,eventData);
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
// cumulativeBorrowUSD: BigDecimal!
    //  totalBorrowBalanceUSD: BigDecimal!
    //cumulativeDepositUSD: BigDecimal!
    
    //totalValueLockedUSD: BigDecimal!
    let market = Market.load((eventData.get("token_id") as JSONValue).toString()) as Market;
    let repaysList = market.repays as string[];
    repaysList.push(repay.id);
    market.repays = repaysList;
    market.inputTokenBalance = market.inputTokenBalance.plus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    market.totalDepositBalanceUSD = market.totalBorrowBalanceUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
//TODO calculate and add interest to reserved supplied and total balance
    
    // updateIntererstRate(functionCallAction, receipt, outcome, block,  eventObject, index,eventData);
    market.save();
 let borrowed = getOrCreateBorrowed((eventData.get("account_id") as JSONValue).toString(), (eventData.get("token_id") as JSONValue).toString())
    borrowed.balance = borrowed.balance.minus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    borrowed.save();
    updateHealthScore((eventData.get("account_id") as JSONValue).toString());

   
}
export function handleLiquidate(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,  index: number,eventData:TypedMap<string, JSONValue>): void  { 
    let liquidate = getOrCreateLiquidate( receipt, index, eventData);
    let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  
    liquidate.hash = receipt.id.toBase58();
    liquidate.logIndex = index;
    liquidate.protocol = ContractAddress.BURROW_MAIN;
    liquidate.to = (eventData.get("account_id") as JSONValue ).toString();
    liquidate.from = (eventData.get("liquidation_account_id") as JSONValue ).toString();
    liquidate.blockNumber =BigInt.fromString (block.header.height.toString());
    liquidate.timestamp = BigInt.fromString(block.header.timestampNanosec.toString());
    liquidate.market = "";
    liquidate.asset = "";
    liquidate.amount = BIG_INT_ZERO;
    liquidate.amountUSD = BIG_DECIMAL_ZERO;//(asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO);
    liquidate.profitUSD = BIG_DECIMAL_ZERO;

    liquidate.save();
    //         &account_id,
    //         &liquidation_account_id,
    //         &collateral_taken_sum,
    //         &borrowed_repaid_sum,

}
export function handleDeposit(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,  index: number,eventData:TypedMap<string, JSONValue>): void  {
 let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  
    let deposit = getOrCreateDeposit( receipt, block,  index, eventData);
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
    // updateIntererstRate(functionCallAction, receipt, outcome, block,  eventObject, index,eventData);
  
    market.totalDepositBalanceUSD = market.totalDepositBalanceUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
    market.cumulativeDepositUSD = market.cumulativeDepositUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO));
      
    market.save();
    updateSnapshots(functionCallAction, receipt, outcome, block, index, eventData);
     let supplied = getOrCreateSupplied((eventData.get("account_id") as JSONValue).toString(), (eventData.get("token_id") as JSONValue).toString()) as Supplied;
    supplied.balance = supplied.balance.plus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    supplied.save();
    let account = getOrCreateAccount((eventData.get("account_id") as JSONValue).toString());
    let id = (eventData.get("account_id") as JSONValue).toString().concat("-").concat((eventData.get("token_id") as JSONValue).toString());
    let suppliedList = account.supplied as string[];
    if (!suppliedList.includes(id)) {
        let suppliedList = account.supplied as string[];
        suppliedList.push(id);
        
    }
    account.save();

 }
export function handleBorrow(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,  index: number,eventData:TypedMap<string, JSONValue>): void {
 let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
 
    let borrow = getOrCreateBorrow( receipt,  index, eventData);
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
    // updateIntererstRate();
    market.save();
    updateSnapshots(functionCallAction, receipt, outcome, block, index, eventData);
    
let borrowed = getOrCreateBorrowed((eventData.get("account_id") as JSONValue).toString(), (eventData.get("token_id") as JSONValue).toString())
    borrowed.balance = borrowed.balance.minus(BigInt.fromString((eventData.get("amount") as JSONValue).toString()));
    borrowed.save();

     
    let account = getOrCreateAccount((eventData.get("account_id") as JSONValue).toString());
    let id = (eventData.get("account_id") as JSONValue).toString().concat("-").concat((eventData.get("token_id") as JSONValue).toString());
    let borrowedList = account.borrowed as string[];
    if (!borrowedList.includes(id)) {
        let borrowedList = account.borrowed as string[];
        borrowedList.push(id);
        
    }
    account.save();

    updateHealthScore(account.id);
   
}

export function handleDepositToReserve(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,  index: number,eventData:TypedMap<string, JSONValue>): void{
    let marketId = (eventData.get("token_id") as JSONValue).toString();
     let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  
    let market = Market.load(marketId) as Market;
    market.totalValueLockedUSD = market.totalValueLockedUSD.plus((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((eventData.get("amount") as JSONValue).toString())).times(ONE_YOCTO))
    market.save();
    // updateIntererstRate(functionCallAction, receipt, outcome, block, eventObject, index, eventData);

}


export function handleIncreaseCollateral(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,  index: number,eventData:TypedMap<string, JSONValue>) :void{
    let account = getOrCreateAccount((eventData.get("account_id") as JSONValue).toString());
    let tokenId = (eventData.get("token_id") as JSONValue).toString();
    let collateral = getOrCreateCollateral(account.id, tokenId);
    let supplied = getOrCreateSupplied(account.id, tokenId);
    let id = account.id.concat("-").concat(tokenId);
    if (!eventData.get("amount")) {
        collateral.balance = collateral.balance.plus(supplied.balance);
        supplied.balance = BIG_INT_ZERO;

          
    } else {
    let amount=BigInt.fromString((eventData.get("token_id") as JSONValue).toString())
        collateral.balance = collateral.balance.plus(amount);
        supplied.balance = collateral.balance.minus(amount);

    }
    let collateralList=account.collateral as string[];
    if (!collateralList.includes(id)) {

        let colllateralListTemp = account.collateral as string[];
        colllateralListTemp.push(id);
        account.collateral = colllateralListTemp;
    }
    account.save();
    collateral.save();
    supplied.save();

    updateHealthScore(account.id);    
}

export function handleDecreaseCollateral(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,  index: number,eventData:TypedMap<string, JSONValue>) :void{
     let account = getOrCreateAccount((eventData.get("account_id") as JSONValue).toString());
     let tokenId = (eventData.get("token_id") as JSONValue).toString();
     let collateral = getOrCreateCollateral(account.id, tokenId);
     let supplied = getOrCreateSupplied(account.id, tokenId);
   if (!eventData.get("amount")) {
        collateral.balance = BIG_INT_ZERO;
        supplied.balance = supplied.balance.plus(collateral.balance);          
      
   } else {
    let amount=BigInt.fromString((eventData.get("token_id") as JSONValue).toString())
        supplied.balance = supplied.balance.plus(amount);
        collateral.balance = supplied.balance.minus(amount);
    }
    account.save();
    collateral.save();
    supplied.save();
    updateHealthScore(account.id);
}
export function handleForceClose(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,  index: number,eventData:TypedMap<string, JSONValue>) :void{
      let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
}

export function updateHealthScore(accountId: string):void {
    let account = getOrCreateAccount(accountId);
    let adjustedCollateralSum = BIG_DECIMAL_ZERO;
    let adjustedBorrowedSum = BIG_DECIMAL_ZERO;
    let collateralList = account.collateral as string[];
    let borrowedList = account.borrowed as string[];
     if(borrowedList.length == 0 || collateralList.length != 0) {
        account.healthScore = BIG_DECIMAL_ZERO;
         account.save();
         return;
    }
    if (collateralList.length != 0) {
        for (let i = 0; i < collateralList.length; i++){
            let tempCollateral = getOrCreateCollateral(collateralList[i].split("-")[0],collateralList[i].split("-")[1]);//{account id}-{token id} 
            let token = getOrCreateToken(collateralList[i].split("-")[1]);
            let market = Market.load(collateralList[i].split("-")[1]) as Market;
            adjustedCollateralSum = adjustedCollateralSum.plus(BigDecimal.fromString(tempCollateral.balance.toString()).times(token.lastPriceUSD as BigDecimal).times(market.maximumLTV).times(BigDecimal.fromString("100")));
        }
    }
    if (borrowedList.length != 0) {
        for (let i = 0; i < borrowedList.length; i++){
            let tempBorrowed = getOrCreateBorrowed(borrowedList[i].split("-")[0],borrowedList[i].split("-")[1]);//{account id}-{token id} 
            let token = getOrCreateToken(borrowedList[i].split("-")[1]);
            let market = Market.load(borrowedList[i].split("-")[1]) as Market;
            adjustedBorrowedSum = adjustedBorrowedSum.plus(BigDecimal.fromString(tempBorrowed.balance.toString()).times(token.lastPriceUSD as BigDecimal).times(market.maximumLTV).times(BigDecimal.fromString("100")));
        }
    }

    account.healthScore = adjustedCollateralSum.div(adjustedBorrowedSum);
    account.save();

    
    
    
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


//account to be updated when a account supplies, borrows, increase or decreases collateral


// on inrease collateral -- if amount is null then put all amount from supplied to collateral else if amount is given then take the 