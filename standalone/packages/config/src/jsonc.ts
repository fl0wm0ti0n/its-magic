/** Strip JSONC line comments and block comments without touching strings. */
export function stripJsonc(text: string): string {
	const out: string[] = [];
	let i = 0;
	const n = text.length;
	let inString = false;
	let escaped = false;
	while (i < n) {
		const ch = text[i] as string;
		if (inString) {
			out.push(ch);
			if (escaped) {
				escaped = false;
			} else if (ch === "\\") {
				escaped = true;
			} else if (ch === '"') {
				inString = false;
			}
			i += 1;
			continue;
		}
		if (ch === '"') {
			inString = true;
			out.push(ch);
			i += 1;
			continue;
		}
		if (ch === "/" && i + 1 < n) {
			const nxt = text[i + 1] as string;
			if (nxt === "/") {
				i += 2;
				while (i < n && text[i] !== "\n" && text[i] !== "\r") {
					i += 1;
				}
				continue;
			}
			if (nxt === "*") {
				i += 2;
				while (i + 1 < n && !(text[i] === "*" && text[i + 1] === "/")) {
					out.push(text[i] === "\n" || text[i] === "\r" ? (text[i] as string) : " ");
					i += 1;
				}
				i += 2;
				continue;
			}
		}
		out.push(ch);
		i += 1;
	}
	return out.join("");
}

export function looksLikeYamlSot(text: string): boolean {
	const trimmed = text.trimStart();
	if (trimmed.startsWith("---")) {
		return true;
	}
	if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
		return false;
	}
	return /^\s*\w[\w-]*:\s+\S/m.test(trimmed) && !trimmed.includes("{");
}

export function looksLikeExecutableLoader(path: string): boolean {
	return /\.(js|mjs|cjs|ts|mts|cts)$/i.test(path);
}
