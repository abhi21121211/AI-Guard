import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Globe } from 'lucide-react';

interface MediaScannerProps {
  file: File | null;
  url?: string;
  scanningLog: string;
}

export const VideoScanner: React.FC<MediaScannerProps> = ({ file, url, scanningLog }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    let objectUrl = "";
    if (file) {
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setIsImage(file.type.startsWith('image/'));
    } else if (url) {
      setPreviewUrl(url);
      setIsImage(!!url.match(/\.(jpg|jpeg|png|webp)/i));
    }
    
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file, url]);

  // Ensure video source is set once element is rendered
  useEffect(() => {
    if (!isImage && videoRef.current && previewUrl) {
      videoRef.current.src = previewUrl;
    }
  }, [isImage, previewUrl]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 overflow-y-auto">
      <div className="w-full max-w-4xl relative flex flex-col gap-6">
        
        {/* Main Scanner View with visible media */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video shadow-2xl flex items-center justify-center group">
          
          {/* Media Preview Layer */}
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {isImage ? (
              <img 
                src={previewUrl} 
                className="w-full h-full object-contain transition-opacity duration-700 opacity-90" 
                alt="Audit target"
              />
            ) : (
              <video 
                ref={videoRef} 
                className="w-full h-full object-contain transition-opacity duration-700 opacity-90" 
                autoPlay 
                muted 
                loop 
                playsInline
              />
            )}
          </div>
          
          {/* Scanning Overlay Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10 opacity-60"></div>

          {/* Laser Scanner Line */}
          <motion.div 
            className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] z-20"
            initial={{ top: "0%" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
          >
             <div className="absolute right-4 -top-6 text-[9px] font-mono text-cyan-400 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/30 uppercase tracking-tighter">
               Neural_Flux_Depth: 100%
             </div>
          </motion.div>
          
          {/* Metadata Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/20 z-30">
             {url ? <Globe className="w-3.5 h-3.5 text-cyan-400" /> : <Shield className="w-3.5 h-3.5 text-cyan-400" />}
             <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
               {url ? 'REMOTE_MEDIA_AUDIT' : 'LOCAL_MEDIA_AUDIT'}
             </span>
          </div>

          <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 z-30">
             <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
               NODE: GEMINI-3-PRO
             </span>
          </div>
        </div>

        {/* Dynamic Reasoning Logs */}
        <div className="w-full bg-slate-900/50 rounded-xl border border-slate-800 p-5 font-mono text-sm shadow-xl min-h-[140px] flex flex-col relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
          
          <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800/50 pb-3 mb-3">
            <Terminal className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Neural Forensic Log Output</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
             <AnimatePresence mode="wait">
               <motion.div
                 key={scanningLog}
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -5 }}
                 className="text-cyan-400 flex items-start gap-3"
               >
                 <span className="text-slate-600 mt-1">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                 <span className="text-cyan-400 font-medium">
                   {scanningLog}
                   <span className="w-2.5 h-4 bg-cyan-500 animate-pulse ml-2 inline-block align-middle"></span>
                 </span>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};