import React from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import { ScanResult } from '../../types';

interface ForensicMarkersProps {
  result: ScanResult;
}

export const ForensicMarkers: React.FC<ForensicMarkersProps> = ({ result }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 print:border-slate-600 print:break-inside-avoid h-[600px] flex flex-col">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2 print:text-black">
        <Eye className="w-4 h-4 text-cyan-400" />
        Detected Forensic Markers
      </h3>
      <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 print:max-h-none print:overflow-visible">
         {result.forensicMarkers.length > 0 ? result.forensicMarkers.map((marker, idx) => (
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
         )) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-600">
              <CheckCircle className="w-8 h-8 mb-2 opacity-20" />
              <span className="text-xs uppercase tracking-widest">No Markers Detected</span>
           </div>
         )}
      </ul>
    </div>
  );
};