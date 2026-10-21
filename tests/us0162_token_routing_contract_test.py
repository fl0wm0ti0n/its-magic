"""US-0162 token routing and context-pack contract. Ten markers."""

from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))

from build_phase_context import (  # noqa: E402
    DELTA_HANDOFF_FIELDS,
    HARD_CAPS,
    build_context_pack,
    effective_budgets,
    load_hard_caps,
    make_delta_handoff,
    pack_hash,
    read_plan,
)
from memory_audit_deterministic import run_audit  # noqa: E402
from model_routing_lib import (  # noqa: E402
    BENCHMARK_FIELDS,
    BENCHMARK_GATE_NOTE,
    FALLBACK_CODES,
    INPUT_REDUCTION_TARGET,
    RoutingSchemaError,
    classify_complexity,
    load_routing_file,
    new_benchmark_row,
    resolve_route,
    validate_routing_document,
)
from model_tier_lib import resolve_model_for_phase  # noqa: E402
from read_dedup_lib import (  # noqa: E402
    large_duplicate_ratio,
    note_read,
    ratio_under_budget,
)
from token_cost_lib import compute_strict_proof_hash  # noqa: E402

KERNEL_LINES = (
    "Canonical repo state beats chat memory.",
    "Work only on active scope.",
    "Start with the generated context pack.",
    "Use targeted reads before broad reads.",
    "Never invent evidence.",
    "Respect artifact ownership.",
    "Mandatory QA, UAT, and release gates may not be bypassed.",
    "Persist only meaningful deltas.",
)

EXAMPLE = REPO / ".its-magic" / "model-routing.json"
BUDGET = REPO / ".its-magic" / "context-budget.json"


def _write(tmp: Path, doc: dict) -> Path:
    path = tmp / "model-routing.json"
    path.write_text(json.dumps(doc), encoding="utf-8")
    return path


def _example() -> dict:
    return json.loads(EXAMPLE.read_text(encoding="utf-8"))


def _delta() -> dict:
    return {
        "story": "US-0162",
        "from": "sprint-plan",
        "to": "execute",
        "changed": "routing schema and pack builder",
        "open": "AC unchecked",
        "required_reads": [".its-magic/model-routing.json"],
        "do_not_reload": ["docs/product/backlog.md"],
    }


def test_us0162_pack_budgets_and_read_order():
    caps = load_hard_caps(BUDGET)
    assert caps == HARD_CAPS
    assert caps["initial_budget_tokens"] == 6000
    assert caps["expansion_budget_tokens"] == 4000
    assert caps["max_expansions"] == 2
    assert caps["max_single_artifact_tokens"] == 3000
    lean = effective_budgets("lean", caps)
    full = effective_budgets("full", caps)
    balanced = effective_budgets("balanced", caps)
    assert lean["initial_budget_tokens"] == 3000
    assert lean["expansion_budget_tokens"] == 2000
    assert lean["max_expansions"] == 1
    assert lean["max_single_artifact_tokens"] == 3000
    assert full == caps
    assert balanced == caps
    assert read_plan(lean) == ["pack", "targeted_read", "expansion"]
    assert read_plan(full) == ["pack", "targeted_read", "expansion", "expansion"]
    raised = effective_budgets("full", {"initial_budget_tokens": 99999, **{k: caps[k] for k in caps if k != "initial_budget_tokens"}})
    assert raised["initial_budget_tokens"] == 6000
    huge = "X" * 20000
    pack = build_context_pack(
        run_id="run-budget",
        phase="execute",
        work_item_id="US-0162",
        sprint_id="S0179",
        token_profile="lean",
        model_profile="expert",
        sections={"architecture_section": huge, "active_story_or_bug": "US-0162"},
        hard_caps=caps,
    )
    assert pack["architecture_section"]["pointer"] is True
    assert pack["architecture_section"]["inline"] is False
    assert huge not in json.dumps(pack)
    assert pack["read_plan"][0] == "pack"
    assert pack["read_plan"][1] == "targeted_read"
    pointer = (REPO / "docs/engineering/phase-context.md").read_text(encoding="utf-8")
    assert "Phase context pointers" in pointer
    assert "initial_budget_tokens" not in pointer


