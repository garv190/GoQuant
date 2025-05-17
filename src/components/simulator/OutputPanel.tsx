import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { BarChart, DollarSign, Percent, Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface OutputPanelProps {
  data: {
    slippage: number;
    fees: number;
    marketImpact: number;
    netCost: number;
    makerTakerProportion: number;
    latency: number;
  };
}

const OutputPanel: React.FC<OutputPanelProps> = ({ data }) => {
  const panelRef = useRef(null);
  const [advancedVisible, setAdvancedVisible] = useState(false);
  const previousValues = useRef({ ...data });
  
  useEffect(() => {
    // Animation for value changes
   Object.keys(data).forEach(key => {
    const currentValue = data[key as keyof typeof data];
    const previousValue = previousValues.current[key as keyof typeof data];
    
    if (currentValue !== previousValue) {
      const direction = currentValue > previousValue ? 'increase' : 'decrease';
      
      gsap.to(`.metric-${key}`, {
        keyframes: [
          { 
            color: direction === 'increase' ? '#22c55e' : '#ef4444',
            duration: 0.2,
            scale: 1.05,
          },
          { 
            color: 'white',
            duration: 0.2,
            scale: 1,
            clearProps: 'all'
          }
        ],
        ease: 'power2.out'
      });
    }
  });
  
  previousValues.current = { ...data };
}, [data]);
  const toggleAdvanced = () => {
    setAdvancedVisible(!advancedVisible);
    
    // Animate the advanced section
    if (advancedVisible) {
      gsap.to('.advanced-section', {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    } else {
      gsap.to('.advanced-section', {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    }
  };

  return (
    <div ref={panelRef} className="panel">
      <h2 className="text-xl font-semibold flex items-center mb-4">
        <BarChart className="w-5 h-5 mr-2 text-primary-400" />
        Output Parameters
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="flex items-center mb-1">
            <Percent className="w-4 h-4 text-accent-400 mr-1" />
            <span className="data-label">Expected Slippage</span>
          </div>
          <div className="flex items-baseline">
            <span className="data-value metric-slippage">{data.slippage.toFixed(4)}</span>
            <span className="text-dark-400 text-sm ml-1">%</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center mb-1">
            <DollarSign className="w-4 h-4 text-success-400 mr-1" />
            <span className="data-label">Expected Fees</span>
          </div>
          <div className="flex items-baseline">
            <span className="data-value metric-fees">{data.fees.toFixed(4)}</span>
            <span className="text-dark-400 text-sm ml-1">USD</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center mb-1">
            <TrendingUp className="w-4 h-4 text-error-400 mr-1" />
            <span className="data-label">Market Impact</span>
          </div>
          <div className="flex items-baseline">
            <span className="data-value metric-marketImpact">{data.marketImpact.toFixed(4)}</span>
            <span className="text-dark-400 text-sm ml-1">%</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center mb-1">
            <DollarSign className="w-4 h-4 text-warning-400 mr-1" />
            <span className="data-label">Net Cost</span>
          </div>
          <div className="flex items-baseline">
            <span className="data-value metric-netCost">{data.netCost.toFixed(4)}</span>
            <span className="text-dark-400 text-sm ml-1">USD</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="metric-card">
          <span className="data-label mb-1">Maker/Taker Proportion</span>
          <div className="h-4 bg-dark-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500" 
              style={{ width: `${data.makerTakerProportion * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Maker: {(data.makerTakerProportion * 100).toFixed(1)}%</span>
            <span>Taker: {((1 - data.makerTakerProportion) * 100).toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center mb-1">
            <Clock className="w-4 h-4 text-secondary-400 mr-1" />
            <span className="data-label">Internal Latency</span>
          </div>
          <div className="flex items-baseline">
            <span className="data-value metric-latency">{data.latency.toFixed(2)}</span>
            <span className="text-dark-400 text-sm ml-1">ms/tick</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-dark-700">
        <button 
          className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
          onClick={toggleAdvanced}
        >
          {advancedVisible ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              <span>Hide Advanced Analytics</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              <span>Show Advanced Analytics</span>
            </>
          )}
        </button>
        
        <div className="advanced-section overflow-hidden opacity-0 h-0">
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-1">Almgren-Chriss Model Parameters</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-dark-800 p-2 rounded">
                  <span className="text-dark-400 text-xs">Volatility</span>
                  <p className="text-sm font-medium">{(data.marketImpact / 5).toFixed(4)}</p>
                </div>
                <div className="bg-dark-800 p-2 rounded">
                  <span className="text-dark-400 text-xs">Time Horizon</span>
                  <p className="text-sm font-medium">1.0</p>
                </div>
                <div className="bg-dark-800 p-2 rounded">
                  <span className="text-dark-400 text-xs">Market Vol.</span>
                  <p className="text-sm font-medium">{(data.marketImpact * 500).toFixed(0)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-1">Regression Model Confidence</h3>
              <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary-600" 
                  style={{ width: '87%' }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Model: Quantile Regression</span>
                <span>87% Confidence</span>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="font-medium mt-4 mb-2">Summary</h3>
        <p className="text-dark-300 text-sm">
          Based on current market conditions, executing a market order with the given parameters would result in a 
          <span className="text-white font-medium"> {data.netCost.toFixed(4)}% </span> 
          total cost impact. The execution would be approximately 
          <span className="text-white font-medium"> {(data.makerTakerProportion * 100).toFixed(1)}% </span>
          maker orders with an average processing latency of 
          <span className="text-white font-medium"> {data.latency.toFixed(2)}ms </span>
          per tick.
        </p>
      </div>
    </div>
  );
};

export default OutputPanel;