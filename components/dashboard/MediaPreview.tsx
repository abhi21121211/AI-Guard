import React, { useEffect, useState, useRef } from 'react';
import { Play, Image as ImageIcon, FileWarning, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaMode } from '../../types';

interface MediaPreviewProps {
  file?: File | null;
  url?: string;
  filename: string;
  mode: MediaMode;
  className?: string;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ file, url, filename, mode, className }) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (url) {
      setPreviewSrc(url);
    } else {
      setPreviewSrc(null);
    }
  }, [file, url]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      className={`bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden relative group h-full flex items-center justify-center bg-black print:border-slate-600 print:break-inside-avoid cursor-none ${className || 'min-h-[300px]'}`}
    >
       <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10 flex items-center gap-2 pointer-events-none">
         {mode === 'video' ? <Play className="w-3 h-3 text-cyan-400" /> : <ImageIcon className="w-3 h-3 text-cyan-400" />}
         SOURCE MEDIA
      </div>
      
      {/* Scanning Laser Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[2px] bg-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.6)] z-20 pointer-events-none"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
      />

      {/* Interactive Cursor Overlay */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ left: cursorPos.x, top: cursorPos.y }}
            className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            {/* Crosshair Center */}
            <div className="relative flex items-center justify-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
              {/* Outer Ring */}
              <div className="absolute w-12 h-12 border border-cyan-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
              <div className="absolute w-14 h-14 border-t border-b border-transparent border-l border-r border-cyan-500/50 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
              
              {/* Axis Lines */}
              <div className="absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
              <div className="absolute h-[200px] w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>

              {/* Coordinates Label */}
              <div className="absolute top-4 left-4 bg-slate-900/90 text-cyan-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
                X: {Math.round(cursorPos.x)} | Y: {Math.round(cursorPos.y)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {previewSrc ? (
        mode === 'video' ? (
          <video 
            src={previewSrc} 
            controls={false} // Hide default controls to not interfere with custom cursor
            className="w-full h-full object-contain max-h-[400px] opacity-90" 
            loop
            autoPlay
            muted
          />
        ) : (
          <img 
            src={previewSrc} 
            alt={filename} 
            className="w-full h-full object-contain max-h-[400px] opacity-90" 
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-600 p-6 text-center">
           <div className="p-4 rounded-full bg-slate-900/50 mb-3">
             <FileWarning className="w-8 h-8 opacity-40" />
           </div>
           <p className="text-xs uppercase tracking-widest font-mono font-bold text-slate-500">Preview Unavailable</p>
           <p className="text-[10px] text-slate-600 mt-1 max-w-[200px]">
             Original source file is not in memory. Re-upload to view analysis overlay.
           </p>
        </div>
      )}
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-slate-600/50"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-slate-600/50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-slate-600/50"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-slate-600/50"></div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    </div>
  );
};