
import React, { useState, useEffect, useRef } from 'react';
import { getDiagnosis, analyzeMedicalImage, generateSpeech } from '../services/geminiService';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { HealthProfile } from '../types';
import CameraScanner from './CameraScanner';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
  return btoa(binary);
}

const DiagnosticAgent: React.FC<{ profile: HealthProfile }> = ({ profile }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const handleDiagnose = async () => {
    if (!input) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await getDiagnosis(input, profile);
      setResponse(res);
    } catch (err) {
      console.error(err);
      setResponse("An error occurred during diagnosis.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!response || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioData = await generateSpeech(response, profile.language);
      if (audioData) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        }
        const ctx = audioContextRef.current;
        const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start(0);
      }
    } catch (err) {
      console.error("Speech synthesis failed", err);
      setIsSpeaking(false);
    }
  };

  const handleScan = async (base64: string, mimeType: string) => {
    setLoading(true);
    try {
      const res = await analyzeMedicalImage(
        base64, 
        mimeType, 
        "Extract diagnostic details from this lab report or symptom photo. Combine with current health profile for a holistic insight.", 
        profile
      );
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stopVoiceMode = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsVoiceActive(false);
  };

  const startVoiceMode = async () => {
    if (isVoiceActive) {
      stopVoiceMode();
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    setIsVoiceActive(true);
    
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    audioContextRef.current = outputCtx;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
            sessionPromise.then(s => {
              sessionRef.current = s;
              s.sendRealtimeInput({
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
              });
            });
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          if (msg.serverContent?.inputTranscription) {
            const text = msg.serverContent.inputTranscription.text;
            setInput(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + text);
          }

          const interrupted = msg.serverContent?.interrupted;
          if (interrupted) {
            for (const source of sourcesRef.current.values()) {
              source.stop();
              sourcesRef.current.delete(source);
            }
            nextStartTimeRef.current = 0;
          }

          const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const buffer = await decodeAudioData(decode(audio), outputCtx, 24000, 1);
            const src = outputCtx.createBufferSource();
            src.buffer = buffer;
            src.connect(outputCtx.destination);
            src.addEventListener('ended', () => {
              sourcesRef.current.delete(src);
            });
            src.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(src);
          }
        },
        onclose: () => setIsVoiceActive(false),
        onerror: () => setIsVoiceActive(false)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        inputAudioTranscription: {},
        systemInstruction: `You are Dr. Vedha. Capture symptoms via voice for ${profile.name}. Encourage detail and respond conversationally in ${profile.language}.`
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isVoiceActive ? 'bg-red-500 text-white shadow-xl shadow-red-900/20' : 'bg-[#1B4332]/10 text-[#1B4332]'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 heading-font">Dr. Vedha Lab</h2>
              <p className="text-slate-500">Holistic analysis for {profile.name}.</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowScanner(true)}
              className="flex items-center space-x-2 bg-green-50 text-[#1B4332] px-5 py-2.5 rounded-2xl font-bold border border-green-100 hover:bg-green-100 transition-all shadow-sm group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span className="text-sm">Scan Report</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full p-6 border-2 rounded-3xl min-h-[180px] focus:ring-4 focus:ring-[#1B4332]/5 outline-none transition-all shadow-inner text-lg ${isVoiceActive ? 'border-red-500 bg-red-50/10' : 'bg-slate-50 border-slate-100'}`}
              placeholder="Describe symptoms or speak to Dr. Vedha..."
            />
            {isVoiceActive && (
              <div className="absolute top-4 right-4">
                <div className="flex space-x-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleDiagnose}
              disabled={loading || !input}
              className="flex-1 bg-[#1B4332] text-white font-black text-lg py-5 rounded-2xl hover:bg-green-900 transition-all active:scale-[0.98] disabled:opacity-50 relative overflow-hidden group shadow-lg shadow-green-900/10"
            >
              {loading ? (
                 <div className="flex flex-col items-center justify-center space-y-1">
                   <div className="flex items-center space-x-2">
                     <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     <span>Consulting Wisdom...</span>
                   </div>
                 </div>
              ) : "Start Diagnostic Cycle"}
            </button>
            <button 
              onClick={startVoiceMode}
              title={isVoiceActive ? "Stop Voice Mode" : "Start Voice Mode"}
              className={`px-8 rounded-2xl border-2 transition-all flex items-center justify-center group ${isVoiceActive ? 'border-red-500 text-red-500 bg-red-50 shadow-inner' : 'border-slate-200 text-slate-400 hover:border-[#1B4332] hover:text-[#1B4332] hover:bg-slate-50 shadow-sm'}`}
            >
              <svg className={`w-8 h-8 ${isVoiceActive ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {response && (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
          <div className="absolute top-8 right-8">
            <button 
              onClick={handlePlayAudio}
              disabled={isSpeaking}
              className={`p-3 rounded-2xl transition-all ${isSpeaking ? 'bg-green-100 text-[#1B4332] cursor-not-allowed' : 'bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-[#1B4332] border border-slate-100'}`}
            >
              {isSpeaking ? (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-3 bg-[#1B4332] animate-bounce" style={{animationDelay: '0s'}} />
                  <div className="w-1 h-4 bg-[#1B4332] animate-bounce" style={{animationDelay: '0.1s'}} />
                  <div className="w-1 h-3 bg-[#1B4332] animate-bounce" style={{animationDelay: '0.2s'}} />
                </div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
              )}
            </button>
          </div>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
            {response}
          </div>
        </div>
      )}

      {showScanner && (
        <CameraScanner 
          title="Medical Drishti Scanner" 
          onClose={() => setShowScanner(false)} 
          onCapture={handleScan} 
        />
      )}
    </div>
  );
};

export default DiagnosticAgent;
