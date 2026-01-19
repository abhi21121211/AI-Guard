import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ProbabilityGaugeProps {
  score: number;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({ score }) => {
  const theme = useMemo(() => {
    if (score > 75) return { 
      color: '#ef4444', 
      text: 'text-red-500',
      bg: 'bg-red-500', 
      label: 'FAKE',
    };
    if (score > 40) return { 
      color: '#eab308', 
      text: 'text-yellow-500',
      bg: 'bg-yellow-500', 
      label: 'SUSPICIOUS',
    };
    return { 
      color: '#22c55e', 
      text: 'text-green-500',
      bg: 'bg-green-500', 
      label: 'AUTHENTIC',
    };
  }, [score]);

  return (
    <div className="lg:col-span-5 bg-[#0b101b] border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center relative min-h-[420px]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
            <div className="absolute bottom-20 right-20 w-1 h-1 bg-white rounded-full opacity-30"></div>
            <div className="absolute top-1/2 left-1/4 w-0.5 h-0.5 bg-slate-500 rounded-full"></div>
            <div className="absolute top-1/4 right-1/3 w-0.5 h-0.5 bg-slate-500 rounded-full"></div>
            <div className="absolute bottom-10 left-1/3 w-1 h-1 bg-slate-600 rounded-full opacity-20"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
        <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.25em] mb-12 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          Synthetic Probability
        </h3>
        
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg
  className="w-full h-full -rotate-90"
  viewBox="0 0 300 300"
> 
  <circle
    cx="150"
    cy="150"
    r="120"
    fill="transparent"
    stroke="#161e2e"
    strokeWidth="8"
  />

  <motion.circle
    cx="150"
    cy="150"
    r="120"
    fill="transparent"
    stroke={theme.color}
    strokeWidth="12"
    strokeDasharray={2 * Math.PI * 120}
    initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
    animate={{
      strokeDashoffset:
        2 * Math.PI * 120 -
        (2 * Math.PI * 120 * score) / 100,
    }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    strokeLinecap="round"
  />
</svg>

          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold tracking-tighter leading-none ${theme.text} mb-2`}>
              {score.toFixed(2)}%
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${theme.bg}`}></span>
              <span className={`w-1 h-1 rounded-full ${theme.bg} opacity-50`}></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {theme.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};