
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Documentation from './pages/Documentation';
import Performance from './pages/Performance';
import About from './pages/About';

function App() {
  return (
   <Router>
      <div className="min-h-screen bg-navy-900">
        <Navbar />
        <main className="pt-16"> 
          <div className="hero-section py-20 text-center">
            <h1 className="hero-title">GoQuant Trade Simulator</h1>
            <p className="hero-subtitle">
              High-performance trade simulator leveraging real-time market data to estimate 
              transaction costs and market impact
            </p>
          </div>
          <div className="container mx-auto px-4 pb-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;