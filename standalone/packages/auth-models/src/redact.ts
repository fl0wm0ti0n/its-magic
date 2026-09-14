const HEADER_KEYS = /^(authorization|cookie)$/i;
const TOKEN_VALUE_RE = /sk-[A-Za-z0-9_-]{8,}|Bearer\s+\S+/gi;
const TOKENISH_KEY = /^(authorization|cookie|access|refresh|api[_-]?key|token)$/i;

export function containsTokenShape(text: string): boolean {
	TOKEN_VALUE_RE.lastIndex = 0;
	if (TOKEN_VALUE_RE.test(text)) {
		TOKEN_VALUE_RE.lastIndex = 0;
		return true;
	}
	TOKEN_VALUE_RE.lastIndex = 0;
	return /(?:authorization|cookie)\s*[:=]\s*(?!\[redacted\])\S+/i.test(text);
}

export function redactSecretShaped(text: string): string {
	return text.replace(TOKEN_VALUE_RE, "[redacted]");
}

export function redactAudit(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(redactAudit);
	}
	if (!value || typeof value !== "object") {
		if (typeof value === "string") {
			return redactSecretShaped(value);
		}
		return value;
	}
	const out: Record<string, unknown> = {};
	for (const [key, child] of Object.entries(value)) {
		if (HEADER_KEYS.test(key) || TOKENISH_KEY.test(key)) {
			continue;
		}
		out[key] = redactAudit(child);
	}
	return out;
}

export function buildPromptAfterRefresh(audit: unknown): string {
	const safe = redactAudit(audit);
	return `refresh complete ${JSON.stringify(safe)}`;
}
