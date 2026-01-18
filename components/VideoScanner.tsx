import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Terminal, Loader2 } from 'lucide-react';

interface VideoScannerProps {
  file: File;
  scanningLog: string;
}

export const VideoScanner: React.FC<VideoScannerProps> = ({ file, scanningLog }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (file && videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }
  }, [file]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-full max-w-4xl relative flex flex-col gap-6">
        
        {/* Main Scanner View */}
        <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black aspect-video shadow-2xl">
          <video 
            ref={videoRef} 
            className="w-full h-full object-contain opacity-60" 
            autoPlay 
            muted 
            loop 
          />
          
          {/* Overlay Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

          {/* Laser Scanner Animation */}
          <motion.div 
            className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-20"
            initial={{ top: "0%" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
          >
             <div className="absolute right-2 -top-6 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-1 rounded border border-cyan-500/30">
               ANALYZING FRAME
             </div>
          </motion.div>
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur px-3 py-1 rounded border border-cyan-900/50">
             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-mono text-cyan-400">GEMINI_3_PRO_ACTIVE</span>
          </div>
        </div>

        {/* Agentic Reasoning Log Terminal */}
        <div className="w-full bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-sm shadow-inner min-h-[120px] flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 border-b border-slate-900 pb-2 mb-2">
            <Terminal className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Reasoning Engine Logs</span>
          </div>
          <div className="flex-1 flex flex-col justify-end">
             <AnimatePresence mode="wait">
               <motion.div
                 key={scanningLog}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="text-cyan-400 flex items-center gap-2"
               >
                 <span className="text-slate-600">{">"}</span>
                 {scanningLog}
                 <span className="w-2 h-4 bg-cyan-500 animate-pulse ml-1 inline-block align-middle"></span>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar (Indeterminate) */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        
      </div>
    </div>
  );
};
