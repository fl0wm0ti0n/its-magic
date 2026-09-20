import { existsSync, lstatSync, realpathSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { POLICY_SECRET_PATH_DENIED, POLICY_TRAVERSAL_DENIED } from "./errors.ts";
import type { PolicyResult } from "./types.ts";

const WINDOWS_DEVICE = /^\\\\[?.]\\/;
const UNC = /^\\\\[^\\]/;

function posixify(p: string): string {
	return p.replace(/\\/g, "/");
}

export function isSecretPath(raw: string): boolean {
	const norm = posixify(raw).toLowerCase();
	const base = norm.split("/").filter(Boolean).pop() ?? "";
	if (base === ".env" || base.startsWith(".env.")) {
		return true;
	}
	if (base.endsWith(".pem")) {
		return true;
	}
	if (base === "credentials.json" || base === "auth.json" || base === ".netrc") {
		return true;
	}
	if (
		base === "id_rsa" ||
		base === "id_ed25519" ||
		base.endsWith("_rsa") ||
		base.endsWith(".ppk")
	) {
		return true;
	}
	if (
		norm.includes("/.ssh/") ||
		norm.endsWith("/.ssh") ||
		norm.includes("/.aws/") ||
		norm.includes("/.gnupg/")
	) {
		return true;
	}
	return false;
}

export function looksLikeEscape(raw: string): boolean {
	const trimmed = raw.trim();
	if (WINDOWS_DEVICE.test(trimmed) || UNC.test(trimmed)) {
		return true;
	}
	if (trimmed.startsWith("\\\\?\\") || trimmed.startsWith("\\\\.\\")) {
		return true;
	}
	const posix = posixify(trimmed);
	if (posix === "/etc" || posix.startsWith("/etc/")) {
		return true;
	}
	if (/^[a-z]:\/windows\//i.test(posix) || posix.toLowerCase().includes("/windows/system32")) {
		return true;
	}
	return false;
}

export function canonicalizeAgainstWorktree(
	raw: string,
	worktreeRoot: string,
	cwd: string,
): { ok: true; abs: string } | { ok: false; reason_code: string } {
	if (looksLikeEscape(raw)) {
		return { ok: false, reason_code: POLICY_TRAVERSAL_DENIED };
	}
	const base = cwd && cwd.length > 0 ? cwd : worktreeRoot;
	const resolved = resolve(base, raw);
	let abs = resolved;
	try {
		if (existsSync(resolved)) {
			abs = realpathSync(resolved);
			if (lstatSync(resolved).isSymbolicLink()) {
				const target = realpathSync(resolved);
				const relLink = relative(resolve(worktreeRoot), target);
				if (relLink.startsWith("..") || isAbsolute(relLink)) {
					return { ok: false, reason_code: POLICY_TRAVERSAL_DENIED };
				}
			}
		} else {
			const parent = resolve(resolved, "..");
			if (existsSync(parent)) {
				const parentReal = realpathSync(parent);
				abs = resolve(parentReal, resolved.split(sep).pop() as string);
			}
		}
	} catch {
		return { ok: false, reason_code: POLICY_TRAVERSAL_DENIED };
	}
	const root = resolve(worktreeRoot);
	const rel = relative(root, abs);
	if (rel.startsWith("..") || isAbsolute(rel)) {
		return { ok: false, reason_code: POLICY_TRAVERSAL_DENIED };
	}
	if (rel.split(/[/\\]/).includes("..")) {
		return { ok: false, reason_code: POLICY_TRAVERSAL_DENIED };
	}
	return { ok: true, abs };
}

export function denySecretOrTraversal(
	paths: string[] | undefined,
	worktreeRoot: string,
	cwd: string,
): PolicyResult | null {
	for (const raw of paths ?? []) {
		if (isSecretPath(raw)) {
			return { decision: "DENY", reason_code: POLICY_SECRET_PATH_DENIED };
		}
		const canon = canonicalizeAgainstWorktree(raw, worktreeRoot, cwd);
		if (!canon.ok) {
			return { decision: "DENY", reason_code: canon.reason_code };
		}
		if (isSecretPath(canon.abs)) {
			return { decision: "DENY", reason_code: POLICY_SECRET_PATH_DENIED };
		}
	}
	return null;
}

export function isProductionSourcePath(abs: string, worktreeRoot: string): boolean {
	const rel = posixify(relative(resolve(worktreeRoot), abs)).toLowerCase();
	if (rel.startsWith("src/") || rel === "src") {
		return true;
	}
	if (rel.startsWith("standalone/packages/")) {
		if (rel.includes("/docs/") || rel.endsWith("/docs") || /\/readme(\.md)?$/.test(rel)) {
			return false;
		}
		return true;
	}
	return false;
}

export function isCuratorIntentPath(abs: string, worktreeRoot: string): boolean {
	const rel = posixify(relative(resolve(worktreeRoot), abs)).replace(/\\/g, "/");
	if (rel === "docs/product/vision.md" || rel.endsWith("/docs/product/vision.md")) {
		return true;
	}
	if (rel === "docs/product/backlog.md" || rel.endsWith("/docs/product/backlog.md")) {
		return true;
	}
	if (rel === "docs/product/acceptance.md" || rel.endsWith("/docs/product/acceptance.md")) {
		return true;
	}
	return false;
}

export function isReleaseArtifactPath(abs: string, worktreeRoot: string): boolean {
	const rel = posixify(relative(resolve(worktreeRoot), abs)).toLowerCase();
	return (
		rel.startsWith("docs/release/") ||
		rel.includes("release-notes") ||
		rel.startsWith("dist/") ||
		rel === "CHANGELOG.md".toLowerCase()
	);
}

/** US-0145 parallel worktree root (gitignored). */
export function isParallelDevWorktreePath(abs: string, worktreeRoot: string): boolean {
	const rel = posixify(relative(resolve(worktreeRoot), abs)).replace(/\\/g, "/");
	return rel.startsWith(".its-magic/worktrees/") || rel.includes("/.its-magic/worktrees/");
}
