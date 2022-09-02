// 5. UsageMetricsDailySnapshot
// 6. UsageMetricsHourlySnapshot
// 7. FinancialDailySnapshot

import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { near } from "@graphprotocol/graph-ts/chain/near";

// 9. MarketDailySnapshot
// 10. MarketHourlySnapshot

export function updateOrCreateDailyUsageMetrics(): void{ 
    
}
export function updateOrCreateHourlyDailyUsageMetrics(): void{ }
export function updateOrCreateFinancialDailySnapshot(): void{ }
export function updateOrCreateMarketDailySnapsot(): void { }
export function updateOrCreateMarketHourlySnapsot(): void { }


export function updateSnapshots(functionCallAction: near.FunctionCallAction, receipt: near.ActionReceipt, outcome: near.ExecutionOutcome, block: near.Block, eventObject: Object, index: number,eventData:TypedMap<string, JSONValue>): void{
    
}