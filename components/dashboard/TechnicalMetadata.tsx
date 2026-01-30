import React from 'react';
import { FileText } from 'lucide-react';
import { ScanResult } from '../../types';
import { MediaPreview } from './MediaPreview';

interface TechnicalMetadataProps {
  result: ScanResult;
  sourceMedia?: File | string | null;
  onViewJson: () => void;
}

export const TechnicalMetadata: React.FC<TechnicalMetadataProps> = ({ result, sourceMedia, onViewJson }) => {
  // Determine file/url for MediaPreview
  const previewFile = (sourceMedia instanceof File) ? sourceMedia : null;
  const previewUrl = (typeof sourceMedia === 'string') ? sourceMedia : result.sourceUrl;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col gap-6 print:border-slate-600 print:break-inside-avoid h-[600px]">
      <h3 className="text-white font-semibold print:text-black">Technical Metadata</h3>
      
      <div className="w-full h-48 md:h-56 shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-black/50">
          <MediaPreview 
            file={previewFile} 
            url={previewUrl} 
            filename={result.filename} 
            mode={result.mode} 
            className="h-full w-full min-h-0 border-0 rounded-none" 
          />
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 content-start">
          <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
            <p className="text-xs text-slate-500 uppercase">Input Format</p>
            <p className="text-sm text-white font-mono print:text-black">{result.filename.split('.').pop()?.toUpperCase() || 'UNKNOWN'}</p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
            <p className="text-xs text-slate-500 uppercase">Analysis Engine</p>
            <p className="text-sm text-white font-mono print:text-black">GEMINI-3-PRO</p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
            <p className="text-xs text-slate-500 uppercase">Reasoning Budget</p>
            <p className="text-sm text-white font-mono print:text-black">HIGH (4k Tokens)</p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 print:bg-white print:border-slate-300">
            <p className="text-xs text-slate-500 uppercase">Timestamp</p>
            <p className="text-sm text-white font-mono print:text-black">{new Date(result.timestamp).toLocaleTimeString()}</p>
          </div>
      </div>

      <button 
        onClick={onViewJson}
        className="w-full py-2 border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-950/30 transition-colors rounded flex items-center justify-center gap-2 no-print active:scale-95 mt-auto"
      >
        <FileText className="w-4 h-4" /> View Full JSON Log
      </button>
    </div>
  );
};