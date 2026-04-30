const mockTabsQuery = jest.fn();
const mockTabsSendMessage = jest.fn();
const mockSessionGet = jest.fn();
const mockSessionSet = jest.fn();
const mockOpenOptionsPage = jest.fn();

(global as any).chrome = {
    tabs: {
        query: mockTabsQuery,
        sendMessage: mockTabsSendMessage,
    },
    storage: {
        session: {
            get: mockSessionGet,
            set: mockSessionSet,
        },
    },
    runtime: {
        openOptionsPage: mockOpenOptionsPage,
    },
};

import storage from "./storage";

jest.mock("./storage", () => ({
    __esModule: true,
    default: {
        getSettings: jest.fn(),
    },
}));

const TAB_ID = 42;
const SESSION_KEY = `detectai-active-${TAB_ID}`;
const flushPromises = () => new Promise<void>(resolve => setTimeout(resolve, 0));

describe("popup", () => {
    let toggleBtn: HTMLButtonElement;
    let noKeyWarning: HTMLDivElement;
    let optionsLink: HTMLAnchorElement;
    let openOptionsLink: HTMLAnchorElement;

    beforeAll(async () => {
        document.body.innerHTML = `
            <button id="toggle-btn"></button>
            <div id="no-key-warning" style="display:none"></div>
            <a id="options-link" href="#"></a>
            <a id="open-options" href="#"></a>
        `;

        mockTabsQuery.mockResolvedValue([{id: TAB_ID}]);
        mockSessionGet.mockResolvedValue({[SESSION_KEY]: false});
        mockSessionSet.mockResolvedValue(undefined);
        mockTabsSendMessage.mockResolvedValue(undefined);
        (storage.getSettings as jest.Mock).mockResolvedValue({claudeApiKey: "test-key"});

        await import("./popup.js");
        document.dispatchEvent(new Event("DOMContentLoaded"));
        await flushPromises();

        toggleBtn = document.getElementById("toggle-btn") as HTMLButtonElement;
        noKeyWarning = document.getElementById("no-key-warning") as HTMLDivElement;
        optionsLink = document.getElementById("options-link") as HTMLAnchorElement;
        openOptionsLink = document.getElementById("open-options") as HTMLAnchorElement;
    });

    beforeEach(() => {
        mockSessionGet.mockReset();
        mockSessionSet.mockReset();
        mockTabsSendMessage.mockReset();
        mockOpenOptionsPage.mockReset();
        (storage.getSettings as jest.Mock).mockReset();

        mockSessionGet.mockResolvedValue({[SESSION_KEY]: false});
        mockSessionSet.mockResolvedValue(undefined);
        mockTabsSendMessage.mockResolvedValue(undefined);
        (storage.getSettings as jest.Mock).mockResolvedValue({claudeApiKey: "test-key"});

        toggleBtn.classList.remove("active");
        noKeyWarning.style.display = "none";
    });

    describe("on load", () => {
        it("queries the active tab in the current window", async () => {
            expect(mockTabsQuery).toHaveBeenCalledWith({active: true, currentWindow: true});
        });

        it("does not add the active class when the tab was inactive", () => {
            expect(toggleBtn.classList.contains("active")).toBe(false);
        });
    });

    describe("toggle button — missing API key", () => {
        beforeEach(() => {
            (storage.getSettings as jest.Mock).mockResolvedValue({claudeApiKey: ""});
        });

        it("shows the no-key warning", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(noKeyWarning.style.display).toBe("block");
        });

        it("does not send a message to the content script", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(mockTabsSendMessage).not.toHaveBeenCalled();
        });

        it("does not update session storage", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(mockSessionSet).not.toHaveBeenCalled();
        });
    });

    describe("toggle button — activating detection", () => {
        it("sends ACTIVATE_DETECTION to the content script", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(mockTabsSendMessage).toHaveBeenCalledWith(TAB_ID, {type: "ACTIVATE_DETECTION"});
        });

        it("stores active=true in session storage keyed by tab ID", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(mockSessionSet).toHaveBeenCalledWith({[SESSION_KEY]: true});
        });

        it("adds the active class to the button", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(toggleBtn.classList.contains("active")).toBe(true);
        });
    });

    describe("toggle button — deactivating detection", () => {
        beforeEach(() => {
            toggleBtn.classList.add("active");
            mockSessionGet.mockResolvedValue({[SESSION_KEY]: true});
        });

        it("sends DEACTIVATE_DETECTION to the content script", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(mockTabsSendMessage).toHaveBeenCalledWith(TAB_ID, {type: "DEACTIVATE_DETECTION"});
        });

        it("stores active=false in session storage keyed by tab ID", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(mockSessionSet).toHaveBeenCalledWith({[SESSION_KEY]: false});
        });

        it("removes the active class from the button", async () => {
            toggleBtn.click();
            await flushPromises();

            expect(toggleBtn.classList.contains("active")).toBe(false);
        });
    });

    describe("options links", () => {
        it("opens the options page when options-link is clicked", () => {
            optionsLink.click();

            expect(mockOpenOptionsPage).toHaveBeenCalledTimes(1);
        });

        it("opens the options page when open-options link is clicked", () => {
            openOptionsLink.click();

            expect(mockOpenOptionsPage).toHaveBeenCalledTimes(1);
        });
    });
});

// This describe resets the module registry and re-imports popup to test a
// different initial load state (previously active tab). It must come last so
// the extra DOMContentLoaded listener it registers does not affect the click
// tests above.
describe("popup — initially active state on load", () => {
    beforeAll(async () => {
        jest.resetModules();

        document.body.innerHTML = `
            <button id="toggle-btn"></button>
            <div id="no-key-warning" style="display:none"></div>
            <a id="options-link" href="#"></a>
            <a id="open-options" href="#"></a>
        `;

        mockTabsQuery.mockResolvedValue([{id: TAB_ID}]);
        mockSessionGet.mockResolvedValue({[SESSION_KEY]: true});

        await import("./popup.js");
        document.dispatchEvent(new Event("DOMContentLoaded"));
        await flushPromises();
    });

    it("adds the active class when the tab was previously active", () => {
        const btn = document.getElementById("toggle-btn") as HTMLButtonElement;
        expect(btn.classList.contains("active")).toBe(true);
    });
});
