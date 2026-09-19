export const CONFIG_SCHEMA_UNSUPPORTED = "CONFIG_SCHEMA_UNSUPPORTED";
export const CONFIG_INVALID = "CONFIG_INVALID";
export const CONFIG_UNKNOWN_KEY = "CONFIG_UNKNOWN_KEY";
export const CONFIG_KEY_SHADOWED = "CONFIG_KEY_SHADOWED";
export const CONFIG_UNSAFE_RELAXATION = "CONFIG_UNSAFE_RELAXATION";
export const CONFIG_LEGACY_INVALID = "CONFIG_LEGACY_INVALID";
export const CONFIG_MIGRATION_HINT = "CONFIG_MIGRATION_HINT";
export const CONFIG_SECRET_REJECTED = "CONFIG_SECRET_REJECTED";

export const CONFIG_CODES = [
	CONFIG_SCHEMA_UNSUPPORTED,
	CONFIG_INVALID,
	CONFIG_UNKNOWN_KEY,
	CONFIG_KEY_SHADOWED,
	CONFIG_UNSAFE_RELAXATION,
	CONFIG_LEGACY_INVALID,
	CONFIG_MIGRATION_HINT,
	CONFIG_SECRET_REJECTED,
] as const;

export type ConfigCode = (typeof CONFIG_CODES)[number];

export class ConfigError extends Error {
	readonly code: string;

	constructor(code: string, message?: string) {
		super(message ?? code);
		this.name = "ConfigError";
		this.code = code;
	}
}
