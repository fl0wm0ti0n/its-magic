import {
	RELEASE_ARTIFACTS_MISSING,
	RELEASE_PREMATURE,
	RELEASE_QA_MISSING,
	RELEASE_TESTS_FAILED,
	RELEASE_UAT_FAILED,
} from "../../stop-matrix/codes.ts";

export const RELEASE_GATE_ORDER = [
	"check_in_tests",
	"independent_qa",
	"uat_evidence",
	"release_artifacts",
	"fail_closed_reason",
] as const;

export type ReleaseGateStep = (typeof RELEASE_GATE_ORDER)[number];

export type ReleaseGateCode =
	| typeof RELEASE_TESTS_FAILED
	| typeof RELEASE_QA_MISSING
	| typeof RELEASE_UAT_FAILED
	| typeof RELEASE_ARTIFACTS_MISSING
	| typeof RELEASE_PREMATURE;

export interface ReleaseGateInput {
	tests_pass: boolean;
	qa_evidence: boolean;
	uat_pass: boolean;
	artifact_refs: readonly string[];
	premature?: boolean;
}

export interface ReleaseGatePass {
	ok: true;
	step_reached: typeof RELEASE_GATE_ORDER;
}

export interface ReleaseGateFail {
	ok: false;
	code: ReleaseGateCode;
	step: ReleaseGateStep;
	step_index: number;
}

export type ReleaseGateVerdict = ReleaseGatePass | ReleaseGateFail;

export class GateEngine {
	evaluate(input: ReleaseGateInput): ReleaseGateVerdict {
		if (!input.tests_pass) {
			return fail(RELEASE_TESTS_FAILED, "check_in_tests", 0);
		}
		if (!input.qa_evidence) {
			return fail(RELEASE_QA_MISSING, "independent_qa", 1);
		}
		if (!input.uat_pass) {
			return fail(RELEASE_UAT_FAILED, "uat_evidence", 2);
		}
		if (input.artifact_refs.length === 0) {
			return fail(RELEASE_ARTIFACTS_MISSING, "release_artifacts", 3);
		}
		if (input.premature) {
			return fail(RELEASE_PREMATURE, "fail_closed_reason", 4);
		}
		return { ok: true, step_reached: RELEASE_GATE_ORDER };
	}
}

function fail(code: ReleaseGateCode, step: ReleaseGateStep, step_index: number): ReleaseGateFail {
	return { ok: false, code, step, step_index };
}

export function createGateEngine(): GateEngine {
	return new GateEngine();
}
