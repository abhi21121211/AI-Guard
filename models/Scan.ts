import mongoose, { Schema, Document } from 'mongoose';
import { ForensicMarker } from '../types';

export interface IScan extends Document {
  filename: string;
  timestamp: Date;
  probabilityScore: number;
  status: 'clean' | 'suspicious' | 'fake';
  analysisSummary: string;
  forensicMarkers: ForensicMarker[];
  rawResponse?: any;
}

const ForensicMarkerSchema = new Schema({
  timestamp: String,
  label: String,
  severity: { type: String, enum: ['low', 'medium', 'high'] },
  description: String,
});

const ScanSchema = new Schema<IScan>(
  {
    filename: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    probabilityScore: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['clean', 'suspicious', 'fake'], 
      required: true 
    },
    analysisSummary: { type: String, required: true },
    forensicMarkers: [ForensicMarkerSchema],
    rawResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.Scan || mongoose.model<IScan>('Scan', ScanSchema);
