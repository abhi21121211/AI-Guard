'use server'

import dbConnect from '../../lib/mongodb';
import Scan from '../../models/Scan';
import { ScanResult } from '../../types';

export async function saveScan(scanData: Omit<ScanResult, 'id'>) {
  try {
    await dbConnect();

    // Create a new scan document
    // We remove the 'id' from the input because MongoDB creates its own '_id'
    const scan = await Scan.create({
      filename: scanData.filename,
      timestamp: scanData.timestamp,
      probabilityScore: scanData.probabilityScore,
      status: scanData.status,
      analysisSummary: scanData.analysisSummary,
      forensicMarkers: scanData.forensicMarkers,
      rawResponse: scanData.rawResponse,
    });

    // Convert Mongoose document to a plain object and map _id to id
    const plainScan = JSON.parse(JSON.stringify(scan));
    return {
      ...plainScan,
      id: plainScan._id,
    };
  } catch (error) {
    console.error('Failed to save scan:', error);
    throw new Error('Database Error: Failed to save scan result.');
  }
}
