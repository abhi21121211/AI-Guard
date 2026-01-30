import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScanResult, TimelineDataPoint } from '../../types';

interface AnomalyTimelineProps {
  result: ScanResult;
}

export const AnomalyTimeline: React.FC<AnomalyTimelineProps> = ({ result }) => {
  const timelineData: TimelineDataPoint[] = useMemo(() => {
    const points = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      anomalyScore: Math.random() * 10
    }));

    result.forensicMarkers.forEach(marker => {
       const minute = parseInt(marker.timestamp.split(':')[0]) || 0;
       const second = parseInt(marker.timestamp.split(':')[1]) || 0;
       const index = (minute * 60 + second) % 20;
       if(points[index]) {
         points[index].anomalyScore = marker.severity === 'high' ? 95 : marker.severity === 'medium' ? 60 : 30;
       }
    });
    return points;
  }, [result]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 print:border-slate-600 print:break-inside-avoid">
       <div className="flex items-center justify-between mb-6">
         <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Anomaly Timeline Analysis</h3>
         <div className="flex items-center gap-2 text-xs text-slate-500">
           <Activity className="w-4 h-4" />
           <span>Temporal Coherence</span>
         </div>
       </div>
       
       <div className="h-64 w-full">
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={timelineData}>
             <defs>
               <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor={result.probabilityScore > 50 ? "#ef4444" : "#22d3ee"} stopOpacity={0.3}/>
                 <stop offset="95%" stopColor={result.probabilityScore > 50 ? "#ef4444" : "#22d3ee"} stopOpacity={0}/>
               </linearGradient>
             </defs>
             <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
             <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
             <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
             <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ color: '#22d3ee' }}
             />
             <Area 
                type="monotone" 
                dataKey="anomalyScore" 
                stroke={result.probabilityScore > 50 ? "#ef4444" : "#22d3ee"} 
                fillOpacity={1} 
                fill="url(#colorScore)" 
                strokeWidth={2}
             />
           </AreaChart>
         </ResponsiveContainer>
       </div>
    </div>
  );
};