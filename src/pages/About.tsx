import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Code, Share2, Shield, Terminal } from 'lucide-react';


gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
   
    gsap.set('.scroll-section', { opacity: 0, y: 50 });
    gsap.set('.about-card', { opacity: 0, y: 30 });
    
   
    const tl = gsap.timeline();
    
    tl.from(headerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    tl.from('.about-card', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4');
    
    
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach(section => {
      gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=100',
          end: 'top center',
          toggleActions: 'play none none reverse',
          scrub: 1,
          markers: false,
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen">

      <div className="relative bg-gradient-to-b from-dark-800 to-dark-900 pt-16 pb-24">
        <div ref={headerRef} className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About GoQuant</h1>
          <p className="text-xl text-dark-300 max-w-3xl mx-auto mb-10">
            Pioneering algorithmic trading tools with cutting-edge technology and quantitative research
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#mission" className="btn-primary">Our Mission</a>
          </div>
        </div>
        
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 text-dark-900 fill-current">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </div>
      

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="about-card card p-6">
            <div className="rounded-full bg-primary-900/50 p-3 w-fit mb-4">
              <Clock className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Processing</h3>
            <p className="text-dark-300">
              Our systems process market data with ultra-low latency, providing real-time insights for trading decisions.
            </p>
          </div>
          
          <div className="about-card card p-6">
            <div className="rounded-full bg-secondary-900/50 p-3 w-fit mb-4">
              <Code className="h-6 w-6 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Algorithms</h3>
            <p className="text-dark-300">
              We implement cutting-edge quantitative models such as Almgren-Chriss for accurate market impact prediction.
            </p>
          </div>
          
          <div className="about-card card p-6">
            <div className="rounded-full bg-accent-900/50 p-3 w-fit mb-4">
              <Shield className="h-6 w-6 text-accent-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Infrastructure</h3>
            <p className="text-dark-300">
              Built with enterprise-grade security to ensure your trading data and strategies remain protected.
            </p>
          </div>
        </div>
      </div>
      
      
      <div id="mission" className="scroll-section bg-dark-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-dark-300">
              To make algorithmic trading more accessible by offering advanced tools and analysis that were previously exclusive to institutional investors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">What We Do</h3>
              <ul className="space-y-3 text-dark-300">
                <li className="flex">
                  <Share2 className="h-5 w-5 text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Create trading simulators and systems with high performance.</span>
                </li>
                <li className="flex">
                  <Share2 className="h-5 w-5 text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Analyze and visualize market data in real time.</span>
                </li>
                <li className="flex">
                  <Share2 className="h-5 w-5 text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Develop mathematical models to forecast the impact on the market.</span>
                </li>
                <li className="flex">
                  <Share2 className="h-5 w-5 text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Investigate and put into practice sophisticated trading algorithms.</span>
                </li>
              </ul>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Why It Matters</h3>
              <p className="text-dark-300 mb-4">
               Trading profitability can be greatly impacted by execution quality in the fast-paced markets of today. For traders of all sizes, it is critical to comprehend and minimize transaction costs.
              </p>
              <p className="text-dark-300">
                Traders can make data-driven decisions, optimize execution strategies, and obtain insights into market microstructure with our technology stack.

              </p>
            </div>
          </div>
        </div>
      </div>

    
      <div className="scroll-section bg-dark-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Technology Stack</h2>
          
          <div className="card p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="rounded-full bg-dark-700 p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Terminal className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="font-medium">Python Flask</h3>
                <p className="text-dark-400 text-sm">Backend Processing</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-dark-700 p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Code className="h-8 w-8 text-secondary-400" />
                </div>
                <h3 className="font-medium">React Vite</h3>
                <p className="text-dark-400 text-sm">Frontend UI</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-dark-700 p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-accent-400 font-bold text-xl">WS</span>
                </div>
                <h3 className="font-medium">WebSockets</h3>
                <p className="text-dark-400 text-sm">Real-time Data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      <div className="scroll-section container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-dark-300">
            Interested in our simulator or have questions about our technology? Reach out to our team.
          </p>
        </div>
        
        <div className="card p-6 max-w-xl mx-auto">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="data-label block mb-1">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="input-field w-full" 
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="data-label block mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="input-field w-full" 
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="data-label block mb-1">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="input-field w-full" 
                placeholder="What is this regarding?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="data-label block mb-1">Message</label>
              <textarea 
                id="message" 
                rows={4} 
                className="input-field w-full" 
                placeholder="Your message"
              ></textarea>
            </div>
            
            <div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center mt-8 text-dark-400 text-sm">
          <p>For career opportunities, please email us at <a href="mailto:careers@goquant.io" className="text-primary-400 hover:underline">careers@goquant.io</a></p>
        </div>
      </div>
      
      
      <footer className="bg-dark-900 py-8 border-t border-dark-700">
        <div className="container mx-auto px-4 text-center">
          <p className="text-dark-400">© 2025 GoQuant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;