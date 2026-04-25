// Content script — highlights paragraphs and runs AI detection on demand

import type {
  PopupToContentMessage,
  AnalyzeParagraphMessage,
  AnalyzeParagraphResponse,
} from "./types.js";

let detectionActive = false;

chrome.runtime.onMessage.addListener((message: PopupToContentMessage) => {
  if (message.type === "ACTIVATE_DETECTION") {
    activateDetection();
  } else if (message.type === "DEACTIVATE_DETECTION") {
    deactivateDetection();
  }
});

function activateDetection(): void {
  detectionActive = true;
  injectStyles();
  highlightParagraphs();
}

function deactivateDetection(): void {
  detectionActive = false;
  removeHighlights();
}

function injectStyles(): void {
  // TODO: check if styles are already injected to avoid duplicates
  // TODO: append a <style> element to document.head with CSS for:
  //   .detectai-paragraph       — border + relative positioning
  //   .detectai-analyze-btn     — small "Analyze" button anchored to paragraph corner
  //   .detectai-result-badge    — result overlay shown after analysis
  //   .detectai-result-ai       — red tint when AI-generated
  //   .detectai-result-human    — green tint when human-written
}

function highlightParagraphs(): void {
  // TODO: query all <p> elements (and optionally <article>, <section> blocks)
  // TODO: skip paragraphs that are too short to be meaningful
  // TODO: for each paragraph, wrap or annotate with .detectai-paragraph class
  //       and append an "Analyze" button (.detectai-analyze-btn)
  // TODO: attach click listener on each button → calls analyzeParagraph(p)
}

function removeHighlights(): void {
  // TODO: remove all .detectai-paragraph wrappers/classes, buttons, and result badges
}

async function analyzeParagraph(paragraph: HTMLElement, button: HTMLElement): Promise<void> {
  // TODO: set button to loading state
  // TODO: extract paragraph.innerText
  // TODO: send ANALYZE_PARAGRAPH message to background via chrome.runtime.sendMessage
  // TODO: receive AnalyzeParagraphResponse and call displayResult(paragraph, result)
  // TODO: restore button state (or hide it after result is shown)
}

function displayResult(paragraph: HTMLElement, response: AnalyzeParagraphResponse): void {
  // TODO: if response.success is false, show an error indicator on the paragraph
  // TODO: if success, create a result badge showing:
  //   - "AI Generated" or "Human Written"
  //   - confidence percentage
  //   - expandable explanation text
  // TODO: apply .detectai-result-ai or .detectai-result-human class to paragraph
}
