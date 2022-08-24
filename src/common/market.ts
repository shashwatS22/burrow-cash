import { JSONValue, near ,json, TypedMap, BigDecimal,BigInt} from "@graphprotocol/graph-ts";
import { Market } from "../../generated/schema";
import { ProtocolName } from "./constants";
import { getOrCreateMarket } from "./initializers";




export function updateMarketFromEvent(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,eventName:JSONValue|null,eventObject:Object,logIndex:number,eventData:TypedMap<string, JSONValue>) {
    let market = Market.load((eventData.get("token_id") as JSONValue).toString());
    


    switch (eventName?.toString()) {
      case "deposit":
        {
          
          break;
        }
      case "withdraw_succeeded": {
          break;  
      }
      case "repay": {
         break;
        
      }
         case "liquidate": {
             break;
      }
      case "borrow": {
             break;
        
     }
     case "deposit_to_reserve":{
       break;
        }
    case "increase_collateral": { 
       break;
     }
     case "decrease_collateral": { 
       break;
       }
     case "force_close": { 
       break;
       }
       

        

    }
}

export function updateIntererstRate(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>) {
    
}
export function updateMarketFromAddAssetFarmAward(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>) {
    
}