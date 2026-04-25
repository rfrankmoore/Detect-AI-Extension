// Options page — save and load the Claude API key via chrome.storage.local

import type { StoredSettings } from "./types.js";

document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("api-key") as HTMLInputElement;
  const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;
  const statusEl = document.getElementById("status") as HTMLElement;

  // TODO: load existing key from chrome.storage.local and populate apiKeyInput

  saveBtn.addEventListener("click", () => {
    // TODO: validate input, save to chrome.storage.local, update statusEl
  });
});
