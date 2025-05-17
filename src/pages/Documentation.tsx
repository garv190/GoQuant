import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BookOpen, ArrowRight } from 'lucide-react';

const Documentation: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(pageRef.current, { opacity: 1 });
      gsap.set('.doc-section', { opacity: 1 });

      gsap.from(pageRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.doc-section', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.3
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Documentation</h1>

       
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card doc-section">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Getting Started</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Steps to install dependencies and starting the development server.
            </p>
            <a href="#getting-started" className="text-blue-400 hover:text-blue-300 inline-flex items-center">
              Read more <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>

        </div>

       
        <div className="space-y-12">
          <section id="getting-started" className="card doc-section doc-content">
            <h2 className="text-2xl font-bold mb-6 text-white">Getting Started</h2>
            <div className="prose text-gray-300">
              <h3>Installation</h3>
              <pre className="bg-navy-900/50 p-4 rounded-lg">
                <code>git clone https://github.com/yourusername/goquant-final.git</code>
                <br></br>
                <code>cd goquant-final</code>
                <br></br>
                <code>npm install</code>
                  <br></br>
                <code>cd backend</code>
                  <br></br>
                <code>pip install -r requirements.txt</code>
                
              </pre>
              
              <h3>Initiation</h3>
              <p>Starting Development Server:</p>
              <pre className="bg-navy-900/50 p-4 rounded-lg">
                <code>cd backend</code>
                <br/>
          <code>python app.py</code>
              <br/>
          <code>cd..</code>
              <br/>
          <code>npm run dev</code>
              </pre>
            </div>
          </section>

          
        </div>
      </div>
    </div>
  );
};

export default Documentation;