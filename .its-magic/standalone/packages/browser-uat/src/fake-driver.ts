import { isDefaultChromeUserDataDir } from "./cdp-adapter.ts";
import {
	BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN,
	BROWSER_CDP_UNAUTHORIZED,
	BROWSER_UNAVAILABLE,
	BrowserUatError,
} from "./codes.ts";
import type {
	BrowserDriver,
	BrowserSession,
	CdpAttachRequest,
	LaunchIsolatedRequest,
} from "./types.ts";

let seq = 0;

function nextId(prefix: string): string {
	seq += 1;
	return `${prefix}-${seq}`;
}

export class FakeBrowserDriver implements BrowserDriver {
	kind: "fake" = "fake";
	readonly launches: LaunchIsolatedRequest[] = [];
	readonly contexts: string[] = [];
	readonly closed: string[] = [];
	readonly disconnected: string[] = [];
	readonly cdpConnects: CdpAttachRequest[] = [];
	readonly pages = new Map<string, { url: string; console: string[]; failed: string[] }>();

	async launch(req: LaunchIsolatedRequest = {}): Promise<BrowserSession> {
		this.launches.push({ headless: req.headless !== false });
		return {
			id: nextId("iso"),
			backend: "isolated",
			closed: false,
			disconnected: false,
			alive: true,
			headless: req.headless !== false,
			cookiesIsolated: true,
		};
	}

	async newContext(session: BrowserSession): Promise<BrowserSession> {
		this.contexts.push(session.id);
		this.pages.set(session.id, { url: "", console: [], failed: [] });
		return { ...session, cookiesIsolated: true };
	}

	async close(session: BrowserSession): Promise<void> {
		session.closed = true;
		session.alive = false;
		this.closed.push(session.id);
	}

	async connectOverCDP(req: CdpAttachRequest): Promise<BrowserSession> {
		this.cdpConnects.push(req);
		if (!req.approved || !req.endpoint || !req.userDataDir) {
			throw new BrowserUatError(BROWSER_CDP_UNAUTHORIZED);
		}
		if (isDefaultChromeUserDataDir(req.userDataDir)) {
			throw new BrowserUatError(BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN);
		}
		const session: BrowserSession = {
			id: nextId("cdp"),
			backend: "cdp",
			closed: false,
			disconnected: false,
			alive: true,
			cookiesIsolated: false,
		};
		this.pages.set(session.id, { url: "", console: [], failed: [] });
		return session;
	}

	async disconnect(session: BrowserSession): Promise<void> {
		session.disconnected = true;
		session.alive = true;
		this.disconnected.push(session.id);
	}
}

export class UnavailableBrowserDriver implements BrowserDriver {
	kind: "unavailable" = "unavailable";

	async launch(): Promise<BrowserSession> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}
	async newContext(): Promise<BrowserSession> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}
	async close(): Promise<void> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}
	async connectOverCDP(): Promise<BrowserSession> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}
	async disconnect(): Promise<void> {
		throw new BrowserUatError(BROWSER_UNAVAILABLE);
	}
}
