export interface ForensicMarker {
  timestamp: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export type MediaMode = 'video' | 'image';
export type ScanSource = 'upload' | 'url';

export interface ScanResult {
  id: string;
  filename: string;
  timestamp: Date;
  probabilityScore: number;
  status: 'clean' | 'suspicious' | 'fake';
  analysisSummary: string;
  forensicMarkers: ForensicMarker[];
  mode: MediaMode;
  sourceType: ScanSource;
  sourceUrl?: string;
  rawResponse?: any;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  SCANNING = 'SCANNING',
  DASHBOARD = 'DASHBOARD',
}

export interface TimelineDataPoint {
  time: number;
  anomalyScore: number;
}