def test_us0162_pack_omits_full_memory_surfaces():
    sentinel = "FULL_BACKLOG_SENTINEL_us0162"
    archive_sentinel = "STATE_ARCHIVE_SENTINEL_us0162"
    pack = build_context_pack(
        run_id="run-omit",
        phase="execute",
        work_item_id="US-0162",
        sprint_id="S0179",
        sections={
            "active_story_or_bug": "US-0162 active heading only",
            "acceptance_criteria": ["relevant criterion"],
            "full_backlog": sentinel,
            "full_architecture": "ENTIRE_ARCHITECTURE_SENTINEL",
            "state_history": archive_sentinel,
            "state_archives": archive_sentinel,
            "old_sprints": "OLD_SPRINT_SENTINEL",
            "old_handoffs": "OLD_HANDOFF_SENTINEL",
            "token_cost_history": "TOKEN_HISTORY_SENTINEL",
            "every_decision": "EVERY_DECISION_SENTINEL",
            "state_slice": {
                "active_story": "US-0162",
                "active_phase": "execute",
                "active_sprint_or_task": "S0179",
                "objective": "pack",
                "blockers": [],
                "next_action": "qa",
                "refs": ["docs/engineering/architecture/US-0162.md"],
                "checkpoint_history": archive_sentinel,
            },
        },
    )
    blob = json.dumps(pack)
    for marker in (
        sentinel,
        "ENTIRE_ARCHITECTURE_SENTINEL",
        archive_sentinel,
        "OLD_SPRINT_SENTINEL",
        "OLD_HANDOFF_SENTINEL",
        "TOKEN_HISTORY_SENTINEL",
        "EVERY_DECISION_SENTINEL",
    ):
        assert marker not in blob
    assert "checkpoint_history" not in blob
    shard = (REPO / "docs/engineering/architecture/US-0162.md").read_text(encoding="utf-8")
    hot = (REPO / "docs/engineering/architecture.md").read_text(encoding="utf-8")
    assert "# US-0162 —" in shard
    assert "A1 is the only approach that meets AC-1..AC-12 without amending DEC-0086" in shard
    assert "Index stub." in hot
    assert "A1 is the only approach that meets AC-1..AC-12 without amending DEC-0086" not in hot
    archiver = (REPO / "scripts/enforce-triad-hot-surface.py").read_text(encoding="utf-8")
    assert "def rollover_architecture(" in archiver


def test_us0162_evidence_ref_not_proof_body():
    sentinel = "PROOF_BODY_SENTINEL_9f3a"
    pack = build_context_pack(
        run_id="run-evidence",
        phase="execute",
        work_item_id="US-0162",
        sprint_id="S0179",
        sections={
            "active_story_or_bug": "US-0162",
            "proof_body": {"payload": sentinel},
            "isolation_proof": sentinel,
            "token_metrics_body": sentinel,
            "previous_phase_handoff_delta": _delta(),
        },
        evidence_refs={
            "runtime_evidence_ref": ".its-magic/runtime/proofs/execute.json",
            "token_metrics_ref": ".its-magic/metrics/tokens.jsonl",
            "routing_evidence_ref": ".its-magic/metrics/routing.jsonl",
        },
    )
    blob = json.dumps(pack)
    assert sentinel not in blob
    assert pack["runtime_evidence_ref"].endswith("execute.json")
    assert pack["token_metrics_ref"].endswith("tokens.jsonl")
    assert pack["pack_hash"] == pack_hash(pack)
    proof = compute_strict_proof_hash(
        "auto-20261016-us0162",
        "rp-not-a-pack",
        "execute",
        "dev",
        "2026-10-16T16:45:00Z",
        3600,
    )
    assert pack["pack_hash"] != proof
    assert pack_hash is not compute_strict_proof_hash


def test_us0162_kernel_present_and_gates_remain():
    for rel in (".cursor/rules/core.mdc", "template/.cursor/rules/core.mdc"):
        text = (REPO / rel).read_text(encoding="utf-8")
        for line in KERNEL_LINES:
            assert line in text
        assert "US-0039" in text
        assert "QA" in text and "UAT" in text and "release" in text
    runbook = (REPO / "docs/engineering/runbook.md").read_text(encoding="utf-8")
    template_runbook = (REPO / "template/docs/engineering/runbook.md").read_text(encoding="utf-8")
    for text in (runbook, template_runbook):
        assert "US-0048" in text
        assert "US-0056" in text
        assert "US-0069" in text
        assert "US-0039" in text
        assert "Kernel pointer:" not in text or "Always-on kernel" in text
        assert "Always-on kernel" in text
    for rel in (
        ".cursor/commands/execute.md",
        ".cursor/commands/qa.md",
        ".cursor/commands/release.md",
        ".cursor/agents/dev.mdc",
        ".cursor/skills/its-magic/SKILL.md",
        "template/.cursor/commands/execute.md",
        "template/.cursor/rules/core.mdc",
    ):
        text = (REPO / rel).read_text(encoding="utf-8")
        if rel.endswith("core.mdc"):
            continue
        assert "Kernel pointer:" in text
        assert sum(1 for line in KERNEL_LINES if line in text) < len(KERNEL_LINES)
    release = (REPO / ".cursor/commands/release.md").read_text(encoding="utf-8")
    assert "Release gate" in release or "release gate" in release.lower()


