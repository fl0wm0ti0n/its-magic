import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import type { CodeIntelligenceProvider, IntelResult } from "@its-magic/code-intelligence";
import {
	computePolicyHash,
	createPolicyEngine,
	DEFAULT_POLICY_SNAPSHOT,
	LIVE_INTEL_TOOLS,
	LIVE_TOOLS,
	POLICY_STUB_TOOL_DENIED,
	type PolicyEngine,
	type PolicyRequest,
	sha256Canonical,
} from "@its-magic/policy-engine";
import { createDefaultRoleCatalog } from "@its-magic/role-runtime";
import { AuditLog } from "./audit.ts";
import { isLiveIntelTool, isStubTool, toolNamesForRole } from "./catalog.ts";
import type { BrokerContext, BrowserToolPort, OwnedToolDefinition } from "./types.ts";

function paramPath(params: unknown): string | undefined {
	if (!params || typeof params !== "object") {
		return undefined;
	}
	const rec = params as Record<string, unknown>;
	if (typeof rec.path === "string") {
		return rec.path;
	}
	if (Array.isArray(rec.paths) && typeof rec.paths[0] === "string") {
		return rec.paths[0];
	}
	return undefined;
}

function paramCommand(params: unknown): string | undefined {
	if (!params || typeof params !== "object") {
		return undefined;
	}
	const rec = params as Record<string, unknown>;
	if (typeof rec.command === "string") {
		return rec.command;
	}
	if (typeof rec.cmd === "string") {
		return rec.cmd;
	}
	return undefined;
}

function paramQuery(params: unknown): string {
	if (!params || typeof params !== "object") {
		return "";
	}
	const rec = params as Record<string, unknown>;
	if (typeof rec.query === "string") {
		return rec.query;
	}
	if (typeof rec.symbol === "string") {
		return rec.symbol;
	}
	if (typeof rec.name === "string") {
		return rec.name;
	}
	if (typeof rec.path === "string") {
		return rec.path;
	}
	return "";
}

function requestFor(ctx: BrokerContext, tool: string, params: unknown): PolicyRequest {
	const path = paramPath(params);
	const intel = isLiveIntelTool(tool);
	return {
		role_id: ctx.role_id,
		phase_id: ctx.phase_id,
		work_item_id: ctx.work_item_id,
		sprint_id: ctx.sprint_id,
		worktree_root: ctx.worktree_root,
		cwd: ctx.cwd,
		paths: path ? [path] : undefined,
		command: paramCommand(params),
		backend: ctx.backend,
		autonomy: ctx.autonomy ?? "supervised",
		permission_mode: ctx.permission_mode ?? "default-deny",
		security_class: ctx.security_class ?? "standard",
		approvals: ctx.approvals,
		isolation_profile: ctx.isolation_profile ?? "trusted-local",
		tool,
		action: intel
			? "read"
			: typeof params === "object" &&
					params !== null &&
					typeof (params as Record<string, unknown>).action === "string"
				? String((params as Record<string, unknown>).action)
				: tool.replace(/^itsm_/, ""),
	};
}

function deniedResult(reason: string): {
	content: Array<{ type: string; text: string }>;
	details: object;
} {
	return {
		content: [{ type: "text", text: reason }],
		details: { denied: true, reason_code: reason },
	};
}

function intelPayload(result: IntelResult): {
	content: Array<{ type: string; text: string }>;
	details: object;
} {
	return {
		content: [{ type: "text", text: JSON.stringify(result) }],
		details: {
			tool: "intel",
			policy: "ALLOW",
			reason_codes: result.reason_codes,
			partial: result.partial,
			hit_count: result.hits.length,
		},
	};
}

function executeIntel(
	provider: CodeIntelligenceProvider | undefined,
	tool: string,
	params: unknown,
): IntelResult {
	if (!provider) {
		return { hits: [], reason_codes: ["INTEL_INDEX_UNAVAILABLE"], partial: true };
	}
	const q = paramQuery(params);
	const path = paramPath(params) ?? q;
	switch (tool) {
		case "itsm_search":
			return provider.search(q);
		case "itsm_outline":
			return provider.outline(path);
		case "itsm_symbol":
			return provider.symbol(q);
		case "itsm_references":
			return provider.references(q);
		case "itsm_callers":
			return provider.callers(q);
		case "itsm_impact":
			return provider.impact(q);
		default:
			return { hits: [], reason_codes: ["INTEL_INDEX_UNAVAILABLE"], partial: true };
	}
}

async function readWorktreeFile(ctx: BrokerContext, params: unknown) {
	const path = paramPath(params);
	if (!path) {
		return deniedResult("TOOL_PATH_REQUIRED");
	}
	const target = resolve(ctx.worktree_root, path);
	const escaped = relative(ctx.worktree_root, target);
	if (escaped.startsWith("..") || isAbsolute(escaped)) {
		return deniedResult("POLICY_PATH_OUTSIDE_WORKTREE");
	}
	try {
		const text = await readFile(target, "utf8");
		return {
			content: [{ type: "text", text }],
			details: { tool: "itsm_read", policy: "ALLOW", path },
		};
	} catch {
		return deniedResult("TOOL_READ_FAILED");
	}
}

