import {
	BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN,
	BROWSER_CDP_UNAUTHORIZED,
	BROWSER_UNAVAILABLE,
	BrowserUatError,
} from "./codes.ts";
import type { BrowserDriver, BrowserSession, CdpAttachRequest } from "./types.ts";

const DEFAULT_PROFILE_NEEDLES = [
	"/google/chrome/user data",
	"/google/chrome/userdata",
	"/google-chrome/user data",
	"library/application support/google/chrome",
	"/.config/google-chrome",
];

export function isDefaultChromeUserDataDir(userDataDir: string): boolean {
	const n = userDataDir.replace(/\\/g, "/").toLowerCase();
	if (n.includes("dedicated") || n.includes("its-magic") || n.includes("debug-profile")) {
		return false;
	}
	return DEFAULT_PROFILE_NEEDLES.some((needle) => n.includes(needle));
}

export function assertCdpAuthorized(req: CdpAttachRequest): void {
	if (!req.approved || !req.endpoint || !req.userDataDir) {
		throw new BrowserUatError(BROWSER_CDP_UNAUTHORIZED);
	}
	if (isDefaultChromeUserDataDir(req.userDataDir)) {
		throw new BrowserUatError(BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN);
	}
}

type ChromiumApi = {
	launch: (opts: { headless?: boolean }) => Promise<{
		newContext: () => Promise<{ close: () => Promise<void> }>;
		close: () => Promise<void>;
	}>;
	connectOverCDP: (endpoint: string) => Promise<{
		disconnect: () => void;
		close: () => Promise<void>;
	}>;
};

export async function loadChromium(): Promise<ChromiumApi | null> {
	if (process.env.ITSM_BROWSER_LIVE !== "1") {
		return null;
	}
	for (const name of ["playwright", "playwright-core"]) {
		try {
			const mod = (await import(name)) as { chromium?: ChromiumApi };
			if (mod.chromium) {
				return mod.chromium;
			}
		} catch {
			/* try next module name */
		}
	}
	return null;
}

const LIVE = new Map<
	string,
	{ close?: () => Promise<void>; disconnect?: () => void; newContext?: () => Promise<unknown> }
>();

export class PlaywrightCdpAdapter implements BrowserDriver {
	kind: "playwright" | "unavailable" = "playwright";

	async launch(): Promise<BrowserSession> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}
	async newContext(): Promise<BrowserSession> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}
	async close(): Promise<void> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}

	async connectOverCDP(req: CdpAttachRequest): Promise<BrowserSession> {
		assertCdpAuthorized(req);
		const chromium = await loadChromium();
		if (!chromium) {
			this.kind = "unavailable";
			throw new BrowserUatError(BROWSER_UNAVAILABLE);
		}
		const browser = await chromium.connectOverCDP(req.endpoint as string);
		const session: BrowserSession = {
			id: `cdp-${Date.now()}`,
			backend: "cdp",
			closed: false,
			disconnected: false,
			alive: true,
			cookiesIsolated: false,
		};
		LIVE.set(session.id, browser);
		return session;
	}

	async disconnect(session: BrowserSession): Promise<void> {
		const live = LIVE.get(session.id);
		if (live?.disconnect) {
			live.disconnect();
		}
		session.disconnected = true;
		session.alive = true;
		session.closed = false;
	}
}