def test_us0162_delta_handoff_fields():
    assert DELTA_HANDOFF_FIELDS == (
        "story",
        "from",
        "to",
        "changed",
        "open",
        "required_reads",
        "do_not_reload",
    )
    delta = make_delta_handoff(_delta())
    assert list(delta) == list(DELTA_HANDOFF_FIELDS)
    huge = dict(_delta())
    huge["changed"] = "word " * 5000
    try:
        make_delta_handoff(huge)
    except ValueError as exc:
        assert "few hundred tokens" in str(exc)
    else:
        raise AssertionError("oversized handoff was accepted")


def test_us0162_audit_clean_is_zero_model_calls(tmp_path: Path):
    result = run_audit(tmp_path)
    assert result["model_calls"] == 0
    assert result["clean"] is True
    assert result["unresolved_semantic_question"] is None
    assert result["order"] == [
        "git_diff",
        "hash_comparison",
        "cross_reference",
        "status",
        "schema",
    ]
    command = (REPO / ".cursor/commands/memory-audit.md").read_text(encoding="utf-8")
    template = (REPO / "template/.cursor/commands/memory-audit.md").read_text(encoding="utf-8")
    for text in (command, template):
        assert "scripts/memory_audit_deterministic.py" in text
        assert "model_calls=0" in text
        assert "Read these files to build the audit picture" not in text
    source = (REPO / "scripts/memory_audit_deterministic.py").read_text(encoding="utf-8")
    assert "urllib" not in source
    assert "openai" not in source
    assert "dotenv" not in source


def test_us0162_dedup_second_read_counted(tmp_path: Path):
    ledger = tmp_path / "read-dedup.jsonl"
    calls = {"n": 0}

    def _load():
        calls["n"] += 1
        return "section-body"

    first = note_read(
        ledger_path=ledger,
        phase="execute",
        path="docs/engineering/architecture/US-0162.md",
        sha256="abc",
        section="US-0162",
        estimated_tokens=3000,
        read=_load,
    )
    second = note_read(
        ledger_path=ledger,
        phase="execute",
        path="docs/engineering/architecture/US-0162.md",
        sha256="abc",
        section="US-0162",
        estimated_tokens=3000,
        read=_load,
    )
    assert first["performed"] is True and first["duplicate"] is False
    assert second["performed"] is False and second["duplicate"] is True
    assert calls["n"] == 1
    assert second["body"] is None
    changed = note_read(
        ledger_path=ledger,
        phase="execute",
        path="docs/engineering/architecture/US-0162.md",
        sha256="def",
        section="US-0162",
        estimated_tokens=3000,
        read=_load,
    )
    assert changed["performed"] is True
    assert calls["n"] == 2
    for index in range(9):
        note_read(
            ledger_path=ledger,
            phase="execute",
            path=f"docs/extra-{index}.md",
            sha256=f"hash-{index}",
            symbol=f"sym-{index}",
            estimated_tokens=3000,
            read=lambda: "x",
        )
    ratio = large_duplicate_ratio(ledger, "execute")
    assert ratio < 0.10
    assert ratio_under_budget(ratio)
    state_line = "routing_evidence_ref=.its-magic/metrics/read-dedup.jsonl"
    assert "section-body" not in state_line
    assert ledger.name == "read-dedup.jsonl"


