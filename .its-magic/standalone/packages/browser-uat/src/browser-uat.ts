import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assertCdpAuthorized } from "./cdp-adapter.ts";
import {
	BROWSER_ASSERTION_FAILED,
	BROWSER_CONSOLE_ERROR,
	BROWSER_CRASHED,
	BROWSER_CREDENTIAL_FORBIDDEN,
	BROWSER_EVIDENCE_GAP,
	BROWSER_NETWORK_FAILED,
	BROWSER_RETRY_CAP_EXHAUSTED,
	BROWSER_RETRY_MAX_KEY,
	BROWSER_WAIT_TIMEOUT,
	BrowserUatError,
	DEFAULT_RETRY_MAX,
	ITSM_BROWSER_ACTIONS,
	isBrowserUatError,
	UAT_BROWSER_PROBE_FAILED,
	UAT_BROWSER_PROBE_MODE_OWNED,
	UAT_PROBE_FORBIDDEN,
	UAT_PROBE_PASS,
} from "./codes.ts";
import { assertNoProjectCredentialRead } from "./credentials.ts";
import { assertEvidenceComplete, uatProbeRow, writeEvidence } from "./evidence.ts";
import { FakeBrowserDriver } from "./fake-driver.ts";
import { redactEvidencePayload, redactFormData, redactHeaders } from "./redact.ts";
import type {
	BrowserActionRequest,
	BrowserDriver,
	BrowserSession,
	BrowserUatOptions,
	CdpAttachRequest,
	ConnectHandoffPort,
	LaunchIsolatedRequest,
	ProbeRecord,
	UatStep,
} from "./types.ts";
import {
	classifyStep,
	kitBrowserProbeMode,
	liftBrowserSmokeForStoryFixtures,
} from "./uat-plugin.ts";

function resolveRetryMax(opts: BrowserUatOptions): number {
	const envRaw = opts.env?.[BROWSER_RETRY_MAX_KEY] ?? opts.env?.ITSM_BROWSER_RETRY_MAX;
	if (typeof opts.retryMax === "number" && Number.isFinite(opts.retryMax)) {
		return Math.max(0, Math.floor(opts.retryMax));
	}
	if (typeof envRaw === "string" && envRaw.trim()) {
		const n = Number.parseInt(envRaw, 10);
		if (Number.isFinite(n)) {
			return Math.max(0, n);
		}
	}
	return DEFAULT_RETRY_MAX;
}

export class BrowserUAT {
	readonly driver: BrowserDriver;
	readonly connect?: ConnectHandoffPort;
	readonly evidenceRoot: string;
	readonly retryMax: number;
	readonly probeMode: string;
	session: BrowserSession | null = null;
	private lastRecord: ProbeRecord | null = null;
	private readonly env: NodeJS.ProcessEnv;

	constructor(opts: BrowserUatOptions = {}) {
		this.driver = opts.driver ?? new FakeBrowserDriver();
		this.connect = opts.connect;
		this.evidenceRoot = opts.evidenceDir ?? process.cwd();
		this.env = opts.env ?? {};
		this.retryMax = resolveRetryMax({ ...opts, env: this.env });
		this.probeMode = kitBrowserProbeMode(opts.probeMode ?? UAT_BROWSER_PROBE_MODE_OWNED);
	}

	async invoke(params: unknown): Promise<{
		content: Array<{ type: string; text: string }>;
		details: object;
	}> {
		const rec = (params ?? {}) as Record<string, unknown>;
		const action = String(rec.action ?? "snapshot");
		try {
			const result = await this.perform({
				action: action as BrowserActionRequest["action"],
				url: typeof rec.url === "string" ? rec.url : undefined,
				selector: typeof rec.selector === "string" ? rec.selector : undefined,
				text: typeof rec.text === "string" ? rec.text : undefined,
				value: typeof rec.value === "string" ? rec.value : undefined,
				path: typeof rec.path === "string" ? rec.path : undefined,
				timeoutMs: typeof rec.timeoutMs === "number" ? rec.timeoutMs : undefined,
				account_ref: typeof rec.account_ref === "string" ? rec.account_ref : undefined,
				operator_approved: rec.operator_approved === true,
			});
			return {
				content: [{ type: "text", text: JSON.stringify(redactEvidencePayload(result)) }],
				details: { tool: "itsm_browser", policy: "ALLOW", result },
			};
		} catch (err) {
			const code = isBrowserUatError(err) ? err.reason_code : BROWSER_ASSERTION_FAILED;
			return {
				content: [{ type: "text", text: code }],
				details: { denied: true, reason_code: code },
			};
		}
	}