function wrapExecute(
	engine: PolicyEngine,
	audit: AuditLog,
	ctx: BrokerContext,
	tool: string,
	live: boolean,
	intel?: CodeIntelligenceProvider,
	browser?: BrowserToolPort,
): OwnedToolDefinition["execute"] {
	return async (_toolCallId, params) => {
		const started = Date.now();
		const policy = engine.evaluate(requestFor(ctx, tool, params));
		const duration = Date.now() - started;
		audit.append({
			run_id: ctx.run_id,
			phase_id: ctx.phase_id,
			kernel_session_id: ctx.kernel_session_id,
			tool,
			action: tool.replace(/^itsm_/, ""),
			decision: policy.decision,
			duration_ms: duration,
			result: policy.decision === "ALLOW" ? "ok" : "denied",
			reason_code: policy.reason_code,
			evidence_ref: ctx.run_id,
		});
		if (policy.decision !== "ALLOW") {
			return deniedResult(policy.reason_code ?? "POLICY_DEFAULT_DENY");
		}
		if (tool === "itsm_browser") {
			if (!browser) {
				return deniedResult("BROWSER_UNAVAILABLE");
			}
			return browser.invoke(params);
		}
		if (isLiveIntelTool(tool)) {
			return intelPayload(executeIntel(intel, tool, params));
		}
		if (tool === "itsm_read") {
			return readWorktreeFile(ctx, params);
		}
		if (!live || isStubTool(tool)) {
			return deniedResult(POLICY_STUB_TOOL_DENIED);
		}
		return deniedResult("TOOL_EXECUTION_UNAVAILABLE");
	};
}

const LABELS: Record<string, { label: string; description: string }> = {
	itsm_read: { label: "Read", description: "Read a file inside the worktree after policy." },
	itsm_edit: { label: "Edit", description: "Edit a file inside the worktree after policy." },
	itsm_write: { label: "Write", description: "Write a file inside the worktree after policy." },
	itsm_patch: { label: "Patch", description: "Patch a file inside the worktree after policy." },
	itsm_shell: { label: "Shell", description: "Run a classified local command after policy." },
	itsm_git: { label: "Git", description: "Run a classified git command after policy." },
	itsm_search: { label: "Search", description: "Lexical and semantic code search." },
	itsm_outline: { label: "Outline", description: "File outline from the intelligence provider." },
	itsm_symbol: { label: "Symbol", description: "Look up a symbol." },
	itsm_references: { label: "References", description: "Find references to a symbol." },
	itsm_callers: { label: "Callers", description: "Find callers of a symbol." },
	itsm_impact: { label: "Impact", description: "Impact analysis for a symbol." },
	itsm_browser: {
		label: "Browser",
		description: "Typed browser UAT actions (snapshot is a11y/DOM, not pixel).",
	},
};

export class ToolBroker {
	readonly engine: PolicyEngine;
	readonly audit: AuditLog;
	readonly intel?: CodeIntelligenceProvider;
	readonly browser?: BrowserToolPort;

	constructor(
		engine?: PolicyEngine,
		audit?: AuditLog,
		intel?: CodeIntelligenceProvider,
		browser?: BrowserToolPort,
	) {
		this.engine = engine ?? createPolicyEngine();
		this.audit = audit ?? new AuditLog();
		this.intel = intel;
		this.browser = browser;
	}

	toolNamesForRole(roleId: string): string[] {
		return toolNamesForRole(roleId);
	}

	spawnAllowlist(roleId: string): string[] {
		return toolNamesForRole(roleId);
	}

	roleCatalogDigest(): string {
		return sha256Canonical(createDefaultRoleCatalog());
	}

	policyHash(roleId: string): string {
		return computePolicyHash({
			policy_snapshot: DEFAULT_POLICY_SNAPSHOT,
			tool_allowlist: this.toolNamesForRole(roleId),
			role_catalog_digest: this.roleCatalogDigest(),
		});
	}

	ownedToolsFor(ctx: BrokerContext): OwnedToolDefinition[] {
		const names = this.toolNamesForRole(ctx.role_id);
		return names.map((name) => {
			const meta = LABELS[name] ?? { label: name, description: `${name} (stub or live)` };
			const live =
				(LIVE_TOOLS as readonly string[]).includes(name) ||
				(LIVE_INTEL_TOOLS as readonly string[]).includes(name) ||
				name === "itsm_browser";
			return {
				name,
				label: meta.label,
				description: meta.description,
				parameters: {
					type: "object",
					properties: {
						path: { type: "string" },
						command: { type: "string" },
						query: { type: "string" },
						symbol: { type: "string" },
						action: { type: "string" },
					},
				},
				execute: wrapExecute(this.engine, this.audit, ctx, name, live, this.intel, this.browser),
			};
		});
	}
}

export function createToolBroker(
	intel?: CodeIntelligenceProvider,
	browser?: BrowserToolPort,
): ToolBroker {
	return new ToolBroker(undefined, undefined, intel, browser);
}
