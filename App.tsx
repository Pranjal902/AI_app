
import React, { useState, useRef } from 'react';
import { AppState, Classification, DetectionResult } from './types';
import { analyzeVoiceAuthenticity } from './geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    audioFile: null,
    audioBase64: null,
    selectedLanguage: null,
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const [statusText, setStatusText] = useState<string>("SYSTEM STANDBY");
  const [sessionId, setSessionId] = useState<string>("VX-READY");
  const [showLog, setShowLog] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedLanguages = [
    { name: 'Tamil', code: 'TA' },
    { name: 'English', code: 'EN' },
    { name: 'Hindi', code: 'HI' },
    { name: 'Malayalam', code: 'ML' },
    { name: 'Telugu', code: 'TE' }
  ];

  const generateSessionId = () => {
    return `VX-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  };

  const handleCopy = () => {
    if (!state.result) return;
    navigator.clipboard.writeText(JSON.stringify(state.result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newId = generateSessionId();
    setSessionId(newId);

    setState({
      audioFile: null,
      audioBase64: null,
      selectedLanguage: null,
      isAnalyzing: false,
      result: null,
      error: null,
    });

    const isMp3 = file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.toLowerCase().endsWith('.mp3');

    if (!isMp3) {
      setStatusText("BITSTREAM ERROR");
      const errorJson: DetectionResult = {
        status: 'error',
        detectedLanguage: 'NULL',
        classification: Classification.UNKNOWN,
        confidenceScore: 0,
        explanation: "Spectral rejection: Non-MP3 format detected. Forensic suite requires high-fidelity MP3 bitstreams for neural artifact mapping.",
        errorCode: "INVALID_MIME"
      };
      setState(prev => ({ ...prev, result: errorJson }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setState(prev => ({ ...prev, audioFile: file, audioBase64: base64 }));
      setStatusText("SIGNAL READY");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!state.audioBase64) return;
    setState(prev => ({ ...prev, isAnalyzing: true, error: null, result: null }));
    
    const steps = ["ISOLATING VOCALS", "EXTRACTING JITTER", "NEURAL SCANNING"];
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setStatusText(steps[stepIdx]);
        stepIdx++;
      }
    }, 900);

    try {
      const result = await analyzeVoiceAuthenticity(state.audioBase64);
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
      setStatusText("AUDIT COMPLETE");
    } catch (err: any) {
      setState(prev => ({ ...prev, error: "ENGINE_FAIL", isAnalyzing: false }));
      setStatusText("SYSTEM ERROR");
    } finally {
      clearInterval(interval);
    }
  };

  const resetAnalysis = () => {
    setState({
      audioFile: null,
      audioBase64: null,
      selectedLanguage: null,
      isAnalyzing: false,
      result: null,
      error: null,
    });
    setSessionId("VX-READY");
    setStatusText("SYSTEM STANDBY");
    setShowLog(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 md:px-12 py-8 md:py-16 max-w-7xl mx-auto selection:bg-white/20">
      
      {/* Dynamic Header */}
      <header className="w-full flex justify-between items-center mb-12 md:mb-20">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tighter uppercase italic leading-none">
            Vox<span className="opacity-30">Veritas</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-[9px] font-bold tracking-[0.4em] opacity-30 uppercase">Neural Forensic Lab</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest mb-0.5">Session Reference</p>
            <p className="text-xs font-medium opacity-80 tracking-tight font-mono">{sessionId}</p>
          </div>
          <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
          <div className="text-right">
             <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest mb-0.5">Diagnostic Status</p>
             <p className={`text-xs font-bold tracking-tight uppercase ${state.isAnalyzing ? 'text-white' : 'opacity-80'}`}>{statusText}</p>
          </div>
        </div>
      </header>

      {/* Primary Interaction Stage */}
      <div className="w-full flex flex-col items-center flex-1">
        {!state.result && !state.isAnalyzing ? (
          <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="premium-glass halo-shadow rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-24 flex flex-col items-center justify-center cursor-pointer group transition-all duration-700 hover:border-white/20"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".mp3" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/[0.03] rounded-full flex items-center justify-center mb-8 group-hover:scale-105 group-hover:bg-white/[0.06] transition-all duration-500 border border-white/10">
                <i className={`fas ${state.audioFile ? 'fa-check text-emerald-400' : 'fa-upload text-white/30'} text-xl`}></i>
              </div>
              <h2 className="text-xl md:text-3xl font-light text-center mb-6 tracking-tight px-4 break-words w-full">
                {state.audioFile ? state.audioFile.name : 'Select Audio for Audit'}
              </h2>
              
              <div className="flex flex-col items-center gap-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-20">Optimized Language Suites</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                  {supportedLanguages.map(lang => (
                    <div key={lang.code} className="px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-full text-[9px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors">
                      {lang.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-12 md:mt-16 flex flex-col items-center gap-6">
              <button
                onClick={handleAnalyze}
                disabled={!state.audioBase64}
                className={`w-full md:w-auto px-20 py-6 rounded-full text-[11px] font-bold uppercase tracking-[0.5em] shadow-2xl transition-all
                  ${!state.audioBase64 ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' : 'btn-premium'}`}
              >
                Start Verification
              </button>
              <p className="text-[9px] opacity-20 uppercase tracking-[0.3em] font-medium text-center">
                Requires MP3 Signal (128kbps+ recommended)
              </p>
            </div>
          </div>
        ) : state.isAnalyzing ? (
          <div className="flex flex-col items-center py-20 animate-in fade-in duration-700">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/[0.02] liquid-morph mb-12 flex items-center justify-center overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(255,255,255,0.03)]">
               <div className="w-full h-1 bg-white/40 animate-[scanning_2s_infinite]"></div>
            </div>
            <p className="text-sm font-bold tracking-[0.6em] opacity-30 uppercase animate-pulse">{statusText}</p>
          </div>
        ) : (
          <div className="w-full max-w-5xl space-y-8 animate-in fade-in zoom-in-95 duration-1000 pb-24">
            
            <div className="premium-glass halo-shadow rounded-[3rem] md:rounded-[5rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
                  <circle cx="50" cy="50" r="46" 
                    stroke="#ffffff" 
                    strokeWidth="3" fill="none" strokeDasharray="289" strokeDashoffset={289 - (289 * (state.result?.confidenceScore || 0))} 
                    strokeLinecap="round" className="transition-all duration-[2.5s] ease-out opacity-80" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                    {Math.round((state.result?.confidenceScore || 0) * 100)}%
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-20 mt-1">Confidence</span>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left min-w-0 max-w-full">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                    {state.result?.detectedLanguage || 'GENERIC'} SUITE
                  </span>
                </div>
                
                <h3 className="text-5xl md:text-7xl xl:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-8 text-white break-words overflow-hidden whitespace-normal">
                  {state.result?.classification === Classification.AI_GENERATED ? 'AI_GENERATED' : (state.result?.classification === Classification.HUMAN ? 'HUMAN' : 'Error')}
                </h3>
                
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-20 mb-3">Explanation</p>
                  <p className="text-lg md:text-xl font-light opacity-60 leading-relaxed break-words italic">
                    {state.result?.explanation}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="premium-glass rounded-[3rem] p-10 md:p-12 space-y-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20">Forensic Markers</h4>
                  <div className="space-y-6">
                    {state.result?.technicalArtifacts?.map((m, i) => (
                      <div key={i} className="flex items-start justify-between group border-b border-white/[0.03] pb-6 last:border-0">
                        <span className="text-sm md:text-base font-medium opacity-50 group-hover:opacity-100 transition-opacity tracking-tight whitespace-normal break-words leading-snug mr-6 flex-1">
                          {m}
                        </span>
                        <div className="flex-shrink-0 pt-1">
                          <i className="fas fa-microscope text-[10px] opacity-20 group-hover:opacity-60 transition-opacity"></i>
                        </div>
                      </div>
                    ))}
                    {(!state.result?.technicalArtifacts || state.result.technicalArtifacts.length === 0) && (
                      <p className="text-xs opacity-20 italic">No markers extracted.</p>
                    )}
                  </div>
               </div>

               <div className="premium-glass rounded-[3rem] p-10 md:p-12 flex flex-col justify-between gap-12">
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20">Audit Metadata</h4>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] opacity-20 uppercase tracking-widest font-bold">Ref ID</span>
                        <span className="text-sm font-medium opacity-80 truncate font-mono">{sessionId}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] opacity-20 uppercase tracking-widest font-bold">Encoding</span>
                        <span className="text-sm font-medium opacity-80">MP3 / {state.audioFile?.size ? Math.round(state.audioFile.size/1024) : '0'}KB</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowLog(!showLog)}
                    className={`flex items-center justify-between w-full px-8 py-5 rounded-2xl transition-all border
                      ${showLog ? 'bg-white/10 border-white/30' : 'bg-white/[0.04] border-white/10 hover:border-white/20'}`}
                  >
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white">Technical Manifest</p>
                      <p className="text-[8px] opacity-30 uppercase tracking-widest mt-0.5">Raw Forensic Data</p>
                    </div>
                    <i className={`fas ${showLog ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px] opacity-40`}></i>
                  </button>
               </div>
            </div>

            {showLog && (
               <div className="animate-in slide-in-from-top-6 fade-in duration-500 bg-black/60 border border-white/5 rounded-[2rem] p-8 md:p-12 font-mono text-[11px] md:text-[13px] opacity-70 overflow-x-auto shadow-2xl relative">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 opacity-30">
                      <i className="fas fa-terminal text-[10px]"></i>
                      <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Raw Forensic Signal Data</span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <i className={`fas ${copied ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                      {copied ? 'Copied!' : 'Copy Manifest'}
                    </button>
                 </div>
                 <pre className="leading-relaxed text-indigo-100/60 custom-scrollbar overflow-x-auto">{JSON.stringify(state.result, null, 2)}</pre>
               </div>
            )}

            <div className="flex flex-col items-center pt-12 gap-6">
               <button 
                onClick={resetAnalysis}
                className="group flex items-center gap-6 px-14 py-5 rounded-full border border-white/10 hover:bg-white/[0.03] hover:border-white/30 transition-all text-[11px] font-bold uppercase tracking-[0.5em] opacity-40 hover:opacity-100 shadow-xl"
               >
                 <i className="fas fa-rotate-right text-[10px] transition-transform group-hover:rotate-180 duration-1000"></i>
                 Analyze New Recording
               </button>
               <p className="text-[8px] opacity-10 uppercase tracking-[0.5em] font-bold">Signal Purge Protocol Enabled</p>
            </div>
          </div>
        )}
      </div>

      <footer className="w-full mt-auto pt-16 flex flex-col sm:flex-row items-center justify-between opacity-10 text-[10px] font-bold uppercase tracking-[0.5em] gap-6">
        <p>© 2026 VoxVeritas Intelligence Lab</p>
        <div className="flex gap-12">
          <span>Indo-Aryan Suite 4.0</span>
          <span>Dravidian Suite 4.0</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanning {
          0% { transform: translateY(-100%); opacity: 0; }
          40%, 60% { opacity: 0.9; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default App;
