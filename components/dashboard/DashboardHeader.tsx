import React from 'react';
import { Shield, Download, Share2 } from 'lucide-react';
import { ScanResult } from '../../types';

interface DashboardHeaderProps {
  result: ScanResult;
  onExport: () => void;
  onShare: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ result, onExport, onShare }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
      <div>
        <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyan-500" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Forensic Report <span className="text-slate-600 text-lg font-normal ml-2">#{result.id.slice(0, 8)}</span></h1>
        </div>
        <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-slate-400 font-medium">Target File:</span>
            <span className="bg-[#0f172a] text-cyan-400 px-3 py-1 rounded text-xs font-mono border border-slate-800">
            {result.filename}
            </span>
        </div>
      </div>
      <div className="flex gap-3">
            <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700 transition-all active:scale-95">
            <Download className="w-4 h-4" /> Export PDF
            </button>
            <button onClick={onShare} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-cyan-900/20 transition-all active:scale-95">
            <Share2 className="w-4 h-4" /> Share Findings
            </button>
      </div>
    </div>
  );
};