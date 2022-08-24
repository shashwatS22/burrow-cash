
import { BigInt, log, near,json,JSONValue, BigDecimal, TypedMap } from "@graphprotocol/graph-ts";

import { Borrow, Withdraw, Token, Market } from "../../generated/schema";
import { handleBorrow, handleDecreaseCollateral, handleDeposit, handleDepositToReserve, handleForceClose, handleIncreaseCollateral, handleLiquidate, handleRepay, handleWithdraw } from "../common/exchange";
import { getOrCreateMarket } from "../common/initializers";
import { createOrEditTokensFromOracle } from "../common/token";
// import { TokenData, TOKENS_CONTRACT_DATA } from "../common/constants";
// import { ProtocolName, ProtocolType } from "../common/constants";
// import { handleWithdraw } from "../common/exchange";
// import { createOrEditTokensFromOracle } from "../common/token";
export function handleReceipt(receiptWithOutcome: near.ReceiptWithOutcome): void {
  
       const receipt = receiptWithOutcome.receipt;
 const outcome = receiptWithOutcome.outcome;
    const block = receiptWithOutcome.block;
    
    const actions = receipt.actions;
    // debugNEARLogs(receipt, outcome, block);
  // log.warning("",receipt.signerId,receipt/)
    
    
    for (let i = 0; i < actions.length; i++){
       handleAction(actions[i],receipt,outcome,block)
    }
}


function handleAction(action: near.ActionValue,
  receipt: near.ActionReceipt,
  outcome: near.ExecutionOutcome,
    block: near.Block): void{
    
    if (action.kind == near.ActionKind.ADD_KEY) {

     }
    
    if (action.kind == near.ActionKind.CREATE_ACCOUNT) { }
    if (action.kind == near.ActionKind.DELETE_ACCOUNT) { }
    if (action.kind == near.ActionKind.DELETE_KEY) { }
    if (action.kind == near.ActionKind.DEPLOY_CONTRACT) { }
    if (action.kind == near.ActionKind.FUNCTION_CALL) { 
      const actionNew = action.toFunctionCall();
      // log.warning("function name {} signerId {} recieverId {} ",[actionNew.methodName,receipt.signerId,receipt.receiverId])
        handleFunctionCall(actionNew, receipt, outcome, block);

    }
    if (action.kind == near.ActionKind.STAKE) { }
    if (action.kind == near.ActionKind.TRANSFER) { }
    
    
    
}
function handleFunctionCall(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block): void{
    const args = json.fromBytes(functionCallAction.args).toObject(); 
  let withdrawLogIndex = 0;
  for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
            let outcomeLogs = outcome.logs;
          let parsableData = outcomeLogs[logIndex].replace("EVENT_JSON:", "");
  
    let eventObject = json.try_fromString(parsableData).value .toObject();
    const eventName = eventObject.get("event") as JSONValue;
        let eventData = eventObject.get("data") as JSONValue;

    if (eventData) {
      let eventArray: JSONValue[] = eventData.toArray()
                

      let data = eventArray[0].toObject();
      handleEvents(functionCallAction, receipt, outcome, block, eventName, eventObject, logIndex, data);
   
    }
    
  }
  
    if (functionCallAction.methodName == "update_config") { }
  if (functionCallAction.methodName == "add_asset") { 
    getOrCreateMarket(functionCallAction,receipt,outcome,block);

      
    }
    if (functionCallAction.methodName == "oracle_on_call") {
        log.warning("oracle_on_call", []);
        for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {

          createOrEditTokensFromOracle(functionCallAction, receipt, outcome, block);

        }
     }
  
  if (functionCallAction.methodName == "add_asset_farm_reward") { 
      
    }
    
    
}


function handleEvents(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,eventName:JSONValue,eventObject:Object,logIndex:number,eventData:TypedMap<string, JSONValue>): void {
   switch (eventName.toString()) {
      case "deposit":
        {
          
          handleDeposit(
           functionCallAction,  receipt,  outcome,  block,eventObject,logIndex,eventData);
          break;
        }
      case "withdraw_succeeded": {
        handleWithdraw(
           functionCallAction,  receipt,  outcome,  block,eventObject,logIndex,eventData);
      }
      case "repay": {
        handleRepay(
          functionCallAction, receipt, outcome, block, eventObject, logIndex,eventData);
        break;
        
      }
         case "liquidate": {
        handleLiquidate(
          functionCallAction, receipt, outcome, block, eventObject, logIndex,eventData);
        break;
      }
      case "borrow": {
        handleBorrow(
          functionCallAction, receipt, outcome, block, eventObject, logIndex,eventData);
        break;
        
     }
     case "deposit_to_reserve":{
       handleDepositToReserve(functionCallAction, receipt, outcome, block, eventObject, logIndex,eventData);
       break;
       }
     case "increase_collateral": { 
       handleIncreaseCollateral(functionCallAction, receipt, outcome, block, eventObject, logIndex, eventData);

       break;
     }
     case "decrease_collateral": { 
       handleDecreaseCollateral(functionCallAction, receipt, outcome, block, eventObject, logIndex, eventData);
       break;
       }
     case "force_close": { 
       handleForceClose(functionCallAction, receipt, outcome, block, eventObject, logIndex, eventData);
       break;
       }
       
        

    }
}
