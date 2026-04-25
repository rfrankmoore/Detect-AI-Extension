// Claude API client — AI-detection calls go through here

import type { DetectionResult } from "./types.js";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-4-7";

/**
 * Calls the Claude API to determine whether the supplied text is AI-generated.
 * Returns a DetectionResult with a boolean verdict, confidence score, and explanation.
 */
export async function detectAIContent(
  text: string,
  apiKey: string
): Promise<DetectionResult> {
  // TODO: implement
  throw new Error("Not implemented");
}
