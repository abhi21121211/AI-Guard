import React from 'react';
import { FileText, Cpu } from 'lucide-react';
import { ScanResult } from '../../types';

interface ExecutiveSummaryProps {
  result: ScanResult;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ result }) => {
  return (
    <div className="lg:col-span-7 bg-[#0b101b] border border-slate-800/80 rounded-2xl p-8 flex flex-col min-h-[420px]">
        <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
            <FileText className="w-5 h-5 text-cyan-500" />
        </div>
        <h3 className="text-base font-bold text-white">Executive AI Summary</h3>
        </div>
        
        <div className="flex-1 bg-[#111827]/50 rounded-xl p-6 border border-slate-800/50 mb-6 font-mono text-sm leading-7 text-slate-300 overflow-y-auto custom-scrollbar shadow-inner">
        {result.analysisSummary}
        </div>

        <div className="flex gap-3">
        <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
            result.status === 'clean' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
            <div className={`w-2 h-2 rounded-full ${result.status === 'clean' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {result.status === 'clean' ? 'Authentic Media' : 'Synthetic Media'}
        </div>
        
        <div className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" />
            Gemini 3 Pro Verified
        </div>
        </div>
    </div>
  );
};