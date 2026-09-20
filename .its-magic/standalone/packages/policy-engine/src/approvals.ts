export function approvalKey(roleId: string, tool: string, action: string, path?: string): string {
	return [roleId, tool, action, path ?? ""].join(":");
}

export class ApprovalStore {
	private readonly mem = new Set<string>();

	has(key: string): boolean {
		return this.mem.has(key);
	}

	grant(key: string): void {
		this.mem.add(key);
	}

	hasAny(keys: string[] | undefined): boolean {
		if (!keys || keys.length === 0) {
			return false;
		}
		return keys.some((k) => this.mem.has(k) || keys.includes(k));
	}
}

export function hasApproval(approvals: string[] | undefined, key: string): boolean {
	if (!approvals || approvals.length === 0) {
		return false;
	}
	return approvals.includes(key) || approvals.includes("*");
}