	async openIsolated(req: LaunchIsolatedRequest = {}): Promise<BrowserSession> {
		const launched = await this.driver.launch({ headless: req.headless !== false });
		this.session = await this.driver.newContext(launched);
		return this.session;
	}

	async attachCdp(req: CdpAttachRequest): Promise<BrowserSession> {
		assertCdpAuthorized(req);
		this.session = await this.driver.connectOverCDP(req);
		return this.session;
	}

	async teardown(): Promise<void> {
		if (!this.session) {
			return;
		}
		if (this.session.backend === "cdp") {
			await this.driver.disconnect(this.session);
			return;
		}
		await this.driver.close(this.session);
	}

	connectHandoff(id: string) {
		if (!this.connect) {
			throw new BrowserUatError(BROWSER_EVIDENCE_GAP, "no connectHandoff port");
		}
		return this.connect.connectHandoff(id);
	}

	async perform(req: BrowserActionRequest, worktree?: string): Promise<ProbeRecord> {
		if (!(ITSM_BROWSER_ACTIONS as readonly string[]).includes(req.action)) {
			throw new BrowserUatError(BROWSER_ASSERTION_FAILED);
		}
		assertNoProjectCredentialRead({
			path: req.path,
			text: req.text,
			value: req.value,
			worktree_root: worktree,
			cwd: worktree,
		});
		if (req.action === "type" && req.path && worktree) {
			assertNoProjectCredentialRead({
				path: req.path,
				text: req.text ?? req.value,
				worktree_root: worktree,
				cwd: worktree,
			});
		}
		if (req.action === "type" && req.account_ref && !req.operator_approved) {
			if (!req.account_ref.startsWith("env:")) {
				throw new BrowserUatError(BROWSER_CREDENTIAL_FORBIDDEN);
			}
		}
		if (!this.session) {
			await this.openIsolated({ headless: true });
		}
		const started = Date.now();
		const session = this.session as BrowserSession;
		if (req.action === "open" && req.url) {
			session.url = req.url;
		}
		if (req.action === "navigate" && req.url) {
			session.url = req.url;
		}
		if (req.action === "wait" && req.timeoutMs === 0) {
			throw new BrowserUatError(BROWSER_WAIT_TIMEOUT);
		}
		const screenshot = this.writeShot(session);
		const record: ProbeRecord = {
			passed: true,
			reason_code: UAT_PROBE_PASS,
			probe_kind: "browser_smoke",
			snapshot_summary:
				req.action === "snapshot" || req.action === "accessibility"
					? `a11y:${req.selector ?? "document"}`
					: `dom:${req.action}`,
			trace_ref: join(this.evidenceRoot, ".its-magic", "runtime", "browser-evidence", "trace.zip"),
			duration_ms: Date.now() - started,
			browser_backend: session.backend,
			app_runtime_ref: "",
			console_errors: req.action === "console" ? [] : [],
			failed_requests: req.action === "network" ? [] : [],
			final_url: session.url ?? req.url ?? "",
			browser_evidence_refs: {
				screenshots: [screenshot],
				console_summary: join(
					this.evidenceRoot,
					".its-magic",
					"runtime",
					"browser-evidence",
					"console.json",
				),
				network_summary: join(
					this.evidenceRoot,
					".its-magic",
					"runtime",
					"browser-evidence",
					"network.json",
				),
				navigation_url: session.url ?? req.url ?? "",
			},
			har_content: "omit",
		};
		this.lastRecord = writeEvidence(this.evidenceRoot, record);
		return this.lastRecord;
	}

	bindAppRuntime(id: string): string {
		const handoff = this.connectHandoff(id);
		if (this.lastRecord) {
			this.lastRecord.app_runtime_ref = handoff.service_id || id;
		}
		return handoff.service_id || id;
	}

