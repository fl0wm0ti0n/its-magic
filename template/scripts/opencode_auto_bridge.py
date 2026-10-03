#!/usr/bin/env python3
"""BUG-0015 thin OpenCode auto bridge (IsolationEvidence + first-phase).

Durable SOT remains docs/engineering/state.md (US-0048 / DEC-0029).
First-phase order (architecture CF3 / R-0114 DQ3):
  argv --start-from → resume_brief → scratchpad → US-0087 bug-queue.
AUTO_SCHEDULER_CONFLICT mutex semantics unchanged (story-drain vs bug-queue).
US-0156 / DEC-0152: no validated source → fail closed (no default phase);
new `--resolve-continuation` emits the typed plan/item tuple (or a reason-coded
failure) and never falls back to an unvalidated phase.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))
import host_runtime_config_lib as hrc  # noqa: E402

EXIT_OK = 0
EXIT_FAIL = 1


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _parse_resume_brief(repo: Path) -> dict[str, str]:
    path = repo / "handoffs" / "resume_brief.md"
    if not path.is_file():
        return {}
    text = path.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    for key in (
        "intended_resume_phase",
        "next_scheduled_phase",
        "orchestrator_run_id",
        "story_id",
        "bug_id",
        "sprint_id",
    ):
        m = re.search(rf"`{key}`\s*:\s*\*\*`([^`]+)`\*\*", text)
        if m:
            out[key] = m.group(1)
            continue
        m2 = re.search(rf"- `{key}`:\s*`([^`]+)`", text)
        if m2:
            out[key] = m2.group(1)
            continue
        m3 = re.search(rf"{key}=([^\s`;]+)", text)
        if m3:
            out[key] = m3.group(1)
    return out


def _merge_scratchpad(repo: Path) -> dict[str, str]:
    """Resolve shared governance keys via host-neutral config (US-0131 / DEC-0131)."""
    resolved = hrc.resolve_runtime_config(repo, raise_on_fatal=False)
    return dict(resolved.values)


def _parse_state_next_phase(repo: Path) -> str | None:
    path = repo / "docs" / "engineering" / "state.md"
    if not path.is_file():
        return None
    text = path.read_text(encoding="utf-8")
    matches = re.findall(r"next_scheduled_phase[=:][\s`*]*([^\s`;*`]+)", text)
    if matches:
        return matches[0].strip("`")
    return None


PHASE_PLAN_ORDER = (
    "intake",
    "discovery",
    "research",
    "architecture",
    "sprint-plan",
    "plan-verify",
    "execute",
    "qa",
    "verify-work",
    "release",
    "closure",
    "refresh-context",
)

PHASE_PLAN = tuple(PHASE_PLAN_ORDER)


def _is_known_phase(phase_id: str) -> bool:
    return phase_id in PHASE_PLAN_ORDER


def _validate_resume_brief(repo: Path) -> dict:
    resume = _parse_resume_brief(repo)
    if not resume:
        return {"ok": False, "reason": "empty"}
    if not resume.get("story_id") and not resume.get("bug_id") and not resume.get("orchestrator_run_id"):
        return {"ok": False, "reason": "missing_work_item_anchor"}
    phase = None
    for key in ("intended_resume_phase", "next_scheduled_phase"):
        val = (resume.get(key) or "").strip().lstrip("/")
        if val and val not in ("(none)", "auto", "n/a"):
            phase = val
            break
    if not _is_known_phase(phase or ""):
        return {"ok": False, "reason": "unknown_phase"}
    return {"ok": True, "value": phase, "source": f"resume_brief"}


def _validate_state(repo: Path) -> dict:
    phase = _parse_state_next_phase(repo)
    if not phase:
        return {"ok": False, "reason": "empty"}
    if not _is_known_phase(phase):
        return {"ok": False, "reason": "unknown_phase"}
    return {"ok": True, "value": phase, "source": "state.md"}


def _effective_plan_intersection(phase_id: str, anchor_phase: str | None) -> list[str]:
    if not _is_known_phase(phase_id):
        return []
    if anchor_phase and _is_known_phase(anchor_phase) and anchor_phase != phase_id:
        i_anchor = PHASE_PLAN_ORDER.index(anchor_phase)
        i_phase = PHASE_PLAN_ORDER.index(phase_id)
        if i_anchor > i_phase:
            return list(PHASE_PLAN_ORDER[i_phase:])
        return list(PHASE_PLAN_ORDER[i_anchor:])
    return list(PHASE_PLAN_ORDER[PHASE_PLAN_ORDER.index(phase_id):])


def _select_next_open_story(repo: Path) -> dict:
    path = repo / "docs" / "product" / "backlog.md"
    if not path.is_file():
        return {"ok": False, "reasonCode": "OPENCODE_AUTO_DEPENDENCY_BLOCKED",
                "reason": "backlog_missing"}
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"(?=^## US-\d+)", text, flags=re.MULTILINE)
    for block in blocks:
        m = re.match(r"^## (US-\d+)", block)
        if not m:
            continue
        if not re.search(r"Status\s*[:=]\s*`*OPEN\b", block, re.IGNORECASE):
            continue
        if re.search(r"Status\s*[:=]\s*`*(DONE|IN_PROGRESS|BLOCKED|PAUSED)\b", block, re.IGNORECASE):
            continue
        return {"ok": True, "value": m.group(1), "source": "backlog.md"}
    return {"ok": False, "reasonCode": "OPENCODE_AUTO_DEPENDENCY_BLOCKED",
            "reason": "no_dependency_eligible_story"}


def _select_next_sprint_from_backlog(repo: Path, story_id: str) -> str:
    path = repo / "docs" / "product" / "backlog.md"
    if not path.is_file():
        return ""
    text = path.read_text(encoding="utf-8")
    m = re.search(
        rf"^## {re.escape(story_id)}.*?(?=^## (?:US|BUG)-\d+\Z|\Z)",
        text,
        flags=re.MULTILINE | re.DOTALL,
    )
    if not m:
        return ""
    sm = re.search(r"Sprint\s*[:=]\s*`*(S\d+)\b", m.group(0), re.IGNORECASE)
    if sm:
        return sm.group(1)
    sm2 = re.search(r"(S\d{3,})", m.group(0))
    return sm2.group(1) if sm2 else ""


def select_first_phase(
    repo: Path,
    *,
    start_from: str | None,
    bug_target: str | None,
) -> dict:
    """Legacy entry retained for adapter compatibility.

    US-0156 / DEC-0152: precedence is start-from → validated resume_brief →
    validated state.md. All fail-closed paths emit a reason code and never
    fall back to an unvalidated phase.
    """
    if start_from and start_from.strip():
        phase = start_from.strip().lstrip("/")
        if _is_known_phase(phase):
            return {"ok": True, "phase_id": phase, "source": "argv"}
        return {"ok": False, "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                "source": "argv"}

    scratch = _merge_scratchpad(repo)
    story_drain = scratch.get("AUTO_BACKLOG_DRAIN", "0") == "1"
    bug_queue = scratch.get("AUTO_BUG_QUEUE", "0") == "1"
    if story_drain and bug_queue and not bug_target:
        return {"ok": False, "reasonCode": "AUTO_SCHEDULER_CONFLICT",
                "source": "scheduler"}

    resume_check = _validate_resume_brief(repo)
    if resume_check["ok"]:
        return {"ok": True, "phase_id": resume_check["value"],
                "source": f"resume_brief"}

    for key in ("INTENDED_RESUME_PHASE", "NEXT_SCHEDULED_PHASE", "AUTO_START_FROM"):
        val = (scratch.get(key) or "").strip().lstrip("/")
        if val and _is_known_phase(val):
            return {"ok": True, "phase_id": val, "source": f"scratchpad:{key}"}
        if val and not _is_known_phase(val):
            return {"ok": False, "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                    "source": f"scratchpad:{key}"}

    state_check = _validate_state(repo)
    if state_check["ok"]:
        return {"ok": True, "phase_id": state_check["value"], "source": "state.md"}

    if bug_queue or bug_target:
        return {"ok": True,
                "phase_id": "intake" if not bug_target else "research",
                "source": "us0087_bug_queue",
                "bug_target": bug_target or ""}

    return {"ok": False, "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
            "source": "no_validated_source"}


# --- US-0156 / DEC-0152: typed continuation resolver --------------
#
# Module-level provenance registry (idempotence + conflict detection).
# Tests reset via reset_continuation_registry_for_tests().
continuation_registry: dict[str, dict] = {}


def reset_continuation_registry_for_tests() -> None:
    continuation_registry.clear()


def _continuation_key(
    orchestrator_run_id: str,
    work_item_kind: str,
    work_item_id: str,
    phase_id: str,
) -> str:
    return f"{orchestrator_run_id}|{work_item_kind}|{work_item_id}|{phase_id}"


def resolve_continuation(
    repo: Path,
    *,
    start_from: str | None,
    bug_target: str | None,
    orchestrator_run_id: str | None,
    cursor: int = 0,
    remaining_budget: int = 32,
) -> dict:
    """US-0156 / DEC-0152 typed, read-only continuation resolution.

    Inputs: explicit start anchor, merged policy, durable resume/state sources.
    Output: ok=true with one complete plan/item tuple, or ok=false with one
    architecture-owned reason code (no fallback execution).
    """
    if remaining_budget <= 0:
        return {"ok": False,
                "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
                "reason": "exhausted_retry_or_loop_budget"}

    scratch = _merge_scratchpad(repo)
    story_drain = scratch.get("AUTO_BACKLOG_DRAIN", "0") == "1"
    bug_queue = scratch.get("AUTO_BUG_QUEUE", "0") == "1"

    # Scheduler mutex (US-0087, US-0156): story-drain + bug-queue without
    # explicit bug_target ⇒ AUTO_SCHEDULER_CONFLICT (fail close before any
    # phase resolution).
    if story_drain and bug_queue and not bug_target:
        return {"ok": False, "reasonCode": "AUTO_SCHEDULER_CONFLICT",
                "source": "scheduler"}

    phase_id: str | None = None
    source: str = "no_validated_source"
    resume = _parse_resume_brief(repo)

    if start_from and start_from.strip():
        phase_id = start_from.strip().lstrip("/")
        source = "argv"
        if not _is_known_phase(phase_id):
            return {"ok": False, "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                    "source": "argv"}
    else:
        resume_val = None
        for key in ("intended_resume_phase", "next_scheduled_phase"):
            val = (resume.get(key) or "").strip().lstrip("/")
            if val and val not in ("(none)", "auto", "n/a", "none"):
                resume_val = val
                break
        state_val = _parse_state_next_phase(repo)

        if resume_val is not None:
            if state_val and state_val != resume_val:
                return {"ok": False,
                        "reasonCode": "OPENCODE_AUTO_RESUME_AMBIGUOUS",
                        "source": "resume_brief+state.md"}
            if not _is_known_phase(resume_val):
                return {"ok": False,
                        "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                        "source": "resume_brief"}
            phase_id = resume_val
            source = "resume_brief"
        elif state_val:
            if not _is_known_phase(state_val):
                return {"ok": False,
                        "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                        "source": "state.md"}
            phase_id = state_val
            source = "state.md"

        if phase_id is None and (bug_queue or bug_target):
            phase_id = "intake" if not bug_target else "research"
            source = "us0087_bug_queue"

    if phase_id is None:
        return {"ok": False,
                "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
                "source": "no_validated_source"}

    def _clean(v: str | None) -> str:
        s = (v or "").strip()
        if s in ("(none)", "n/a", "auto", "", "null", "None", "none"):
            return ""
        return s

    story_id = _clean(resume.get("story_id"))
    sprint_id = _clean(resume.get("sprint_id"))
    run_id = _clean(orchestrator_run_id or resume.get("orchestrator_run_id"))
    bug_id = _clean(resume.get("bug_id"))
    if bug_target:
        bug_id = bug_target

    work_item_kind: str
    work_item_id: str
    if bug_id:
        work_item_kind = "bug"
        work_item_id = bug_id
    elif story_id:
        work_item_kind = "story"
        work_item_id = story_id
    else:
        if story_drain:
            story_sel = _select_next_open_story(repo)
            if not story_sel["ok"]:
                return {"ok": False,
                        "reasonCode": story_sel.get("reasonCode", "OPENCODE_AUTO_DEPENDENCY_BLOCKED"),
                        "source": "backlog.md"}
            work_item_kind = "story"
            work_item_id = story_sel["value"]
            story_id = story_sel["value"]
            sprint_id = sprint_id or _clean(_select_next_sprint_from_backlog(repo, story_sel["value"]))
        elif bug_queue:
            return {"ok": False,
                    "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
                    "source": "no_bug_id_in_queue"}
        else:
            return {"ok": False,
                    "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
                    "source": "no_work_item_anchor"}

    plan = _effective_plan_intersection(phase_id, None)
    if not plan:
        return {"ok": False, "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                "source": "anchor_intersection_empty"}

    ckey = _continuation_key(run_id or "missing", work_item_kind, work_item_id, phase_id)
    existing = continuation_registry.get(ckey)
    if existing is not None:
        if existing.get("session_id") and existing.get("phase_id") != phase_id:
            return {"ok": False, "reasonCode": "OPENCODE_AUTO_CONTINUATION_CONFLICT",
                    "source": "registry"}
        return {
            "ok": True,
            "idempotent_noop": True,
            "source": existing.get("source", source),
            "work_item_kind": work_item_kind,
            "story_id": story_id,
            "bug_id": bug_id,
            "sprint_id": sprint_id,
            "effective_phase_plan": existing.get("effective_phase_plan", plan),
            "skipped_phases": existing.get("skipped_phases", []),
            "phase_id": phase_id,
            "cursor": cursor,
            "remaining_budget": remaining_budget,
            "continuation_key": ckey,
        }
    skipped_phases = (
        list(PHASE_PLAN_ORDER[: PHASE_PLAN_ORDER.index(phase_id)])
        if _is_known_phase(phase_id)
        else []
    )

    continuation_registry[ckey] = {
        "source": source,
        "phase_id": phase_id,
        "effective_phase_plan": plan,
        "skipped_phases": skipped_phases,
        "session_id": None,
    }

    return {
        "ok": True,
        "idempotent_noop": False,
        "source": source,
        "work_item_kind": work_item_kind,
        "story_id": story_id,
        "bug_id": bug_id,
        "sprint_id": sprint_id,
        "effective_phase_plan": plan,
        "skipped_phases": skipped_phases,
        "phase_id": phase_id,
        "cursor": cursor,
        "remaining_budget": remaining_budget,
        "continuation_key": ckey,
    }


def note_continuation_session(
    ckey: str,
    session_id: str,
) -> None:
    existing = continuation_registry.get(ckey)
    if existing is None:
        return
    if existing.get("session_id") and existing["session_id"] != session_id:
        existing["_conflict"] = True
    else:
        existing["session_id"] = session_id


def append_isolation(
    repo: Path,
    *,
    parent_id: str,
    session_id: str,
    role: str,
    phase_id: str,
    timestamp: str,
    fresh_context_marker: str,
    story_id: str | None = None,
    sprint_id: str | None = None,
    orchestrator_run_id: str | None = None,
    bug_id: str | None = None,
    state_path: Path | None = None,
) -> dict:
    placeholder = "tui-auto"
    if parent_id == placeholder or orchestrator_run_id == placeholder:
        return {"ok": False, "reasonCode": "OPENCODE_PLACEHOLDER_PARENT_REJECTED"}
    if not parent_id or not session_id or session_id == parent_id:
        return {"ok": False, "reasonCode": "OPENCODE_SUBTASK_IGNORED"}
    path = state_path or (repo / "docs" / "engineering" / "state.md")
    path.parent.mkdir(parents=True, exist_ok=True)
    extra = ""
    if story_id:
        extra += f"- storyId=`{story_id}`\n"
    if sprint_id:
        extra += f"- sprintId=`{sprint_id}`\n"
    if orchestrator_run_id:
        extra += f"- orchestratorRunId=`{orchestrator_run_id}`\n"
    if bug_id:
        extra += f"- bugId=`{bug_id}`\n"
    block = (
        "\n### IsolationEvidence (OpenCode plugin / BUG-0015)\n\n"
        f"- parentID=`{parent_id}`\n"
        f"- sessionID=`{session_id}`\n"
        f"- role=`{role}`\n"
        f"- phase_id=`{phase_id}`\n"
        f"- timestamp=`{timestamp or _utc_now_iso()}`\n"
        f"- fresh_context_marker=`{fresh_context_marker}`\n"
        f"{extra}"
        f"- sessionID_ne_parentID=`true`\n"
    )
    if path.is_file():
        existing = path.read_text(encoding="utf-8")
        path.write_text(block + "\n" + existing, encoding="utf-8")
    else:
        path.write_text(block.lstrip() + "\n", encoding="utf-8")
    return {"ok": True}


def resolve_manual_phase_context(repo: Path) -> dict:
    resume = _parse_resume_brief(repo)
    return {
        "ok": True,
        "storyId": resume.get("story_id", ""),
        "sprintId": resume.get("sprint_id", ""),
        "orchestratorRunId": resume.get("orchestrator_run_id", ""),
        "bugId": resume.get("bug_id", ""),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="BUG-0015 OpenCode auto bridge")
    parser.add_argument("--repo", default=".", help="Repository root")
    parser.add_argument(
        "--select-first-phase",
        action="store_true",
        help="Emit JSON first-phase selection",
    )
    parser.add_argument("--start-from", default=None, help="Explicit phase argv")
    parser.add_argument("--bug-target", default=None, help="Bug id when bug-queue wins")
    parser.add_argument(
        "--orchestrator-run-id",
        default=None,
        dest="orchestrator_run_id",
    )
    parser.add_argument(
        "--append-isolation",
        action="store_true",
        help="Append IsolationEvidence block to state.md",
    )
    parser.add_argument("--parent-id", default=None)
    parser.add_argument("--session-id", default=None)
    parser.add_argument("--role", default=None)
    parser.add_argument("--phase-id", default=None)
    parser.add_argument("--timestamp", default=None)
    parser.add_argument("--fresh-context-marker", default=None)
    parser.add_argument("--story-id", default=None, dest="story_id")
    parser.add_argument("--sprint-id", default=None, dest="sprint_id")
    parser.add_argument("--bug-id", default=None, dest="bug_id")
    parser.add_argument(
        "--resolve-context",
        action="store_true",
        help="Emit JSON story/sprint/run/bug from resume_brief",
    )
    parser.add_argument(
        "--resolve-continuation",
        action="store_true",
        help="US-0156 / DEC-0152: typed, read-only continuation resolution",
    )
    parser.add_argument("--cursor", default="0", help="Cursor for continuation accounting")
    parser.add_argument("--remaining-budget", default="32", dest="remaining_budget")
    parser.add_argument("--state-path", default=None, help="Override state.md path")
    args = parser.parse_args()
    repo = Path(args.repo).resolve()

    if args.select_first_phase:
        payload = select_first_phase(
            repo, start_from=args.start_from, bug_target=args.bug_target
        )
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK if payload.get("ok") else EXIT_FAIL

    if args.resolve_continuation:
        payload = resolve_continuation(
            repo,
            start_from=args.start_from,
            bug_target=args.bug_target,
            orchestrator_run_id=args.orchestrator_run_id,
            cursor=int(args.cursor or 0),
            remaining_budget=int(args.remaining_budget or 32),
        )
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK if payload.get("ok") else EXIT_FAIL

    if args.resolve_context:
        payload = resolve_manual_phase_context(repo)
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK

    if args.append_isolation:
        if not all(
            [
                args.parent_id,
                args.session_id,
                args.role,
                args.phase_id,
                args.fresh_context_marker,
            ]
        ):
            sys.stderr.write("append-isolation requires identity fields\n")
            return EXIT_FAIL
        state_path = Path(args.state_path) if args.state_path else None
        payload = append_isolation(
            repo,
            parent_id=args.parent_id,
            session_id=args.session_id,
            role=args.role,
            phase_id=args.phase_id,
            timestamp=args.timestamp or _utc_now_iso(),
            fresh_context_marker=args.fresh_context_marker,
            story_id=args.story_id,
            sprint_id=args.sprint_id,
            orchestrator_run_id=args.orchestrator_run_id,
            bug_id=args.bug_id,
            state_path=state_path,
        )
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK if payload.get("ok") else EXIT_FAIL

    parser.print_help()
    return EXIT_FAIL


if __name__ == "__main__":
    sys.exit(main())
