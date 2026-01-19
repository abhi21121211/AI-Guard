import React, { useEffect, useState } from 'react';
import { Play, Image as ImageIcon, FileWarning } from 'lucide-react';
import { MediaMode } from '../../types';

interface MediaPreviewProps {
  file?: File | null;
  url?: string;
  filename: string;
  mode: MediaMode;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ file, url, filename, mode }) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

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

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden relative group h-full min-h-[300px] flex items-center justify-center bg-black print:border-slate-600 print:break-inside-avoid">
       <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10 flex items-center gap-2">
         {mode === 'video' ? <Play className="w-3 h-3 text-cyan-400" /> : <ImageIcon className="w-3 h-3 text-cyan-400" />}
         SOURCE MEDIA
      </div>
      
      {previewSrc ? (
        mode === 'video' ? (
          <video 
            src={previewSrc} 
            controls 
            className="w-full h-full object-contain max-h-[400px]" 
          />
        ) : (
          <img 
            src={previewSrc} 
            alt={filename} 
            className="w-full h-full object-contain max-h-[400px]" 
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
    </div>
  );
};