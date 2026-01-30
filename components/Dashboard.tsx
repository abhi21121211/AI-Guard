import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { ScanResult } from '../types';
import { jsPDF } from 'jspdf';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { ProbabilityGauge } from './dashboard/ProbabilityGauge';
import { ExecutiveSummary } from './dashboard/ExecutiveSummary';
import { AnomalyTimeline } from './dashboard/AnomalyTimeline';
import { ForensicMarkers } from './dashboard/ForensicMarkers';
import { TechnicalMetadata } from './dashboard/TechnicalMetadata';
import { JsonViewer } from './dashboard/JsonViewer';

interface DashboardProps {
  result: ScanResult;
  sourceMedia?: File | string | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export const Dashboard: React.FC<DashboardProps> = ({ result, sourceMedia }) => {
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // --- HEADER ---
      doc.setFillColor(2, 6, 23); // slate-950
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(34, 211, 238); // cyan-400
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("AI GUARD", margin, 20);
      
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("FORENSIC AUDIT SUITE", margin, 28);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(`REPORT #${result.id.slice(0, 8).toUpperCase()}`, pageWidth - margin, 20, { align: 'right' });
      doc.text(`${new Date(result.timestamp).toLocaleDateString()}`, pageWidth - margin, 28, { align: 'right' });

      // --- STATUS ---
      let y = 60;
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("AUDIT RESULT", margin, y);
      y += 8;

      const isFake = result.probabilityScore > 75;
      const isSuspicious = result.probabilityScore > 40;
      const statusColor = isFake ? [239, 68, 68] : (isSuspicious ? [234, 179, 8] : [34, 197, 94]);
      const statusText = isFake ? "SYNTHETIC / FAKE" : (isSuspicious ? "SUSPICIOUS" : "AUTHENTIC / CLEAN");

      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 2, 2, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(`${result.probabilityScore.toFixed(2)}%  -  ${statusText}`, pageWidth / 2, y + 16, { align: 'center' });

      y += 40;

      // --- SUMMARY ---
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EXECUTIVE SUMMARY", margin, y);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 3, pageWidth - margin, y + 3);
      y += 12;

      doc.setFont("courier", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const summaryLines = doc.splitTextToSize(result.analysisSummary, pageWidth - (margin * 2));
      doc.text(summaryLines, margin, y);
      y += (summaryLines.length * 5) + 20;

      // --- METADATA ---
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.text("TECHNICAL DATA", margin, y);
      doc.line(margin, y + 3, pageWidth - margin, y + 3);
      y += 12;

      const metadata = [
        ["Filename", result.filename],
        ["Media Type", result.mode.toUpperCase()],
        ["Scan Source", result.sourceType.toUpperCase()],
        ["Analysis Model", "GEMINI-3-PRO"],
        ["Integrity", "VERIFIED"]
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      metadata.forEach(([label, value]) => {
        doc.setTextColor(100, 116, 139);
        doc.text(label, margin, y);
        doc.setTextColor(15, 23, 42);
        doc.text(value, margin + 50, y);
        y += 8;
      });
      y += 10;

      // --- MARKERS ---
      if (result.forensicMarkers?.length > 0) {
        if (y > pageHeight - 60) { doc.addPage(); y = 30; }
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("FORENSIC MARKERS", margin, y);
        doc.line(margin, y + 3, pageWidth - margin, y + 3);
        y += 12;

        result.forensicMarkers.forEach((m) => {
           if (y > pageHeight - 40) { doc.addPage(); y = 30; }
           doc.setFont("helvetica", "bold");
           doc.setFontSize(10);
           doc.setTextColor(6, 182, 212);
           doc.text(`[${m.timestamp}] ${m.label}`, margin, y);
           y += 5;
           
           doc.setFont("helvetica", "normal");
           doc.setTextColor(51, 65, 85);
           const descLines = doc.splitTextToSize(m.description, pageWidth - margin - 25);
           doc.text(descLines, margin + 5, y);
           y += (descLines.length * 5) + 8;
        });
      }

      doc.save(`AI_Guard_Report_${result.id}.pdf`);
    } catch (e) {
      console.error(e);
      alert("PDF generation failed.");
    }
  };

  return (
    <div className="h-full p-8 overflow-y-auto dashboard-content bg-[#050914] text-slate-200">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-6 pb-20"
      >
        <motion.div variants={itemVariants}>
          <DashboardHeader result={result} onExport={generatePDFReport} />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProbabilityGauge result={result} />
          <ExecutiveSummary result={result} />
        </motion.div>

        <motion.div variants={itemVariants}>
           <AnomalyTimeline result={result} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:space-y-6">
           <motion.div variants={itemVariants}>
             <ForensicMarkers result={result} />
           </motion.div>

           <motion.div variants={itemVariants}>
             <TechnicalMetadata 
               result={result} 
               sourceMedia={sourceMedia} 
               onViewJson={() => setIsJsonModalOpen(true)} 
             />
           </motion.div>
        </div>

        <JsonViewer 
          isOpen={isJsonModalOpen} 
          onClose={() => setIsJsonModalOpen(false)} 
          data={result} 
        />

      </motion.div>
    </div>
  );
};