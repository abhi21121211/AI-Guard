import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle, Copy } from 'lucide-react';

interface JsonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ isOpen, onClose, data }) => {
  const [jsonCopyStatus, setJsonCopyStatus] = useState("Copy JSON");

  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setJsonCopyStatus("Copied!");
      setTimeout(() => setJsonCopyStatus("Copy JSON"), 2000);
    } catch (err) {
      console.error('Failed to copy JSON', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
              <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Forensic Analysis Log
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={copyJsonToClipboard}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 hover:bg-slate-800 transition-colors"
                >
                  {jsonCopyStatus === "Copied!" ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {jsonCopyStatus}
                </button>
                <button 
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto bg-slate-950">
              <pre className="text-xs font-mono text-cyan-100 whitespace-pre-wrap break-all">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};