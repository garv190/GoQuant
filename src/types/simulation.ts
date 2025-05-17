export interface CalculationResult {
  slippage: number;
  fees: number;
  marketImpact: number;
  netCost: number;
  makerTakerProportion: number;
  latency: number;
}