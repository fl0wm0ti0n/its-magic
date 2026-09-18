const TOKEN_VALUE_RE = /sk-[A-Za-z0-9_-]{8,}|Bearer\s+\S+/gi;
const TOKENISH_KEY = /^(authorization|cookie|access|refresh|api[_-]?key|token|secret)$/i;

function redactString(text: string): string {
	TOKEN_VALUE_RE.lastIndex = 0;
	return text.replace(TOKEN_VALUE_RE, "[redacted]");
}

export function redactEventPayload<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map((item) => redactEventPayload(item)) as T;
	}
	if (!value || typeof value !== "object") {
		if (typeof value === "string") {
			return redactString(value) as T;
		}
		return value;
	}
	const out: Record<string, unknown> = {};
	for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
		if (TOKENISH_KEY.test(key)) {
			out[key] = "[redacted]";
			continue;
		}
		out[key] = redactEventPayload(child);
	}
	return out as T;
}
