import { hasApproval } from "./approvals.ts";
import {
	AUTO_ORCHESTRATOR_PHASE_EXECUTION,
	POLICY_ASK_UNAPPROVED,
	POLICY_CLOSURE_RELEASE_WRITE,
	POLICY_CURATOR_INTENT_REWRITE,
	POLICY_DEFAULT_DENY,
	POLICY_PO_PRODUCTION_WRITE,
	POLICY_QA_SILENT_FIX,
	POLICY_RAW_PI_TOOL_DENIED,
	POLICY_RELEASE_CLOSURE_WRITE,
	POLICY_STUB_TOOL_DENIED,
	SESSION_ORCHESTRATOR_TOOLS_DENIED,
} from "./errors.ts";
import {
	canonicalizeAgainstWorktree,
	denySecretOrTraversal,
	isCuratorIntentPath,
	isProductionSourcePath,
	isReleaseArtifactPath,
} from "./paths.ts";
import { evaluateIsolation } from "./profiles.ts";
import { classifyShell } from "./shell.ts";
import {
	ITSM_NAME_RE,
	LIVE_INTEL_TOOLS,
	LIVE_WRITE_TOOLS,
	type PolicyRequest,
	type PolicyResult,
	PROMOTED_LIVE_TOOLS,
	RAW_PI_TOOL_NAMES,
	STUB_TOOLS,
} from "./types.ts";

const RAW_PI = new Set<string>(RAW_PI_TOOL_NAMES);
const PROMOTED = new Set<string>(PROMOTED_LIVE_TOOLS);
const STUBS = new Set<string>(STUB_TOOLS.filter((name) => !PROMOTED.has(name)));
const INTEL = new Set<string>(LIVE_INTEL_TOOLS);
const WRITES = new Set<string>(LIVE_WRITE_TOOLS);
const WRITE_ACTIONS = new Set(["write", "edit", "patch", "create", "delete", "append"]);

function isWrite(req: PolicyRequest): boolean {
	if (WRITES.has(req.tool)) {
		return true;
	}
	return WRITE_ACTIONS.has(req.action);
}

function finalizeAsk(req: PolicyRequest, result: PolicyResult): PolicyResult {
	if (result.decision !== "ASK") {
		return result;
	}
	if (req.security_class === "security_hard") {
		return { decision: "DENY", reason_code: result.reason_code ?? POLICY_ASK_UNAPPROVED };
	}
	const key = `${req.role_id}:${req.tool}:${req.action}`;
	if (hasApproval(req.approvals, key) || hasApproval(req.approvals, "*")) {
		return { decision: "ALLOW" };
	}
	return { decision: "DENY", reason_code: result.reason_code ?? POLICY_ASK_UNAPPROVED };
}

function pathMatrix(req: PolicyRequest): PolicyResult | null {
	if (!isWrite(req)) {
		return null;
	}
	for (const raw of req.paths ?? []) {
		const canon = canonicalizeAgainstWorktree(raw, req.worktree_root, req.cwd);
		if (!canon.ok) {
			return { decision: "DENY", reason_code: canon.reason_code };
		}
		const abs = canon.abs;
		if (req.role_id === "po" && isProductionSourcePath(abs, req.worktree_root)) {
			return { decision: "DENY", reason_code: POLICY_PO_PRODUCTION_WRITE };
		}
		if (
			req.role_id === "qa" &&
			isProductionSourcePath(abs, req.worktree_root) &&
			(req.phase_id === "qa" || req.phase_id === "verify-work" || req.phase_id === "plan-verify")
		) {
			return { decision: "DENY", reason_code: POLICY_QA_SILENT_FIX };
		}
		if (
			req.role_id === "release" &&
			(isProductionSourcePath(abs, req.worktree_root) ||
				req.action === "mark-done" ||
				req.action === "closure-write")
		) {
			return { decision: "DENY", reason_code: POLICY_RELEASE_CLOSURE_WRITE };
		}
		if (req.role_id === "qe" && isReleaseArtifactPath(abs, req.worktree_root)) {
			return { decision: "DENY", reason_code: POLICY_CLOSURE_RELEASE_WRITE };
		}
		if (req.role_id === "curator" && isCuratorIntentPath(abs, req.worktree_root)) {
			return { decision: "DENY", reason_code: POLICY_CURATOR_INTENT_REWRITE };
		}
	}
	if (req.role_id === "release" && (req.action === "mark-done" || req.action === "closure-write")) {
		return { decision: "DENY", reason_code: POLICY_RELEASE_CLOSURE_WRITE };
	}
	if (req.role_id === "orchestrator") {
		return { decision: "DENY", reason_code: AUTO_ORCHESTRATOR_PHASE_EXECUTION };
	}
	return null;
}

export class PolicyEngine {
	evaluate(req: PolicyRequest): PolicyResult {
		const iso = evaluateIsolation(req.isolation_profile, req.backend);
		if (iso) {
			return iso;
		}

		if (req.role_id === "orchestrator") {
			if (isWrite(req) || (req.paths && req.paths.length > 0)) {
				return { decision: "DENY", reason_code: AUTO_ORCHESTRATOR_PHASE_EXECUTION };
			}
			return { decision: "DENY", reason_code: SESSION_ORCHESTRATOR_TOOLS_DENIED };
		}

		if (RAW_PI.has(req.tool) || !ITSM_NAME_RE.test(req.tool)) {
			return { decision: "DENY", reason_code: POLICY_RAW_PI_TOOL_DENIED };
		}

		if (STUBS.has(req.tool)) {
			return { decision: "DENY", reason_code: POLICY_STUB_TOOL_DENIED };
		}

		const secretOrTrav = denySecretOrTraversal(req.paths, req.worktree_root, req.cwd);
		if (secretOrTrav) {
			return secretOrTrav;
		}

		const matrix = pathMatrix(req);
		if (matrix) {
			return matrix;
		}

		if (req.tool === "itsm_shell" || req.command?.trim()) {
			const classified = classifyShell(req.command ?? "", {
				autonomy: req.autonomy,
				security_class: req.security_class,
			});
			if (classified.deny) {
				return finalizeAsk(req, { ...classified.deny, shell_class: classified.cls });
			}
		}

		if (PROMOTED.has(req.tool)) {
			if (req.role_id !== "qa") {
				return { decision: "DENY", reason_code: POLICY_DEFAULT_DENY };
			}
			return { decision: "ALLOW" };
		}

		const readOk =
			req.tool === "itsm_read" ||
			INTEL.has(req.tool) ||
			req.action === "read" ||
			req.action === "list";
		const writeRole = req.role_id === "dev" || req.role_id === "tech-lead";
		if (readOk && !isWrite(req)) {
			return { decision: "ALLOW" };
		}
		if (writeRole && isWrite(req)) {
			if (req.permission_mode === "ask-on-write") {
				return finalizeAsk(req, { decision: "ASK", reason_code: POLICY_ASK_UNAPPROVED });
			}
			return { decision: "ALLOW" };
		}

		return { decision: "DENY", reason_code: POLICY_DEFAULT_DENY };
	}
}

export function createPolicyEngine(): PolicyEngine {
	return new PolicyEngine();
}