def test_us0162_multi_provider_resolution_order(tmp_path: Path):
    doc = _example()
    validate_routing_document(doc)
    kie = doc["providers"]["kie"]["base_url"]
    assert kie.startswith("http://127.0.0.1")
    assert "kie.ai" not in kie.lower()
    for provider in doc["providers"].values():
        assert provider["api_key_env"].isupper()
        assert "sk-" not in provider["api_key_env"]
    intake = resolve_route("intake", routing_path=EXAMPLE, requirements=[])
    execute = resolve_route("execute", routing_path=EXAMPLE)
    assert intake.provider != execute.provider
    assert intake.provider == "lmstudio"
    assert execute.provider == "anthropic"
    assert intake.model not in {"fast", "inherit"}
    assert execute.model not in {"fast", "inherit"}
    assert intake.source == "routing_file"
    assert execute.step == "phase"

    doc["tasks"]["T-9"] = {"profile": "cheap"}
    doc["phases"]["execute"] = {"profile": "balanced"}
    doc["roles"]["dev"] = {"profile": "expert"}
    doc["complexity"]["routes"]["normal"] = "local"
    doc["default"] = {"profile": "cheap"}
    path = _write(tmp_path, doc)
    signals = {
        "changed_files": ["scripts/model_routing_lib.py"],
        "estimated_lines": 120,
        "component_count": 1,
        "source_files_changed": True,
    }
    explicit = resolve_route(
        "execute",
        role="dev",
        task="T-9",
        explicit={"provider": "openrouter", "model": "route-explicit"},
        routing_path=path,
        signals=signals,
        requirements=[],
    )
    assert explicit.step == "explicit_invocation"
    assert explicit.provider == "openrouter"
    assert explicit.model == "route-explicit"
    task_hit = resolve_route(
        "execute", role="dev", task="T-9", routing_path=path, signals=signals, requirements=[]
    )
    assert task_hit.step == "task" and task_hit.provider == "lmstudio" and task_hit.model == "local-small"
    phase_hit = resolve_route(
        "execute", role="dev", routing_path=path, signals=signals, requirements=[]
    )
    assert phase_hit.step == "phase" and phase_hit.provider == "openai"
    del doc["phases"]["execute"]
    path = _write(tmp_path, doc)
    role_hit = resolve_route(
        "execute", role="dev", routing_path=path, signals=signals, requirements=[]
    )
    assert role_hit.step == "role" and role_hit.provider == "anthropic"
    del doc["roles"]["dev"]
    path = _write(tmp_path, doc)
    complex_hit = resolve_route(
        "execute", role="dev", routing_path=path, signals=signals, requirements=[]
    )
    assert complex_hit.step == "complexity" and complex_hit.profile == "local"
    del doc["complexity"]["routes"]["normal"]
    path = _write(tmp_path, doc)
    default_hit = resolve_route(
        "execute", role="dev", routing_path=path, signals=signals, requirements=[]
    )
    assert default_hit.step == "global_default" and default_hit.profile == "cheap"

    secret = _example()
    secret["providers"]["openai"]["api_key"] = "sk-" + ("a" * 24)
    try:
        validate_routing_document(secret)
    except RoutingSchemaError as exc:
        assert exc.code == "SECRET_VALUE"
    else:
        raise AssertionError("secret value was accepted")
    env_path = tmp_path / ".env"
    env_path.write_text("OPENAI_API_KEY=sk-not-read\n", encoding="utf-8")
    try:
        load_routing_file(env_path)
    except RoutingSchemaError as exc:
        assert exc.code == "ENV_READ_FORBIDDEN"
    else:
        raise AssertionError(".env was read")
    source = (REPO / "scripts/model_routing_lib.py").read_text(encoding="utf-8")
    assert "dotenv" not in source
    assert "os.environ" not in source


