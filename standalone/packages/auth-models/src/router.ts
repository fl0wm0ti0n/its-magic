import {
	AuthModelsError,
	CROSS_MODEL_DEGRADED_MODE,
	MODEL_OVERRIDE_SLUG_UNKNOWN,
	MODEL_ROLE_SLUG_UNKNOWN,
} from "./errors.ts";
import { clampThinkingLevel } from "./thinking.ts";
import type {
	ModelResolveProvenance,
	ModelRouter,
	ModelRouterResolveInput,
	ResolveSource,
	StandaloneCatalog,
	ThinkingLevel,
} from "./types.ts";
import { CURSOR_ALIAS_SLUGS, FAKE_MODEL_SLUG } from "./types.ts";

export function parseSlug(slug: string): { provider: string; model: string } {
	const idx = slug.indexOf("/");
	if (idx <= 0 || idx === slug.length - 1) {
		throw new AuthModelsError(MODEL_OVERRIDE_SLUG_UNKNOWN, `Slug must be provider/model: ${slug}`);
	}
	return { provider: slug.slice(0, idx), model: slug.slice(idx + 1) };
}

export function normalizeSlug(slug: string): string {
	return slug.trim().toLowerCase();
}

function isCursorAlias(slug: string): boolean {
	return CURSOR_ALIAS_SLUGS.has(slug.trim().toLowerCase());
}

function knownSlugs(catalog: StandaloneCatalog, runtimeDefault: string): Set<string> | undefined {
	if (!catalog.available || catalog.available.length === 0) {
		return undefined;
	}
	return new Set([...catalog.available, runtimeDefault, FAKE_MODEL_SLUG].map(normalizeSlug));
}

function assertKnown(
	slug: string,
	known: Set<string> | undefined,
	code: string,
): { provider: string; model: string } {
	if (isCursorAlias(slug)) {
		throw new AuthModelsError(code, `Cursor aliases are not runtime slugs: ${slug}`);
	}
	const parts = parseSlug(slug);
	if (known && !known.has(normalizeSlug(slug))) {
		throw new AuthModelsError(code, `Unknown slug: ${slug}`);
	}
	return parts;
}

function entrySlug(
	value: string | { slug: string; thinking?: ThinkingLevel } | undefined,
): string | undefined {
	if (!value) {
		return undefined;
	}
	return typeof value === "string" ? value : value.slug;
}

function entryThinking(
	value: string | { slug: string; thinking?: ThinkingLevel } | undefined,
): ThinkingLevel | undefined {
	if (!value || typeof value === "string") {
		return undefined;
	}
	return value.thinking;
}

function resolveRoleKey(
	catalog: StandaloneCatalog,
	phase?: string,
	role?: string,
): { slug: string; thinking?: ThinkingLevel } | undefined {
	if (!catalog.roles) {
		return undefined;
	}
	const keys: string[] = [];
	if (phase && role) {
		keys.push(`${phase}->${role}`, `${phase}:${role}`, `${phase}/${role}`);
	}
	if (role) {
		keys.push(role);
	}
	if (phase) {
		keys.push(phase);
	}
	for (const key of keys) {
		const value = catalog.roles[key];
		const slug = entrySlug(value);
		if (slug) {
			return { slug, thinking: entryThinking(value) };
		}
	}
	return undefined;
}

function firstTier(catalog: StandaloneCatalog): string | undefined {
	const tiers = catalog.tiers;
	if (!tiers) {
		return undefined;
	}
	return tiers.balanced || tiers.cheap || tiers.strong;
}

function pickThinking(
	input: ModelRouterResolveInput,
	catalog: StandaloneCatalog,
	roleThinking?: ThinkingLevel,
	phaseThinking?: ThinkingLevel,
): ThinkingLevel {
	if (input.requestedThinking) {
		return input.requestedThinking;
	}
	if (roleThinking) {
		return roleThinking;
	}
	if (phaseThinking) {
		return phaseThinking;
	}
	if (input.role && catalog.thinking?.[input.role]) {
		return catalog.thinking[input.role];
	}
	if (input.phase && catalog.thinking?.[input.phase]) {
		return catalog.thinking[input.phase];
	}
	return "off";
}

export function resolve(input: ModelRouterResolveInput): {
	slug: string;
	thinkingLevel: ThinkingLevel;
	provenance: ModelResolveProvenance;
} {
	const runtimeDefault = input.runtimeDefaultSlug ?? FAKE_MODEL_SLUG;
	const catalog = input.catalog ?? { schema_version: 1 };
	const known = knownSlugs(catalog, runtimeDefault);
	void input.tokenProfile;

	let source: ResolveSource = "runtime-default";
	let slug = catalog.default ?? runtimeDefault;
	let unknownCode = MODEL_OVERRIDE_SLUG_UNKNOWN;
	let criticPin = false;
	let roleThinking: ThinkingLevel | undefined;
	let phaseThinking: ThinkingLevel | undefined;

	const overlay = input.criticOverlaySlug || catalog.critic?.model;
	const phaseEntry = input.phase ? catalog.phases?.[input.phase] : undefined;
	const roleEntry = resolveRoleKey(catalog, input.phase, input.role);
	const tierSlug = firstTier(catalog);

	if (input.argvSlug) {
		source = "cli";
		slug = input.argvSlug;
		unknownCode = MODEL_OVERRIDE_SLUG_UNKNOWN;
	} else if (entrySlug(phaseEntry)) {
		source = "phase-local";
		slug = entrySlug(phaseEntry) as string;
		phaseThinking = entryThinking(phaseEntry);
		unknownCode = MODEL_OVERRIDE_SLUG_UNKNOWN;
	} else if (roleEntry) {
		source = "role-catalog";
		slug = roleEntry.slug;
		roleThinking = roleEntry.thinking;
		unknownCode = MODEL_ROLE_SLUG_UNKNOWN;
	} else if (input.criticResolve && overlay) {
		source = "critic-overlay";
		slug = overlay;
		criticPin = true;
		unknownCode = MODEL_OVERRIDE_SLUG_UNKNOWN;
	} else if (tierSlug) {
		source = "tier-catalog";
		slug = tierSlug;
		unknownCode = MODEL_OVERRIDE_SLUG_UNKNOWN;
	} else {
		source = "runtime-default";
		slug = catalog.default ?? runtimeDefault;
	}

	const parts = assertKnown(slug, known, unknownCode);
	const requestedThinking = pickThinking(input, catalog, roleThinking, phaseThinking);
	const map = catalog.thinkingLevelMaps?.[slug] ?? catalog.thinkingLevelMaps?.[normalizeSlug(slug)];
	const clamped = clampThinkingLevel(requestedThinking, map);
	const producer = input.producerSlug ? normalizeSlug(input.producerSlug) : undefined;
	const degradedMode = Boolean(input.criticResolve && producer && producer === normalizeSlug(slug));
	if (input.criticResolve && overlay) {
		criticPin = true;
	}

	const provenance: ModelResolveProvenance = {
		source,
		slug,
		provider: parts.provider,
		model: parts.model,
		thinkingLevel: clamped.level,
		criticPin,
		degradedMode,
		thinkingClamped: clamped.thinkingClamped,
		...(clamped.thinkingForced ? { thinkingForced: true } : {}),
		...(degradedMode ? { degradedReason: CROSS_MODEL_DEGRADED_MODE } : {}),
	};

	return { slug, thinkingLevel: clamped.level, provenance };
}

export function createModelRouter(): ModelRouter {
	return { resolve };
}

export const modelRouter: ModelRouter = { resolve };
