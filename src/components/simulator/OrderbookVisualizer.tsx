import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { BarChart, RefreshCw } from 'lucide-react';

interface OrderbookItem {
  price: number;
  amount: number;
}

interface OrderbookProps {
  orderbook: {
    timestamp: string;
    exchange: string;
    symbol: string;
    asks: string[][];
    bids: string[][];
  };
}

const OrderbookVisualizer: React.FC<OrderbookProps> = ({ orderbook }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxDisplayedRows, setMaxDisplayedRows] = useState(5);
  
useEffect(() => {

  gsap.to('.ask-bar', {
    width: 'auto',
    duration: 0.3,
    ease: 'power2.out',
    clearProps: 'all'
  });
  
  gsap.to('.bid-bar', {
    width: 'auto',
    duration: 0.3,
    ease: 'power2.out',
    clearProps: 'all'
  });
  

  gsap.to('.update-indicator', {
    scale: 1.2,
    opacity: 1,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
    clearProps: 'all'
  });
}, [orderbook]);

const processedAsks: OrderbookItem[] = orderbook.asks
  .map(([price, amount]) => ({
    price: parseFloat(price),
    amount: parseFloat(amount)
  }))
  .slice(0, isExpanded ? 10 : maxDisplayedRows);

const processedBids: OrderbookItem[] = orderbook.bids
  .map(([price, amount]) => ({
    price: parseFloat(price),
    amount: parseFloat(amount)
  }))
  .slice(0, isExpanded ? 10 : maxDisplayedRows);
  // Find max amount for scaling
  const maxAmount = Math.max(
    ...processedAsks.map(a => a.amount),
    ...processedBids.map(b => b.amount)
  );
  
  // Calculate spread
  const lowestAsk = processedAsks.length > 0 ? processedAsks[0].price : 0;
  const highestBid = processedBids.length > 0 ? processedBids[0].price : 0;
  const spread = lowestAsk - highestBid;
  const spreadPercentage = highestBid > 0 ? (spread / highestBid) * 100 : 0;

  // Format timestamp
  const timestamp = new Date(orderbook.timestamp).toLocaleTimeString();
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    
    // Animate the height change
    if (chartRef.current) {
      gsap.to(chartRef.current, {
        height: isExpanded ? 'auto' : 'auto',
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          // Animate the bars after height change
          gsap.from('.ask-bar, .bid-bar', {
            width: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out'
          });
        }
      });
    }
  };


  // Add after the toggleExpand function
const adjustDisplayedRows = (increment: boolean) => {
  setMaxDisplayedRows(prev => {
    const newValue = increment ? prev + 1 : prev - 1;
    return Math.min(Math.max(newValue, 3), 10); // Limits between 3-10 rows
  });
};

  return (
    <div className="panel opacity-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChart className="w-5 h-5 text-primary-400 mr-2" />
          <h2 className="text-xl font-semibold">Orderbook Visualization</h2>
        </div>
        <div className="flex items-center">
          <div className="text-sm mr-4">
            <span className="text-dark-400">Last update: </span>
            <span className="text-white">{timestamp}</span>
          </div>
          <div className="update-indicator h-2 w-2 rounded-full bg-primary-500 opacity-50"></div>
        </div>
      </div>
      
      <div className="flex justify-between text-sm mb-2">
        <div>
          <span className="text-dark-400">Symbol: </span>
          <span className="font-medium">{orderbook.symbol}</span>
        </div>
        <div>
          <span className="text-dark-400">Spread: </span>
          <span className={`font-medium ${spread > 5 ? 'text-warning-400' : 'text-success-400'}`}>
            {spread.toFixed(2)} ({spreadPercentage.toFixed(4)}%)
          </span>
        </div>
      </div>
      
     
<div className="mb-4 px-2 py-1 bg-primary-900/20 rounded-md text-xs text-primary-200 flex items-center">
  <span className="flex-grow">Showing top {isExpanded ? 10 : maxDisplayedRows} orders on each side</span>
  <div className="flex items-center space-x-2 mr-4">
    <button 
      onClick={() => adjustDisplayedRows(false)}
      disabled={maxDisplayedRows <= 3}
      className="px-2 py-1 text-primary-400 hover:text-primary-300 disabled:opacity-50"
    >
      -
    </button>
    <span>{maxDisplayedRows}</span>
    <button 
      onClick={() => adjustDisplayedRows(true)}
      disabled={maxDisplayedRows >= 10}
      className="px-2 py-1 text-primary-400 hover:text-primary-300 disabled:opacity-50"
    >
      +
    </button>
  </div>
  <button 
    onClick={toggleExpand} 
    className="ml-2 text-primary-400 hover:text-primary-300 transition-colors flex items-center"
  >
    {isExpanded ? 'Show Less' : 'Show More'}
    <RefreshCw className={`ml-1 w-3 h-3 ${isExpanded ? 'rotate-180' : ''} transition-transform`} />
  </button>
</div>
      
      <div ref={chartRef} className="flex">
        <div className="w-1/2 pr-2 border-r border-dark-700">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-success-500 font-medium">Bids</span>
            <span className="text-dark-400">Amount</span>
          </div>
          {processedBids.map((item, index) => (
            <div key={`bid-${index}`} className="flex items-center mb-1 text-sm">
              <div className="w-20 text-right mr-2">{item.price.toFixed(2)}</div>
              <div 
                className="bid-bar bg-success-900/50 h-5 flex items-center justify-end px-2 rounded-sm text-xs"
                style={{ width: `${(item.amount / maxAmount) * 100}%` }}
              >
                {item.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-1/2 pl-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-dark-400">Amount</span>
            <span className="text-error-500 font-medium">Asks</span>
          </div>
          {processedAsks.map((item, index) => (
            <div key={`ask-${index}`} className="flex items-center mb-1 text-sm">
              <div 
                className="ask-bar bg-error-900/50 h-5 flex items-center px-2 rounded-sm text-xs"
                style={{ width: `${(item.amount / maxAmount) * 100}%` }}
              >
                {item.amount.toFixed(2)}
              </div>
              <div className="w-20 text-left ml-2">{item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-dark-700 text-xs text-dark-400">
        <p>The visualization shows market depth with bids (buy orders) in green and asks (sell orders) in red. Bar length represents order volume.</p>
      </div>
    </div>
  );
};

export default OrderbookVisualizer;