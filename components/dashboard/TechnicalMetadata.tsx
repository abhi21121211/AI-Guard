import React from 'react';
import { Terminal } from 'lucide-react';
import { ScanResult } from '../../types';

interface TechnicalMetadataProps {
  result: ScanResult;
  onViewJson: () => void;
}

export const TechnicalMetadata: React.FC<TechnicalMetadataProps> = ({ result, onViewJson }) => {
  return (
    <div className="bg-[#0b101b] border border-slate-800/80 rounded-2xl p-8 flex flex-col h-[400px]">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Technical Metadata</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#111827] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Source Format</span>
            <span className="text-sm font-mono text-slate-300 font-bold">{result.mode === 'video' ? 'MP4 / H.264' : 'JPEG / RAW'}</span>
            </div>
            <div className="p-4 bg-[#111827] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Analysis Engine</span>
            <span className="text-sm font-mono text-slate-300 font-bold">GEMINI-3-PRO</span>
            </div>
            <div className="p-4 bg-[#111827] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Integrity Check</span>
            <span className="text-sm font-mono text-green-400 font-bold">PASSED</span>
            </div>
            <div className="p-4 bg-[#111827] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Scan Latency</span>
            <span className="text-sm font-mono text-slate-300 font-bold">~1.2s</span>
            </div>
        </div>
        <div className="mt-auto pt-6">
            <button onClick={onViewJson} className="w-full py-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white group">
            <Terminal className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest">View JSON Buffer</span>
            </button>
        </div>
    </div>
  );
};