import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { UploadZone } from './components/UploadZone';
import { VideoScanner } from './components/VideoScanner';
import { Dashboard } from './components/Dashboard';
import { LiveBackground } from './components/LiveBackground';
import { AppState, ScanResult, MediaMode, ScanSource } from './types';
import { analyzeMedia } from './services/geminiService';
import { saveScan, getHistory } from './services/storageService';
import { Plus, Loader2 } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [currentInput, setCurrentInput] = useState<File | string | null>(null);
  const [currentMode, setCurrentMode] = useState<MediaMode>('video');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [scanningLog, setScanningLog] = useState<string>("Initializing...");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      const recentScans = await getHistory();
      setHistory(recentScans);
    };
    loadHistory();
  }, []);

  const performScan = async (input: File | string, mode: MediaMode) => {
    setIsScanning(true);
    setAppState(AppState.SCANNING);
    try {
      const source: ScanSource = typeof input === 'string' ? 'url' : 'upload';
      setScanningLog(`Calibrating forensic node for ${source} source...`);
      
      const analysisResult = await analyzeMedia(input, mode, (log) => {
        setScanningLog(log);
      });

      const scanData: Omit<ScanResult, 'id'> = {
        filename: typeof input === 'string' ? input.split('/').pop() || 'Remote Media' : input.name,
        timestamp: new Date(),
        probabilityScore: analysisResult.probabilityScore || 0,
        status: analysisResult.status || 'clean',
        analysisSummary: analysisResult.analysisSummary || 'Analysis synthesized.',
        forensicMarkers: analysisResult.forensicMarkers || [],
        mode: mode,
        sourceType: source,
        sourceUrl: typeof input === 'string' ? input : undefined,
        rawResponse: analysisResult.rawResponse
      };

      const savedScan = await saveScan(scanData);

      setHistory(prev => [savedScan, ...prev]);
      setCurrentResult(savedScan);
      setAppState(AppState.DASHBOARD);

    } catch (error: any) {
      console.error(error);
      setScanningLog(error.message || "Neural engine timeout or error.");
      setTimeout(() => setAppState(AppState.UPLOAD), 4000);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileSelected = (file: File, mode: MediaMode) => {
    setCurrentInput(file);
    setCurrentMode(mode);
    performScan(file, mode);
  };

  const handleUrlSelected = (url: string, mode: MediaMode) => {
    setCurrentInput(url);
    setCurrentMode(mode);
    performScan(url, mode);
  };

  const handleSelectResult = (result: ScanResult) => {
    if (isScanning) return;
    setCurrentResult(result);
    setAppState(AppState.DASHBOARD);
  };

  const resetToUpload = () => {
    if (isScanning) return;
    setAppState(AppState.UPLOAD);
    setCurrentInput(null);
    setCurrentResult(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <Sidebar 
        history={history} 
        onSelectResult={handleSelectResult} 
        currentId={currentResult?.id}
      />

      <main className="flex-1 relative flex flex-col">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
             <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
               SESSION_NODE: {appState}
             </span>
             {isScanning && (
               <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono animate-pulse">
                 <Loader2 className="w-3 h-3 animate-spin" />
                 ANALYZING_LIVE
               </div>
             )}
          </div>
          <button 
             onClick={resetToUpload}
             disabled={isScanning}
             className={`flex items-center gap-2 px-3 py-1.5 border rounded-md transition-all text-xs font-bold uppercase tracking-wide
               ${isScanning 
                 ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' 
                 : 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border-cyan-500/30 active:scale-95'
               }`}
          >
             <Plus className="w-3 h-3" /> New Audit
          </button>
        </header>

        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
           <LiveBackground />
           
           <div className="relative z-10 h-full w-full">
             {appState === AppState.UPLOAD && (
               <UploadZone 
                onFileSelected={handleFileSelected} 
                onUrlSelected={handleUrlSelected}
               />
             )}

             {appState === AppState.SCANNING && currentInput && (
               <VideoScanner file={typeof currentInput === 'string' ? null : (currentInput as File)} url={typeof currentInput === 'string' ? currentInput : undefined} scanningLog={scanningLog} />
             )}

             {appState === AppState.DASHBOARD && currentResult && (
               <Dashboard result={currentResult} sourceMedia={currentInput} />
             )}
           </div>
        </div>
      </main>
    </div>
  );
}