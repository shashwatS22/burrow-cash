import { JSONValue, near ,json, TypedMap, BigDecimal,BigInt} from "@graphprotocol/graph-ts";
import { Deposit, InterestRate, Market,Withdraw, Repay, Borrow, Liquidate, Token, Collateral, Borrowed, Account, Supplied, LendingProtocol, RewardToken,  } from "../../generated/schema";
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO, ContractAddress, InterestRateSide, InterestRateType, ProtocolName, TOKENS_CONTRACT_DATA,ProtocolType } from "./constants";

export function getOrCreateMarket(functionCallAction: near.FunctionCallAction, block: near.Block, marketId?:string): Market{
  const args = json.fromBytes(functionCallAction.args).toObject();
  // const config = (args.get("asset_config") as JSONValue).toObject();
  const tokenId = (args.get("token_id") as JSONValue).toString();

  let market = Market.load(tokenId);
  let interestRate = getOrCreateInterestRate(tokenId);

  if (!market) {
    market = new Market(tokenId);
  
    market.protocol = ContractAddress.BURROW_MAIN;
    market.isActive = true;
    market.canBorrowFrom = (args.get("can_borrow") as JSONValue).toBool();
    market.canUseAsCollateral = (args.get("can_use_as_collateral") as JSONValue).toBool();
    market.maximumLTV = (BigDecimal.fromString((args.get("volatility_ratio") as JSONValue).toString())).div(BigDecimal.fromString("100.0"));
    market.liquidationThreshold = BIG_DECIMAL_ZERO;
    market.liquidationPenalty = BIG_DECIMAL_ZERO;
    market.inputToken = tokenId;
    market.outputToken = null;
    market.rewardTokens = [];
    market.rates.push(interestRate.id);
    market.totalValueLockedUSD = BIG_DECIMAL_ZERO;//event
    market.totalDepositBalanceUSD = BIG_DECIMAL_ZERO;//event
    market.cumulativeDepositUSD = BIG_DECIMAL_ZERO;//event
    market.totalBorrowBalanceUSD = BIG_DECIMAL_ZERO;//event
    market.cumulativeBorrowUSD = BIG_DECIMAL_ZERO;//event
    market.cumulativeLiquidateUSD = BIG_DECIMAL_ZERO;//event
    market.inputTokenBalance = BIG_INT_ZERO;//event
    market.inputTokenPriceUSD= BIG_DECIMAL_ZERO;//event
    market.outputTokenSupply= BIG_INT_ZERO;//event
    market.outputTokenPriceUSD= BIG_DECIMAL_ZERO;//event
    market.exchangeRate= BIG_DECIMAL_ZERO;//event
    market.rewardTokenEmissionsAmount = [];
    market.rewardTokenEmissionsUSD = [];
    market.createdTimestamp = BigInt.fromU64(block.header.timestampNanosec / 1000);
    market.createdBlockNumber =BigInt.fromU64( block.header.height);
    market.dailySnapshots = [];
    market.hourlySnapshots = [];
    market.deposits = [];
    market.withdraws = [];
    market.borrows = [];
    market.repays = [];
    market.liquidates = [];
    
    market.save();
  } 
      
  return market as Market;
}

export function getOrCreateInterestRate(tokenId:string): InterestRate {
 
  const interestId = InterestRateSide.BORROWER + "-" + InterestRateType.STABLE + tokenId;// TODO add variable interest rate side 
    let interestRate = InterestRate.load(interestId);
  if (!interestRate) {
    interestRate = new InterestRate(interestId);
    interestRate.duration = 0;
    interestRate.rate = BIG_DECIMAL_ZERO;
    interestRate.side = "";
    interestRate.type = "";
    interestRate.save();
  
}
    return interestRate as InterestRate;
}

export function getOrCreateRepay( receipt: near.ActionReceipt,index: number,eventData:TypedMap<string, JSONValue>): Repay{
   let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
    let repay = Repay.load(transactionId);
   let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  
    
  if (!repay) {
    repay = new Repay(transactionId);
    
    repay.hash = receipt.id.toBase58();
    repay.logIndex = 0;
    repay.protocol = "";
    repay.to = "";
    repay.from = "";
    repay.blockNumber = BIG_INT_ZERO;
    repay.timestamp =BIG_INT_ZERO;
    repay.market = "";
    repay.asset = "";
    repay.amount = BIG_INT_ZERO;
    repay.amountUSD = BIG_DECIMAL_ZERO;
    repay.save();
      
  }
  return repay as Repay;
}

