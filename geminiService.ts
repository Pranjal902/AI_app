
import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult, Classification } from "./types";

export const analyzeVoiceAuthenticity = async (
  base64Audio: string
): Promise<DetectionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    ROLE: VOXVERITAS SENIOR LINGUISTIC FORENSIC ANALYST
    
    CORE MISSION: Distinguish between HUMAN and AI_GENERATED origins.
    
    STRICT CLASSIFICATION: 
    - You MUST return exactly "AI_GENERATED" or "HUMAN" in the classification field.
    
    EXPLANATION GUIDELINE (NATURAL LANGUAGE):
    - Do NOT use uppercase enums like "AI_GENERATED" in your explanation sentence.
    - Instead, use natural, descriptive terms: "synthetic," "AI-cloned," "digital," "real person," "natural voice," "human-like," etc.
    - Your "explanation" must be EXTREMELY HUMAN-FRIENDLY.
    - Use "The Analogy Principle": Explain technical anomalies using common human experiences.
    - If you find high-frequency quantization, say: "The high notes have a digital 'crunchiness' or 'fuzz' that sounds like a low-quality recording, which is a common footprint of synthetic voices."
    - If you find a lack of micro-jitter, say: "The voice is a bit too 'perfect.' Real people have tiny, shaky fluctuations that AI cloning often smooths out."
    - If you find artificial breaths, say: "The breathing sounds like it was 'pasted' in. It's too regular, whereas a real person breathes differently based on the length of the sentence."
    
    ANALYSIS CRITERIA:
    1. PROSODIC JITTER: Real speech has micro-fluctuations. Synthetic is often too "perfect."
    2. SPECTRAL QUANTIZATION: Digital "stepping" in high frequencies.
    3. ARTIFACT DETECTION: Phoneme clipping or unnatural transitions.
    4. LANGUAGE DETECTION: Identify the specific language (Tamil, English, Hindi, Malayalam, or Telugu).

    STRICT JSON SCHEMA:
    {
      "status": "success",
      "detectedLanguage": "Name of Language",
      "classification": "AI_GENERATED" | "HUMAN",
      "confidenceScore": float,
      "explanation": "Natural, professional narrative using analogies.",
      "technicalArtifacts": ["Specific Technical Marker 1", "Marker 2", "Marker 3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: "audio/mp3", data: base64Audio } },
          { text: "SIGNAL_INPUT: Perform verification. Classify strictly as AI_GENERATED or HUMAN. Write a natural, human-readable explanation." },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            detectedLanguage: { type: Type.STRING },
            classification: { type: Type.STRING, enum: ["AI_GENERATED", "HUMAN"] },
            confidenceScore: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            technicalArtifacts: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["status", "detectedLanguage", "classification", "confidenceScore", "explanation", "technicalArtifacts"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("ENGINE_SILENCE");

    return JSON.parse(resultText) as DetectionResult;
  } catch (err) {
    console.error("Forensic Error:", err);
    throw new Error("CORE_ENGINE_TIMEOUT");
  }
};
