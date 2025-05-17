import type { CalculationResult } from '../types/simulation';

interface SimulationParams {
  exchange: string;
  asset: string;
  orderType: string;
  quantity: number;
  volatility: number;
  feeTier: string;
}

interface OrderbookData {
  timestamp: string;
  exchange: string;
  symbol: string;
  asks: string[][];
  bids: string[][];
}

class SimulationService {
  

  public calculateOutputs(params: SimulationParams, orderbook: OrderbookData): CalculationResult {
    const startTime = performance.now();
    

    const processedAsks = orderbook.asks.map(([price, amount]) => ({
      price: parseFloat(price),
      amount: parseFloat(amount)
    }));
    
    const processedBids = orderbook.bids.map(([price, amount]) => ({
      price: parseFloat(price),
      amount: parseFloat(amount)
    }));
    
   
    const bestAsk = processedAsks.length > 0 ? processedAsks[0].price : 0;
    const bestBid = processedBids.length > 0 ? processedBids[0].price : 0;
    const midPrice = (bestAsk + bestBid) / 2;
    
   
    const depth = this.calculateMarketDepth(processedBids, processedAsks, params.quantity);
    
    
    const slippage = this.calculateSlippage(params.quantity, depth, params.volatility);
    
  
    const fees = this.calculateFees(params.quantity, params.feeTier);
    
   
    const marketImpact = this.calculateMarketImpact(params.quantity, params.volatility, midPrice, depth);
    
    
    const makerTakerProportion = this.predictMakerTakerProportion(params.quantity, depth);
    
    
    const netCost = slippage + fees + marketImpact;
    
   
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    return {
      slippage,
      fees,
      marketImpact,
      netCost,
      makerTakerProportion,
      latency
    };
  }
  
 private calculateMarketDepth(bids: { price: number, amount: number }[], 
                           asks: { price: number, amount: number }[],
                           quantity: number): number {
  
  const depthThreshold = 0.01; 
  const bestAsk = asks[0].price;
  const bestBid = bids[0].price;
  const midPrice = (bestAsk + bestBid) / 2;
  
  
  const adjustedThreshold = depthThreshold * (1 + Math.log10(quantity + 1) * 0.1);
  
  const upperBound = midPrice * (1 + adjustedThreshold);
  const lowerBound = midPrice * (1 - adjustedThreshold);
  
  const askDepth = asks
    .filter(ask => ask.price <= upperBound)
    .reduce((sum, ask) => sum + ask.amount, 0);
    
  const bidDepth = bids
    .filter(bid => bid.price >= lowerBound)
    .reduce((sum, bid) => sum + bid.amount, 0);
    
 
  const weightedDepth = (askDepth + bidDepth) * (1 - Math.min(0.5, quantity / (askDepth + bidDepth)));
  
  return weightedDepth;
}
  
  private calculateSlippage(quantity: number, depth: number, volatility: number): number {
   
    const relativeSizeImpact = quantity / (depth + 1);
    return relativeSizeImpact * volatility * 100; 
  }
  
  private calculateFees(quantity: number, feeTier: string): number {
    
    let feeRate = 0.001; 
    
    switch (feeTier) {
      case 'default':
        feeRate = 0.001; 
        break;
      case 'tier1':
        feeRate = 0.0008; 
        break;
      case 'tier2':
        feeRate = 0.0006; 
        break;
      case 'tier3':
        feeRate = 0.0004; 
        break;
    }
    
    return quantity * feeRate;
  }
  
  private calculateMarketImpact(quantity: number, volatility: number, midPrice: number, depth: number): number {
    // Simplified Almgren-Chriss model for market impact
    // I(v) = σ × |v| × √(T/V) × P
    // where σ is volatility, v is order size, T is time horizon, V is volume, P is price
    
    const timeHorizon = 1; // Assuming immediate execution
    const volume = depth; // Using market depth as volume
    
    // Scale the impact by the mid price to get absolute value impact
    const impact = (volatility * Math.abs(quantity) * Math.sqrt(timeHorizon / volume) * midPrice) / midPrice;
    return impact * 100; // Convert to percentage
}
  private predictMakerTakerProportion(quantity: number, depth: number): number {
    // Higher quantity relative to depth means more taker orders
    const proportion = 1 - Math.min(0.9, quantity / (depth * 10 + 1));
    return Math.max(0.1, proportion); // Ensure at least 10% maker
  }
}

export default new SimulationService();