
import React, { useState } from 'react';
import Layout from './components/Layout';
import DNAExtractor from './components/DNAExtractor';
import CampaignHub from './components/CampaignHub';
import { BrandDNA } from './types';
import { ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [dna, setDNA] = useState<BrandDNA | null>(null);

  const resetDNA = () => {
    setDNA(null);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {!dna ? (
          <DNAExtractor onDNALoaded={setDNA} />
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* Brand DNA Sidebar Header */}
            <div className="bg-white border-b border-gray-100 py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={resetDNA}
                    className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2 text-sm text-gray-500 font-medium"
                  >
                    <ArrowLeft size={16} /> New Brand
                  </button>
                  <div className="h-6 w-px bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dna.identity.colors.primary }} />
                    <span className="font-bold text-gray-900">Brand Profile Active</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">{dna.identity.tone}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {dna.keywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase tracking-wider">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <CampaignHub dna={dna} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
