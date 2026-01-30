import React from 'react';
import { Download } from 'lucide-react';
import { ScanResult } from '../../types';

interface DashboardHeaderProps {
  result: ScanResult;
  onExport: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ result, onExport }) => {
  return (
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
           type="button"
           onClick={onExport}
           className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200 transition-colors border border-slate-700 active:scale-95"
         >
           <Download className="w-4 h-4" /> Export PDF
         </button>
      </div>
    </div>
  );
};