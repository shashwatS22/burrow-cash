

import { BigInt, log, near,json,JSONValue, BigDecimal } from "@graphprotocol/graph-ts";


import { Borrow, Withdraw, Token, Market } from "../../generated/schema";
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO, TokenData, TOKENS_CONTRACT_DATA } from "../common/constants";
import { ProtocolName, ProtocolType } from "../common/constants";
export function createOrEditTokensFromOracle(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block): void{

  const args = json.fromBytes(functionCallAction.args).toObject();
  const data =(args.get("data") as JSONValue).toObject();
  let lastUpdateblockNumber = block.header.height;
  let priceData = (data.get("prices") as JSONValue).toArray();
  let tokenContractData:Array<TokenData>= TOKENS_CONTRACT_DATA;
  
  
  for (let i = 0; i < priceData.length; i++){
    let tokenId = (priceData.at(i).toObject().get("asset_id") as JSONValue).toString();
    let token = Token.load(tokenId);
    if (!token) {
      token = new Token(tokenId);
      
    }
    if (BigInt.fromString( lastUpdateblockNumber.toString()) >= (token.lastPriceBlockNumber as BigInt)) {

      let t = tokenContractData.filter((tokenData) => {
        return tokenData.id === tokenId;
      });
      token.name = t[0]. name;
      token.symbol = t[0].symbol;
      token.decimals = ((priceData.at(i).toObject().get("price")?.toObject().get("decimals") as JSONValue) ).toI64()
      token.lastPriceUSD = BigDecimal.fromString(((priceData.at(i).toObject().get("price")?.toObject().get("multiplier") as JSONValue) ).toString()).div(BigDecimal.fromString("10000"));//["price"]["multiplier"]
      token.lastPriceBlockNumber = BigInt.fromU64(block.header.height) ;
      token.save();
    }
  }


  
}
export function getOrCreateRewardToken(): void{ }
