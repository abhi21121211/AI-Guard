'use server'

import dbConnect from '../../lib/mongodb';
import Scan from '../../models/Scan';

export async function getHistory() {
  try {
    await dbConnect();

    // Fetch last 5 scans, sorted by newest first
    const scans = await Scan.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Serialize for Client Component
    return scans.map((scan) => ({
      ...scan,
      id: (scan as any)._id.toString(),
      timestamp: (scan as any).timestamp || (scan as any).createdAt,
      // Ensure other fields match ScanResult interface if strictness is needed
    }));
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
}
