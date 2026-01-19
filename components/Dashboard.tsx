import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, FileText, Share2, Download, Eye, Activity, ClipboardCheck, X, Copy, FileDown, Info, Globe, Upload } from 'lucide-react';
import { ScanResult, TimelineDataPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';

interface DashboardProps {
  result: ScanResult;
}

export const Dashboard: React.FC<DashboardProps> = ({ result }) => {
  const [shareBtnText, setShareBtnText] = useState("Share Findings");
  const [isCopied, setIsCopied] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonCopyStatus, setJsonCopyStatus] = useState("Copy JSON");

  const timelineData: TimelineDataPoint[] = React.useMemo(() => {
    const points = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      anomalyScore: Math.random() * 15
    }));

    result.forensicMarkers.forEach(marker => {
       const timeVal = parseInt(marker.timestamp.split(':')[0]) || Math.floor(Math.random() * 20);
       const index = timeVal % 20;
       if(points[index]) {
         points[index].anomalyScore = marker.severity === 'high' ? 95 : marker.severity === 'medium' ? 65 : 35;
       }
    });
    return points;
  }, [result]);

  const scoreColor = result.probabilityScore > 75 ? 'text-red-500' : result.probabilityScore > 40 ? 'text-yellow-500' : 'text-green-500';
  const scoreBorder = result.probabilityScore > 75 ? 'border-red-500' : result.probabilityScore > 40 ? 'border-yellow-500' : 'border-green-500';

  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFillColor(2, 6, 23);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(34, 211, 238);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(`AI GUARD ${result.mode.toUpperCase()} AUDIT`, 15, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`REPORT ID: ${result.id}`, 15, 30);
      doc.text(`SOURCE: ${result.sourceType.toUpperCase()}`, 15, 35);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Audit for: ${result.filename}`, 15, 55);
      doc.setFontSize(12);
      doc.text("EXECUTIVE SUMMARY", 15, 65);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const splitSummary = doc.splitTextToSize(result.analysisSummary || "No summary available.", pageWidth - 30);
      doc.text(splitSummary, 15, 72);
      let currentY = 72 + (splitSummary.length * 5) + 10;
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.rect(15, currentY, pageWidth - 30, 25, 'FD');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text("DETECTION SCORE:", 20, currentY + 10);
      const scoreValue = `${result.probabilityScore}%`;
      const statusText = result.status.toUpperCase();
      doc.setFontSize(16);
      if (result.probabilityScore > 75) doc.setTextColor(239, 68, 68);
      else if (result.probabilityScore > 40) doc.setTextColor(234, 179, 8);
      else doc.setTextColor(34, 197, 94);
      doc.text(`${scoreValue} - ${statusText} CONFIDENCE`, 20, currentY + 18);
      currentY += 40;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("FORENSIC MARKERS", 15, currentY);
      currentY += 10;
      doc.setFontSize(9);
      result.forensicMarkers.forEach((marker) => {
        if (currentY > 260) { doc.addPage(); currentY = 20; }
        doc.setFont("helvetica", "bold");
        doc.setTextColor(34, 211, 238);
        doc.text(`[${marker.timestamp}] ${marker.label}`, 15, currentY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        const desc = doc.splitTextToSize(marker.description, pageWidth - 40);
        doc.text(desc, 20, currentY + 5);
        currentY += 10 + (desc.length * 4);
      });
      doc.save(`Forensic_Report_${result.id.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error("PDF failed", err);
    }
  };

  return (
    <div className="h-full p-8 overflow-y-auto dashboard-content relative">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
             <div className="flex items-center gap-2 mb-1">
               <h2 className="text-2xl font-bold text-white tracking-tight">
                 {result.mode === 'image' ? 'Image Audit' : 'Video Audit'}
               </h2>
               <div className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 uppercase">
                 ID: {result.id.slice(0, 8)}
               </div>
               {result.sourceType === 'url' && (
                 <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800 text-[10px] font-mono text-cyan-400 uppercase">
                   <Globe className="w-3 h-3" /> URL-based
                 </div>
               )}
             </div>
             <p className="text-slate-400 flex items-center gap-2 truncate max-w-lg">
               Source: <span className="text-cyan-400 font-mono text-xs">{result.filename}</span>
             </p>
          </div>
          <div className="flex gap-3 no-print">
             <button 
               onClick={generatePDFReport}
               className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors border border-slate-700 active:scale-95"
             >
               <Download className="w-4 h-4" /> Download PDF
             </button>
             <button 
               onClick={() => setIsJsonModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-sm text-cyan-400 transition-all active:scale-95"
             >
               <FileText className="w-4 h-4" /> Raw Log
             </button>
          </div>
        </div>

        {/* URL Disclaimer & Source Link */}
        {result.sourceType === 'url' && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-cyan-400/80 text-sm">
              <Globe className="w-5 h-5 flex-shrink-0" />
              <p>Analyzed via public direct URL. Content fetched live for neural verification.</p>
            </div>
            {result.sourceUrl && (
              <a 
                href={result.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 text-xs transition-all"
              >
                <Globe className="w-4 h-4" /> View Original Source
              </a>
            )}
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]"></div>
             <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Risk Probability</h3>
             <div className={`relative w-40 h-40 rounded-full border-4 ${scoreBorder} flex items-center justify-center bg-slate-950 shadow-2xl`}>
                <div className="text-center">
                   <span className={`text-4xl font-bold font-mono ${scoreColor}`}>{result.probabilityScore}%</span>
                   <p className="text-xs text-slate-500 mt-1 uppercase">{result.status}</p>
                </div>
             </div>
          </div>

          <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col">
             <div className="flex items-center gap-2 mb-4">
               <FileText className="w-5 h-5 text-cyan-400" />
               <h3 className="text-white font-semibold">Forensic Synthesis</h3>
             </div>
             <div className="flex-1 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50">
               <p className="text-slate-300 leading-relaxed font-mono text-sm">
                 "{result.analysisSummary || "Synthesis complete."}"
               </p>
               <div className="mt-4 flex flex-wrap gap-2">
                 <span className={`px-2 py-1 border rounded text-xs ${
                    result.status === 'fake' ? 'bg-red-950/40 text-red-400 border-red-900/50' :
                    result.status === 'suspicious' ? 'bg-yellow-950/40 text-yellow-400 border-yellow-900/50' :
                    'bg-green-950/40 text-green-400 border-green-900/50'
                 }`}>
                   {result.status === 'fake' ? 'Anomalies Confirmed' : result.status === 'suspicious' ? 'Markers Detected' : 'No Artifacts Found'}
                 </span>
                 <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs">Node_3.0_Multimodal</span>
               </div>
             </div>
          </div>
        </div>

        {/* Findings List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Evidence Indicators
              </h3>
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {result.forensicMarkers.map((marker, idx) => (
                   <li key={idx} className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/50 hover:border-cyan-500/30 transition-colors">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        marker.severity === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                        marker.severity === 'medium' ? 'bg-yellow-500' : 'bg-cyan-500'
                      }`}></div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                           <span className="text-xs text-cyan-400 font-mono bg-cyan-950/30 px-1.5 py-0.5 rounded">{marker.timestamp}</span>
                           <span className="text-xs font-semibold text-slate-300">{marker.label}</span>
                        </div>
                        <p className="text-sm text-slate-400">{marker.description}</p>
                      </div>
                   </li>
                 ))}
                 {result.forensicMarkers.length === 0 && (
                   <li className="p-8 text-center text-slate-500 italic text-sm">
                     No neural fingerprints detected.
                   </li>
                 )}
              </ul>
           </div>

           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Anomaly Flux Chart</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={result.probabilityScore > 50 ? "#ef4444" : "#22d3ee"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={result.probabilityScore > 50 ? "#ef4444" : "#22d3ee"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
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
              <p className="text-xs text-slate-500 mt-4 text-center font-mono">NEURAL FREQUENCY FLUCTUATION</p>
           </div>
        </div>

        {/* JSON Modal */}
        <AnimatePresence>
          {isJsonModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md no-print">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                  <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    Forensic Raw Buffer
                  </h3>
                  <button onClick={() => setIsJsonModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-6 overflow-auto bg-slate-950/50 custom-scrollbar flex-1">
                  <pre className="text-xs font-mono text-cyan-100/80 whitespace-pre-wrap break-all">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="text-center pb-12">
           <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
             Neural Audit ID: {result.id} // System: AI Guard 2.5 // Disclaimer: Educational purposes only.
           </p>
        </div>
      </motion.div>
    </div>
  );
};