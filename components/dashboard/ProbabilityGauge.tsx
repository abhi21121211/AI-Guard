import React from 'react';
import { ScanResult } from '../../types';

interface ProbabilityGaugeProps {
  result: ScanResult;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({ result }) => {
  const scoreColor = result.probabilityScore > 75 ? 'text-red-500' : result.probabilityScore > 40 ? 'text-yellow-500' : 'text-green-500';
  const scoreBorder = result.probabilityScore > 75 ? 'border-red-500' : result.probabilityScore > 40 ? 'border-yellow-500' : 'border-green-500';

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden print:border-slate-600">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]"></div>
       <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Synthetic Probability</h3>
       <div className={`relative w-40 h-40 rounded-full border-4 ${scoreBorder} flex items-center justify-center bg-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
          <div className="text-center">
             <span className={`text-4xl font-bold font-mono ${scoreColor}`}>{result.probabilityScore.toFixed(2)}%</span>
             <p className="text-xs text-slate-500 mt-1 uppercase">{result.status}</p>
          </div>
          {/* Decorative spinner */}
          <div className={`absolute inset-0 border-t-4 ${scoreBorder} rounded-full animate-spin no-print`} style={{ animationDuration: '3s', opacity: 0.3 }}></div>
       </div>
    </div>
  );
};