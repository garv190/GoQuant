import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { gsap } from 'gsap';

const Dashboard: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set([headerRef.current, '.dashboard-card', '.stat-item'], { opacity: 0 });

    const tl = gsap.timeline();
    
    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .to('.dashboard-card', {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .to('.stat-item', {
      opacity: 1,
      scale: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.3');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div ref={headerRef} className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">GoQuant Trade Simulator</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            High-performance trade simulator leveraging real-time market data to estimate transaction costs and market impact
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="dashboard-card bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <div className="rounded-full bg-blue-900/50 p-3 w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Trade Simulator</h3>
            <p className="text-gray-300 mb-4">
              Link to real-time orderbook information and run thorough cost analysis-based simulations of trades.
            </p>
            <Link to="/simulator" className="group flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors">
              Start simulating
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="dashboard-card bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <div className="rounded-full bg-purple-900/50 p-3 w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analytics Models</h3>
            <p className="text-gray-300 mb-4">
           Research the Almgren-Chriss model, regression analysis, and other quantitative instruments.
            </p>
            <Link to="/documentation" className="group flex items-center text-purple-400 font-medium hover:text-purple-300 transition-colors">
              View documentation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="dashboard-card bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            <div className="rounded-full bg-green-900/50 p-3 w-fit mb-4">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Performance Analysis</h3>
            <p className="text-gray-300 mb-4">
              Benchmark and improve system latency, memory consumption, and processing effectiveness.
            </p>
            <Link to="/performance" className="group flex items-center text-green-400 font-medium hover:text-green-300 transition-colors">
              Check performance
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-item p-4 bg-gray-800 rounded-lg">
              <span className="block text-sm text-gray-400 mb-1">Data Sources</span>
              <div className="flex items-baseline">
                <span className="text-xl font-semibold text-white">OKX Spot</span>
              </div>
            </div>
            <div className="stat-item p-4 bg-gray-800 rounded-lg">
              <span className="block text-sm text-gray-400 mb-1">Processing Rate</span>
              <div className="flex items-baseline">
                <span className="text-xl font-semibold text-white">500+</span>
                <span className="text-gray-400 text-sm ml-1">ticks/sec</span>
              </div>
            </div>
            <div className="stat-item p-4 bg-gray-800 rounded-lg">
              <span className="block text-sm text-gray-400 mb-1">Avg. Latency</span>
              <div className="flex items-baseline">
                <span className="text-xl font-semibold text-white">5.2</span>
                <span className="text-gray-400 text-sm ml-1">ms</span>
              </div>
            </div>
            <div className="stat-item p-4 bg-gray-800 rounded-lg">
              <span className="block text-sm text-gray-400 mb-1">Model Accuracy</span>
              <div className="flex items-baseline">
                <span className="text-xl font-semibold text-white">98.7%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            to="/simulator" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <span>Go to simulator</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;