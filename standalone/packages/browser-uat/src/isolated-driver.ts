import { loadChromium } from "./cdp-adapter.ts";
import { BROWSER_UNAVAILABLE, BrowserUatError } from "./codes.ts";
import type { BrowserDriver, BrowserSession, LaunchIsolatedRequest } from "./types.ts";

const LIVE = new Map<
	string,
	{
		newContext: () => Promise<unknown>;
		close: () => Promise<void>;
	}
>();

export class PlaywrightIsolatedDriver implements BrowserDriver {
	kind: "playwright" | "unavailable" = "playwright";

	async launch(req: LaunchIsolatedRequest = {}): Promise<BrowserSession> {
		const chromium = await loadChromium();
		if (!chromium) {
			this.kind = "unavailable";
			throw new BrowserUatError(BROWSER_UNAVAILABLE);
		}
		const browser = await chromium.launch({ headless: req.headless !== false });
		const session: BrowserSession = {
			id: `iso-${Date.now()}`,
			backend: "isolated",
			closed: false,
			disconnected: false,
			alive: true,
			headless: req.headless !== false,
			cookiesIsolated: true,
		};
		LIVE.set(session.id, browser);
		return session;
	}

	async newContext(session: BrowserSession): Promise<BrowserSession> {
		const live = LIVE.get(session.id);
		if (!live) {
			throw new BrowserUatError(BROWSER_UNAVAILABLE);
		}
		await live.newContext();
		return { ...session, cookiesIsolated: true };
	}

	async close(session: BrowserSession): Promise<void> {
		const live = LIVE.get(session.id);
		if (live) {
			await live.close();
			LIVE.delete(session.id);
		}
		session.closed = true;
		session.alive = false;
	}

	async connectOverCDP(): Promise<BrowserSession> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}

	async disconnect(): Promise<void> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}
}
