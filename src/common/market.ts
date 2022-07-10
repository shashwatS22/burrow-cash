import { near } from "@graphprotocol/graph-ts";
import { Market } from "../../generated/schema";



export function getOrCreateMarket(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block): Market{
  let market = Market.load("");
  //market ID is the token address 
//   Each token is a separate pool/ market

// when a deposit, withdraw, borrow, repay is done we add it to that market using token id
  if (!market) {
    //id - 
    //protocol -
    //name -
    //isActive -
    //canUseAsCollateral -
    //canBorrowFrom -
    //maximumLTV
    //liquidationThreshold
    //liquidationPenalty
    //inputToken
    //outputToken
    //rewardTokens
    //rates
    //totalValueLockedUSD
    //totalDepositBalanceUSD
    //cumulativeDepositUSD
    //totalBorrowBalanceUSD
    //cumulativeBorrowUSD
    //cumulativeLiquidateUSD
    //inputTokenBalance
    //inputTokenPriceUSD
    //outputTokenSupply
    //outputTokenPriceUSD
    //exchangeRate
    //rewardTokenEmissionsAmount
    //rewardTokenEmissionsUSD
    //createdTimestamp
    //createdBlockNumber
    //dailySnapshots
    //hourlySnapshots
    //deposits
    //withdraws
    //borrows
    //repays
    //liquidates
      


    
  }

  return market as Market;
}
export function updateOrCreateInterestRate():void{}
