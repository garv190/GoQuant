import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import InputPanel from '../components/simulator/InputPanel';
import OutputPanel from '../components/simulator/OutputPanel';
import OrderbookVisualizer from '../components/simulator/OrderbookVisualizer';
import WebSocketHandler from '../services/WebSocketHandler';
import SimulationService from '../services/SimulationService';
import { AlertCircle } from 'lucide-react';


const initialParams = {
  exchange: "OKX",
  asset: "BTC-USDT",
  orderType: "market",
  quantity: 100,
  volatility: 0.05,
  feeTier: "default"
};


const initialOrderbook = {
  timestamp: new Date().toISOString(),
  exchange: "OKX",
  symbol: "BTC-USDT-SWAP",
  asks: [
    ["95445.5", "9.06"],
    ["95448", "2.05"],
    ["95450", "5.12"],
    ["95455", "10.45"],
    ["95460", "15.78"]
  ],
  bids: [
    ["95445.4", "1104.23"],
    ["95445.3", "0.02"],
    ["95440", "4.56"],
    ["95435", "8.9"],
    ["95430", "12.34"]
  ]
};

const Simulator: React.FC = () => {
  const [params, setParams] = useState(initialParams);
  const [orderbook, setOrderbook] = useState(initialOrderbook);
  const [outputData, setOutputData] = useState({
    slippage: 0.12,
    fees: 0.05,
    marketImpact: 0.23,
    netCost: 0.40,
    makerTakerProportion: 0.75,
    latency: 3.2,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const websocketRef = useRef<WebSocketHandler | null>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
   
     animationRef.current = gsap.timeline();
  
  animationRef.current.from(containerRef.current, {
    y: 10,
    duration: 0.4,
    ease: 'power2.out',
    clearProps: 'all' 
  });
  
  animationRef.current.from('.panel', {
    y: 10,
    stagger: 0.1,
    duration: 0.3,
    ease: 'power2.out',
    clearProps: 'all' 
  }, '-=0.2');
    
    
    websocketRef.current = new WebSocketHandler({
      onMessage: (data) => {
        setOrderbook(data);
        if (isSimulating) {
          const results = SimulationService.calculateOutputs(params, data);
          setOutputData(results);
        }
      },
      onOpen: () => {
        setIsConnected(true);
        setConnectionError(null);
      },
      onClose: () => {
        setIsConnected(false);
        setConnectionError("Connection closed. Attempting to reconnect...");
      },
      onError: (error) => {
        console.error("WebSocket error:", error);
        setConnectionError("Error connecting to exchange data. Please check your network.");
      }
    });
    
   
    return () => {
      if (websocketRef.current) {
        websocketRef.current.disconnect();
      }
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (isSimulating && websocketRef.current) {
      const results = SimulationService.calculateOutputs(params, orderbook);
      setOutputData(results);
    }
  }, [params, isSimulating]);

  const handleConnect = () => {
    if (websocketRef.current) {
      websocketRef.current.connect();
    }
  };

  const handleDisconnect = () => {
    if (websocketRef.current) {
      websocketRef.current.disconnect();
      setIsConnected(false);
    }
  };

  const handleParamsChange = (newParams: typeof initialParams) => {
    setParams(newParams);
    if (isSimulating) {
      const results = SimulationService.calculateOutputs(newParams, orderbook);
      setOutputData(results);
    }
  };

  const toggleSimulation = () => {
    const newSimulatingState = !isSimulating;
    setIsSimulating(newSimulatingState);
    
    if (newSimulatingState && !isConnected && websocketRef.current) {
      handleConnect();
    }
    
   
    if (newSimulatingState) {
      gsap.to('.simulator-status', {
        backgroundColor: 'rgba(239, 68, 68, 0.2)', 
        duration: 0.5,
        repeat: -1,
        yoyo: true
      });
    } else {
      gsap.killTweensOf('.simulator-status');
      gsap.to('.simulator-status', {
        backgroundColor: 'transparent',
        duration: 0.3
      });
    }
  };

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trade Simulator</h1>
        
        <div className="flex items-center space-x-4">
          <div className="simulator-status px-3 py-1 rounded-md flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${isSimulating ? 'bg-error-500' : 'bg-dark-500'}`}></div>
            <span>{isSimulating ? 'Simulation Running' : 'Simulation Idle'}</span>
          </div>
          
          <div className="flex items-center bg-dark-800 px-3 py-1 rounded-md">
            <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-success-500' : 'bg-error-500'}`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
      
      {connectionError && (
        <div className="mb-4 bg-error-900/30 border border-error-700 text-error-200 px-4 py-3 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{connectionError}</span>
        </div>
      )}
      
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {!isConnected ? (
          <button onClick={handleConnect} className="btn-primary">
            <span className="w-4 h-4 mr-2" /> Connect to Exchange
          </button>
        ) : (
          <button onClick={handleDisconnect} className="btn bg-dark-700 hover:bg-dark-600 text-white">
            Disconnect
          </button>
        )}
        
        <button 
          onClick={toggleSimulation} 
          className={`btn ${isSimulating ? 'bg-error-600 hover:bg-error-700' : 'bg-success-600 hover:bg-success-700'} text-white`}
        >
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <InputPanel 
            params={params} 
            onChange={handleParamsChange} 
            isSimulating={isSimulating}
          />
        </div>
        
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <OutputPanel data={outputData} />
            <OrderbookVisualizer orderbook={orderbook} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;