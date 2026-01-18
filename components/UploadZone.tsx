import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onFileSelected(file);
      } else {
        alert("Please upload a video file.");
      }
    }
  }, [onFileSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  }, [onFileSelected]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Deep Video Audit<span className="text-cyan-500">.</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Drag and drop footage to initiate neural forensic analysis. 
          Detect deepfakes, synthetic overlays, and frame manipulation in real-time.
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`
          relative w-full max-w-3xl aspect-[16/9] rounded-2xl border-2 border-dashed transition-all duration-300
          flex flex-col items-center justify-center cursor-pointer overflow-hidden group
          ${isDragging 
            ? 'border-cyan-400 bg-cyan-900/10 shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
            : 'border-slate-700 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-800/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept="video/*" 
          onChange={handleFileInput}
        />

        <div className="absolute inset-0 pointer-events-none">
           {/* Decorative Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <motion.div 
          className="z-10 flex flex-col items-center"
          animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
        >
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center mb-6
            ${isDragging ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-cyan-400 transition-colors'}
          `}>
             {isDragging ? <ScanLine className="w-10 h-10 animate-pulse" /> : <UploadCloud className="w-10 h-10" />}
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragging ? 'Drop to Initialize Scan' : 'Drop video here or click to browse'}
          </h3>
          <p className="text-slate-500 font-mono text-sm">
            MP4, MOV, AVI supported up to 500MB
          </p>
        </motion.div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-600 group-hover:border-cyan-500 transition-colors m-4 rounded-tl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-600 group-hover:border-cyan-500 transition-colors m-4 rounded-tr"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-600 group-hover:border-cyan-500 transition-colors m-4 rounded-bl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-600 group-hover:border-cyan-500 transition-colors m-4 rounded-br"></div>
      </motion.div>
    </div>
  );
};
