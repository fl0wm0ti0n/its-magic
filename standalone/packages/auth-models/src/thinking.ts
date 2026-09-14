import type { ThinkingLevel, ThinkingLevelMap } from "./types.ts";
import { THINKING_LEVELS } from "./types.ts";

export function clampThinkingLevel(
	requested: ThinkingLevel,
	map: ThinkingLevelMap | undefined,
): { level: ThinkingLevel; thinkingClamped: boolean; thinkingForced?: boolean } {
	if (!map) {
		return { level: requested, thinkingClamped: false };
	}
	if (requested === "off" && map.off == null) {
		const fallback = firstSupported(map) ?? "medium";
		return { level: fallback, thinkingClamped: false, thinkingForced: true };
	}
	if (isSupported(map, requested)) {
		return { level: requested, thinkingClamped: false };
	}
	const idx = THINKING_LEVELS.indexOf(requested);
	for (let i = idx - 1; i >= 0; i -= 1) {
		const candidate = THINKING_LEVELS[i];
		if (isSupported(map, candidate)) {
			return { level: candidate, thinkingClamped: true };
		}
	}
	for (let i = idx + 1; i < THINKING_LEVELS.length; i += 1) {
		const candidate = THINKING_LEVELS[i];
		if (isSupported(map, candidate)) {
			return { level: candidate, thinkingClamped: true };
		}
	}
	return { level: requested, thinkingClamped: true };
}

function isSupported(map: ThinkingLevelMap, level: ThinkingLevel): boolean {
	return map[level] === true;
}

function firstSupported(map: ThinkingLevelMap): ThinkingLevel | undefined {
	for (const level of THINKING_LEVELS) {
		if (isSupported(map, level)) {
			return level;
		}
	}
	return undefined;
}
