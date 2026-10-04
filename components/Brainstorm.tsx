
import React from 'react';
import { Feature } from '../types';

interface BrainstormProps {
  features: Feature[];
  onUpdateFeatures: (features: Feature[]) => void;
  onRefresh: () => void;
}

const Brainstorm: React.FC<BrainstormProps> = ({ features, onUpdateFeatures, onRefresh }) => {
  if (features.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No features yet</h2>
        <p className="text-slate-500 max-w-sm mb-8">Generate strategic feature ideas with Gemini to populate your backlog.</p>
        <button 
          onClick={onRefresh}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          Generate Ideas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Feature Backlog</h2>
        <div className="flex space-x-2">
          <button onClick={onRefresh} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Feature</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">RICE Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reach</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Impact</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Effort</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {features.map((feature) => (
              <tr key={feature.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{feature.name}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{feature.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-indigo-600">{feature.riceScore.toFixed(1)}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{feature.reach}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{feature.impact}/10</td>
                <td className="px-6 py-4 text-sm text-slate-600">{feature.effort}/10</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                    feature.priority === 'High' ? 'bg-red-100 text-red-700' :
                    feature.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {feature.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brainstorm;
