// Shared types used across background, content, and popup scripts

export interface StoredSettings {
  claudeApiKey: string;
}

export interface DetectionResult {
  isAiGenerated: boolean;
  confidence: number; // 0–1
  explanation: string;
}

// Messages sent from popup → content script
export interface ActivateDetectionMessage {
  type: "ACTIVATE_DETECTION";
}

export interface DeactivateDetectionMessage {
  type: "DEACTIVATE_DETECTION";
}

// Message sent from content script → background to trigger an API call
export interface AnalyzeParagraphMessage {
  type: "ANALYZE_PARAGRAPH";
  text: string;
}

// Response from background → content script
interface AnalyzeParagraphSuccessResponse {
  success: true;
  result: DetectionResult;
}

// Response from background → content script
interface AnalyzeParagraphErrorResponse{
  success: false;
  error: string;
}

export type AnalyzeParagraphResponse = AnalyzeParagraphSuccessResponse | AnalyzeParagraphErrorResponse;
export type PopupToContentMessage = ActivateDetectionMessage | DeactivateDetectionMessage;
export type ContentToBackgroundMessage = AnalyzeParagraphMessage;
