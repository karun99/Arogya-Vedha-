
import React, { useState } from 'react';
import { getMedicationInfo, analyzeMedicalImage } from '../services/geminiService';
import { HealthProfile } from '../types';
import CameraScanner from './CameraScanner';

const MedicalAgent: React.FC<{ profile: HealthProfile }> = ({ profile }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<{text: string, sources: any[]} | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await getMedicationInfo(query, profile);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (base64: string, mimeType: string) => {
    setLoading(true);
    try {
      const res = await analyzeMedicalImage(
        base64, 
        mimeType, 
        "Extract all medications, dosages, and instructions from this prescription. Check for interactions with current profile.", 
        profile
      );
      setData({ text: res, sources: [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 heading-font">Bheshaj Guru</h2>
              <p className="text-slate-500">Real-time interaction checker & Prescription scanner.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowScanner(true)}
            className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-2xl font-bold border border-blue-100 hover:bg-blue-100 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="text-sm">Scan Prescription</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter medications separated by commas..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {loading ? "Searching..." : "Scan Interactions"}
            </button>
          </div>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Safety & Interaction Analysis</h3>
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                 <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest">Real-time Verified</span>
              </div>
            </div>
            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
              {data.text}
            </div>
          </div>
          
          {data.sources.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest px-1">Evidence Base</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {data.sources.map((src, i) => (
                  <a key={i} href={src.web?.uri} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group">
                    <p className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">{src.web?.title || 'Scientific Reference'}</p>
                    <p className="text-[9px] text-slate-400 truncate font-mono">{src.web?.uri}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showScanner && (
        <CameraScanner 
          title="Prescription Scanner" 
          onClose={() => setShowScanner(false)} 
          onCapture={handleScan} 
        />
      )}
    </div>
  );
};

export default MedicalAgent;
