
import React, { useState } from 'react';

interface MarketResearchProps {
  data: { text: string; sources: any[] } | null;
  onSearch: (query: string) => void;
}

const MarketResearch: React.FC<MarketResearchProps> = ({ data, onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Market Insights</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-2 mb-8">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about competitors, market trends, or user behaviors..." 
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
          />
          <button 
            onClick={() => onSearch(query)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Ask AI
          </button>
        </div>

        {!data ? (
          <div className="text-center py-20 text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            <p>Enter a query to research your target market.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 prose prose-slate max-w-none">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Analysis</h3>
              <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                {data.text}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Sources</h3>
              <div className="space-y-3">
                {data.sources.length > 0 ? (
                  data.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.web?.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Reference {i + 1}</span>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      </div>
                      <p className="text-sm font-bold text-slate-900 line-clamp-2">{source.web?.title || 'External Source'}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate">{source.web?.uri}</p>
                    </a>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No direct sources found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketResearch;
