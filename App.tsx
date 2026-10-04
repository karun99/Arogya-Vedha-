
import React, { useState, useEffect } from 'react';
import { ViewType, HealthProfile } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DiagnosticAgent from './components/DiagnosticAgent';
import FoodieAgent from './components/FoodieAgent';
import MedicalAgent from './components/MedicalAgent';

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 z-[200] bg-[#1B4332] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
    {/* Animated Logo Container */}
    <div className="mb-8 relative group">
      <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="w-32 h-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden">
        {/* The Mountain Logo */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 relative z-10 transition-transform group-hover:scale-105 duration-1000">
          {/* Mountain Peaks */}
          <path d="M15 85 L45 25 L65 55 L85 35 L95 85 Z" fill="rgba(255,255,255,0.2)" />
          <path d="M5 90 L35 20 L60 65 L80 40 L95 90 Z" fill="white" />
          
          {/* Girl Child Figure */}
          <g transform="translate(48, 62) scale(0.9)">
            <circle cx="0" cy="0" r="4.5" fill="#FF9F1C" />
            <path d="M-5 5 L5 5 L8 20 L-8 20 Z" fill="#FF9F1C" />
            {/* Arms holding toy */}
            <path d="M-4 8 Q0 12 4 8" stroke="#FF9F1C" strokeWidth="2" fill="none" />
            {/* Toy (Teddy) */}
            <circle cx="0" cy="11" r="2.5" fill="white" />
            <circle cx="-1" cy="9.5" r="1" fill="white" />
            <circle cx="1" cy="9.5" r="1" fill="white" />
          </g>
          
          {/* Sun */}
          <circle cx="75" cy="25" r="7" fill="#FF9F1C" className="animate-pulse" opacity="0.6" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>
    </div>

    {/* App Name */}
    <div className="mb-6">
      <h1 className="text-white text-5xl md:text-6xl font-bold heading-font tracking-tight">Aarogya</h1>
      <div className="flex items-center justify-center space-x-4 mt-2">
        <div className="h-px w-8 bg-[#FF9F1C]/50"></div>
        <h2 className="text-[#FF9F1C] text-lg font-black uppercase tracking-[0.5em]">Vedha</h2>
        <div className="h-px w-8 bg-[#FF9F1C]/50"></div>
      </div>
    </div>

    {/* Tagline */}
    <div className="max-w-3xl space-y-4">
      <p className="text-green-300/60 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Synthesizing Sacred Wisdom</p>
      <h3 className="text-white text-lg md:text-2xl font-light heading-font leading-relaxed italic animate-pulse px-4">
        "vachana sravana samyuktha hridaya spandana sammilitha vachana yuktha manava yanthra gnana sammilitha arogya samrakshaka"
      </h3>
    </div>

    {/* Loading Indicator */}
    <div className="mt-16 flex items-center space-x-3">
      {[0, 1, 2].map(i => (
        <div 
          key={i} 
          className="w-2 h-2 rounded-full bg-white/40 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        ></div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<HealthProfile>({
    name: '',
    age: '',
    weight: '',
    gender: '',
    allergies: [],
    medications: [],
    conditions: [],
    language: 'English',
    isSetup: false
  });

  useEffect(() => {
    // Initial boot sequence - slightly longer to allow user to read the tagline
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden text-slate-900">
      {isLoading && <LoadingScreen />}
      
      <Sidebar currentView={view} onViewChange={setView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {view === 'dashboard' && (
            <Dashboard profile={profile} onUpdateProfile={setProfile} />
          )}
          {profile.isSetup ? (
            <>
              {view === 'diagnose' && (
                <DiagnosticAgent profile={profile} />
              )}
              {view === 'nutrition' && (
                <FoodieAgent profile={profile} />
              )}
              {view === 'pharmacy' && (
                <MedicalAgent profile={profile} />
              )}
            </>
          ) : (
            view !== 'dashboard' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-[#FF9F1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Setup Required</h2>
                <p className="text-slate-500 max-w-sm mb-8">Please complete your health profile in the Prana Portal before accessing AI agents.</p>
                <button 
                  onClick={() => setView('dashboard')}
                  className="bg-[#1B4332] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-900 transition-all"
                >
                  Setup Profile Now
                </button>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
