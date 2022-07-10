
import { BigInt, log, near,json,JSONValue, BigDecimal } from "@graphprotocol/graph-ts";

import { Borrow, Withdraw, Token, Market } from "../../generated/schema";
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
    const eventName = eventObject.get("event");
    
    if (eventName) {
      log.warning("event {} ", [parsableData])
    }
        }
    // log.warning("outcomeStatus {}",[json.fromBytes( outcome.status.toValue()).toString()])
    // log.warning("function call: {} ,outcome Id : {}, receipt id: {}",[functionCallAction.methodName,outcome.id.toBase58(),receipt.id.toBase58()])
    // if (functionCallAction.methodName == "new") {
        
    //  }
    // if (functionCallAction.methodName == "get_account") {
        
    //  }
    // if (functionCallAction.methodName == "get_accounts_paged") { }
    // if (functionCallAction.methodName == "execute") {
        // log.warning("execute",[]);
        // // if ((args.get("Withdraw") as JSONValue)) {
        
        //     let withdraw = new Withdraw(outcome.id.toBase58());
        // withdraw.hash = outcome.id.toBase58();
        // withdraw.timestamp = BigInt.fromU64(block.header.timestampNanosec);
        //     withdraw.logIndex = withdrawLogIndex++;
        //     withdraw.blockNumber = BigInt.fromU64(block.header.height);
        // for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++){
        //      let outcomeLogs = outcome.logs;
        //     let parsableData= outcomeLogs[logIndex].replace("EVENT_JSON:", "");
        //     log.warning("outcomelogs execute {} {} ", [logIndex.toString(),outcomeLogs[logIndex]]);
        //     let jsonObject = json.try_fromString(parsableData).value.toObject();
        //     let eventData = jsonObject.get("data");

        //     if (eventData) {
        //         let eventArray: JSONValue[] = eventData.toArray()
                

        //         let data = eventArray[0].toObject()
        //         const amount=data.get('amount');
        //         const tokenId=data.get('token_id');
        //         const accountId = data.get('account_id');
                
        //         // log.warning("amount : {} ,tokenId : {}, accountId: {} ", [amount.toString(), tokenId.toString(), accountId.toString()]);
            
        //     }

            
        // }


           


            
        // }
        
        // const actionsList = (args.get("actions") as JSONValue).toArray();
    // }

    // if (functionCallAction.methodName == "get_asset") { }
    // if (functionCallAction.methodName == "get_assets") { }
    // if (functionCallAction.methodName == "get_assets_paged") { }
    // if (functionCallAction.methodName == "get_assets_paged_detailed") { }
    // if (functionCallAction.methodName == "get_config") { }
    // if (functionCallAction.methodName == "update_config") { }
    // if (functionCallAction.methodName == "add_asset") { }
    // if (functionCallAction.methodName == "update_asset") { }
    // if (functionCallAction.methodName == "ft_on_transfer") { 
    //     for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
    //         let outcomeLogs = outcome.logs;
    //         let parsableData = outcomeLogs[logIndex].replace("EVENT_JSON:", "");
    //         log.warning("outcomelogs ft_on_transfer {} {} ", [logIndex.toString(),outcomeLogs[logIndex]]);
    //     }
    // }
  //   if (functionCallAction.methodName == "oracle_on_call") {
  //       log.warning("oracle_on_call", []);
  //       for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
  //           let outcomeLogs = outcome.logs;
  //         let parsableData = outcomeLogs[logIndex].replace("EVENT_JSON:", "");
  //         createOrEditTokensFromOracle(functionCallAction, receipt, outcome, block);

  //       }
  //    }
  
  //   if (functionCallAction.methodName == "after_ft_transfer") {
  //     log.warning("after_ft_transfer", []);
  //     for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
        
  //       let eventJsonString:string = outcome.logs[logIndex];
  //       let parsableData: string = eventJsonString.replace("EVENT_JSON:", "");
  //       let eventObject  : Object= JSON.parse(parsableData);
  //       if (eventObject["event"] === "withdraw_succeeded") {
        
  //         handleWithdraw(functionCallAction, receipt, outcome, block,eventObject,logIndex);

  //       }
  //       }
  //    }
    
  //   // if (functionCallAction.methodName == "account_farm_claim_all") { }
  //   // if (functionCallAction.methodName == "get_asset_farm") { }
  //   // if (functionCallAction.methodName == "get_asset_farms") { }
  //   // if (functionCallAction.methodName == "get_asset_farms_paged") { }
  // if (functionCallAction.methodName == "add_asset_farm_reward") { 
      
  //   }
  //   // if (functionCallAction.methodName == "storage_deposit") { 
  //   //     for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
  //   //         let outcomeLogs = outcome.logs;
  //   //         let parsableData = outcomeLogs[logIndex].replace("EVENT_JSON:", "");
  //   //         log.warning("outcomelogs storage_deposit {} {} ", [logIndex.toString(),outcomeLogs[logIndex]]);
  //   //     }
  //   //     // let withdraw = new Withdraw();
  //   // }
  //   // if (functionCallAction.methodName == "storage_withdraw") { 
  //   //     for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
  //   //         let outcomeLogs = outcome.logs;
  //   //         let parsableData = outcomeLogs[logIndex].replace("EVENT_JSON:", "");
  //   //         log.warning("outcomelogs storage_withdrawl {} {} ", [logIndex.toString(),outcomeLogs[logIndex]]);
  //   //     }
  //   // }
  //   // if (functionCallAction.methodName == "storage_unregister") { }
  //   // if (functionCallAction.methodName == "storage_balance_bounds") { }
  //   // if (functionCallAction.methodName == "storage_balance_of") { }
    
    
    
}



