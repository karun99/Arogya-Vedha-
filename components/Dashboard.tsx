
import React, { useState } from 'react';
import { HealthProfile, AppLanguage } from '../types';

interface DashboardProps {
  profile: HealthProfile;
  onUpdateProfile: (p: HealthProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(!profile.isSetup);
  const [formData, setFormData] = useState<HealthProfile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...formData, isSetup: true };
    onUpdateProfile(updated);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto py-4">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 bg-[#1B4332] rounded-2xl flex items-center justify-center text-white">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 heading-font">Create Prana Profile</h2>
              <p className="text-slate-500">Multilingual & Unbiased Indigenous Healthcare Assistant</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-sm font-black text-[#1B4332] uppercase tracking-[0.1em] mb-4">Identity & Language</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Primary Language</label>
                  <select 
                    value={formData.language}
                    onChange={e => setFormData({...formData, language: e.target.value as AppLanguage})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B4332] transition-all"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Bengali</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B4332] transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-sm font-black text-[#1B4332] uppercase tracking-[0.1em] mb-4">Biometric Basics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Age</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B4332]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Weight (kg)</label>
                  <input 
                    type="text" 
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B4332]"
                    placeholder="e.g. 70"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Biological Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B4332]"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-sm font-black text-[#1B4332] uppercase tracking-[0.1em] mb-4">Medical History</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Health Conditions / Concerns</label>
                  <textarea 
                    value={formData.conditions.join(', ')}
                    onChange={e => setFormData({...formData, conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl min-h-[100px] outline-none focus:ring-2 focus:ring-[#1B4332]"
                    placeholder="e.g. Type 2 Diabetes, Asthama, Lower Back Pain..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Medications / Supplements</label>
                  <textarea 
                    value={formData.medications.join(', ')}
                    onChange={e => setFormData({...formData, medications: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl min-h-[80px] outline-none focus:ring-2 focus:ring-[#1B4332]"
                    placeholder="e.g. Metformin, Ashwagandha, Vitamin D..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-slate-500 bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               <p>Your data is processed locally and securely with Aarogya-Vedha AI. We do not sell your personal health data.</p>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1B4332] text-white font-black text-lg py-5 rounded-[1.5rem] shadow-2xl shadow-green-900/30 hover:bg-green-900 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Initialize My Healthcare Shield</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 heading-font">Vitals Dashboard</h2>
                <p className="text-slate-500">Holistic monitoring for {profile.name}</p>
              </div>
              <button 
                onClick={() => setIsEditing(true)} 
                className="bg-slate-50 text-[#1B4332] px-5 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-all"
              >
                Refine Profile
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 relative z-10">
              <div className="p-5 bg-green-50/50 rounded-3xl border border-green-100/50">
                <span className="text-[10px] font-black text-green-700/60 uppercase tracking-widest">Prakriti</span>
                <p className="text-xl font-bold text-slate-900 truncate">{profile.name.split(' ')[0]}</p>
              </div>
              <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                <span className="text-[10px] font-black text-blue-700/60 uppercase tracking-widest">Age</span>
                <p className="text-xl font-bold text-slate-900">{profile.age} Yrs</p>
              </div>
              <div className="p-5 bg-orange-50/50 rounded-3xl border border-orange-100/50">
                <span className="text-[10px] font-black text-orange-700/60 uppercase tracking-widest">Weight</span>
                <p className="text-xl font-bold text-slate-900">{profile.weight || '--'} kg</p>
              </div>
              <div className="p-5 bg-purple-50/50 rounded-3xl border border-purple-100/50">
                <span className="text-[10px] font-black text-purple-700/60 uppercase tracking-widest">Lingo</span>
                <p className="text-xl font-bold text-slate-900">{profile.language}</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.conditions.length > 0 ? profile.conditions.map(c => (
                    <span key={c} className="px-5 py-2 bg-white text-slate-700 text-sm font-bold rounded-2xl border border-slate-200 shadow-sm">{c}</span>
                  )) : <span className="text-slate-400 italic text-sm">Vitality is clear. No reported conditions.</span>}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Active Substances</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.medications.length > 0 ? profile.medications.map(m => (
                    <span key={m} className="px-5 py-2 bg-[#1B4332]/5 text-[#1B4332] text-sm font-bold rounded-2xl border border-[#1B4332]/10">{m}</span>
                  )) : <span className="text-slate-400 italic text-sm">No regular medications.</span>}
                </div>
              </div>
            </div>
            
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-green-50 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#1B4332] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-green-900/30 relative overflow-hidden group">
            <h2 className="text-2xl font-bold mb-3 heading-font">Vedha Oracle</h2>
            <p className="text-green-100/80 text-sm mb-8 leading-relaxed">
              Your profile is synchronized. Dr. Vedha and the council are ready to assist in <strong>{profile.language}</strong>.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-green-400 tracking-widest">Operational Mode</span>
                <span className="text-sm font-bold">Unbiased Diagnostic</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-6 heading-font">Wellness Roadmap</h3>
            <div className="space-y-5">
              <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Aarogya Aahar Update</p>
                  <p className="text-xs text-slate-500 mt-0.5">Recommended seasonal adjustment based on current climate.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Bheshaj Interaction Scan</p>
                  <p className="text-xs text-slate-500 mt-0.5">Interaction check scheduled for Ashwagandha & Metformin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
