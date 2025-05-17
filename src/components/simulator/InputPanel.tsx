import React from  'react';
import { Settings } from 'lucide-react';

interface InputPanelProps {
  params: {
    exchange: string;
    asset: string;
    orderType: string;
    quantity: number;
    volatility: number;
    feeTier: string;
  };
  onChange: (params: InputPanelProps['params']) => void;
  isSimulating: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ params, onChange, isSimulating }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = e.target.type === 'number' ? parseFloat(value) : value;
    
    onChange({
      ...params,
      [name]: newValue
    });
  };

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-400" />
          Input Parameters
        </h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="exchange" className="data-label block mb-1">Exchange</label>
          <select
            id="exchange"
            name="exchange"
            value={params.exchange}
            onChange={handleChange}
            disabled={isSimulating}
            className="input-field w-full text-black"
          >
            <option value="OKX">OKX</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="asset" className="data-label block mb-1">Spot Asset</label>
          <select
            id="asset"
            name="asset"
            value={params.asset}
            onChange={handleChange}
            disabled={isSimulating}
            className="input-field w-full text-black" 
          >
            <option value="BTC-USDT">BTC-USDT</option>
            <option value="ETH-USDT">ETH-USDT</option>
            <option value="SOL-USDT">SOL-USDT</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="orderType" className="data-label block mb-1">Order Type</label>
          <select
            id="orderType"
            name="orderType"
            value={params.orderType}
            onChange={handleChange}
            disabled={isSimulating}
            className="input-field w-full text-black"
          >
            <option value="market">Market</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="quantity" className="data-label block mb-1">
            Quantity (USD Equivalent)
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={params.quantity}
            onChange={handleChange}
            min="1"
            max="10000"
            disabled={isSimulating}
            className="input-field w-full text-black"
          />
        </div>
        
        <div>
          <label htmlFor="volatility" className="data-label block mb-1">
            Volatility
          </label>
          <div className="flex items-center">
            <input
              type="range"
              id="volatility"
              name="volatility"
              value={params.volatility}
              onChange={handleChange}
              min="0.01"
              max="0.5"
              step="0.01"
              disabled={isSimulating}
              className="w-full mr-2 "
            />
            <span className="min-w-[40px] text-right">{params.volatility.toFixed(2)}</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="feeTier" className="data-label block mb-1">Fee Tier</label>
          <select
            id="feeTier"
            name="feeTier"
            value={params.feeTier}
            onChange={handleChange}
            disabled={isSimulating}
            className="input-field w-full text-black"
          >
            <option value="default">Default (0.10%)</option>
            <option value="tier1">Tier 1 (0.08%)</option>
            <option value="tier2">Tier 2 (0.06%)</option>
            <option value="tier3">Tier 3 (0.04%)</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6 border-t border-dark-700 pt-4">
        <h3 className="data-label mb-2">Advanced Settings</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="enableACModel" 
              className="mr-2"
              disabled={isSimulating} 
            />
            <label htmlFor="enableACModel" className="text-sm">Use Almgren-Chriss Model</label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="enableRegression" 
              className="mr-2"
              disabled={isSimulating} 
            />
            <label htmlFor="enableRegression" className="text-sm">Enable Quantile Regression</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;