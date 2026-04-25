// Background service worker — routes messages and calls the Claude API

import { detectAIContent } from "./claude.js";
import type { ContentToBackgroundMessage, AnalyzeParagraphResponse, StoredSettings } from "./types.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Detect AI installed.");
});

chrome.runtime.onMessage.addListener(
  (message: ContentToBackgroundMessage, _sender, sendResponse) => {
    if (message.type === "ANALYZE_PARAGRAPH") {
      handleAnalyzeParagraph(message.text).then(sendResponse);
      return true; // keep message channel open for async response
    }
  }
);

async function handleAnalyzeParagraph(text: string): Promise<AnalyzeParagraphResponse> {
  // TODO: load API key from chrome.storage.local
  // TODO: call detectAIContent(text, apiKey)
  // TODO: return { success: true, result } or { success: false, error }
  throw new Error("Not implemented");
}
