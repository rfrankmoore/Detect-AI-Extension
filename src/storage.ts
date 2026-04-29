import {Settings} from "./types";

async function getSettings(): Promise<Settings> {
    return chrome.storage.local.get("detectAiSettings")
        .then(({"detectAiSettings": settings}) => {
            return settings;
        });
}

async function storeSettings(settings: Settings): Promise<void> {
    return chrome.storage.local.set({"detectAiSettings": settings});
}

export default {
    getSettings,
    storeSettings
}