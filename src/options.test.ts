const mockGet = jest.fn();
const mockSet = jest.fn();

(global as any).chrome = {
    storage: {
        local: {
            get: mockGet,
            set: mockSet,
        },
    },
};

const flushPromises = () => new Promise<void>(resolve => setTimeout(resolve, 0));

describe("options page", () => {
    let apiKeyInput: HTMLInputElement;
    let saveBtn: HTMLButtonElement;
    let statusEl: HTMLElement;

    beforeAll(async () => {
        document.body.innerHTML = `
      <input id="api-key" type="text" />
      <button id="save-btn">Save</button>
      <span id="status"></span>
    `;

        mockGet.mockResolvedValue({
            "detectAiSettings": {claudeApiKey: "existing-key"},
        });

        await import("./options.js");
        document.dispatchEvent(new Event("DOMContentLoaded"));
        await flushPromises();

        apiKeyInput = document.getElementById("api-key") as HTMLInputElement;
        saveBtn = document.getElementById("save-btn") as HTMLButtonElement;
        statusEl = document.getElementById("status") as HTMLElement;
    });

    beforeEach(() => {
        mockSet.mockReset();
        mockSet.mockResolvedValue(undefined);
        statusEl.textContent = "";
    });

    it("populates the API key input with the stored value on load", () => {
        expect(apiKeyInput.value).toBe("existing-key");
    });

    it("shows an error message when saving with an empty API key", async () => {
        apiKeyInput.value = "";

        saveBtn.click();
        await flushPromises();

        expect(statusEl.textContent).toBe("Please enter a valid API key.");
    });

    it("does not save to storage when the API key is empty", async () => {
        apiKeyInput.value = "";

        saveBtn.click();
        await flushPromises();

        expect(mockSet).not.toHaveBeenCalled();
    });

    it("saves settings to chrome.storage.local when a valid API key is provided", async () => {
        apiKeyInput.value = "new-key";

        saveBtn.click();
        await flushPromises();

        expect(mockSet).toHaveBeenCalledWith({
            "detectAiSettings": {claudeApiKey: "new-key"},
        });
    });

    it("shows a success message after saving", async () => {
        apiKeyInput.value = "new-key";

        saveBtn.click();
        await flushPromises();

        expect(statusEl.textContent).toBe("Settings stored successfully.");
    });

    it("trims whitespace from the API key before saving", async () => {
        apiKeyInput.value = "  padded-key  ";

        saveBtn.click();
        await flushPromises();
        
        expect(mockSet).toHaveBeenCalledWith({
            "detectAiSettings": {claudeApiKey: "padded-key"},
        });
    });
});