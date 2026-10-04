
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'dashboard', label: 'Prana Portal', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
    )},
    { id: 'diagnose', label: 'Dr. Vedha Lab', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
    )},
    { id: 'nutrition', label: 'Aarogya Aahar', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 01-1.5-.454M9 16v2m3-6v6m3-3v3M9 12V9a1 1 0 011-1h4a1 1 0 011 1v3m-6 0h6"/></svg>
    )},
    { id: 'pharmacy', label: 'Bheshaj Guru', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.162 1.162a2 2 0 000 2.828l1.162 1.162a2 2 0 002.828 0l1.162-1.162a2 2 0 00.547-1.022l.477-2.387a6 6 0 01.517-3.86l.309-.618a6 6 0 013.86-.517l2.387.477a2 2 0 011.022.547l1.162 1.162a2 2 0 010 2.828l-1.162 1.162a2 2 0 01-2.828 0l-1.162-1.162z"/></svg>
    )}
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-[#1B4332] rounded-2xl flex items-center justify-center shadow-xl shadow-green-900/20 relative overflow-hidden group">
            {/* Redesigned Brand Logo */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 relative z-10 transition-transform group-hover:scale-105 duration-700">
              {/* Mountain Peaks with gradients */}
              <defs>
                <linearGradient id="mtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
                </linearGradient>
              </defs>
              <path d="M15 85 L45 25 L65 55 L85 35 L95 85 Z" fill="url(#mtnGrad)" />
              <path d="M5 90 L35 20 L60 65 L80 40 L95 90 Z" fill="white" />
              
              {/* Girl Child Figure */}
              <g transform="translate(48, 62) scale(0.8)">
                {/* Head */}
                <circle cx="0" cy="0" r="4.5" fill="#FF9F1C" />
                {/* Body/Dress */}
                <path d="M-5 5 L5 5 L8 20 L-8 20 Z" fill="#FF9F1C" />
                {/* Arms holding toy */}
                <path d="M-4 8 Q0 12 4 8" stroke="#FF9F1C" strokeWidth="2" fill="none" />
                {/* Toy (Teddy) */}
                <circle cx="0" cy="11" r="2.5" fill="white" />
                <circle cx="-1" cy="9.5" r="1" fill="white" />
                <circle cx="1" cy="9.5" r="1" fill="white" />
              </g>
              
              {/* Rising Sun */}
              <circle cx="75" cy="25" r="7" fill="#FF9F1C" className="animate-pulse" opacity="0.4" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none heading-font">Aarogya</h1>
            <h1 className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-[0.3em] mt-1">Vedha</h1>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-[#1B4332] text-white font-bold shadow-lg shadow-green-900/20 scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Vedha Intelligence</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-700">Gemini 3 Multimodal</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
