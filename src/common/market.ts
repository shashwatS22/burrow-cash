import { JSONValue, near ,json, TypedMap, BigDecimal,BigInt} from "@graphprotocol/graph-ts";
import { Market } from "../../generated/schema";
import { ProtocolName } from "./constants";
import { getOrCreateMarket } from "./initializers";




export function updateIntererstRate(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>) {
    
}
export function updateMarketFromAddAssetFarmAward(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>) {
    
}