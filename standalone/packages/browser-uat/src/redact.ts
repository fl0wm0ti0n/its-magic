import { redactAudit, redactSecretShaped } from "@its-magic/auth-models";

const SENSITIVE_HEADER = /^(authorization|cookie|set-cookie|x-api-key|x-auth-token)$/i;
const SENSITIVE_FORM = /^(password|passwd|secret|token|credential|otp)$/i;

export function redactHeaders(headers: Record<string, string>): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(headers)) {
		if (SENSITIVE_HEADER.test(key)) {
			out[key] = "[redacted]";
			continue;
		}
		out[key] = redactSecretShaped(value);
	}
	return out;
}

export function redactFormData(data: Record<string, string>): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(data)) {
		if (SENSITIVE_FORM.test(key)) {
			out[key] = "[redacted]";
			continue;
		}
		out[key] = redactSecretShaped(value);
	}
	return out;
}

export function redactEvidencePayload(payload: unknown): unknown {
	if (!payload || typeof payload !== "object") {
		return typeof payload === "string" ? redactSecretShaped(payload) : payload;
	}
	if (Array.isArray(payload)) {
		return payload.map(redactEvidencePayload);
	}
	const rec = payload as Record<string, unknown>;
	const out: Record<string, unknown> = {};
	for (const [key, child] of Object.entries(rec)) {
		if (SENSITIVE_HEADER.test(key) || SENSITIVE_FORM.test(key)) {
			out[key] = "[redacted]";
			continue;
		}
		out[key] = redactEvidencePayload(child);
	}
	return redactAudit(out);
}
