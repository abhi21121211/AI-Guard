import React, { useCallback, useState, useEffect } from 'react';
import { UploadCloud, FileVideo, FileImage, ScanLine, Sparkles, Link as LinkIcon, Globe, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaMode } from '../types';

interface UploadZoneProps {
  onFileSelected: (file: File, mode: MediaMode) => void;
  onUrlSelected: (url: string, mode: MediaMode) => void;
}

type InputMethod = 'upload' | 'url';

interface ValidationResult {
  isValid: boolean;
  message: string;
  detectedMode?: MediaMode;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected, onUrlSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMode, setActiveMode] = useState<MediaMode>('video');
  const [inputMethod, setInputMethod] = useState<InputMethod>('upload');
  const [url, setUrl] = useState('');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, message: "" });

  const validateMediaUrl = (inputUrl: string): ValidationResult => {
    if (!inputUrl) return { isValid: false, message: "" };
    
    const trimmed = inputUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return { isValid: false, message: "URL must start with http:// or https://" };
    }

    // Google Drive Specific Validation
    if (trimmed.toLowerCase().includes('drive.google.com')) {
      if (trimmed.includes('/file/d/') && trimmed.includes('/view')) {
        return { 
          isValid: false, 
          message: "Google Drive viewer links are not supported. Please use a direct download link." 
        };
      }
      
      if (trimmed.includes('uc?export=download&id=')) {
        return { 
          isValid: true, 
          message: "Supported Google Drive direct link detected" 
        };
      }

      return { 
        isValid: false, 
        message: "Invalid Google Drive link format. Use a direct download link." 
      };
    }

    const socialMedia = ['youtube.com', 'youtu.be', 'instagram.com', 'tiktok.com', 'twitter.com', 'x.com', 'facebook.com'];
    if (socialMedia.some(site => trimmed.toLowerCase().includes(site))) {
      return { isValid: false, message: "Social media links are not supported. Use direct media URLs." };
    }

    const videoExts = ['.mp4', '.webm', '.mov'];
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp'];
    
    const cleanUrl = trimmed.split('?')[0].toLowerCase();
    
    if (videoExts.some(ext => cleanUrl.endsWith(ext))) {
      return { isValid: true, message: "Supported public video link detected", detectedMode: 'video' };
    }
    
    if (imageExts.some(ext => cleanUrl.endsWith(ext))) {
      return { isValid: true, message: "Supported public image link detected", detectedMode: 'image' };
    }

    return { isValid: false, message: "URL must point directly to a media file (.jpg, .mp4, etc.)" };
  };

  useEffect(() => {
    if (inputMethod === 'url') {
      const result = validateMediaUrl(url);
      setValidation(result);
      if (result.detectedMode) {
        setActiveMode(result.detectedMode);
      }
    }
  }, [url, inputMethod]);

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
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (isVideo) {
        onFileSelected(file, 'video');
      } else if (isImage) {
        onFileSelected(file, 'image');
      } else {
        alert("Unsupported file format.");
      }
    }
  }, [onFileSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const mode: MediaMode = file.type.startsWith('image/') ? 'image' : 'video';
      onFileSelected(file, mode);
    }
  }, [onFileSelected]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validation.isValid) {
      onUrlSelected(url.trim(), activeMode);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 w-full max-w-2xl"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Forensic Audit<span className="text-cyan-500">.</span>
        </h2>
        <p className="text-slate-400 text-lg mx-auto mb-6">
          High-precision neural analysis of digital media authenticity.
        </p>

        {/* Input Method Toggle */}
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-sm mx-auto mb-6">
          <button 
            onClick={() => setInputMethod('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              inputMethod === 'upload' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UploadCloud className="w-4 h-4" /> Upload
          </button>
          <button 
            onClick={() => setInputMethod('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${
              inputMethod === 'url' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LinkIcon className="w-4 h-4" /> Public URL
            <span className="absolute -top-1 -right-1 px-1 py-0.5 bg-yellow-500 text-slate-950 rounded-full text-[7px] font-black">BETA</span>
          </button>
        </div>

        {/* Media Mode Selector */}
        <div className="flex p-1 bg-slate-900/50 border border-slate-800/50 rounded-lg max-w-xs mx-auto mb-10">
          <button 
            disabled={inputMethod === 'url' && validation.isValid && !url.includes('drive.google.com')}
            onClick={() => setActiveMode('video')}
            className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeMode === 'video' ? 'bg-slate-800 text-cyan-400' : 'text-slate-600'
            } ${inputMethod === 'url' && validation.isValid && !url.includes('drive.google.com') ? 'cursor-not-allowed' : ''}`}
          >
            Video Audit
          </button>
          <button 
            disabled={inputMethod === 'url' && validation.isValid && !url.includes('drive.google.com')}
            onClick={() => setActiveMode('image')}
            className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeMode === 'image' ? 'bg-slate-800 text-cyan-400' : 'text-slate-600'
            } ${inputMethod === 'url' && validation.isValid && !url.includes('drive.google.com') ? 'cursor-not-allowed' : ''}`}
          >
            Image Audit
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {inputMethod === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
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
              accept={activeMode === 'video' ? "video/*" : "image/*"} 
              onChange={handleFileInput}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            <div className="z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mb-4 group-hover:text-cyan-400 group-hover:bg-slate-700 transition-all">
                 <ScanLine className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Upload Source File</h3>
              <p className="text-slate-500 font-mono text-xs">DROP MEDIA TO COMMENCE AUDIT</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="url"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleUrlSubmit}
            className="w-full max-w-3xl space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="w-5 h-5 text-slate-500" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/media/file.mp4"
                className={`w-full bg-slate-900/50 border rounded-xl py-5 pl-12 pr-32 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all font-mono text-sm ${
                  url && !validation.isValid ? 'border-red-500/50 focus:ring-red-500/20' : 
                  url && validation.isValid ? 'border-green-500/50 focus:ring-green-500/20' : 'border-slate-800 focus:ring-cyan-500/50'
                }`}
                required
              />
              <button
                type="submit"
                disabled={!validation.isValid}
                className={`absolute inset-y-2 right-2 px-6 text-xs font-bold uppercase rounded-lg transition-all shadow-lg ${
                  validation.isValid 
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white active:scale-95' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                Start Audit
              </button>
            </div>

            {/* Validation Message */}
            <AnimatePresence mode="wait">
              {url && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`flex items-center gap-2 text-xs font-mono px-1 ${
                    validation.isValid ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {validation.isValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {validation.message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                 <div className="p-2 bg-slate-800 rounded-lg text-cyan-400">
                    <Info className="w-4 h-4" />
                 </div>
                 <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                   DIRECT LINKS ONLY. ONLY .MP4, .MOV, .JPG, .PNG ARE SUPPORTED. PLATFORM-WRAPPED URLS (YOUTUBE/TIKTOK) ARE INCOMPATIBLE.
                 </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                 <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                    <Sparkles className="w-4 h-4" />
                 </div>
                 <p className="text-[10px] text-yellow-600 font-mono leading-relaxed">
                   URL AUDIT RELIES ON EXTERNAL CORS PERMISSIONS. IF AN ERROR OCCURS, DOWNLOAD THE FILE AND USE MANUAL UPLOAD.
                 </p>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};