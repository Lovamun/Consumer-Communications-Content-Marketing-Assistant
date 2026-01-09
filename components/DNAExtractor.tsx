
import React, { useState } from 'react';
import { Search, Globe, FileText, Loader2, Sparkles } from 'lucide-react';
import { extractBrandDNA } from '../services/geminiService';
import { BrandDNA } from '../types';

interface DNAExtractorProps {
  onDNALoaded: (dna: BrandDNA) => void;
}

const DNAExtractor: React.FC<DNAExtractorProps> = ({ onDNALoaded }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'url' | 'notes'>('url');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const dna = await extractBrandDNA(input);
      // Ensure defaults if missing from LLM response
      if (!dna.identity.toneSettings) {
        dna.identity.toneSettings = { formality: 50, enthusiasm: 50, humour: 20 };
      }
      onDNALoaded(dna);
    } catch (error) {
      console.error("Failed to extract DNA:", error);
      alert("Analysis failed. Please check your connection or provide more text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-black mb-6 uppercase tracking-widest border border-blue-100">
          <Sparkles size={16} /> Marketing DNA Engine v2.0
        </div>
        <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tighter">
          Define Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-orange-500 to-red-500">Brand Identity</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl leading-relaxed font-medium">
          The ultimate multi-channel marketing suite. Paste a link or describe your business, and we'll generate on-brand strategy, copy, and motion ads.
        </p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(30,64,175,0.15)] p-12 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <div className="flex gap-4 mb-10 relative z-10">
          <button 
            onClick={() => setMode('url')}
            className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] border-2 transition-all font-black text-lg ${mode === 'url' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xl shadow-blue-50' : 'border-gray-50 text-gray-300 hover:border-gray-200'}`}
          >
            <Globe size={20} /> Website URL
          </button>
          <button 
            onClick={() => setMode('notes')}
            className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] border-2 transition-all font-black text-lg ${mode === 'notes' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xl shadow-blue-50' : 'border-gray-50 text-gray-300 hover:border-gray-200'}`}
          >
            <FileText size={20} /> Brand Notes
          </button>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'url' ? 'e.g., myshopify-store.co.uk' : 'Describe your value proposition, target audience, and brand personality...'}
              className="w-full px-8 py-6 rounded-[2rem] border-none bg-gray-50 focus:ring-4 focus:ring-blue-100 text-xl min-h-[180px] transition-all resize-none placeholder:text-gray-300 font-medium"
            />
            {loading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center animate-in fade-in duration-300 z-20">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full animate-ping absolute opacity-20" />
                  <Loader2 className="animate-spin text-blue-600 relative" size={48} />
                </div>
                <span className="text-xs font-black text-blue-600 tracking-[0.2em] uppercase">Sequencing DNA...</span>
                <p className="text-gray-400 text-sm mt-2">Analyzing tone, colours, and UK compliance.</p>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="w-full flex items-center justify-center gap-3 py-6 bg-gray-900 text-white rounded-[1.5rem] font-black text-2xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-95 shadow-2xl shadow-gray-200"
          >
            {!loading && <Search size={24} />}
            {loading ? 'Initializing...' : 'Generate Brand DNA'}
          </button>
        </div>

        <div className="mt-12 pt-10 border-t border-gray-50 grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-green-50 text-green-600 flex items-center justify-center">✓</div>
            <span>UK Compliance</span>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">✓</div>
            <span>Modular Assets</span>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">✓</div>
            <span>Tone Slider</span>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">✓</div>
            <span>Video Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNAExtractor;
