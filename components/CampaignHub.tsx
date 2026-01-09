
import React, { useState, useEffect } from 'react';
import { Target, MessageCircle, PenTool, Sparkles, Video, ArrowRight, Loader2, RefreshCw, Calendar, Sliders, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { BrandDNA, CampaignType, Platform, MarketingAsset, ToneSettings } from '../types';
import { generateCampaignIdeas, generateAssetContent, generateImage, generateVideo } from '../services/geminiService';

interface CampaignHubProps {
  dna: BrandDNA;
}

const ANIMATION_STYLES = [
  { id: 'Cinematic', label: 'Cinematic', description: 'Subtle pans and dramatic lighting' },
  { id: 'Corporate', label: 'Corporate', description: 'Clean, professional, and smooth' },
  { id: 'Playful', label: 'Playful', description: 'Fun, energetic, and bouncing' },
  { id: 'Minimalist', label: 'Minimalist', description: 'Simple, clean motion design' },
  { id: 'High Energy', label: 'High Energy', description: 'Fast-paced and rhythmic' },
];

const CampaignHub: React.FC<CampaignHubProps> = ({ dna: initialDna }) => {
  const [dna, setDna] = useState<BrandDNA>(initialDna);
  const [goal, setGoal] = useState<CampaignType | null>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any | null>(null);
  const [assets, setAssets] = useState<MarketingAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingAssets, setGeneratingAssets] = useState(false);
  const [activeTab, setActiveTab] = useState<Platform>(Platform.LINKEDIN);
  const [editingAsset, setEditingAsset] = useState<MarketingAsset | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedAnimationStyle, setSelectedAnimationStyle] = useState(ANIMATION_STYLES[0]);

  useEffect(() => {
    if (goal && !selectedIdea) {
      fetchIdeas();
    }
  }, [goal]);

  const fetchIdeas = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const result = await generateCampaignIdeas(dna, goal);
      setIdeas(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAssets = async (idea: any) => {
    setSelectedIdea(idea);
    setGeneratingAssets(true);
    try {
      const platforms = [Platform.LINKEDIN, Platform.INSTAGRAM, Platform.FACEBOOK, Platform.TIKTOK];
      const newAssets: MarketingAsset[] = [];
      
      for (const platform of platforms) {
        const content = await generateAssetContent(dna, idea.theme, platform, goal!);
        const imageUrl = await generateImage(content.imagePrompt, platform === Platform.INSTAGRAM ? '1:1' : '16:9');
        
        newAssets.push({
          id: Math.random().toString(36).substr(2, 9),
          platform,
          headline: content.headline,
          body: content.body,
          caption: content.caption,
          imageUrl: imageUrl || 'https://picsum.photos/800/600',
          ratio: platform === Platform.INSTAGRAM ? '1:1' : '16:9'
        });
      }
      setAssets(newAssets);
      setEditingAsset(newAssets.find(a => a.platform === activeTab) || null);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAssets(false);
    }
  };

  const handleAnimate = async () => {
    if (!editingAsset?.imageUrl) return;
    setIsAnimating(true);
    try {
      const stylePrompt = `A ${selectedAnimationStyle.id.toLowerCase()} motion ad with ${selectedAnimationStyle.description}`;
      const videoUrl = await generateVideo(editingAsset.imageUrl, `${stylePrompt} for ${selectedIdea.theme}, high quality, realistic textures`);
      const updatedAssets = assets.map(a => a.id === editingAsset.id ? { ...a, videoUrl } : a);
      setAssets(updatedAssets);
      setEditingAsset(updatedAssets.find(a => a.id === editingAsset.id) || null);
    } catch (e) {
      console.error(e);
      alert("Video generation failed. Please try again later.");
    } finally {
      setIsAnimating(false);
    }
  };

  const updateAssetField = (field: keyof MarketingAsset, value: string) => {
    if (!editingAsset) return;
    const updated = { ...editingAsset, [field]: value };
    setEditingAsset(updated);
    setAssets(prev => prev.map(a => a.id === editingAsset.id ? updated : a));
  };

  const updateTone = (field: keyof ToneSettings, value: number) => {
    setDna(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        toneSettings: {
          ...prev.identity.toneSettings,
          [field]: value
        }
      }
    }));
  };

  const handleSchedule = () => {
    if (!editingAsset) return;
    const updated = { ...editingAsset, scheduledAt: scheduledDate };
    setEditingAsset(updated);
    setAssets(prev => prev.map(a => a.id === editingAsset.id ? updated : a));
    setShowScheduleModal(false);
    alert(`Asset scheduled for ${scheduledDate}`);
  };

  const campaignTemplates = [
    { type: CampaignType.AWARENESS, icon: Sparkles, desc: "Build brand visibility & reach." },
    { type: CampaignType.LEAD_GEN, icon: Target, desc: "Capture enquiries and sign-ups." },
    { type: CampaignType.PROMOTIONAL, icon: Sliders, desc: "Drive immediate sales & offers." },
    { type: CampaignType.STORYTELLING, icon: MessageCircle, desc: "Connect via brand narratives." },
  ];

  if (!goal) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Select Campaign Goal</h2>
          <p className="text-gray-500 text-lg">Choose a template to tailor your AI-generated assets.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaignTemplates.map((template) => (
            <button
              key={template.type}
              onClick={() => setGoal(template.type)}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col items-start group"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <template.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{template.type}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{template.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {!selectedIdea ? (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <button onClick={() => setGoal(null)} className="text-sm font-bold text-blue-600 hover:underline mb-2 flex items-center gap-1">
                <ArrowRight className="rotate-180" size={14} /> Change Template
              </button>
              <h2 className="text-3xl font-extrabold text-gray-900">{goal} Strategies</h2>
              <p className="text-gray-500">Tailored ideas for your {dna.identity.tone} UK audience.</p>
            </div>
            <button 
              onClick={fetchIdeas}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition shadow-lg"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Generate New Angles
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 animate-pulse h-80 shadow-sm" />
              ))
            ) : (
              ideas.map((idea, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all flex flex-col group">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Target size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{idea.theme}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{idea.angle}</p>
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">High Converting</span>
                    <button 
                      onClick={() => handleGenerateAssets(idea)}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                    >
                      Draft Assets <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedIdea(null)}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedIdea.theme}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">{goal}</span>
                  <span className="text-xs font-bold text-gray-400">UK Market Focus</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition shadow-lg">
                <CheckCircle size={14} /> Approve Campaign
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar with Advanced Controls */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-[1.5rem] border border-gray-100 p-2 shadow-xl">
                {Object.values(Platform).filter(p => assets.some(a => a.platform === p)).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => {
                      setActiveTab(platform);
                      setEditingAsset(assets.find(a => a.platform === platform) || null);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition font-bold text-sm ${activeTab === platform ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle size={18} />
                      {platform}
                    </div>
                    {assets.find(a => a.platform === platform)?.scheduledAt && <Clock size={14} />}
                  </button>
                ))}
              </div>

              {/* Advanced Tone Sliders */}
              <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-xl space-y-6">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Sliders size={16} className="text-blue-600" /> Advanced Tone
                </h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tighter">
                      <span>Casual</span>
                      <span>Formal</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={dna.identity.toneSettings.formality}
                      onChange={(e) => updateTone('formality', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tighter">
                      <span>Professional</span>
                      <span>Enthusiastic</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={dna.identity.toneSettings.enthusiasm}
                      onChange={(e) => updateTone('enthusiasm', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tighter">
                      <span>Serious</span>
                      <span>Humorous</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={dna.identity.toneSettings.humour}
                      onChange={(e) => updateTone('humour', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                  </div>
                </div>
                <button className="w-full py-2 bg-gray-50 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-100 transition">
                  Regenerate with Tone
                </button>
              </div>
            </div>

            {/* Asset Editor Canvas */}
            <div className="lg:col-span-9">
              {generatingAssets ? (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl h-[650px] flex flex-col items-center justify-center text-center p-12">
                   <div className="relative mb-8">
                    <div className="w-24 h-24 bg-blue-100 rounded-full animate-ping absolute opacity-20" />
                    <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center relative shadow-xl shadow-blue-200 rotate-12">
                      <PenTool className="text-white w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">Crafting Your Campaign...</h3>
                  <p className="text-gray-500 max-w-md leading-relaxed">AI is currently analyzing your tone sliders and UK-specific keywords to draft pixel-perfect assets for {activeTab}.</p>
                </div>
              ) : editingAsset && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Visual Preview */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden group">
                      <div className={`relative bg-gray-50 rounded-[2rem] overflow-hidden aspect-square flex items-center justify-center border-4 border-white shadow-inner`}>
                        {editingAsset.videoUrl ? (
                          <video src={editingAsset.videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
                        ) : (
                          <img src={editingAsset.imageUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black text-gray-900 shadow-xl uppercase tracking-widest border border-gray-100">
                          {activeTab} Preview
                        </div>
                      </div>

                      {/* Animation Style Selector */}
                      <div className="mt-6">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Animation Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          {ANIMATION_STYLES.map((style) => (
                            <button
                              key={style.id}
                              onClick={() => setSelectedAnimationStyle(style)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                                selectedAnimationStyle.id === style.id
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                              }`}
                            >
                              {style.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <button 
                          onClick={handleAnimate}
                          disabled={isAnimating}
                          className="flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                        >
                          {isAnimating ? <Loader2 className="animate-spin" size={18} /> : <Video size={18} />}
                          {isAnimating ? 'Animating...' : `Animate (${selectedAnimationStyle.label})`}
                        </button>
                        <button 
                          onClick={() => setShowScheduleModal(true)}
                          className="flex items-center justify-center gap-2 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-100"
                        >
                          <Calendar size={18} /> Schedule
                        </button>
                      </div>
                    </div>

                    {editingAsset.scheduledAt && (
                      <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-sm font-bold text-green-800">Scheduled for {editingAsset.scheduledAt}</span>
                      </div>
                    )}
                  </div>

                  {/* High Performance Copy Editor */}
                  <div className="space-y-6">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-8 h-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Content Editor</h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                          <Sparkles size={12} /> Real-Time Sync
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Strong Headline</label>
                          <input 
                            type="text" 
                            value={editingAsset.headline}
                            onChange={(e) => updateAssetField('headline', e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-gray-900 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Post Body Content</label>
                          <textarea 
                            rows={6}
                            value={editingAsset.body}
                            onChange={(e) => updateAssetField('body', e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 text-sm leading-relaxed text-gray-700 transition-all resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Social Media Caption</label>
                          <textarea 
                            rows={3}
                            value={editingAsset.caption}
                            onChange={(e) => updateAssetField('caption', e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 text-sm italic text-gray-500 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div className="pt-8 flex items-center justify-between border-t border-gray-50">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Current Tone</span>
                          <span className="text-xs font-black text-gray-900 uppercase">{dna.identity.tone} Profile</span>
                        </div>
                        <button className="text-blue-600 text-sm font-black flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition">
                          <RefreshCw size={14} /> AI Rewrite
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scheduling Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Schedule Post</h3>
            <p className="text-gray-500 mb-8">Pick a time for your {activeTab} asset to go live.</p>
            
            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 text-gray-900 font-bold"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSchedule}
                disabled={!scheduledDate}
                className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignHub;