def test_us0162_capability_fallback_codes(tmp_path: Path):
    assert classify_complexity({"security_or_auth": True}) == "critical"
    assert classify_complexity({"architecture_impact": True, "estimated_lines": 10, "source_files_changed": True}) == "high"
    assert classify_complexity({"changed_files": ["README.md"], "estimated_lines": 10}) == "trivial"
    assert classify_complexity({
        "source_files_changed": True,
        "estimated_lines": 20,
        "component_count": 1,
    }) == "low"
    assert classify_complexity({
        "source_files_changed": True,
        "estimated_lines": 120,
        "component_count": 1,
    }) == "normal"
    raised = dict(_example()["complexity"]["thresholds"])
    raised["component_count_high"] = 9
    assert classify_complexity({
        "component_count": 3,
        "estimated_lines": 10,
        "source_files_changed": True,
    }, raised) != "high"

    def _isolated(profile: str, requirements, status) -> dict:
        doc = _example()
        doc["profiles"][profile]["fallback"] = []
        doc["escalation"]["max_failures"] = 2
        path = _write(tmp_path, doc)
        return resolve_route(
            "execute",
            explicit={"profile": profile},
            routing_path=path,
            requirements=requirements,
            provider_status=status,
        )

    cases = [
        ("cheap", [], {"providers": {"lmstudio": "unavailable"}}, "PROVIDER_UNAVAILABLE"),
        ("cheap", [], {"models": {"local-small": "rate_limited"}}, "MODEL_RATE_LIMITED"),
        ("cheap", [], {"models": {"local-small": "unavailable"}}, "MODEL_UNAVAILABLE"),
        ("cheap", ["large_context"], {}, "MODEL_CONTEXT_TOO_SMALL"),
        ("cheap", ["tools"], {}, "MODEL_CAPABILITY_MISMATCH"),
    ]
    seen = set()
    for profile, reqs, status, code in cases:
        result = _isolated(profile, reqs, status)
        assert result.accepted is False
        assert result.reason == code
        assert code in FALLBACK_CODES
        seen.add(code)
    assert seen == set(FALLBACK_CODES)

    doc = _example()
    doc["profiles"]["cheap"]["fallback"] = ["balanced"]
    doc["profiles"]["balanced"]["fallback"] = ["expert"]
    doc["profiles"]["expert"]["fallback"] = ["cheap"]
    doc["escalation"]["max_failures"] = 2
    path = _write(tmp_path, doc)
    stopped = resolve_route(
        "execute",
        explicit={"profile": "cheap"},
        routing_path=path,
        requirements=["code"],
        provider_status={"providers": {
            "lmstudio": "unavailable",
            "openai": "unavailable",
            "anthropic": "unavailable",
        }},
        ledger_path=tmp_path / "routing.jsonl",
    )
    assert stopped.accepted is False
    assert stopped.reason == "PROVIDER_UNAVAILABLE"
    assert stopped.fallback == ["cheap", "balanced"]
    assert "expert" not in stopped.fallback
    lines = (tmp_path / "routing.jsonl").read_text(encoding="utf-8").splitlines()
    assert len(lines) == 1
    logged = json.loads(lines[0])
    assert logged["reason"] == "PROVIDER_UNAVAILABLE"
    assert isinstance(logged["reason"], str)
    state_line = f"routing_evidence_ref={stopped.routing_evidence_ref}"
    assert "PROVIDER_UNAVAILABLE" not in state_line


def test_us0162_token_profile_independent_of_model(tmp_path: Path):
    lean = build_context_pack(
        run_id="run-axes",
        phase="execute",
        work_item_id="US-0162",
        sprint_id="S0179",
        token_profile="lean",
        model_profile="expert",
        sections={"active_story_or_bug": "US-0162", "previous_phase_handoff_delta": _delta()},
    )
    balanced = build_context_pack(
        run_id="run-axes",
        phase="execute",
        work_item_id="US-0162",
        sprint_id="S0179",
        token_profile="balanced",
        model_profile="local",
        sections={"active_story_or_bug": "US-0162", "previous_phase_handoff_delta": _delta()},
    )
    assert lean["token_profile"] == "lean" and lean["model_profile"] == "expert"
    assert balanced["token_profile"] == "balanced" and balanced["model_profile"] == "local"
    assert lean["budgets"]["initial_budget_tokens"] == 3000
    assert balanced["budgets"]["initial_budget_tokens"] == 6000
    missing = tmp_path / "absent-routing.json"
    host = resolve_model_for_phase("execute", {})
    routed = resolve_route("execute", routing_path=missing, scratchpad={})
    assert routed.source == "host_resolution"
    assert routed.host_result.alias == host.alias
    assert routed.host_result.slug == host.slug
    assert routed.host_result.success == host.success
    adapted = resolve_route(
        "execute",
        routing_path=EXAMPLE,
        scratchpad={"MODEL_EXECUTE": "vendor-slug-a"},
        requirements=[],
    )
    assert adapted.provider == "host-catalog"
    assert adapted.model == "vendor-slug-a"
    assert adapted.step == "explicit_invocation"
    tiered = resolve_route(
        "qa",
        routing_path=EXAMPLE,
        scratchpad={"MODEL_TIER_QA": "strong"},
        requirements=[],
    )
    assert tiered.step == "phase"
    assert tiered.profile == "expert"
    assert tiered.provider == "anthropic"
    assert tiered.model != "fast"
    row = new_benchmark_row()
    for name in BENCHMARK_FIELDS:
        assert name in row
    assert row["input_reduction_target"] == INPUT_REDUCTION_TARGET
    assert "not a reason to remove a gate" in BENCHMARK_GATE_NOTE
    assert "40 to 55 percent" in INPUT_REDUCTION_TARGET
    backlog = (REPO / "docs/product/backlog.md").read_text(encoding="utf-8")
    start = backlog.find("## US-0162 —")
    end = backlog.find("\n## ", start + 4)
    section = backlog[start:end]
    assert "Status: OPEN" in section
    assert "- [ ] AC-1:" in section
    assert "- [ ] AC-12:" in section
    assert "- [x] AC-" not in section
