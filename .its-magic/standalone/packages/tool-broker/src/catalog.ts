import { LIVE_INTEL_TOOLS, LIVE_TOOLS, STUB_TOOLS } from "@its-magic/policy-engine";

const READ_PLUS_SEARCH = ["itsm_read", ...LIVE_INTEL_TOOLS] as const;

/** Production catalog excludes itsm_ping (US-0133 kernel placeholder). */
export const PRODUCTION_LIVE_TOOLS: readonly string[] = [...LIVE_TOOLS];

export const PRODUCTION_LIVE_INTEL_TOOLS: readonly string[] = [...LIVE_INTEL_TOOLS];

export const PRODUCTION_STUB_TOOLS: readonly string[] = [...STUB_TOOLS];

const FLOOR: Record<string, readonly string[]> = {
	orchestrator: [],
	po: READ_PLUS_SEARCH,
	curator: READ_PLUS_SEARCH,
	release: READ_PLUS_SEARCH,
	qe: READ_PLUS_SEARCH,
	qa: [...READ_PLUS_SEARCH, "itsm_browser"],
	scout: READ_PLUS_SEARCH,
	security: READ_PLUS_SEARCH,
	critic: READ_PLUS_SEARCH,
	"tech-lead": PRODUCTION_LIVE_TOOLS,
	dev: PRODUCTION_LIVE_TOOLS,
};

export function toolNamesForRole(roleId: string): string[] {
	const names = FLOOR[roleId];
	if (!names) {
		return ["itsm_read"];
	}
	return [...names];
}

export function isLiveTool(name: string): boolean {
	return (
		(PRODUCTION_LIVE_TOOLS as readonly string[]).includes(name) ||
		(PRODUCTION_LIVE_INTEL_TOOLS as readonly string[]).includes(name)
	);
}

export function isStubTool(name: string): boolean {
	return (PRODUCTION_STUB_TOOLS as readonly string[]).includes(name);
}

export function isLiveIntelTool(name: string): boolean {
	return (PRODUCTION_LIVE_INTEL_TOOLS as readonly string[]).includes(name);
}

export function assertItsmOnly(names: string[]): void {
	for (const n of names) {
		if (!/^itsm_[a-z0-9_]+$/.test(n)) {
			throw new Error(`POLICY_RAW_PI_TOOL_DENIED:${n}`);
		}
	}
}
