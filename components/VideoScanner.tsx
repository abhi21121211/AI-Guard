import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Globe, Cpu, Activity, Lock } from 'lucide-react';

interface MediaScannerProps {
  file: File | null;
  url?: string;
  scanningLog: string;
}

const MatrixText: React.FC = () => {
  const [text, setText] = useState('');
  const chars = '0123456789ABCDEF';
  
  useEffect(() => {
    const interval = setInterval(() => {
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setText(result);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return <span className="font-mono text-[10px] text-cyan-500/60 block">{text}</span>;
};

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
    <div className="flex flex-col items-center justify-center h-full p-8 overflow-y-auto relative">
      <div className="w-full max-w-5xl relative flex flex-col gap-6 z-10">
        
        {/* Main Scanner View with visible media */}
        <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 aspect-video shadow-[0_0_50px_rgba(6,182,212,0.1)] flex items-center justify-center group">
          
          {/* Decorative Corner Brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500 z-30"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500 z-30"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500 z-30"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500 z-30"></div>

          {/* Media Preview Layer */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            {isImage ? (
              <img 
                src={previewUrl} 
                className="w-full h-full object-contain opacity-80" 
                alt="Audit target"
              />
            ) : (
              <video 
                ref={videoRef} 
                className="w-full h-full object-contain opacity-80" 
                autoPlay 
                muted 
                loop 
                playsInline
              />
            )}
          </div>
          
          {/* Scanning Overlay Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-10"></div>

          {/* Animated HUD Data Column Left */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 opacity-50 hidden md:flex">
             {Array.from({ length: 12 }).map((_, i) => <MatrixText key={i} />)}
          </div>

          {/* Animated HUD Data Column Right */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 opacity-50 hidden md:flex text-right">
             {Array.from({ length: 12 }).map((_, i) => <MatrixText key={i} />)}
          </div>

          {/* Laser Scanner Line */}
          <motion.div 
            className="absolute left-0 right-0 h-1 bg-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,1)] z-20"
            initial={{ top: "0%" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
          >
             <div className="absolute right-10 -top-8 bg-slate-900/90 text-cyan-400 text-[10px] font-mono px-2 py-1 rounded border border-cyan-500/50 flex items-center gap-2 shadow-lg">
               <Activity className="w-3 h-3 animate-pulse" />
               SCANNING_LAYER_0{Math.floor(Math.random() * 9)}
             </div>
          </motion.div>

          {/* Central Target Reticle */}
          <motion.div 
             className="absolute w-64 h-64 border border-cyan-500/30 rounded-full z-10 flex items-center justify-center"
             animate={{ rotate: 360, scale: [1, 1.05, 1] }}
             transition={{ rotate: { duration: 10, ease: "linear", repeat: Infinity }, scale: { duration: 2, repeat: Infinity } }}
          >
             <div className="w-56 h-56 border border-dashed border-cyan-500/20 rounded-full"></div>
             <div className="absolute w-2 h-2 bg-cyan-400 rounded-full"></div>
          </motion.div>
          
          {/* Metadata Badges */}
          <div className="absolute top-4 left-16 flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-cyan-500/20 z-30">
             {url ? <Globe className="w-3.5 h-3.5 text-cyan-400" /> : <Shield className="w-3.5 h-3.5 text-cyan-400" />}
             <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
               {url ? 'REMOTE_SOURCE' : 'SECURE_UPLOAD'}
             </span>
          </div>

          <div className="absolute bottom-4 right-16 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-slate-700/50 z-30 flex items-center gap-2">
             <Cpu className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
               GEMINI_NEURAL_CORE
             </span>
          </div>
        </div>

        {/* Dynamic Reasoning Logs */}
        <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-lg border-l-4 border-cyan-500 p-5 font-mono text-sm shadow-xl min-h-[120px] flex flex-col relative overflow-hidden">
          {/* Background stripe animation for logs */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
             <motion.div 
               className="w-full h-2 bg-white"
               animate={{ y: [0, 150] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             />
          </div>

          <div className="flex items-center gap-2 text-cyan-500 border-b border-cyan-900/30 pb-3 mb-3 z-10">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">System Output Log</span>
            <div className="ml-auto flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
               <span className="text-[10px] text-cyan-400">LIVE</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center z-10">
             <AnimatePresence mode="wait">
               <motion.div
                 key={scanningLog}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 10 }}
                 transition={{ duration: 0.2 }}
                 className="text-cyan-100 flex items-start gap-3"
               >
                 <span className="text-cyan-700 mt-0.5 font-bold">
                   {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} &gt;
                 </span>
                 <span className="font-medium tracking-wide">
                   {scanningLog}
                   <span className="w-2 h-4 bg-cyan-500 animate-pulse ml-1 inline-block align-middle"></span>
                 </span>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};