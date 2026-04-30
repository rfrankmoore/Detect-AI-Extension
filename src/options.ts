import storage from "./storage";
import type {Settings} from "./types.js";

document.addEventListener("DOMContentLoaded", async () => {
    const apiKeyInput = document.getElementById("api-key") as HTMLInputElement;
    const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;
    const statusEl = document.getElementById("status") as HTMLElement;

    const settings = await storage.getSettings();
    apiKeyInput.value = settings.claudeApiKey;

    saveBtn.addEventListener("click", async () => {
        if (!apiKeyInput.value) {
            statusEl.textContent = "Please enter a valid API key.";
            return;
        }

        const settings: Settings = {
            claudeApiKey: apiKeyInput.value?.trim(),
        };
        await storage.storeSettings(settings);

        statusEl.textContent = "Settings stored successfully.";
    });
});
