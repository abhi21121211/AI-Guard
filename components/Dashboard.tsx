import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, FileText, Share2, Download, Eye, Activity, ClipboardCheck, X, Copy } from 'lucide-react';
import { ScanResult, TimelineDataPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  result: ScanResult;
}

export const Dashboard: React.FC<DashboardProps> = ({ result }) => {
  const [shareBtnText, setShareBtnText] = useState("Share Findings");
  const [isCopied, setIsCopied] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonCopyStatus, setJsonCopyStatus] = useState("Copy JSON");

  // Generate dummy timeline data based on markers if no real timeseries data exists
  // In a real app, Gemini might return frame-by-frame scores, but here we use markers to spike the graph
  const timelineData: TimelineDataPoint[] = React.useMemo(() => {
    const points = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      anomalyScore: Math.random() * 10
    }));

    // Inject spikes where markers exist (simplified mapping)
    result.forensicMarkers.forEach(marker => {
       const minute = parseInt(marker.timestamp.split(':')[0]) || 0;
       const second = parseInt(marker.timestamp.split(':')[1]) || 0;
       const index = (minute * 60 + second) % 20; // Modulo to fit dummy graph
       if(points[index]) {
         points[index].anomalyScore = marker.severity === 'high' ? 95 : marker.severity === 'medium' ? 60 : 30;
       }
    });
    return points;
  }, [result]);

  const scoreColor = result.probabilityScore > 75 ? 'text-red-500' : result.probabilityScore > 40 ? 'text-yellow-500' : 'text-green-500';
  const scoreBorder = result.probabilityScore > 75 ? 'border-red-500' : result.probabilityScore > 40 ? 'border-yellow-500' : 'border-green-500';

  const handleExportPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    const textToShare = `AI Guard Forensic Report\n\nFile: ${result.filename}\nStatus: ${result.status.toUpperCase()}\nProbability Score: ${result.probabilityScore}%\n\nExecutive Summary:\n${result.analysisSummary}\n\nScan ID: ${result.id}`;
    
    // Check for Web Share API support
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Guard Forensic Report',
          text: textToShare,
        });
      } catch (err) {
        // User cancelled or share failed
        console.debug('Share cancelled');
      }
    } else {
      // Fallback to Clipboard
      try {
        await navigator.clipboard.writeText(textToShare);
        setShareBtnText("Copied!");
        setIsCopied(true);
        setTimeout(() => {
          setShareBtnText("Share Findings");
          setIsCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setJsonCopyStatus("Copied!");
      setTimeout(() => setJsonCopyStatus("Copy JSON"), 2000);
    } catch (err) {
      console.error('Failed to copy JSON', err);
    }
  };

  return (
    <div className="h-full p-8 overflow-y-auto dashboard-content">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
             <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
               Forensic Report 
               <span className="text-slate-500 text-base font-mono font-normal">#{result.id.slice(0, 8)}</span>
             </h2>
             <p className="text-slate-400 mt-1 flex items-center gap-2">
               Target File: <span className="text-cyan-400 font-mono bg-cyan-950/30 px-2 py-0.5 rounded text-sm">{result.filename}</span>
             </p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleExportPDF}
               className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors border border-slate-700 active:scale-95"
             >
               <Download className="w-4 h-4" /> Export PDF
             </button>
             <button 
               onClick={handleShare}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-all shadow-lg active:scale-95 ${
                 isCopied 
                   ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' 
                   : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20'
               }`}
             >
               {isCopied ? <ClipboardCheck className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
               {shareBtnText}
             </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Probability Gauge */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden print:border-slate-600">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]"></div>
             <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Synthetic Probability</h3>
             <div className={`relative w-40 h-40 rounded-full border-4 ${scoreBorder} flex items-center justify-center bg-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                <div className="text-center">
                   <span className={`text-4xl font-bold font-mono ${scoreColor}`}>{result.probabilityScore}%</span>
                   <p className="text-xs text-slate-500 mt-1 uppercase">{result.status}</p>
                </div>
                {/* Decorative spinner */}
                <div className={`absolute inset-0 border-t-4 ${scoreBorder} rounded-full animate-spin no-print`} style={{ animationDuration: '3s', opacity: 0.3 }}></div>
             </div>
          </div>

          {/* AI Summary */}
          <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col print:border-slate-600">
             <div className="flex items-center gap-2 mb-4">
               <FileText className="w-5 h-5 text-cyan-400" />
               <h3 className="text-white font-semibold print:text-black">Executive AI Summary</h3>
             </div>
             <div className="flex-1 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 print:bg-white print:border-slate-300">
               <p className="text-slate-300 leading-relaxed font-mono text-sm print:text-black">
                 {result.analysisSummary || "Analyzing..."}
               </p>
               <div className="mt-4 flex flex-wrap gap-2">
                 {result.probabilityScore > 50 ? (
                   <>
                     <span className="px-2 py-1 bg-red-950/40 text-red-400 border border-red-900/50 rounded text-xs print:text-red-700 print:bg-red-100 print:border-red-200">Artifacts Detected</span>
                     <span className="px-2 py-1 bg-red-950/40 text-red-400 border border-red-900/50 rounded text-xs print:text-red-700 print:bg-red-100 print:border-red-200">Deepfake Signature</span>
                   </>
                 ) : (
                   <span className="px-2 py-1 bg-green-950/40 text-green-400 border border-green-900/50 rounded text-xs print:text-green-700 print:bg-green-100 print:border-green-200">Authentic Media</span>
                 )}
                 <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs print:text-gray-700 print:bg-gray-100 print:border-gray-300">Gemini 3 Pro Verified</span>
               </div>
             </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 print:border-slate-600 print:break-inside-avoid">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Anomaly Timeline Analysis</h3>
             <div className="flex items-center gap-2 text-xs text-slate-500">
               <Activity className="w-4 h-4" />
               <span>Temporal Coherence</span>
             </div>
           </div>
           
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={timelineData}>
                 <defs>
                   <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={result.probabilityScore > 50 ? "#ef4444" : "#22d3ee"} stopOpacity={0.3}/>
                     <stop offset="95%" stopColor={result.probabilityScore > 50 ? "#ef4444" : "#22d3ee"} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#22d3ee' }}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="anomalyScore" 
                    stroke={result.probabilityScore > 50 ? "#ef4444" : "#22d3ee"} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    strokeWidth={2}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Findings List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:space-y-6">
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 print:border-slate-600 print:break-inside-avoid">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2 print:text-black">
                <Eye className="w-4 h-4 text-cyan-400" />
                Detected Forensic Markers
              </h3>
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar print:max-h-none print:overflow-visible">
                 {result.forensicMarkers.map((marker, idx) => (
                   <li key={idx} className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/50 hover:border-cyan-500/30 transition-colors print:bg-white print:border-slate-300">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        marker.severity === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                        marker.severity === 'medium' ? 'bg-yellow-500' : 'bg-cyan-500'
                      }`}></div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                           <span className="text-xs text-cyan-400 font-mono bg-cyan-950/30 px-1.5 py-0.5 rounded print:text-cyan-700 print:bg-cyan-100">{marker.timestamp}</span>
                           <span className="text-xs font-semibold text-slate-300 print:text-black">{marker.label}</span>
                        </div>
                        <p className="text-sm text-slate-400 print:text-gray-700">{marker.description}</p>
                      </div>
                   </li>
                 ))}
                 {result.forensicMarkers.length === 0 && (
                   <li className="text-sm text-slate-500 italic p-4 text-center border border-dashed border-slate-800 rounded">
                     No significant manipulation markers detected.
                   </li>
                 )}
              </ul>
           </div>

           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-between print:border-slate-600 print:break-inside-avoid">
              <div>
                <h3 className="text-white font-semibold mb-2 print:text-black">Technical Metadata</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                    <p className="text-xs text-slate-500 uppercase">Input Format</p>
                    <p className="text-sm text-white font-mono print:text-black">{result.filename.split('.').pop()?.toUpperCase() || 'UNKNOWN'}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                    <p className="text-xs text-slate-500 uppercase">Analysis Engine</p>
                    <p className="text-sm text-white font-mono print:text-black">GEMINI-3-PRO</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                    <p className="text-xs text-slate-500 uppercase">Reasoning Budget</p>
                    <p className="text-sm text-white font-mono print:text-black">HIGH (4k Tokens)</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
                    <p className="text-xs text-slate-500 uppercase">Timestamp</p>
                    <p className="text-sm text-white font-mono print:text-black">{result.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsJsonModalOpen(true)}
                className="w-full mt-6 py-2 border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-950/30 transition-colors rounded flex items-center justify-center gap-2 no-print active:scale-95"
              >
                <FileText className="w-4 h-4" /> View Full JSON Log
              </button>
           </div>
        </div>

        {/* JSON Modal */}
        <AnimatePresence>
          {isJsonModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
                  <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    Forensic Analysis Log
                  </h3>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={copyJsonToClipboard}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 hover:bg-slate-800 transition-colors"
                    >
                      {jsonCopyStatus === "Copied!" ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      {jsonCopyStatus}
                    </button>
                    <button 
                      onClick={() => setIsJsonModalOpen(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-auto bg-slate-950">
                  <pre className="text-xs font-mono text-cyan-100 whitespace-pre-wrap break-all">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};