export function getOrCreateWithdraw( receipt: near.ActionReceipt,   index: number,eventData:TypedMap<string, JSONValue>): Withdraw{
  let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
  let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  

  
  let withdraw = Withdraw.load(transactionId);
    if (!withdraw) {
    withdraw = new Withdraw(transactionId);
    withdraw.hash = receipt.id.toBase58();
    withdraw.from = "";
    withdraw.to = "";
    withdraw.timestamp = BIG_INT_ZERO;
    withdraw.amount = BIG_INT_ZERO;
    withdraw.blockNumber = BIG_INT_ZERO;
  
    withdraw.logIndex = 0;
    withdraw.protocol ="";
    withdraw.amountUSD = BIG_DECIMAL_ZERO;
    withdraw.asset = "";
    withdraw.market ="";
    withdraw.save();
      
    }
  return withdraw as Withdraw;

}

export function getOrCreateDeposit( receipt: near.ActionReceipt,  block: near.Block, index: number,eventData:TypedMap<string, JSONValue>): Deposit{
  let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
 let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
  
    let deposit = Deposit.load(transactionId);
  if (!deposit) {
    deposit = new Deposit(transactionId);
    
    deposit.hash = receipt.id.toBase58();
    deposit.logIndex = index;
    deposit.protocol = "";
    deposit.to = "";
    deposit.from = "";
    deposit.blockNumber = BIG_INT_ZERO;
    deposit.timestamp = BIG_INT_ZERO;
    deposit.market = "";
    deposit.asset = "";
    deposit.amount =BIG_INT_ZERO;
    deposit.amountUSD = BIG_DECIMAL_ZERO;

    deposit.save();
  }
  return deposit as Deposit;
}

export function getOrCreateBorrow( receipt: near.ActionReceipt,  index: number,eventData:TypedMap<string, JSONValue>): Borrow{
   let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
 let asset:Token = getOrCreateToken((eventData.get("token_id") as JSONValue).toString());
 
    let borrow = Borrow.load(transactionId);
  if (!borrow) {
    borrow = new Borrow(transactionId);
    
    borrow.hash = receipt.id.toBase58();
    borrow.logIndex = index;
    borrow.protocol = "";
    borrow.to = "";
    borrow.from = "";
    borrow.blockNumber = BIG_INT_ZERO;
    borrow.timestamp = BIG_INT_ZERO;
    borrow.market = "";
    borrow.asset = "";
    borrow.amount = BIG_INT_ZERO;
    borrow.amountUSD = BIG_DECIMAL_ZERO;
    borrow.save();
  }
  return borrow as Borrow;
}

export function getOrCreateLiquidate( receipt: near.ActionReceipt,  index: number,eventData:TypedMap<string, JSONValue>): Liquidate{
   let transactionId = receipt.id.toBase58().concat("-").concat(index.toString());
    let liquidate = Liquidate.load(transactionId);
 

  if (!liquidate) {
    liquidate = new Liquidate(transactionId);
    
    liquidate.hash = receipt.id.toBase58();
    liquidate.logIndex = index;
    liquidate.protocol = ContractAddress.BURROW_MAIN;
    liquidate.to = "";
    liquidate.from = "";
    liquidate.blockNumber = BIG_INT_ZERO;
    liquidate.timestamp = BIG_INT_ZERO;
    liquidate.market = "";
    liquidate.asset = "";
    liquidate.amount = BIG_INT_ZERO;
    liquidate.amountUSD = BIG_DECIMAL_ZERO;
    liquidate.profitUSD = BIG_DECIMAL_ZERO;
    liquidate.save();
  }
  return liquidate as Liquidate;
}

