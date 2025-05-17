import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { 
  BarChart3, 
  Clock, 
  Cpu, 
  MemoryStick as Memory,
  Zap, 
  TrendingUp, 
 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimelineData {
  timestamp: string;
  latency: number;
  cpu: number;
  memory: number;
}

// Mock performance data
const mockPerformanceData = {
  timeline: Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${23-i}h ago`,
    latency: Math.random() * 100 + 50,
    cpu: Math.random() * 100,
    memory: Math.random() * 100
  })) as TimelineData[]
};

const Performance: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'memory' | 'latency'>('latency');

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { clearProps: 'all' } });
    
    gsap.set(pageRef.current, { opacity: 1 });
    gsap.set('.performance-card', { opacity: 1 });
    gsap.set('.metric-bar', { scaleX: 1 });

    tl.from(pageRef.current, {
      y: 20,
      duration: 0.5,
      ease: 'power2.out'
    });
    
    tl.from('.performance-card', {
      y: 20,
      stagger: 0.1,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.2');

    gsap.from('.metric-bar', {
      scaleX: 0,
      duration: 1,
      ease: 'power2.out',
      delay: 0.8,
      stagger: 0.1
    });

    const interval = setInterval(() => {
      gsap.to('.live-value', {
        keyframes: [
          { color: '#38bdf8', duration: 0.2 },
          { color: 'white', duration: 0.4 }
        ],
        ease: 'power2.out'
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: mockPerformanceData.timeline.map((d: TimelineData) => d.timestamp),
    datasets: [
      {
        label: activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1),
        data: mockPerformanceData.timeline.map((d: TimelineData) => d[activeMetric]),
        borderColor: activeMetric === 'latency' ? '#60a5fa' : 
                    activeMetric === 'cpu' ? '#34d399' : '#f472b6',
        backgroundColor: activeMetric === 'latency' ? 'rgba(96, 165, 250, 0.1)' : 
                        activeMetric === 'cpu' ? 'rgba(52, 211, 153, 0.1)' : 
                        'rgba(244, 114, 182, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad'
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        padding: 12,
        borderColor: 'rgba(148, 163, 184, 0.1)',
        borderWidth: 1,
      }
    },
   scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        display: true,
      },
      border: {
        display: false, 
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: 'rgba(148, 163, 184, 0.7)',
        padding: 8,
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: 'rgba(148, 163, 184, 0.7)',
        padding: 8,
      }
    }
  }
  };

  return (
    <div ref={pageRef} className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Performance Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="performance-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Latency</h3>
            </div>
            <span className="text-sm text-gray-400">Last 24h</span>
          </div>
          <div className="text-3xl font-bold text-white mb-4 live-value">
            120<span className="text-lg ml-1">ms</span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <div className="metric-bar h-full bg-blue-500 rounded-full" style={{width: '60%'}} />
          </div>
        </div>

        <div className="performance-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Cpu className="h-5 w-5 text-emerald-400 mr-2" />
              <h3 className="text-lg font-medium text-white">CPU Usage</h3>
            </div>
            <span className="text-sm text-gray-400">Last 24h</span>
          </div>
          <div className="text-3xl font-bold text-white mb-4 live-value">
            45<span className="text-lg ml-1">%</span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <div className="metric-bar h-full bg-emerald-500 rounded-full" style={{width: '45%'}} />
          </div>
        </div>

        <div className="performance-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Memory className="h-5 w-5 text-pink-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Memory Usage</h3>
            </div>
            <span className="text-sm text-gray-400">Last 24h</span>
          </div>
          <div className="text-3xl font-bold text-white mb-4 live-value">
            2.4<span className="text-lg ml-1">GB</span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <div className="metric-bar h-full bg-pink-500 rounded-full" style={{width: '75%'}} />
          </div>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Performance History</h2>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeMetric === 'latency' ? 'bg-primary-900 text-primary-400' : 'bg-dark-700 hover:bg-dark-600'
              }`}
              onClick={() => setActiveMetric('latency')}
            >
              Latency
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeMetric === 'cpu' ? 'bg-primary-900 text-primary-400' : 'bg-dark-700 hover:bg-dark-600'
              }`}
              onClick={() => setActiveMetric('cpu')}
            >
              CPU
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeMetric === 'memory' ? 'bg-primary-900 text-primary-400' : 'bg-dark-700 hover:bg-dark-600'
              }`}
              onClick={() => setActiveMetric('memory')}
            >
              Memory
            </button>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Optimization Recommendations</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Reduce Network Latency</h3>
              <p className="text-gray-400">Think about connecting to the exchange API more directly. For high-frequency trading, the current network latency of 120 ms is greater than ideal.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Optimize CPU Usage</h3>
              <p className="text-gray-400">High market volatility causes a spike in the trading algorithm's CPU usage. Think about using calculations that are more effective.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;