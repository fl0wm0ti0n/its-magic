import { ISOLATION_BACKEND_UNAVAILABLE } from "./errors.ts";
import type { IsolationProfile, PolicyResult } from "./types.ts";

const LAYER_B_PROFILES = new Set<IsolationProfile>([
	"isolated-development",
	"untrusted-repository",
]);

export function needsLayerBBackend(profile: IsolationProfile): boolean {
	return LAYER_B_PROFILES.has(profile);
}

export function hasLayerBBackend(backend: string | undefined): boolean {
	if (!backend) {
		return false;
	}
	const n = backend.trim().toLowerCase();
	if (!n || n === "none" || n === "in-process" || n === "missing") {
		return false;
	}
	return true;
}

/** Layer A records the profile. Missing Layer B (US-0141) fails closed. Not an OS sandbox. */
export function evaluateIsolation(
	profile: IsolationProfile,
	backend: string | undefined,
): PolicyResult | null {
	if (needsLayerBBackend(profile) && !hasLayerBBackend(backend)) {
		return {
			decision: "DENY",
			reason_code: ISOLATION_BACKEND_UNAVAILABLE,
			isolation_profile: profile,
			backend,
		};
	}
	return null;
}