export function getOrCreateToken(tokenId: string): Token {
  
  let token = Token.load(tokenId);
  let tokenContractData = TOKENS_CONTRACT_DATA;
   let t = tokenContractData .filter ((tokenData) => {
        return tokenData.id === tokenId;
      });
  
  if (!token) {
    token = new Token(tokenId)
    token.decimals = 18;

    token.lastPriceUSD = BIG_DECIMAL_ZERO;
    token.lastPriceBlockNumber = BIG_INT_ZERO;
  }

  token.name = t[0].name ;
  token.symbol = t[0].symbol;
  token.save();

  return token as Token;  
}

export function getOrCreateAccount(accountId:string): Account{
  
  let account = Account.load(accountId);
  if (!account) {
    account = new Account(accountId);
    account.healthScore = BIG_DECIMAL_ZERO;
    account.supplied = [];
    account.borrowed = [];
    account.collateral = [];
  }
  return account as Account;
}


export function getOrCreateCollateral(accountId:string, tokenId:string): Collateral{
  
  let collateralId = accountId.concat("-").concat(tokenId);
  let collateral = Collateral.load(collateralId);
  if (!collateral) {
    collateral = new Collateral(collateralId);
    collateral.account = accountId;
    collateral.token = tokenId;
    collateral.balance = BIG_INT_ZERO;
    collateral.shares = BIG_INT_ZERO;
    
  }
  
  return collateral as Collateral;
}

export function getOrCreateSupplied(accountId:string, tokenId:string): Supplied{
  let suppliedId = accountId.concat("-").concat(tokenId);
  let supplied = Supplied.load(suppliedId);
  if (!supplied) {
    supplied = new Supplied(suppliedId);
    supplied.account = accountId;
    supplied.token = tokenId;
    supplied.balance = BIG_INT_ZERO;
    supplied.shares = BIG_INT_ZERO;
  }
  return supplied as Supplied;
}

export function getOrCreateBorrowed(accountId:string, tokenId:string): Borrowed{
  
  let borrowedId = accountId.concat("-").concat(tokenId);
  let borrowed = Borrowed.load(borrowedId);
  if (!borrowed) {
    borrowed = new Borrowed(borrowedId);
    borrowed.account = accountId;
    borrowed.token = tokenId;
    borrowed.balance = BIG_INT_ZERO;
    borrowed.shares = BIG_INT_ZERO;
    
  }
  return borrowed as Borrowed;
}

export function getOrCreateLendingProtocol():LendingProtocol {
  let lendingProtocol = LendingProtocol.load(ContractAddress.BURROW_MAIN);
  if (!lendingProtocol) {
    lendingProtocol = new LendingProtocol(ContractAddress.BURROW_MAIN);
    lendingProtocol.name = ProtocolName.BURROW;
    lendingProtocol.slug = "burrow-v1";
    lendingProtocol.schemaVersion = "1.0.0";
    lendingProtocol.subgraphVersion = "1.0.0";
    lendingProtocol.methodologyVersion = "1.0.0";
    lendingProtocol.network = "NEAR_MAINNET";
    lendingProtocol.type = ProtocolType.LENDING;
    lendingProtocol.lendingType = "";
    lendingProtocol.riskType = "";
    lendingProtocol.mintedTokens = [];
    lendingProtocol.cumulativeUniqueUsers = 0;
    lendingProtocol.totalValueLockedUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.protocolControlledValueUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.cumulativeSupplySideRevenueUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.cumulativeProtocolSideRevenueUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.cumulativeTotalRevenueUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.totalDepositBalanceUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.cumulativeDepositUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.totalBorrowBalanceUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.cumulativeBorrowUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.cumulativeLiquidateUSD = BIG_DECIMAL_ZERO;
    lendingProtocol.mintedTokenSupplies = [];
    lendingProtocol.dailyUsageMetrics = [];
    lendingProtocol.hourlyUsageMetrics = [];
    lendingProtocol.financialMetrics = [];
    lendingProtocol.markets = [];
    lendingProtocol.save();

  }
  return lendingProtocol as LendingProtocol;
}
export function getOrCreateRewardToken(rewardTokenAddress:string):RewardToken {
 let rewardTokenId ="POOLED".concat(rewardTokenAddress)
  let rewardToken = RewardToken.load(rewardTokenId);

  if (!rewardToken) {
    rewardToken = new RewardToken(rewardTokenId);
    rewardToken.token = rewardTokenAddress;
    rewardToken.type = "POOLED";
  }
  return rewardToken as RewardToken;

}