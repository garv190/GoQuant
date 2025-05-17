import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    
  
    gsap.set('.nav-item', { opacity: 1 });
    tl.from('.nav-item', {
      y: -10,
      stagger: 0.1,
      duration: 0.3,
      ease: 'power2.out',
      clearProps: 'all'
    }, '-=0.2');
  }, []);

  return (
    <nav ref={navRef} className="bg-navy-900/95 backdrop-blur-sm border-b border-navy-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         
          <div className="flex items-center flex-1">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white opacity-100">GoQuant</span>
            </div>
            
          
            <div className="hidden md:block ml-10 flex-1">
              <div className="flex space-x-4">
                <NavLink to="/" 
                  className={({isActive}) => `nav-item px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                    isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}>
                  Dashboard
                </NavLink>
                <NavLink to="/simulator"
                  className={({isActive}) => `nav-item px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                    isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}>
                  Simulator
                </NavLink>
                <NavLink to="/documentation"
                  className={({isActive}) => `nav-item px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                    isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}>
                  Documentation
                </NavLink>
                <NavLink to="/performance"
                  className={({isActive}) => `nav-item px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                    isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}>
                  Performance
                </NavLink>
                <NavLink to="/about"
                  className={({isActive}) => `nav-item px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                    isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}>
                  About
                </NavLink>
              </div>
            </div>
          </div>

         
          <div className="flex items-center">
      

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 
                         hover:text-white hover:bg-navy-800 focus:outline-none">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" className={({isActive}) => 
              `block px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
              }`}>
              Dashboard
            </NavLink>
            <NavLink to="/simulator" className={({isActive}) => 
              `block px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
              }`}>
              Simulator
            </NavLink>
            <NavLink to="/documentation" className={({isActive}) => 
              `block px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
              }`}>
              Documentation
            </NavLink>
            <NavLink to="/performance" className={({isActive}) => 
              `block px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
              }`}>
              Performance
            </NavLink>
            <NavLink to="/about" className={({isActive}) => 
              `block px-3 py-2 rounded-md text-sm font-medium opacity-100 ${
                isActive ? 'bg-navy-800 text-blue-400' : 'text-gray-300 hover:text-white'
              }`}>
              About
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;