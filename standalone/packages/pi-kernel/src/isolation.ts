import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	DefaultResourceLoader,
	type ResourceLoader,
	SettingsManager,
} from "@earendil-works/pi-coding-agent";
import { type IsolationMode, PI_COMPAT_RESOURCES_ENV } from "./types.ts";

export interface IsolationDirs {
	root: string;
	cwd: string;
	agentDir: string;
}

export function resolveIsolationMode(
	explicit?: IsolationMode,
	env: NodeJS.ProcessEnv = process.env,
): IsolationMode {
	if (explicit) {
		return explicit;
	}
	const raw = (env[PI_COMPAT_RESOURCES_ENV] ?? "off").trim().toLowerCase();
	if (raw === "trusted") {
		return "trusted";
	}
	return "off";
}

export function createIsolationDirs(): IsolationDirs {
	const root = mkdtempSync(join(tmpdir(), "itsm-pi-iso-"));
	const cwd = join(root, "cwd");
	const agentDir = join(root, "agent");
	mkdirSync(cwd);
	mkdirSync(agentDir);
	return { root, cwd, agentDir };
}

/**
 * Production isolation loader (DEC-0133 §5).
 * Empty overrides; no additionalExtensionPaths / extensionFactories.
 * cwd/agentDir are runtime-owned empty dirs — not ~/.pi/agent and not the target project.
 * US-0133 still uses this empty loader when isolationMode is `trusted` (US-0137 owns enablement).
 */
export function createEmptyResourceLoader(dirs: IsolationDirs): ResourceLoader {
	const settingsManager = SettingsManager.inMemory({
		compaction: { enabled: false },
		retry: { enabled: false },
	});
	const loader = new DefaultResourceLoader({
		cwd: dirs.cwd,
		agentDir: dirs.agentDir,
		settingsManager,
		agentsFilesOverride: () => ({ agentsFiles: [] }),
		skillsOverride: () => ({ skills: [], diagnostics: [] }),
		promptsOverride: () => ({ prompts: [], diagnostics: [] }),
		themesOverride: () => ({ themes: [], diagnostics: [] }),
		extensionsOverride: (base) => ({
			extensions: [],
			errors: [],
			runtime: base.runtime,
		}),
	});
	return loader;
}

export interface LoaderSnapshot {
	extensionCount: number;
	agentsFileCount: number;
	skillCount: number;
	promptCount: number;
}

export function snapshotLoader(loader: ResourceLoader): LoaderSnapshot {
	const extensions = loader.getExtensions();
	const agents = loader.getAgentsFiles();
	const skills = loader.getSkills();
	const prompts = loader.getPrompts();
	const extensionList = Array.isArray(extensions) ? extensions : (extensions.extensions ?? []);
	const skillList = Array.isArray(skills) ? skills : (skills.skills ?? []);
	const promptList = Array.isArray(prompts) ? prompts : (prompts.prompts ?? []);
	return {
		extensionCount: extensionList.length,
		agentsFileCount: agents.agentsFiles.length,
		skillCount: skillList.length,
		promptCount: promptList.length,
	};
}
