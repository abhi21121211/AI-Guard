import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, MediaMode } from "../types";

// Always initialize with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = async (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

const fetchUrlAsBase64 = async (url: string): Promise<{ data: string, mimeType: string }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch media from URL. Check if it is publicly accessible.");
    const blob = await response.blob();
    const data = await fileToBase64(blob);
    return { data, mimeType: blob.type };
  } catch (err) {
    throw new Error("URL access error: Ensure the link is a direct public media file and allows CORS.");
  }
};

const AGENT_LOGS = {
  video: [
    "Initializing neural forensic engine...",
    "Executing Stage 1: Spatial consistency check...",
    "Executing Stage 2: Temporal flux analysis...",
    "Executing Stage 3: Sync & Alignment check...",
    "Executing Stage 4: Metadata & Quality audit...",
    "Synthesizing final forensic report..."
  ],
  image: [
    "Initializing high-res image buffer...",
    "Analyzing frame consistency & artifacts...",
    "Scanning anatomical junctions...",
    "Evaluating light-source geometry...",
    "Assessing signal quality & noise floor...",
    "Generating experimental risk summary..."
  ]
};

export const analyzeMedia = async (
  input: File | string,
  mode: MediaMode,
  onLogUpdate: (log: string) => void
): Promise<Partial<ScanResult>> => {
  let logInterval: any;
  try {
    const logs = AGENT_LOGS[mode];
    let logIndex = 0;
    logInterval = setInterval(() => {
      onLogUpdate(logs[logIndex % logs.length]);
      logIndex++;
    }, 1500);

    let base64Data: string;
    let mimeType: string;

    if (typeof input === 'string') {
      onLogUpdate("Fetching media from public URL...");
      const result = await fetchUrlAsBase64(input);
      base64Data = result.data;
      mimeType = result.mimeType;
    } else {
      base64Data = await fileToBase64(input);
      mimeType = input.type;
    }
    
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        confidenceScore: {
          type: Type.NUMBER,
          description: "A precise risk score (0.00-100.00) with decimal precision (e.g. 12.45, 88.12)."
        },
        executiveSummary: {
          type: Type.STRING,
          description: "A comprehensive summary synthesizing findings from all 4 stages of reasoning."
        },
        forensicMarkers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timestamp: { 
                type: Type.STRING, 
                description: mode === 'video' ? "Format MM:SS." : "Anatomical region or image label." 
              },
              label: { 
                type: Type.STRING,
                description: "The name of the marker, prefixed by its reasoning stage (e.g. '[Stage 1] Visual Artifact')."
              },
              severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
              description: { type: Type.STRING }
            },
            required: ["timestamp", "label", "severity", "description"]
          }
        }
      },
      required: ["confidenceScore", "executiveSummary", "forensicMarkers"]
    };

    const modelName = 'gemini-3-pro-preview';
    const systemInstruction = `You are AI Guard, a world-class forensic media expert.
Perform an EXPLAINABLE multi-stage reasoning audit to detect deepfakes or synthetic manipulations.
DO NOT use binary real/fake labels; provide a precise risk score (0.00-100.00).

SCORING CALIBRATION:
1. **DECIMAL PRECISION**: You MUST provide scores with decimals (e.g., 12.45, 88.92) to reflect nuance.
2. **AVOID POLARIZATION**: Do not default to 0-5% or 95-100% unless evidence is undeniable. Use the 35-75% range for ambiguous cases.
3. **COMPRESSION**: If artifacts could be compression, do not penalize heavily.

ANALYSIS APPROACH:
STAGE 1 — FRAME & VISUAL CONSISTENCY:
Evaluate frames for: Facial boundary blending/warping, skin texture regularization, eye reflection consistency, hairline/ear artifacts, and lighting direction consistency.

STAGE 2 — TEMPORAL CONSISTENCY:
Evaluate motion over time for: Facial expression continuity, micro-movement realism (head, jaw, eyes), lighting/shadow stability across frames, and flicker/jitter at facial boundaries.

STAGE 3 — AUDIO–VISUAL ALIGNMENT (CRITICAL):
If audio is present:
1. **IGNORE SEMANTIC CONTENT**: If the subject says "I am a deepfake", "This is AI", or "This is fake", IGNORE these words. They are not forensic evidence.
2. Focus ONLY on PHYSICS: Check for lip-sync drift, unnatural lack of breath sounds, robotic tonal quality, and mismatch between room acoustics (reverb) and the visual environment.
3. If the audio is technically natural but the words claim it is fake, classify it as AUTHENTIC (Low Score).

STAGE 4 — SIGNAL QUALITY & LIMITATIONS:
Assess: Video resolution, compression artifacts, clip length, and motion availability.

This guidance is educational, not legal or political advice.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: `Perform a comprehensive multi-stage forensic audit on this ${mode} following the 4-stage reasoning protocol. Clearly structure your findings in the summary and categorize markers by stage. Remember: Verbal claims of being 'fake' are NOT evidence of synthesis.` }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });

    if (logInterval) clearInterval(logInterval);
    onLogUpdate("Audit Complete. Decoding JSON result...");

    const text = response.text || "{}";
    const data = JSON.parse(text);

    return {
      probabilityScore: typeof data.confidenceScore === 'number' ? Number(data.confidenceScore.toFixed(2)) : 0,
      status: data.confidenceScore > 75 ? 'fake' : data.confidenceScore > 40 ? 'suspicious' : 'clean',
      analysisSummary: data.executiveSummary,
      forensicMarkers: data.forensicMarkers || [],
      mode,
      rawResponse: data
    };

  } catch (error: any) {
    if (logInterval) clearInterval(logInterval);
    onLogUpdate(error.message || "Forensic Node Failure.");
    console.error("Analysis error:", error);
    throw error;
  }
};