import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AnomalyTimeline: React.FC = () => {
  const timelineData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
        const base = Math.sin(i * 0.5) * 10;
        const noise = Math.random() * 5;
        const spike = (i === 10 || i === 18) ? 20 : 0;
        return {
            time: i,
            score: Math.max(0, base + noise + spike + 5)
        };
    });
  }, []);

  return (
    <div className="bg-[#0b101b] border border-slate-800/80 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">Anomaly Timeline Analysis</h3>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> Temporal Coherence
        </div>
        </div>
        
        <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                cursor={{ stroke: '#334155', strokeWidth: 1 }}
            />
            <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#22d3ee" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
            />
            </AreaChart>
        </ResponsiveContainer>
        </div>
    </div>
  );
};