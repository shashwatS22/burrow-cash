

// import { BigInt, log, near,json,JSONValue, BigDecimal } from "@graphprotocol/graph-ts";

// import { Borrow, Withdraw, Token, Market } from "../../generated/schema";
// import { TokenData, TOKENS_CONTRACT_DATA } from "../common/constants";
// import { ProtocolName, ProtocolType } from "../common/constants";
// import { getOrCreateToken } from "./token";
// export function handleWithdraw(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number): void { 
  
//   let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
//   //getOrCreateMarket()
//   //createOrgetdailySnapshop()
//   let asset:Token = getOrCreateToken(eventObject["data"][0]["token_id"]);
//   //createOrgetProtocol()

  
//   let withdraw = Withdraw.load(transactionId);
//   if (!withdraw) {
//     withdraw = new Withdraw(receipt
//       .id.toBase58());
    
  
 


//     withdraw.hash = receipt.id.toBase58();
//     withdraw.from = "contract.main.burrow.near";
//     withdraw.to = eventObject["data"][0]["account_id"];
//     withdraw.timestamp = BigInt.fromU64(block.header.timestampNanosec);
//     withdraw.amount = BigInt.fromString(eventObject["data"][0]["amount"]);
//     withdraw.blockNumber = BigInt.fromU64(block.header.height);
  
//     withdraw.logIndex = index;
//     withdraw.protocol =ProtocolName.BURROW;
//     withdraw.amountUSD = asset.lastPriceUSD;
//     withdraw.asset = eventObject["data"][0]["token_id"];
//     withdraw.market = eventObject["data"][0]["token_id"];
//   }
    
  
// }
// export function handleRepay(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number): void  { }
// export function handleLiquidate(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number): void  { }
// export function handleDeposit(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number): void  { }
// export function handleBorrow(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number): void {}