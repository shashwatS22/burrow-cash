import { BigDecimal, BigInt } from "@graphprotocol/graph-ts"

export namespace Blockchain {
  export const ETHEREUM = "ETHEREUM"
  export const BSC = "BSC"
  export const XDAI = "XDAI"
  export const POLYGON = "POLYGON"
  export const OPTIMISM = "OPTIMISM"
  export const AVALANCHE = "AVALANCE"
  export const NEAR = "NEAR"
}

export namespace TokenStandard {
  export const NEP141 = "NEP141"
  export const NEP171 = "NEP171"
  export const NEP245 = "NEP245"
}

export namespace ProtocolName {
  export const BURROW = "BURROW"
}

export namespace ProtocolType {
  export const STAKING = "STAKING"
  export const LENDING = "LENDING"
  export const EXCHANGE = "EXCHANGE"
  export const INSURANCE = "INSURANCE"
  export const STABLECOIN = "STABLECOIN"
  export const DERIVATIVE = "DERIVATIVE"
  export const SYNTHETIC_TOKEN = "SYNTHETIC_TOKEN"
  export const TOKEN_MANAGEMENT = "TOKEN_MANAGEMENT"
  export const PREDICTION_MARKET = "PREDICTION_MARKET"
}

export namespace PositionType {
  export const INVESTMENT = "INVESTMENT"
  export const DEBT = "DEBT"
}

export namespace TransactionType {
  export const INVEST = "INVEST"
  export const REDEEM = "REDEEM"
  export const BORROW = "BORROW"
  export const REPAY = "REPAY"
  export const TRANSFER_IN = "TRANSFER_IN"
  export const TRANSFER_OUT = "TRANSFER_OUT"
}
export namespace InterestRateType{
  export const STABLE = "STABLE";
  export const VARIABLE = "VARIABLE";
  export const FIXED_TERM = "FIXED_TERM";
  
  
}
export namespace InterestRateSide{
  export const LENDER = "LENDER";
  export const BORROWER = "BORROWER";
}

export namespace ContractAddress{
  export const BURROW_MAIN = "contract.main.burrow.near";
}

export const BIG_INT_ZERO = BigInt.fromString("0");
export const BIG_DECIMAL_ZERO = BigDecimal.fromString("0");
export const ONE_YOCTO = BigDecimal.fromString("0.000000000000000000000001");
// export const TOKENS_CONTRACT_DATA = [
//     {
//         "wrap.near": {
//             "name": "Wrapped NEAR fungible token",
//             "symbol": "wNEAR"
//         }
//     },
//     {
//         "c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near": {
//             "name": "Wrapped Ether",
//             "symbol": "WETH"
//         },
//     },
//         {
//         "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near":
//         {
//             "name": "Tether USD",
//             "symbol": "USDT"
//         }
//     },
//         {
//             "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near": {
//                 "name": "USD Coin",
//                 "symbol": "USDC"
//             },

//     },
//     {
            
//      "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near":{
//     "name": "Dai Stablecoin",
//     "symbol": "DAI"
//         },
//     },
//     {
//         "aurora": {
//             "name": "Ether",
//             "symbol": "ETH"
//         },
//     },
//     {
//         "meta-pool.near":
//         {
//             "name": "Staked NEAR",
//             "symbol": "STNEAR"
//         }
//     },
//     {
//         "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near":
//         {
//             "name": "Wrapped BTC",
//             "symbol": "WBTC"
//         },
//     },
//     {
//         "usn": {
//             "name": "USN",
//             "symbol": "USN"
//         }
// }


// ];
export interface TokenData{
  id: string,
  name: string,
  symbol:string,
}


export const TOKENS_CONTRACT_DATA:TokenData [] = [{
    "id": "wrap.near",
    "name": "Wrapped NEAR fungible token",
    "symbol": "wNEAR"
}, {
    "id": "c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near",
    "name": "Wrapped Ether",
    "symbol": "WETH"
}, {
    "id": "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
    "name": "Tether USD",
    "symbol": "USDT"
}, {
    "id": "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
    "name": "USD Coin",
    "symbol": "USDC"
}, {
    "id": "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
    "name": "Dai Stablecoin",
    "symbol": "DAI"
}, {
    "id": "aurora",
    "name": "Ether",
    "symbol": "ETH"
}, {
    "id": "meta-pool.near",
    "name": "Staked NEAR",
    "symbol": "STNEAR"
}, {
    "id": "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
    "name": "Wrapped BTC",
    "symbol": "WBTC"
}, {
    "id": "usn",
    "name": "USN",
    "symbol": "USN"
  }];

  