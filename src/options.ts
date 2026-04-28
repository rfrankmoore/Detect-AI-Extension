import type {StoredSettings} from "./types.js";

document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("api-key") as HTMLInputElement;
    const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;
    const statusEl = document.getElementById("status") as HTMLElement;

    chrome.storage.local.get("detectAiSettings")
        .then(({"detectAiSettings": settings}) => {
            apiKeyInput.value = settings.claudeApiKey;
        });

    saveBtn.addEventListener("click", async () => {
        if (!apiKeyInput.value) {
            statusEl.textContent = "Please enter a valid API key.";
            return;
        }

        const settings: StoredSettings = {
            claudeApiKey: apiKeyInput.value?.trim(),
        };

        await chrome.storage.local.set({"detectAiSettings": settings});
        statusEl.textContent = "Settings stored successfully.";
    });
});
