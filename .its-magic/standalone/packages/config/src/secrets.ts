const SECRET_PATTERNS = [
	/(api[_-]?key|secret|password|token|passwd)\s*[:=]/i,
	/\b(sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-)/i,
	/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
	/bearer\s+[A-Za-z0-9\-._~+/]+=*/i,
];

const HANDLE_KEYS = new Set(["secret_name", "credential_handle"]);
export const HANDLE_RE = /^[A-Za-z][A-Za-z0-9_.-]*$/;

export function looksLikeSecret(value: string): boolean {
	const text = value || "";
	return SECRET_PATTERNS.some((p) => {
		p.lastIndex = 0;
		return p.test(text);
	});
}

export function isHandleKey(key: string): boolean {
	return HANDLE_KEYS.has(key);
}

export function isAllowedHandle(value: string): boolean {
	return HANDLE_RE.test(value) && !looksLikeSecret(value);
}

/** Reject secret-shaped values; allow names/handles only. */
export function rejectSecretShaped(key: string, value: string): boolean {
	if (isHandleKey(key)) {
		return !isAllowedHandle(value);
	}
	return looksLikeSecret(value);
}
