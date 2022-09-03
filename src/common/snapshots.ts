// 5. UsageMetricsDailySnapshot
// 6. UsageMetricsHourlySnapshot
// 7. FinancialDailySnapshot
// 9. MarketDailySnapshot
// 10. MarketHourlySnapshot

import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { near } from "@graphprotocol/graph-ts/chain/near";


export function updateDailyUsageMetrics(): void{ 
    
}
export function updateHourlyDailyUsageMetrics(): void{ }
export function updateFinancialDailySnapshot(): void{ }
export function updateMarketDailySnapsot(): void { }
export function updateMarketHourlySnapsot(): void { }


export function updateSnapshots(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block,  index: number,eventData:TypedMap<string, JSONValue>): void{
    
}