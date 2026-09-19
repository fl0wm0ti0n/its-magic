import {
	POLICY_GIT_FORCE_DENIED,
	POLICY_PACKAGE_DENIED,
	POLICY_SHELL_DESTRUCTIVE_DENIED,
	POLICY_SHELL_EXFIL_DENIED,
	POLICY_SHELL_PRIVILEGED_DENIED,
	POLICY_SHELL_UNPARSEABLE,
} from "./errors.ts";
import type { Autonomy, PolicyResult, SecurityClass, ShellClass } from "./types.ts";

const UNPARSEABLE = /\$\(|`[^`]*`|<\(|>\(|\$\{|&&|\|\||;\s*(bash|sh|powershell|pwsh|cmd)\b/i;

export interface ShellClassification {
	cls: ShellClass;
	tokens: string[];
	deny?: PolicyResult;
}

function tokenize(command: string): string[] | null {
	const trimmed = command.trim();
	if (!trimmed) {
		return [];
	}
	if (
		UNPARSEABLE.test(trimmed) &&
		!/^(git|npm|npx|node|python|pytest|tsc|biome)\b/i.test(trimmed)
	) {
		if (/\$\(|`|<\(/.test(trimmed)) {
			return null;
		}
	}
	if (/\$\(|`[^`]*`|<\(/.test(trimmed)) {
		return null;
	}
	const tokens: string[] = [];
	const re = /(?:"([^"]*)"|'([^']*)'|[^\s]+)/g;
	let match: RegExpExecArray | null = re.exec(trimmed);
	while (match) {
		tokens.push(match[1] ?? match[2] ?? match[0]);
		match = re.exec(trimmed);
	}
	return tokens;
}

function unwrapWrapper(tokens: string[]): string[] {
	if (tokens.length === 0) {
		return tokens;
	}
	const first = tokens[0]?.toLowerCase() ?? "";
	const base = first.replace(/\.exe$/i, "");
	if (base === "powershell" || base === "pwsh") {
		const cmdIdx = tokens.findIndex((t) => /^(-c|-command)$/i.test(t));
		if (cmdIdx >= 0) {
			return tokens.slice(cmdIdx + 1);
		}
		return tokens.slice(1);
	}
	if (base === "cmd") {
		const cmdIdx = tokens.findIndex((t) => /^\/c$/i.test(t));
		if (cmdIdx >= 0) {
			return tokens.slice(cmdIdx + 1);
		}
		return tokens.slice(1);
	}
	return tokens;
}

function deny(code: string): PolicyResult {
	return { decision: "DENY", reason_code: code };
}

export function classifyShell(
	command: string,
	opts: { autonomy: Autonomy; security_class: SecurityClass } = {
		autonomy: "supervised",
		security_class: "standard",
	},
): ShellClassification {
	if (/\$\(|`[^`]*`|<\(/.test(command)) {
		return { cls: "privileged", tokens: [], deny: deny(POLICY_SHELL_UNPARSEABLE) };
	}
	const rawTokens = tokenize(command);
	if (rawTokens === null) {
		return { cls: "privileged", tokens: [], deny: deny(POLICY_SHELL_UNPARSEABLE) };
	}
	const tokens = unwrapWrapper(rawTokens);
	const joined = tokens.join(" ");
	const lower = joined.toLowerCase();
	const head = (tokens[0] ?? "").toLowerCase().replace(/\.exe$/i, "");

	if (
		/\bprintenv\b/i.test(joined) ||
		/get-childitem\s+env:/i.test(joined) ||
		/\b(type|cat|get-content)\s+[^\n]*\.env\b/i.test(joined) ||
		/\b(type|cat|get-content)\s+[^\n]*\.ssh\b/i.test(joined) ||
		/\b(curl|wget|invoke-webrequest)\b/i.test(joined)
	) {
		return { cls: "network-deploy", tokens, deny: deny(POLICY_SHELL_EXFIL_DENIED) };
	}

	if (head === "sudo" || head === "runas" || /set-executionpolicy\s+unrestricted/i.test(joined)) {
		return { cls: "privileged", tokens, deny: deny(POLICY_SHELL_PRIVILEGED_DENIED) };
	}

	if (
		/\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b/i.test(joined) ||
		/remove-item\s+[^\n]*-recurse/i.test(joined) ||
		/\b(format|mkfs)\b/i.test(head)
	) {
		return { cls: "destructive-fs", tokens, deny: deny(POLICY_SHELL_DESTRUCTIVE_DENIED) };
	}

	if (/\bnpm\s+publish\b/i.test(lower) || /\bnpm\s+install\s+-g\b/i.test(lower)) {
		if (opts.security_class === "security_hard" || opts.autonomy === "autonomous") {
			return { cls: "package-install", tokens, deny: deny(POLICY_PACKAGE_DENIED) };
		}
		return {
			cls: "package-install",
			tokens,
			deny: { decision: "ASK", reason_code: POLICY_PACKAGE_DENIED },
		};
	}

	if (
		/\bgit\s+push\s+[^\n]*--force\b/i.test(lower) ||
		/\bgit\s+reset\s+[^\n]*--hard\b/i.test(lower)
	) {
		return { cls: "git-mutation", tokens, deny: deny(POLICY_GIT_FORCE_DENIED) };
	}

	if (head === "git") {
		return { cls: "git-mutation", tokens };
	}
	if (head === "npm" || head === "npx" || head === "pnpm" || head === "yarn") {
		return { cls: "package-install", tokens };
	}
	if (
		head === "pytest" ||
		head === "node" ||
		head === "tsc" ||
		head === "biome" ||
		head === "python" ||
		/\bnpm\s+test\b/i.test(lower)
	) {
		return { cls: "build-test", tokens };
	}
	if (head === "curl" || head === "wget" || head === "invoke-webrequest") {
		return { cls: "network-deploy", tokens, deny: deny(POLICY_SHELL_EXFIL_DENIED) };
	}
	if (
		head === "ls" ||
		head === "dir" ||
		head === "cat" ||
		head === "type" ||
		head === "get-content"
	) {
		return { cls: "safe-read", tokens };
	}
	return { cls: "local-process", tokens };
}
