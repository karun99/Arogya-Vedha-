
import React, { useState } from 'react';
import { getDietaryAdvice } from '../services/geminiService';
import { HealthProfile } from '../types';

const FoodieAgent: React.FC<{ profile: HealthProfile }> = ({ profile }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConsult = async () => {
    setLoading(true);
    const res = await getDietaryAdvice(input || "Suggest a general healthy meal plan for my profile", profile);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10"></div>
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-[#FF9F1C]/10 rounded-2xl flex items-center justify-center text-[#FF9F1C]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 heading-font">Aarogya Aahar</h2>
            <p className="text-slate-500">Indigenous culinary wisdom for {profile.name}.</p>
          </div>
        </div>

        <div className="space-y-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF9F1C]"
            placeholder="What should I eat today for my condition?"
          />
          <button 
            onClick={handleConsult}
            disabled={loading}
            className="w-full bg-[#FF9F1C] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {loading ? "Optimizing Nutrition..." : "Get Dietary Wisdom"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 whitespace-pre-wrap leading-relaxed text-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <h3 className="text-lg font-bold">Recommended Nutrition Plan</h3>
          </div>
          {result}
        </div>
      )}
    </div>
  );
};

export default FoodieAgent;
