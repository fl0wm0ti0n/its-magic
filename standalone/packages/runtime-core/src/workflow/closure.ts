import type { KernelBridge, ValidatorResult } from "@its-magic/kernel-bridge";
import { CLOSURE_RELEASE_EVIDENCE_MISSING } from "../stop-matrix/codes.ts";
import {
	createGateEngine,
	type ReleaseGateInput,
	type ReleaseGateVerdict,
} from "./gates/gate-engine.ts";
import { type ReleaseEvidence, WorkflowError } from "./types.ts";

export interface ClosureDeps {
	kernelBridge?: Pick<KernelBridge, "runValidator" | "runStatusReconcile">;
}

export interface ClosureOk {
	ok: true;
	status_written: "DONE";
	isolation_written_by: "closure";
	reconcile?: ValidatorResult;
	closure_verification?: ValidatorResult;
}

export function writeReleaseEvidence(
	input: ReleaseEvidence,
	gates: ReleaseGateInput,
): {
	evidence: ReleaseEvidence;
	marked_done: false;
	status_reconcile_called: false;
	gates: ReleaseGateVerdict;
} {
	const engine = createGateEngine();
	const verdict = engine.evaluate(gates);
	if (!verdict.ok) {
		throw new WorkflowError(verdict.code, `release gates failed: ${verdict.code}`);
	}
	return {
		evidence: { ...input, artifact_refs: [...input.artifact_refs] },
		marked_done: false,
		status_reconcile_called: false,
		gates: verdict,
	};
}

export function releaseCannotMarkDone(): { marked_done: false } {
	return { marked_done: false };
}

function envelopeValid(evidence: ReleaseEvidence | null | undefined): evidence is ReleaseEvidence {
	if (!evidence) {
		return false;
	}
	return (
		typeof evidence.release_run_id === "string" &&
		evidence.release_run_id.length > 0 &&
		evidence.tests_pass === true &&
		evidence.qa_pass === true &&
		evidence.uat_pass === true &&
		Array.isArray(evidence.artifact_refs) &&
		evidence.artifact_refs.length > 0
	);
}

export async function applyClosure(
	evidence: ReleaseEvidence | null | undefined,
	deps: ClosureDeps = {},
): Promise<ClosureOk> {
	if (!envelopeValid(evidence)) {
		throw new WorkflowError(
			CLOSURE_RELEASE_EVIDENCE_MISSING,
			"closure requires a valid release-evidence envelope",
		);
	}
	let closure_verification: ValidatorResult | undefined;
	let reconcile: ValidatorResult | undefined;
	if (deps.kernelBridge) {
		closure_verification = await deps.kernelBridge.runValidator("validate_closure_verification");
		if (!closure_verification.pass) {
			throw new WorkflowError(
				closure_verification.reasonCode ?? "CLOSURE_VERIFICATION_FAILED",
				"validate_closure_verification failed",
			);
		}
		reconcile = await deps.kernelBridge.runStatusReconcile();
		if (!reconcile.pass) {
			throw new WorkflowError(
				reconcile.reasonCode ?? "STATUS_RECONCILE_FAILED",
				"status-reconcile failed",
			);
		}
	}
	return {
		ok: true,
		status_written: "DONE",
		isolation_written_by: "closure",
		reconcile,
		closure_verification,
	};
}
