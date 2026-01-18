import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { UploadZone } from './components/UploadZone';
import { VideoScanner } from './components/VideoScanner';
import { Dashboard } from './components/Dashboard';
import { AppState, ScanResult } from './types';
import { analyzeVideo } from './services/geminiService';
// Switched to client-side storage to prevent Mongoose/zstd errors in browser
import { saveScan, getHistory } from './services/storageService';
import { Plus } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [scanningLog, setScanningLog] = useState<string>("Initializing...");

  // Load history from storage on mount
  useEffect(() => {
    const loadHistory = async () => {
      const recentScans = await getHistory();
      setHistory(recentScans);
    };
    loadHistory();
  }, []);

  // Trigger scan when entering SCANNING state
  useEffect(() => {
    if (appState === AppState.SCANNING && currentFile) {
      performScan(currentFile);
    }
  }, [appState, currentFile]);

  const performScan = async (file: File) => {
    try {
      setScanningLog("Connecting to Gemini 3 Pro File API...");
      
      const analysisResult = await analyzeVideo(file, (log) => {
        setScanningLog(log);
      });

      setScanningLog("Saving to Forensic Database...");

      // Prepare data for saving
      const scanData = {
        filename: file.name,
        timestamp: new Date(),
        probabilityScore: analysisResult.probabilityScore || 0,
        status: analysisResult.status || 'clean',
        analysisSummary: analysisResult.analysisSummary || 'No summary available.',
        forensicMarkers: analysisResult.forensicMarkers || [],
        rawResponse: analysisResult.rawResponse
      };

      // Save to Storage
      const savedScan = await saveScan(scanData);

      // Add small delay to show "Complete" log and transition
      setTimeout(() => {
        setHistory(prev => [savedScan, ...prev]);
        setCurrentResult(savedScan);
        setAppState(AppState.DASHBOARD);
      }, 800);

    } catch (error) {
      console.error(error);
      setScanningLog("Analysis Failed. Please try again.");
      setTimeout(() => setAppState(AppState.UPLOAD), 3000);
    }
  };

  const handleFileSelected = (file: File) => {
    setCurrentFile(file);
    setAppState(AppState.SCANNING);
  };

  const handleSelectResult = (result: ScanResult) => {
    setCurrentResult(result);
    setAppState(AppState.DASHBOARD);
  };

  const resetToUpload = () => {
    setAppState(AppState.UPLOAD);
    setCurrentFile(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Sidebar 
        history={history} 
        onSelectResult={handleSelectResult} 
        currentId={currentResult?.id}
      />

      <main className="flex-1 relative flex flex-col">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
             <span className="text-slate-500 font-mono text-xs">MODE: {appState}</span>
          </div>
          <button 
             onClick={resetToUpload}
             className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-md transition-all text-sm font-medium"
          >
             <Plus className="w-4 h-4" /> New Scan
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
           {appState === AppState.UPLOAD && (
             <UploadZone onFileSelected={handleFileSelected} />
           )}

           {appState === AppState.SCANNING && currentFile && (
             <VideoScanner file={currentFile} scanningLog={scanningLog} />
           )}

           {appState === AppState.DASHBOARD && currentResult && (
             <Dashboard result={currentResult} />
           )}
        </div>
      </main>
    </div>
  );
}
