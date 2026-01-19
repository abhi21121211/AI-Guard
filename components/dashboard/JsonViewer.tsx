import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface JsonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ isOpen, onClose, data }) => {
  return (
    <AnimatePresence>
        {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}} className="bg-[#0a0f1d] w-full max-w-4xl max-h-[80vh] rounded-2xl border border-slate-800 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-widest">Raw Forensic Data</span>
                <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-[#050914]">
                <pre className="text-xs font-mono text-slate-400 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>
            </motion.div>
        </div>
        )}
    </AnimatePresence>
  );
};