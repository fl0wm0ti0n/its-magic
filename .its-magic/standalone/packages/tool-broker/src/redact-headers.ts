import { containsTokenShape, redactAudit, redactSecretShaped } from "@its-magic/auth-models";

/**
 * Redact Authorization/Cookie and token-shaped values in network-shaped payloads.
 * Does not implement US-0142 browser runtime.
 */
export function redactNetworkPayload(payload: unknown): unknown {
	return redactAudit(payload);
}

export function redactBrowserHeaders(headers: Record<string, string>): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(headers)) {
		if (/^(authorization|cookie)$/i.test(key)) {
			continue;
		}
		out[key] = containsTokenShape(value) ? redactSecretShaped(value) : value;
	}
	return out;
}
