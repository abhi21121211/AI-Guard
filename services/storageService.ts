import { ScanResult } from '../types';

const STORAGE_KEY = 'ai_guard_history';

export const getHistory = async (): Promise<ScanResult[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert string timestamps back to Date objects
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveScan = async (scan: Omit<ScanResult, 'id'>): Promise<ScanResult> => {
  // Generate a client-side ID
  const newScan: ScanResult = {
    ...scan,
    id: crypto.randomUUID(),
  };

  const currentHistory = await getHistory();
  // Keep the last 10 items
  const updatedHistory = [newScan, ...currentHistory].slice(0, 10);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return newScan;
};
