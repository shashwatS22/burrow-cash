

// import { BigInt, log, near,json,JSONValue, BigDecimal } from "@graphprotocol/graph-ts";

// import { Borrow, Withdraw, Token, Market } from "../../generated/schema";
// import { TokenData, TOKENS_CONTRACT_DATA } from "../common/constants";
// import { ProtocolName, ProtocolType } from "../common/constants";
// export function createOrEditTokensFromOracle(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block): void{

//   const args = json.fromBytes(functionCallAction.args).toObject();
//   const data =args.get("data") as JSONValue;
//   let lastUpdateblockNumber = block.header.height;
//   let priceData: JSONValue[] = data["prices"];
//   let tokenContractData:Array<TokenData>= TOKENS_CONTRACT_DATA;
  
  
//   for (let i = 0; i < priceData.length; i++){
//     let token = Token.load(priceData[i]["asset_id"])
//     if (!token) {
//       token = new Token(priceData[i]["asset_id"])
      
//     }
//     if (lastUpdateblockNumber >= token.lastPriceBlockNumber) {

//       let t = tokenContractData.find((tokenData) => {
//         return tokenData.id === priceData[i]["asset_id"];
//       });
//       token.name = t.name;
//       token.symbol = t.symbol;
//       token.decimals = priceData[i]["price"]["decimals"]
//       token.lastPriceUSD = BigDecimal.fromString((priceData[i]["price"]["multiplier"] / 10000).toString());
//       token.lastPriceBlockNumber = block.header.height;
//       token.save();
//     }
//   }


  
// }
// export function getOrCreateToken(tokenId: string): Token {
  
//   let token = Token.load(tokenId);
//   let tokenContractData = TOKENS_CONTRACT_DATA;
//    let t = tokenContractData.find((tokenData) => {
//         return tokenData.id === tokenId;
//       });
  
//   if (!token) {
//     token = new Token(tokenId)
//     token.decimals = 18;

//     token.lastPriceUSD = BigDecimal.fromString("0");
//     token.lastPriceBlockNumber = BigInt.fromString("0");
//   }

//   token.name = t.name;
//   token.symbol = t.symbol;
//   token.save();

//   return token as Token;  
// }
// export function updateOrCreateRewardToken(): void{ }