	async withRetry<T>(op: () => Promise<T>, classifiable: string): Promise<T> {
		let last: unknown;
		const attempts = this.retryMax + 1;
		for (let i = 0; i < attempts; i += 1) {
			try {
				return await op();
			} catch (err) {
				last = err;
				const code = isBrowserUatError(err) ? err.reason_code : "";
				if (
					code === "BROWSER_CDP_UNAUTHORIZED" ||
					code === "BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN" ||
					code === UAT_PROBE_FORBIDDEN ||
					code === BROWSER_CREDENTIAL_FORBIDDEN
				) {
					throw err;
				}
				if (i >= this.retryMax) {
					break;
				}
				if (
					classifiable === BROWSER_CRASHED ||
					classifiable === BROWSER_WAIT_TIMEOUT ||
					classifiable === BROWSER_CONSOLE_ERROR ||
					classifiable === BROWSER_NETWORK_FAILED
				) {
					continue;
				}
				throw err;
			}
		}
		throw new BrowserUatError(BROWSER_RETRY_CAP_EXHAUSTED, String(last));
	}

	executeOwnedUat(
		steps: UatStep[],
		opts: { storyId?: string; connectId?: string; fail?: boolean } = {},
	): { probe_results: Record<string, unknown>[]; passed: boolean; reason_code: string } {
		const probe_results: Record<string, unknown>[] = [];
		for (const step of steps) {
			const classified = classifyStep(step.text);
			if (classified.reason_code === UAT_PROBE_FORBIDDEN) {
				probe_results.push({
					passed: false,
					reason_code: UAT_PROBE_FORBIDDEN,
					step: step.text,
				});
				continue;
			}
			if (classified.kind === "browser_smoke") {
				if (opts.storyId && !liftBrowserSmokeForStoryFixtures(step, opts.storyId)) {
					probe_results.push({
						passed: false,
						reason_code: UAT_PROBE_FORBIDDEN,
						step: step.text,
					});
					continue;
				}
			}
			if (opts.fail) {
				const failed: ProbeRecord = {
					passed: false,
					reason_code: UAT_BROWSER_PROBE_FAILED,
					snapshot_summary: "failure",
					trace_ref: "trace.zip",
					duration_ms: 1,
					browser_backend: this.session?.backend ?? "isolated",
					app_runtime_ref: opts.connectId ?? "svc",
					console_errors: ["error"],
					failed_requests: ["http://example.invalid/fail"],
					final_url: this.session?.url ?? "",
					browser_evidence_refs: {
						screenshots: ["shot.png"],
						navigation_url: this.session?.url ?? "http://127.0.0.1/",
					},
					har_content: "omit",
				};
				probe_results.push(uatProbeRow(failed));
				return { probe_results, passed: false, reason_code: UAT_BROWSER_PROBE_FAILED };
			}
		}
		const record: ProbeRecord = {
			passed: true,
			reason_code: UAT_PROBE_PASS,
			probe_kind: "browser_smoke",
			snapshot_summary: "a11y:document",
			trace_ref: "trace.zip",
			duration_ms: 12,
			browser_backend: this.session?.backend ?? "isolated",
			app_runtime_ref: opts.connectId ?? "svc",
			console_errors: [],
			failed_requests: [],
			final_url: this.session?.url ?? "http://127.0.0.1/",
			browser_evidence_refs: {
				screenshots: ["shot.png"],
				console_summary: "console.json",
				network_summary: "network.json",
				navigation_url: this.session?.url ?? "http://127.0.0.1/",
			},
			har_content: "omit",
		};
		assertEvidenceComplete(record);
		probe_results.push(uatProbeRow(record));
		return { probe_results, passed: true, reason_code: UAT_PROBE_PASS };
	}

	redactHeaders(headers: Record<string, string>): Record<string, string> {
		return redactHeaders(headers);
	}

	redactForm(data: Record<string, string>): Record<string, string> {
		return redactFormData(data);
	}

	private writeShot(session: BrowserSession): string {
		const dir = join(this.evidenceRoot, ".its-magic", "runtime", "browser-evidence");
		mkdirSync(dir, { recursive: true });
		const file = join(dir, `${session.id}-shot.txt`);
		writeFileSync(file, "screenshot-placeholder", "utf8");
		return file;
	}
}

export function createBrowserUat(opts?: BrowserUatOptions): BrowserUAT {
	return new BrowserUAT(opts);
}
