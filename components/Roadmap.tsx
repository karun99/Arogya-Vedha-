
import React from 'react';
import { Feature } from '../types';

interface RoadmapProps {
  features: Feature[];
}

const Roadmap: React.FC<RoadmapProps> = ({ features }) => {
  const quarters: ('Q1' | 'Q2' | 'Q3' | 'Q4')[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Annual Roadmap</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[500px]">
        {quarters.map((q) => (
          <div key={q} className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-900">{q}</h3>
              <span className="text-xs text-slate-400 font-medium">
                {features.filter(f => f.quarter === q).length} items
              </span>
            </div>
            
            <div className="flex-1 bg-slate-100/50 rounded-2xl p-3 border border-slate-200/50 space-y-3">
              {features
                .filter(f => f.quarter === q)
                .map((feature) => (
                  <div 
                    key={feature.id} 
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        feature.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                        feature.status === 'Development' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {feature.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{feature.id.slice(-4)}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                      {feature.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {feature.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span className="text-[10px] font-bold text-slate-700">{feature.riceScore.toFixed(0)}</span>
                      </div>
                      <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-slate-200 border border-white"></div>
                        <div className="w-4 h-4 rounded-full bg-slate-300 border border-white"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
