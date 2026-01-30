import React from 'react';
import { FileText } from 'lucide-react';
import { ScanResult } from '../../types';

interface ExecutiveSummaryProps {
  result: ScanResult;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ result }) => {
  return (
    <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col print:border-slate-600">
       <div className="flex items-center gap-2 mb-4">
         <FileText className="w-5 h-5 text-cyan-400" />
         <h3 className="text-white font-semibold print:text-black">Executive AI Summary</h3>
       </div>
       <div className="flex-1 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 print:bg-white print:border-slate-300 overflow-y-auto max-h-[160px] custom-scrollbar">
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
  );
};