function debugNEARLogs(
  receipt: near.ActionReceipt,
  outcome: near.ExecutionOutcome,
  block: near.Block
): void {

  log.warning("****************** Receipt ID {} Start ***********************", [receipt.id.toBase58()]);

  log.warning("Receipt data -> id: {}, predecessorId: {}, receiverId: {}, signerId: {}", [
    receipt.id.toBase58(),
    receipt.predecessorId,
    receipt.receiverId,
    receipt.signerId
  ]);

  let inputDataIdsArray : String[] = [];
  let outputDataReceiversArray : String[] = [];
  let logsArray = [];
  let receiptIdsArray: String[] = [];
  const actions = receipt.actions;
  for (let i = 0; i < actions.length; i++) {
    log.warning("Receipt actions: kind: {}, data: {}", [actions[i].kind.toString(), actions[i].data.toString()]);
  }

  const inputDataIds = receipt.inputDataIds;
  for (let i = 0; i < inputDataIds.length; i++) {
    inputDataIdsArray.push(inputDataIds[i].toBase58());
  }

  log.warning("Receipt input data ids array : {}", [inputDataIdsArray.join("|||||||||")]);

  const outputDataReceivers = receipt.outputDataReceivers;
  for (let i = 0; i < outputDataReceivers.length; i++) {
    outputDataReceiversArray.push(outputDataReceiversArray[i]);
  }

    log.info("Receipt output data receiver id: {}", [outputDataReceiversArray.join("|||||||||")]);
  log.warning("Outcome data -> blockHash: {}, id: {}, executorId: {}", [
    outcome.blockHash.toBase58(),
    outcome.id.toBase58(),
    outcome.executorId
  ]);
//outcome.id=receipt.id
  const logs = outcome.logs;

  // for (let i = 0; i < logs.length; i++) {
  //   logsArray.push(logs[i]);
  // }
    log.warning("Outcome logs array : {}", [logs.join("|||||||||")]);
  const receiptIds = outcome.receiptIds;
  for (let i = 0; i < receiptIds.length; i++) {
    receiptIdsArray.push(receiptIds[i].toBase58())
   
  }
 log.warning("Outcome receiptIds: {}", [receiptIdsArray.join("|||||||||")]);
  log.warning("****************** Receipt ID {} End ***********************", [receipt.id.toBase58()]);
}