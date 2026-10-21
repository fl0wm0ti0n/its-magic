#!/usr/bin/env python3
"""Host-neutral model routing.

An absent `.its-magic/model-routing.json` keeps `resolve_model_for_phase`.
A present file is the source of truth. This module does not edit the
DEC-0087 5-step and does not read `.env`.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Dict, List, Mapping, Optional, Sequence

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

from model_tier_lib import phase_to_model_key, phase_to_tier_key, resolve_model_for_phase  # noqa: E402

ROUTING_REL = ".its-magic/model-routing.json"
ROUTING_LEDGER_REL = ".its-magic/metrics/routing.jsonl"

RESOLUTION_STEPS: tuple[str, ...] = (
    "explicit_invocation",
    "task",
    "phase",
    "role",
    "complexity",
    "global_default",
)

PROVIDER_TYPES = frozenset({"openai", "openai-compatible", "anthropic"})
API_KEY_ENV_RE = re.compile(r"^[A-Z][A-Z0-9_]*$")
TIER_TO_PROFILE = {"cheap": "cheap", "balanced": "balanced", "strong": "expert"}

FALLBACK_CODES = (
    "MODEL_UNAVAILABLE",
    "MODEL_CAPABILITY_MISMATCH",
    "MODEL_CONTEXT_TOO_SMALL",
    "PROVIDER_UNAVAILABLE",
    "MODEL_RATE_LIMITED",
)

DEFAULT_THRESHOLDS = {
    "component_count_high": 3,
    "estimated_lines_high_with_failures": 200,
    "component_count_high_with_api": 2,
    "component_count_low_max": 1,
    "estimated_lines_low_max": 80,
}

DEFAULT_ESCALATION = {
    "max_failures": 2,
    "on_context_overflow": True,
    "on_repeated_test_failure": True,
    "on_uncertainty": True,
}

COMPLEXITY_CLASSES = ("critical", "high", "trivial", "low", "normal")

_SOURCE_SUFFIXES = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".go", ".java", ".cs", ".rs", ".rb", ".php", ".sh", ".ps1",
}

_SECRET_PATTERNS = (
    re.compile(r"(?i)(api[_-]?key|secret|password|token|passwd)\s*[:=]"),
    re.compile(r"(?i)\b(sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-)"),
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"(?i)bearer\s+[A-Za-z0-9\-._~+/]+=*"),
)

_SECRET_FIELDS = frozenset({
    "api_key", "apikey", "secret", "token", "password", "authorization",
})

BENCHMARK_FIELDS = (
    "input_tokens",
    "cached_input",
    "output_tokens",
    "requests",
    "provider",
    "model",
    "phase",
    "context_pack_size",
    "expansions",
    "duplicate_reads",
    "latency",
    "estimated_or_actual_cost",
    "test_result",
    "qa_cycles",
    "acceptance_result",
    "uat_result",
    "release_result",
    "quality_per_token",
    "quality_per_cost",
)

INPUT_REDUCTION_TARGET = "40 to 55 percent"
BENCHMARK_GATE_NOTE = (
    "The percentage target is a before/after benchmark row. "
    "It is not a reason to remove a gate."
)

REQUIRED_TOP_KEYS = ("profiles", "roles", "phases", "tasks", "providers", "complexity", "default")


class RoutingSchemaError(ValueError):
    def __init__(self, code: str, detail: str = "") -> None:
        self.code = code
        self.detail = detail
        super().__init__(f"{code}: {detail}".strip(": "))


def looks_like_secret(value: str) -> bool:
    text = value or ""
    return any(pattern.search(text) for pattern in _SECRET_PATTERNS)


def new_benchmark_row() -> Dict[str, Any]:
    row = {name: None for name in BENCHMARK_FIELDS}
    row["input_reduction_target"] = INPUT_REDUCTION_TARGET
    row["gate_note"] = BENCHMARK_GATE_NOTE
    return row


@dataclass
class RouteResult:
    provider: str
    model: str
    profile: Optional[str]
    step: str
    phase: str
    role: Optional[str]
    task: Optional[str]
    complexity: Optional[str]
    reason: Optional[str]
    fallback: List[str] = field(default_factory=list)
    accepted: bool = True
    source: str = "routing_file"
    host_result: Any = None
    routing_evidence_ref: str = ROUTING_LEDGER_REL

    def as_log(self) -> Dict[str, Any]:
        return {
            "phase": self.phase,
            "role": self.role,
            "task": self.task,
            "complexity": self.complexity,
            "profile": self.profile,
            "provider": self.provider,
            "model": self.model,
            "reason": self.reason,
            "fallback": list(self.fallback),
        }


def routing_path_for(repo: Path) -> Path:
    return Path(repo) / ROUTING_REL


def load_routing_file(path: Path) -> Dict[str, Any]:
    path = Path(path)
    if path.name == ".env" or ".env" in path.suffixes:
        raise RoutingSchemaError("ENV_READ_FORBIDDEN", "router does not read .env")
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError as exc:
        raise RoutingSchemaError("SCHEMA_INVALID", str(exc)) from exc
    try:
        doc = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RoutingSchemaError("SCHEMA_INVALID", str(exc)) from exc
    validate_routing_document(doc)
    return doc


def validate_routing_document(doc: Mapping[str, Any]) -> None:
    if not isinstance(doc, Mapping):
        raise RoutingSchemaError("SCHEMA_INVALID", "routing document must be an object")
    for key in REQUIRED_TOP_KEYS:
        if key not in doc:
            raise RoutingSchemaError("SCHEMA_INVALID", f"missing {key}")
    _reject_secret_strings(doc)
    complexity = doc["complexity"]
    if not isinstance(complexity, Mapping) or not isinstance(complexity.get("thresholds"), Mapping):
        raise RoutingSchemaError("SCHEMA_INVALID", "complexity.thresholds required")
    if not isinstance(complexity.get("routes"), Mapping):
        raise RoutingSchemaError("SCHEMA_INVALID", "complexity.routes required")
    providers = doc["providers"]
    if not isinstance(providers, Mapping):
        raise RoutingSchemaError("SCHEMA_INVALID", "providers must be an object")
    for name, provider in providers.items():
        _validate_provider(str(name), provider)
    for bucket in ("profiles", "roles", "phases", "tasks"):
        if not isinstance(doc[bucket], Mapping):
            raise RoutingSchemaError("SCHEMA_INVALID", f"{bucket} must be an object")
    default = doc["default"]
    if not isinstance(default, Mapping) or not str(default.get("profile") or "").strip():
        raise RoutingSchemaError("SCHEMA_INVALID", "default.profile required")
    profiles = doc["profiles"]
    for name, profile in profiles.items():
        if not isinstance(profile, Mapping):
            raise RoutingSchemaError("SCHEMA_INVALID", f"profile {name} must be an object")
        if "provider" not in profile or "model" not in profile:
            raise RoutingSchemaError("SCHEMA_INVALID", f"profile {name} needs provider and model")
        caps = profile.get("capabilities") or []
        if not isinstance(caps, list):
            raise RoutingSchemaError("SCHEMA_INVALID", f"profile {name} capabilities must be a list")


def _validate_provider(name: str, provider: Any) -> None:
    if not isinstance(provider, Mapping):
        raise RoutingSchemaError("SCHEMA_INVALID", f"provider {name} must be an object")
    provider_type = provider.get("type")
    if provider_type not in PROVIDER_TYPES:
        raise RoutingSchemaError(
            "PROVIDER_TYPE",
            f"{name} type {provider_type!r} not in {sorted(PROVIDER_TYPES)}",
        )
    env_name = provider.get("api_key_env")
    if not isinstance(env_name, str) or not API_KEY_ENV_RE.match(env_name):
        raise RoutingSchemaError("API_KEY_ENV", f"{name} api_key_env must match {API_KEY_ENV_RE.pattern}")
    if looks_like_secret(env_name):
        raise RoutingSchemaError("SECRET_VALUE", f"{name} api_key_env looks like a secret")


def _reject_secret_strings(obj: Any, path: str = "$") -> None:
    if isinstance(obj, Mapping):
        for key, value in obj.items():
            key_s = str(key)
            child = f"{path}.{key_s}"
            if key_s.lower() in _SECRET_FIELDS:
                raise RoutingSchemaError("SECRET_VALUE", f"{child} is not an env name")
            if isinstance(value, str) and looks_like_secret(value):
                raise RoutingSchemaError("SECRET_VALUE", child)
            _reject_secret_strings(value, child)
    elif isinstance(obj, list):
        for index, value in enumerate(obj):
            _reject_secret_strings(value, f"{path}[{index}]")
    elif isinstance(obj, str) and looks_like_secret(obj):
        raise RoutingSchemaError("SECRET_VALUE", path)


def classify_complexity(
    signals: Optional[Mapping[str, Any]] = None,
    thresholds: Optional[Mapping[str, Any]] = None,
) -> str:
    """First match wins: critical, high, trivial, low, otherwise normal. No model call."""
    data = dict(signals or {})
    limits = dict(DEFAULT_THRESHOLDS)
    if thresholds:
        limits.update({k: thresholds[k] for k in DEFAULT_THRESHOLDS if k in thresholds})
    if data.get("security_or_auth") or data.get("destructive_migration") or data.get("release_blocker"):
        return "critical"
    components = int(data.get("component_count") or 0)
    lines = int(data.get("estimated_lines") or 0)
    failing = bool(data.get("failing_tests"))
    api_change = bool(data.get("api_or_schema_change"))
    if (
        data.get("architecture_impact")
        or components >= int(limits["component_count_high"])
        or (failing and lines >= int(limits["estimated_lines_high_with_failures"]))
        or (api_change and components >= int(limits["component_count_high_with_api"]))
    ):
        return "high"
    if "source_files_changed" in data:
        source_changed = bool(data.get("source_files_changed"))
    else:
        changed = data.get("changed_files") or []
        source_changed = any(_is_source_path(str(item)) for item in changed)
    if (not source_changed) or (lines == 0 and not failing):
        return "trivial"
    if (
        components <= int(limits["component_count_low_max"])
        and not api_change
        and not data.get("unknown_dependencies")
        and lines < int(limits["estimated_lines_low_max"])
    ):
        return "low"
    return "normal"


def _is_source_path(path: str) -> bool:
    return Path(path).suffix.lower() in _SOURCE_SUFFIXES


def incompatibility(
    profile: Mapping[str, Any],
    requirements: Sequence[str],
    status: Optional[Mapping[str, Any]] = None,
) -> Optional[str]:
    status = status or {}
    provider = str(profile.get("provider") or "")
    model = str(profile.get("model") or "")
    providers = status.get("providers") or {}
    models = status.get("models") or {}
    provider_state = providers.get(provider)
    model_state = models.get(f"{provider}/{model}")
    if model_state is None:
        model_state = models.get(model)
    if provider_state == "unavailable":
        return "PROVIDER_UNAVAILABLE"
    if provider_state == "rate_limited" or model_state == "rate_limited":
        return "MODEL_RATE_LIMITED"
    if model_state == "unavailable":
        return "MODEL_UNAVAILABLE"
    caps = set(profile.get("capabilities") or [])
    reqs = list(requirements or [])
    if "large_context" in reqs and "large_context" not in caps:
        return "MODEL_CONTEXT_TOO_SMALL"
    if any(req not in caps for req in reqs):
        return "MODEL_CAPABILITY_MISMATCH"
    return None


def walk_fallback(
    start_profile: str,
    profiles: Mapping[str, Any],
    requirements: Sequence[str],
    status: Optional[Mapping[str, Any]] = None,
    max_failures: int = 2,
) -> Dict[str, Any]:
    current: Optional[str] = start_profile
    seen = set()
    failures = 0
    last_code: Optional[str] = None
    chain: List[str] = []
    while current and current not in seen:
        seen.add(current)
        profile = profiles.get(current)
        if not isinstance(profile, Mapping):
            last_code = "MODEL_UNAVAILABLE"
            failures += 1
            chain.append(current)
            break
        code = incompatibility(profile, requirements, status)
        if code is None:
            return {
                "profile": current,
                "provider": str(profile.get("provider")),
                "model": str(profile.get("model")),
                "reason": last_code if failures else None,
                "fallback": chain,
                "accepted": True,
                "stopped": False,
            }
        last_code = code
        failures += 1
        chain.append(current)
        if failures >= max_failures:
            break
        nxt = profile.get("fallback") or []
        current = str(nxt[0]) if nxt else None
    last_profile = profiles.get(chain[-1]) if chain else {}
    if not isinstance(last_profile, Mapping):
        last_profile = {}
    return {
        "profile": chain[-1] if chain else start_profile,
        "provider": str(last_profile.get("provider") or ""),
        "model": str(last_profile.get("model") or ""),
        "reason": last_code,
        "fallback": chain,
        "accepted": False,
        "stopped": True,
    }


def resolve_route(
    phase: str,
    *,
    role: Optional[str] = None,
    task: Optional[str] = None,
    explicit: Optional[Mapping[str, Any]] = None,
    scratchpad: Optional[Mapping[str, str]] = None,
    routing_path: Optional[Path] = None,
    repo: Optional[Path] = None,
    signals: Optional[Mapping[str, Any]] = None,
    requirements: Optional[Sequence[str]] = None,
    provider_status: Optional[Mapping[str, Any]] = None,
    ledger_path: Optional[Path] = None,
    catalog: Optional[dict] = None,
    catalog_path: Optional[Path] = None,
) -> RouteResult:
    path = Path(routing_path) if routing_path is not None else routing_path_for(repo or Path.cwd())
    if path.name == ".env":
        raise RoutingSchemaError("ENV_READ_FORBIDDEN", "router does not read .env")
    if not path.is_file():
        return _host_resolution(
            phase,
            scratchpad=scratchpad,
            catalog=catalog,
            catalog_path=catalog_path,
            role=role,
            task=task,
        )
    doc = load_routing_file(path)
    return _resolve_present(
        doc,
        phase,
        role=role,
        task=task,
        explicit=explicit,
        scratchpad=scratchpad or {},
        signals=signals,
        requirements=requirements,
        provider_status=provider_status,
        ledger_path=ledger_path,
    )


def _host_resolution(
    phase: str,
    *,
    scratchpad: Optional[Mapping[str, str]],
    catalog: Optional[dict],
    catalog_path: Optional[Path],
    role: Optional[str],
    task: Optional[str],
) -> RouteResult:
    host = resolve_model_for_phase(
        phase,
        dict(scratchpad) if scratchpad is not None else None,
        catalog,
        catalog_path,
    )
    model = host.slug or host.alias or ""
    return RouteResult(
        provider="host-catalog",
        model=str(model or ""),
        profile=None,
        step="host_resolution",
        phase=phase,
        role=role,
        task=task,
        complexity=None,
        reason=None if host.success else (host.reason_code.value if host.reason_code else None),
        accepted=bool(host.success),
        source="host_resolution",
        host_result=host,
    )


def _resolve_present(
    doc: Mapping[str, Any],
    phase: str,
    *,
    role: Optional[str],
    task: Optional[str],
    explicit: Optional[Mapping[str, Any]],
    scratchpad: Mapping[str, str],
    signals: Optional[Mapping[str, Any]],
    requirements: Optional[Sequence[str]],
    provider_status: Optional[Mapping[str, Any]],
    ledger_path: Optional[Path],
) -> RouteResult:
    profiles: Mapping[str, Any] = doc["profiles"]
    thresholds = doc["complexity"]["thresholds"]
    complexity = classify_complexity(signals, thresholds)
    escalation = dict(DEFAULT_ESCALATION)
    if isinstance(doc.get("escalation"), Mapping):
        escalation.update(doc["escalation"])
    max_failures = int(escalation.get("max_failures") or 2)
    phase_requirements = doc.get("phase_requirements") or {}
    reqs = list(requirements) if requirements is not None else list(phase_requirements.get(phase) or [])

    model_key = phase_to_model_key(phase)
    tier_key = phase_to_tier_key(phase)
    direct = str(scratchpad.get(model_key) or "").strip()
    tier_value = str(scratchpad.get(tier_key) or "").strip()

    chosen_step = "global_default"
    chosen_profile: Optional[str] = None
    direct_provider: Optional[str] = None
    direct_model: Optional[str] = None

    if explicit and (explicit.get("provider") and explicit.get("model") or explicit.get("profile")):
        chosen_step = "explicit_invocation"
        if explicit.get("profile"):
            chosen_profile = str(explicit["profile"])
        else:
            direct_provider = str(explicit["provider"])
            direct_model = str(explicit["model"])
    elif direct:
        chosen_step = "explicit_invocation"
        direct_provider = "host-catalog"
        direct_model = direct
    elif task and task in doc["tasks"]:
        chosen_step = "task"
        chosen_profile = str(doc["tasks"][task]["profile"])
    elif tier_value:
        chosen_step = "phase"
        if tier_value not in TIER_TO_PROFILE:
            raise RoutingSchemaError("SCHEMA_INVALID", f"unknown tier {tier_value}")
        chosen_profile = TIER_TO_PROFILE[tier_value]
    elif phase in doc["phases"]:
        chosen_step = "phase"
        chosen_profile = str(doc["phases"][phase]["profile"])
    elif role and role in doc["roles"]:
        chosen_step = "role"
        chosen_profile = str(doc["roles"][role]["profile"])
    elif complexity in (doc["complexity"].get("routes") or {}):
        chosen_step = "complexity"
        chosen_profile = str(doc["complexity"]["routes"][complexity])
    else:
        chosen_step = "global_default"
        chosen_profile = str(doc["default"]["profile"])

    if direct_provider is not None and chosen_profile is None:
        synthetic = {
            "provider": direct_provider,
            "model": direct_model,
            "capabilities": list(explicit.get("capabilities")) if explicit and explicit.get("capabilities") else [
                "code", "tools", "reasoning", "large_context",
            ],
            "fallback": list(explicit.get("fallback") or []) if explicit else [],
        }
        walked = walk_fallback(
            "__explicit__",
            {"__explicit__": synthetic, **{k: v for k, v in profiles.items()}},
            reqs,
            provider_status,
            max_failures,
        )
        if walked["profile"] == "__explicit__":
            walked["profile"] = None
        result = RouteResult(
            provider=str(walked["provider"]),
            model=str(walked["model"]),
            profile=walked["profile"],
            step=chosen_step,
            phase=phase,
            role=role,
            task=task,
            complexity=complexity if chosen_step == "complexity" else None,
            reason=walked["reason"],
            fallback=[item for item in walked["fallback"] if item != "__explicit__"],
            accepted=bool(walked["accepted"]),
            source="routing_file",
        )
    else:
        walked = walk_fallback(
            str(chosen_profile),
            profiles,
            reqs,
            provider_status,
            max_failures,
        )
        result = RouteResult(
            provider=str(walked["provider"]),
            model=str(walked["model"]),
            profile=walked["profile"],
            step=chosen_step,
            phase=phase,
            role=role,
            task=task,
            complexity=complexity if chosen_step == "complexity" else complexity,
            reason=walked["reason"],
            fallback=list(walked["fallback"]),
            accepted=bool(walked["accepted"]),
            source="routing_file",
        )
    if ledger_path is not None:
        append_routing_log(ledger_path, result.as_log())
        result.routing_evidence_ref = str(ledger_path)
    return result


def append_routing_log(path: Path, record: Mapping[str, Any]) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    line = json.dumps(dict(record), sort_keys=True, separators=(",", ":"))
    with path.open("a", encoding="utf-8", newline="\n") as handle:
        handle.write(line + "\n")


def provider_public_view(doc: Mapping[str, Any], provider_id: str) -> Dict[str, Any]:
    provider = doc["providers"][provider_id]
    view = {
        "id": provider_id,
        "type": provider["type"],
        "api_key_env": provider["api_key_env"],
    }
    if provider.get("base_url"):
        view["base_url"] = provider["base_url"]
    return view


def file_sha256(path: Path) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()
