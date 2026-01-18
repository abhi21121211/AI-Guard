import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScanResult } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to convert File to Base64 for inline transport
// Note: For files > 20MB, you would typically use the Resumable Upload API via a backend proxy.
const fileToBase64 = async (file: File): Promise<string> => {
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

const AGENT_LOGS = [
  "Initializing neural forensic engine...",
  "Decomposing video frames into latent vectors...",
  "Analyzing temporal coherence...",
  "Checking for pixel jitter and compression artifacts...",
  "Scanning audio-visual synchronization...",
  "Detecting synthetic lighting anomalies...",
  "Evaluating biological pulse markers (rPPG)...",
  "Cross-referencing Generative Adversarial Network signatures...",
  "Finalizing confidence score..."
];

export const analyzeVideo = async (
  file: File,
  onLogUpdate: (log: string) => void
): Promise<Partial<ScanResult>> => {
  try {
    // 1. Start Agentic Log Simulation
    let logIndex = 0;
    const logInterval = setInterval(() => {
      onLogUpdate(AGENT_LOGS[logIndex % AGENT_LOGS.length]);
      logIndex++;
    }, 1500);

    // 2. Prepare Data
    const base64Data = await fileToBase64(file);
    
    // 3. Define Structured Output Schema
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        confidenceScore: {
          type: Type.NUMBER,
          description: "Probability (0-100) that the video is synthetic or manipulated."
        },
        isSynthetic: {
          type: Type.BOOLEAN,
          description: "Binary classification of the video."
        },
        executiveSummary: {
          type: Type.STRING,
          description: "A brief, professional forensic summary of the findings."
        },
        forensicMarkers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timestamp: { type: Type.STRING, description: "Timecode of anomaly (MM:SS)" },
              label: { type: Type.STRING, description: "Short title of the anomaly" },
              severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
              description: { type: Type.STRING, description: "Detailed technical explanation" }
            },
            required: ["timestamp", "label", "severity", "description"]
          }
        }
      },
      required: ["confidenceScore", "isSynthetic", "executiveSummary", "forensicMarkers"]
    };

    // 4. Call Gemini 3 Pro with High Thinking Budget
    const model = 'gemini-3-pro-preview'; // Using Pro for complex reasoning
    const prompt = "Perform a deep video audit on this file. Analyze for deepfake characteristics, temporal inconsistencies, and AI artifacts.";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: {
          thinkingBudget: 4096 // High thinking level request
        }
      }
    });

    clearInterval(logInterval);
    onLogUpdate("Analysis Complete. Compiling Report...");

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const data = JSON.parse(jsonText);

    // Map response to ScanResult partial
    return {
      probabilityScore: data.confidenceScore,
      status: data.confidenceScore > 80 ? 'fake' : data.confidenceScore > 40 ? 'suspicious' : 'clean',
      analysisSummary: data.executiveSummary,
      forensicMarkers: data.forensicMarkers || [],
      rawResponse: data
    };

  } catch (error) {
    console.error("Forensic Analysis Failed:", error);
    onLogUpdate("Critical Error in Neural Engine.");
    throw error;
  }
};
