import { denySecretOrTraversal } from "@its-magic/policy-engine";
import { BROWSER_CREDENTIAL_FORBIDDEN, BrowserUatError, UAT_PROBE_FORBIDDEN } from "./codes.ts";

const ENV_PATH = /(^|[\\/])\.env(\.|$|[\\/])/i;
const STORAGE_STATE = /storageState|storage-state/i;

export function credentialReason(params: {
	path?: string;
	text?: string;
	value?: string;
	worktree_root?: string;
	cwd?: string;
}): string | null {
	const path = (params.path ?? "").replace(/\\/g, "/");
	const blob = `${params.text ?? ""} ${params.value ?? ""} ${path}`.toLowerCase();
	if (path.includes(".env") || blob.includes(".env")) {
		return UAT_PROBE_FORBIDDEN;
	}
	if (STORAGE_STATE.test(path) && /cookie/i.test(blob)) {
		return BROWSER_CREDENTIAL_FORBIDDEN;
	}
	if (path && params.worktree_root) {
		const denied = denySecretOrTraversal(
			[path],
			params.worktree_root,
			params.cwd ?? params.worktree_root,
		);
		if (denied) {
			return UAT_PROBE_FORBIDDEN;
		}
	}
	if (
		(blob.includes("password") || blob.includes("credential")) &&
		(path.includes("src/") ||
			path.includes("docs/") ||
			path.includes("secret") ||
			ENV_PATH.test(path))
	) {
		return BROWSER_CREDENTIAL_FORBIDDEN;
	}
	return null;
}

export function assertNoProjectCredentialRead(params: {
	path?: string;
	text?: string;
	value?: string;
	worktree_root?: string;
	cwd?: string;
}): void {
	const reason = credentialReason(params);
	if (reason) {
		throw new BrowserUatError(reason);
	}
}
