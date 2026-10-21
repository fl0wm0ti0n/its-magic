#!/usr/bin/env python3
"""Budgeted phase context packs.

Hard caps live in `.its-magic/context-budget.json`. TOKEN_PROFILE selects a
preset inside those caps. The pack hash is not a runtime proof.
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Any, Dict, Mapping, Optional, Sequence

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

from token_cost_lib import canonical_json_dumps  # noqa: E402

BUDGET_REL = ".its-magic/context-budget.json"
PACK_REL_DIR = ".its-magic/runtime/context-packs"

HARD_CAPS = {
    "initial_budget_tokens": 6000,
    "expansion_budget_tokens": 4000,
    "max_expansions": 2,
    "max_single_artifact_tokens": 3000,
}

PRESETS = {
    "lean": {
        "initial_budget_tokens": 3000,
        "expansion_budget_tokens": 2000,
        "max_expansions": 1,
        "max_single_artifact_tokens": 3000,
    },
    "balanced": dict(HARD_CAPS),
    "full": dict(HARD_CAPS),
}

READ_ORDER = ("pack", "targeted_read", "expansion")

PACK_CONTENT_KEYS = (
    "active_story_or_bug",
    "acceptance_criteria",
    "current_goal",
    "current_sprint_or_task",
    "architecture_section",
    "decisions",
    "previous_phase_handoff_delta",
    "changed_files_or_symbols",
    "open_blockers",
)

STATE_SLICE_KEYS = (
    "active_story",
    "active_phase",
    "active_sprint_or_task",
    "objective",
    "blockers",
    "next_action",
    "refs",
)

DELTA_HANDOFF_FIELDS = (
    "story",
    "from",
    "to",
    "changed",
    "open",
    "required_reads",
    "do_not_reload",
)

TYPICAL_HANDOFF_TOKEN_CAP = 400

OMITTED_SURFACES = (
    "full_backlog",
    "full_acceptance",
    "full_architecture",
    "state_history",
    "old_sprints",
    "old_handoffs",
    "state_archives",
    "token_cost_history",
    "every_decision",
    "proof_body",
    "isolation_proof",
    "token_metrics_body",
    "validator_evidence",
    "archive_verification",
)


def estimate_tokens(text: str) -> int:
    if not text:
        return 0
    return max(1, len(text) // 4)


def load_hard_caps(path: Optional[Path] = None) -> Dict[str, int]:
    data: Mapping[str, Any] = {}
    if path is not None and Path(path).is_file():
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    caps: Dict[str, int] = {}
    for key, ceiling in HARD_CAPS.items():
        raw = int(data.get(key, ceiling))
        caps[key] = min(raw, ceiling)
    return caps


def effective_budgets(token_profile: str, hard_caps: Optional[Mapping[str, int]] = None) -> Dict[str, int]:
    if token_profile not in PRESETS:
        raise ValueError(f"unknown TOKEN_PROFILE {token_profile}")
    caps = dict(hard_caps or HARD_CAPS)
    for key, ceiling in HARD_CAPS.items():
        caps[key] = min(int(caps.get(key, ceiling)), ceiling)
    preset = PRESETS[token_profile]
    return {key: min(int(preset[key]), int(caps[key])) for key in HARD_CAPS}


def read_plan(budgets: Mapping[str, int]) -> list:
    plan = ["pack", "targeted_read"]
    plan.extend(["expansion"] * int(budgets["max_expansions"]))
    return plan


def fit_section(
    text: str,
    *,
    path: str,
    section: str,
    budgets: Mapping[str, int],
) -> Dict[str, Any]:
    estimated = estimate_tokens(text)
    limit = int(budgets["max_single_artifact_tokens"])
    if estimated > limit:
        return {
            "pointer": True,
            "inline": False,
            "path": path,
            "section": section,
            "estimated_tokens": estimated,
        }
    return {
        "pointer": False,
        "inline": True,
        "path": path,
        "section": section,
        "text": text,
        "estimated_tokens": estimated,
    }


def make_delta_handoff(fields: Mapping[str, Any]) -> Dict[str, Any]:
    missing = [key for key in DELTA_HANDOFF_FIELDS if key not in fields]
    extra = [key for key in fields if key not in DELTA_HANDOFF_FIELDS]
    if missing or extra:
        raise ValueError(f"delta handoff fields missing={missing} extra={extra}")
    delta = {key: fields[key] for key in DELTA_HANDOFF_FIELDS}
    if estimate_tokens(json.dumps(delta, sort_keys=True)) > TYPICAL_HANDOFF_TOKEN_CAP:
        raise ValueError("handoff exceeds a few hundred tokens")
    return delta


def pack_hash(pack: Mapping[str, Any]) -> str:
    body = {key: value for key, value in pack.items() if key not in ("pack_hash", "pack_path")}
    payload = canonical_json_dumps(body)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _fit_content(value: Any, *, path: str, section: str, budgets: Mapping[str, int]) -> Any:
    if isinstance(value, (dict, list)):
        text = json.dumps(value, sort_keys=True)
    else:
        text = "" if value is None else str(value)
    fitted = fit_section(text, path=path, section=section, budgets=budgets)
    if fitted["pointer"]:
        return fitted
    return value


def build_context_pack(
    *,
    run_id: str,
    phase: str,
    work_item_id: str,
    sprint_id: str,
    token_profile: str = "balanced",
    model_profile: Optional[str] = None,
    role: Optional[str] = None,
    sections: Optional[Mapping[str, Any]] = None,
    evidence_refs: Optional[Mapping[str, str]] = None,
    hard_caps: Optional[Mapping[str, int]] = None,
    output_dir: Optional[Path] = None,
) -> Dict[str, Any]:
    """Build one pack. Full memory surfaces in `sections` are dropped."""
    budgets = effective_budgets(token_profile, hard_caps)
    incoming = dict(sections or {})
    for omitted in OMITTED_SURFACES:
        incoming.pop(omitted, None)
    handoff = incoming.get("previous_phase_handoff_delta")
    if isinstance(handoff, Mapping):
        handoff = make_delta_handoff(handoff)
    state_slice_in = incoming.get("state_slice") or {}
    state_slice = {key: state_slice_in.get(key) for key in STATE_SLICE_KEYS} if isinstance(state_slice_in, Mapping) else {}
    refs = dict(evidence_refs or {})
    pack: Dict[str, Any] = {
        "run_id": run_id,
        "phase": phase,
        "role": role,
        "token_profile": token_profile,
        "model_profile": model_profile,
        "read_order": list(READ_ORDER),
        "read_plan": read_plan(budgets),
        "budgets": budgets,
        "hard_caps": {
            key: min(int((hard_caps or HARD_CAPS)[key]), HARD_CAPS[key]) for key in HARD_CAPS
        },
        "active_story_or_bug": _fit_content(
            incoming.get("active_story_or_bug", work_item_id),
            path="docs/product/backlog.md",
            section=work_item_id,
            budgets=budgets,
        ),
        "acceptance_criteria": _fit_content(
            incoming.get("acceptance_criteria"),
            path="docs/product/acceptance.md",
            section=work_item_id,
            budgets=budgets,
        ),
        "current_goal": incoming.get("current_goal"),
        "current_sprint_or_task": incoming.get("current_sprint_or_task", sprint_id),
        "architecture_section": _fit_content(
            incoming.get("architecture_section"),
            path=f"docs/engineering/architecture/{work_item_id}.md",
            section=work_item_id,
            budgets=budgets,
        ),
        "decisions": _fit_content(
            incoming.get("decisions"),
            path="docs/engineering/decisions.md",
            section="relevant",
            budgets=budgets,
        ),
        "previous_phase_handoff_delta": handoff,
        "changed_files_or_symbols": incoming.get("changed_files_or_symbols") or [],
        "open_blockers": incoming.get("open_blockers") or [],
        "state_slice": state_slice,
        "runtime_evidence_ref": refs.get("runtime_evidence_ref"),
        "token_metrics_ref": refs.get("token_metrics_ref"),
        "routing_evidence_ref": refs.get("routing_evidence_ref"),
    }
    pack["pack_hash"] = pack_hash(pack)
    if output_dir is not None:
        dest = Path(output_dir) / run_id / f"{phase}.json"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(pack, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        pack["pack_path"] = str(dest)
    return pack


def extract_heading(text: str, heading: str) -> str:
    lines = text.splitlines()
    start = None
    for index, line in enumerate(lines):
        if line.strip() == heading or line.startswith(heading + " ") or line.startswith(heading + "—") or line.startswith(heading + " -"):
            start = index
            break
    if start is None:
        return ""
    marker = lines[start]
    level = len(marker) - len(marker.lstrip("#"))
    out = [marker]
    for line in lines[start + 1:]:
        if line.startswith("#"):
            lv = len(line) - len(line.lstrip("#"))
            if lv <= level and line.strip():
                break
        out.append(line)
    return "\n".join(out).strip()


def main(argv: Optional[Sequence[str]] = None) -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Write a budgeted phase context pack")
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--phase", required=True)
    parser.add_argument("--work-item", required=True)
    parser.add_argument("--sprint", required=True)
    parser.add_argument("--token-profile", default="balanced")
    parser.add_argument("--model-profile", default=None)
    parser.add_argument("--output-dir", default=None)
    parser.add_argument("--budget", default=None)
    args = parser.parse_args(list(argv) if argv is not None else None)
    caps = load_hard_caps(Path(args.budget) if args.budget else None)
    pack = build_context_pack(
        run_id=args.run_id,
        phase=args.phase,
        work_item_id=args.work_item,
        sprint_id=args.sprint,
        token_profile=args.token_profile,
        model_profile=args.model_profile,
        hard_caps=caps,
        output_dir=Path(args.output_dir) if args.output_dir else None,
    )
    sys.stdout.write(pack["pack_hash"] + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
