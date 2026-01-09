
import React from 'react';
import { Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Marketing<span className="text-orange-500">DNA</span> <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2 uppercase tracking-tighter text-gray-400">Open-Source Edition</span>
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 font-medium">Workflows</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 font-medium">Library</a>
            </nav>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Local-Ready
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm">
              <p className="font-bold text-gray-600 mb-1">Consumer Communication Assistant</p>
              <p>Built for UK businesses. Modular. Privacy-first.</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest">Documentation</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest">Github</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
