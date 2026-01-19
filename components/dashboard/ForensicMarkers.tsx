import React from 'react';
import { Eye, CheckCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { ForensicMarker } from '../../types';

interface ForensicMarkersProps {
  markers: ForensicMarker[];
}

export const ForensicMarkers: React.FC<ForensicMarkersProps> = ({ markers }) => {
  
  const getSeverityConfig = (severity: string) => {
    // Normalize string to handle potential case variations
    const s = severity?.toLowerCase() || 'low';
    
    switch(s) {
      case 'high':
        return {
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          dotColor: 'bg-red-500',
          icon: AlertOctagon
        };
      case 'medium':
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          dotColor: 'bg-yellow-500',
          icon: AlertTriangle
        };
      case 'low':
      default:
        return {
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20',
          dotColor: 'bg-cyan-500',
          icon: Info
        };
    }
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800/80 rounded-2xl p-8 flex flex-col h-[400px]">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-500" /> Detected Forensic Markers
        </h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {markers.length > 0 ? markers.map((m, i) => {
              const style = getSeverityConfig(m.severity);
              const Icon = style.icon;
              
              return (
                <div key={i} className={`bg-[#111827] border ${style.borderColor} rounded-lg p-4 transition-colors relative overflow-hidden group hover:bg-[#161e2e]`}>
                    {/* Left Color Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.dotColor} opacity-80 shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
                    
                    <div className="flex items-center justify-between mb-2 pl-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${style.color}`} />
                          <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">{m.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${style.color} ${style.bgColor} px-2 py-0.5 rounded border ${style.borderColor}`}>
                          {m.timestamp}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-3 border-l border-slate-800/50 ml-0.5">{m.description}</p>
                </div>
              );
            }) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600">
                <CheckCircle className="w-10 h-10 mb-3 opacity-20" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-40">No Markers Detected</span>
            </div>
            )}
        </div>
    </div>
  );
};