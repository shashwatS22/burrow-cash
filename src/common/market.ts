import { JSONValue, near ,json, TypedMap, BigDecimal,BigInt} from "@graphprotocol/graph-ts";
import { Market, Token } from "../../generated/schema";
import { ProtocolName } from "./constants";
import { getOrCreateMarket, getOrCreateRewardToken, getOrCreateToken } from "./initializers";




// export function updateIntererstRate(marketId: string) {
    
    
// }
export function updateMarketFromAddAssetFarmAward(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block):void {
    const args = json.fromBytes(functionCallAction.args).toObject(); 
    
    let marketId :JSONValue;
    if (!(args.get("farm_id") as JSONValue ).toObject().get("Borrowed")) {
      marketId = (args.get("farm_id") as JSONValue ).toObject().get("Supplied") as JSONValue;
    } else {
        marketId = (args.get("farm_id") as JSONValue ).toObject().get("Borrowed") as JSONValue;
    }
    let market = Market.load(marketId.toString()) as Market;
    let asset:Token = getOrCreateToken(marketId.toString());
  getOrCreateRewardToken((args.get("reward_token_id") as JSONValue).toString());
    let oldRewardTokens = market.rewardTokens as string [];
    oldRewardTokens.push((args.get("reward_token_id") as JSONValue).toString());
    let oldRewardTokenEmissionAmount = market.rewardTokenEmissionsAmount as BigInt[];
    oldRewardTokenEmissionAmount.push(BigInt.fromString((args.get("new_reward_per_day") as JSONValue).toString()));

    let oldRewardTokenEmissionAmountUSD = market.rewardTokenEmissionsUSD as BigDecimal[];
    oldRewardTokenEmissionAmountUSD.push((asset.lastPriceUSD as BigDecimal).times(BigDecimal.fromString((args.get("new_reward_per_day") as JSONValue).toString())));

    market.rewardTokens = oldRewardTokens;
    market.rewardTokenEmissionsAmount = oldRewardTokenEmissionAmount;
    market.rewardTokenEmissionsUSD = oldRewardTokenEmissionAmountUSD;
    market.save();
}
// export function updateLendingProtocol(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>){}