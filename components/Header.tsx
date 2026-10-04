
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm shadow-slate-50/50">
      <div className="flex items-center space-x-6">
        <div className="hidden sm:flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aarogya Link</span>
          <span className="text-xs font-bold text-[#1B4332]">Stable • encrypted</span>
        </div>
        <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C] animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Vedha Core 3.0</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-slate-400 hover:text-[#1B4332] transition-colors relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF9F1C] rounded-full ring-2 ring-white"></span>
        </button>
        <div className="w-10 h-10 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center border border-[#1B4332]/10 shadow-sm overflow-hidden p-0.5">
          <img className="rounded-xl w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aarogya" alt="User Avatar" />
        </div>
      </div>
    </header>
  );
};

export default Header;
