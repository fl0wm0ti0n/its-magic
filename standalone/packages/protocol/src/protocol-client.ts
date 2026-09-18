import { redactEventPayload } from "./redact.ts";

export interface JsonRpcRequest {
	jsonrpc: "2.0";
	id: string | number;
	method: string;
	params?: Record<string, unknown>;
}

export interface JsonRpcError {
	code: number;
	message: string;
	data?: { reason_code?: string; [key: string]: unknown };
}

export interface JsonRpcResponse<T = unknown> {
	jsonrpc: "2.0";
	id: string | number | null;
	result?: T;
	error?: JsonRpcError;
}

export function buildJsonRpcRequest(
	id: string | number,
	method: string,
	params?: Record<string, unknown>,
): JsonRpcRequest {
	return { jsonrpc: "2.0", id, method, params };
}

export async function jsonRpcCall<T>(
	baseUrl: string,
	token: string,
	method: string,
	params?: Record<string, unknown>,
): Promise<T> {
	const body = buildJsonRpcRequest(crypto.randomUUID(), method, params);
	const res = await fetch(`${baseUrl.replace(/\/$/, "")}/rpc`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		throw new Error(`json_rpc_http_${res.status}`);
	}
	const parsed = (await res.json()) as JsonRpcResponse<T>;
	if (parsed.error) {
		const reason = parsed.error.data?.reason_code ?? parsed.error.message;
		const err = new Error(parsed.error.message) as Error & { reason_code?: string };
		err.reason_code = typeof reason === "string" ? reason : parsed.error.data?.reason_code;
		throw err;
	}
	return redactEventPayload(parsed.result) as T;
}
