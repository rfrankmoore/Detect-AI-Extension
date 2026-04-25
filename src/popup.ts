// Popup script — toggles paragraph highlighting on the active tab

import type { ActivateDetectionMessage, DeactivateDetectionMessage } from "./types.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-btn") as HTMLButtonElement;
  const noKeyWarning = document.getElementById("no-key-warning") as HTMLDivElement;
  const optionsLink = document.getElementById("options-link") as HTMLAnchorElement;
  const openOptionsLink = document.getElementById("open-options") as HTMLAnchorElement;

  // TODO: read active state from chrome.storage.session (or a tab-keyed store)
  //       and reflect it in toggleBtn.classList ("active") on open

  toggleBtn.addEventListener("click", async () => {
    // TODO: check that an API key exists in chrome.storage.local;
    //       if missing, show noKeyWarning and return early

    // TODO: read current active state, then send either ActivateDetectionMessage
    //       or DeactivateDetectionMessage to the content script on the active tab
    //       via chrome.tabs.sendMessage, and toggle the button's "active" class
  });

  optionsLink.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  openOptionsLink?.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
