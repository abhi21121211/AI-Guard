export interface ForensicMarker {
  timestamp: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface ScanResult {
  id: string;
  filename: string;
  timestamp: Date;
  probabilityScore: number;
  status: 'clean' | 'suspicious' | 'fake';
  analysisSummary: string;
  forensicMarkers: ForensicMarker[];
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
