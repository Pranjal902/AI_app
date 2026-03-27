
export enum Classification {
  AI_GENERATED = 'AI_GENERATED',
  HUMAN = 'HUMAN',
  UNKNOWN = 'UNKNOWN'
}

export interface DetectionResult {
  status: 'success' | 'error';
  detectedLanguage: string;
  classification: Classification;
  confidenceScore: number;
  explanation: string;
  technicalArtifacts?: string[];
  errorCode?: string;
}

export interface AppState {
  audioFile: File | null;
  audioBase64: string | null;
  selectedLanguage: any; // Deprecated but kept to avoid structural breakage
  isAnalyzing: boolean;
  result: DetectionResult | null;
  error: string | null;
}
