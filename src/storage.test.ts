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

import storage from "./storage";
import type {Settings} from "./types";

describe("storage", () => {
    const testSettings: Settings = {claudeApiKey: "test-key"};

    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
    });

    describe("getSettings", () => {
        it("calls chrome.storage.local.get with the correct key", async () => {
            mockGet.mockResolvedValue({"detectAiSettings": testSettings});

            await storage.getSettings();

            expect(mockGet).toHaveBeenCalledWith("detectAiSettings");
        });

        it("returns the stored settings", async () => {
            mockGet.mockResolvedValue({"detectAiSettings": testSettings});

            const result = await storage.getSettings();

            expect(result).toEqual(testSettings);
        });

        it("returns undefined when no settings are stored", async () => {
            mockGet.mockResolvedValue({"detectAiSettings": undefined});

            const result = await storage.getSettings();

            expect(result).toBeUndefined();
        });
    });

    describe("storeSettings", () => {
        it("calls chrome.storage.local.set with the correct shape", async () => {
            mockSet.mockResolvedValue(undefined);

            await storage.storeSettings(testSettings);

            expect(mockSet).toHaveBeenCalledWith({"detectAiSettings": testSettings});
        });

        it("resolves when the storage write completes", async () => {
            mockSet.mockResolvedValue(undefined);

            await expect(storage.storeSettings(testSettings)).resolves.toBeUndefined();
        });
    });
});
