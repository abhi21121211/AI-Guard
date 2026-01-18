import React from 'react';
import { History, ShieldAlert, CheckCircle, FileVideo, Clock, ChevronRight } from 'lucide-react';
import { ScanResult } from '../types';

interface SidebarProps {
  history: ScanResult[];
  onSelectResult: (result: ScanResult) => void;
  currentId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ history, onSelectResult, currentId }) => {
  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 mb-1">
          <ShieldAlert className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight text-white">AI Guard</h1>
        </div>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Forensic Suite v2.0</p>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 text-slate-400 mb-4 px-2">
          <History className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Scan History</span>
        </div>

        <div className="space-y-2">
          {history.length === 0 && (
            <div className="text-slate-600 text-sm italic px-2 py-4 text-center border border-dashed border-slate-800 rounded-lg">
              No recent scans found.
            </div>
          )}
          
          {history.map((scan) => (
            <button
              key={scan.id}
              onClick={() => onSelectResult(scan)}
              className={`w-full group flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                currentId === scan.id
                  ? 'bg-slate-800 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                  : 'bg-slate-800/30 border-transparent hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`mt-1 ${
                scan.status === 'fake' ? 'text-red-500' : 
                scan.status === 'suspicious' ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {scan.status === 'fake' ? <ShieldAlert className="w-5 h-5" /> : 
                 scan.status === 'suspicious' ? <Clock className="w-5 h-5" /> : 
                 <CheckCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{scan.filename}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500 font-mono">{scan.timestamp.toLocaleDateString()}</span>
                  <span className={`text-xs font-mono font-bold ${
                    scan.probabilityScore > 80 ? 'text-red-400' : 
                    scan.probabilityScore > 40 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {scan.probabilityScore}%
                  </span>
                </div>
              </div>
              {currentId === scan.id && <ChevronRight className="w-4 h-4 text-cyan-400 self-center" />}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950 rounded p-3 flex items-center gap-3 border border-slate-800/50">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-xs text-slate-400 font-mono">SYSTEM ONLINE // SECURE</span>
        </div>
      </div>
    </aside>
  );
};
