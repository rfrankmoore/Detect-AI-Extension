import type {ActivateDetectionMessage, DeactivateDetectionMessage} from "./types.js";
import storage from "./storage";

document.addEventListener("DOMContentLoaded", async () => {
    const toggleBtn = document.getElementById("toggle-btn") as HTMLButtonElement;
    const noKeyWarning = document.getElementById("no-key-warning") as HTMLDivElement;
    const optionsLink = document.getElementById("options-link") as HTMLAnchorElement;
    const openOptionsLink = document.getElementById("open-options") as HTMLAnchorElement;

    const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
    const tabId = activeTab?.id;
    const sessionKey = `detectai-active-${tabId}`;

    // Read per-tab active state from session storage and reflect in button class.
    if (tabId !== undefined) {
        const sessionData = await chrome.storage.session.get(sessionKey);
        if (sessionData[sessionKey]) {
            toggleBtn.classList.add("active");
        }
    }

    toggleBtn.addEventListener("click", async () => {
        const settings = await storage.getSettings();
        if (!settings.claudeApiKey) {
            noKeyWarning.style.display = "block";
            return;
        }

        if (tabId === undefined) return;

        const sessionData = await chrome.storage.session.get(sessionKey);
        const isActive = !!sessionData[sessionKey];

        if (isActive) {
            const message: DeactivateDetectionMessage = {type: "DEACTIVATE_DETECTION"};
            await chrome.tabs.sendMessage(tabId, message);
            await chrome.storage.session.set({[sessionKey]: false});
            toggleBtn.classList.remove("active");
        } else {
            const message: ActivateDetectionMessage = {type: "ACTIVATE_DETECTION"};
            await chrome.tabs.sendMessage(tabId, message);
            await chrome.storage.session.set({[sessionKey]: true});
            toggleBtn.classList.add("active");
        }
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
