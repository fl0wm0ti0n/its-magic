import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline";
import { OPERATOR_INPUT_REQUIRED, OPERATOR_MIN_TERMINAL_COLS } from "./types.ts";

export interface PromptChoice {
	id: string;
	label: string;
	default?: boolean;
}

export interface PromptRequest {
	message: string;
	choices: PromptChoice[];
	help?: string;
}

export interface OperatorPromptsOptions {
	interactive?: boolean;
	terminalCols?: number;
	env?: NodeJS.ProcessEnv;
	yesFlag?: boolean;
	noFlag?: boolean;
}

export class OperatorPrompts {
	private readonly interactive: boolean;
	private readonly cols: number;
	private readonly env: NodeJS.ProcessEnv;
	private readonly yesFlag: boolean;
	private readonly noFlag: boolean;

	constructor(opts: OperatorPromptsOptions = {}) {
		this.interactive = opts.interactive ?? Boolean(process.stdin.isTTY);
		this.cols = Math.max(opts.terminalCols ?? output.columns ?? 80, OPERATOR_MIN_TERMINAL_COLS);
		this.env = opts.env ?? process.env;
		this.yesFlag = opts.yesFlag ?? false;
		this.noFlag = opts.noFlag ?? false;
	}

	wrapLine(text: string): string {
		const width = Math.max(this.cols, OPERATOR_MIN_TERMINAL_COLS);
		if (text.length <= width) {
			return text;
		}
		const chunks: string[] = [];
		for (let i = 0; i < text.length; i += width) {
			chunks.push(text.slice(i, i + width));
		}
		return chunks.join("\n");
	}

	async choose(request: PromptRequest): Promise<string> {
		if (this.noFlag) {
			const reject = request.choices.find((c) => c.id === "no" || c.id === "reject");
			if (reject) {
				return reject.id;
			}
		}
		if (this.yFlagFromEnv() || this.yesFlag) {
			const accept = request.choices.find((c) => c.default || c.id === "yes" || c.id === "accept");
			if (accept) {
				return accept.id;
			}
		}
		if (!this.interactive) {
			throw new Error(OPERATOR_INPUT_REQUIRED);
		}
		const defaultChoice = request.choices.find((c) => c.default) ?? request.choices[0];
		const lines = [
			this.wrapLine(request.message),
			...request.choices.map((c, i) => `  [${i + 1}] ${c.label}${c.default ? " (default)" : ""}`),
		];
		if (request.help) {
			lines.push(this.wrapLine(`? ${request.help}`));
		}
		output.write(`${lines.join("\n")}\n> `);
		const answer = await new Promise<string>((resolve) => {
			const rl = readline.createInterface({ input, output, terminal: true });
			rl.question("", (value) => {
				rl.close();
				resolve(value.trim());
			});
		});
		if (!answer && defaultChoice) {
			return defaultChoice.id;
		}
		const byIndex = Number.parseInt(answer, 10);
		if (Number.isFinite(byIndex) && byIndex >= 1 && byIndex <= request.choices.length) {
			return request.choices[byIndex - 1].id;
		}
		const byId = request.choices.find((c) => c.id === answer);
		return byId?.id ?? defaultChoice?.id ?? request.choices[0].id;
	}

	private yFlagFromEnv(): boolean {
		const raw = this.env.ITS_MAGIC_APPROVE;
		return raw === "1" || raw === "yes" || raw === "true";
	}
}

export function createOperatorPrompts(opts?: OperatorPromptsOptions): OperatorPrompts {
	return new OperatorPrompts(opts);
}
