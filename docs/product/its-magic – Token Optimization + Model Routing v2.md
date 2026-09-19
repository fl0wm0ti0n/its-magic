# Aufgabe: its-magic Token Optimization + Model Routing v2

Analysiere zuerst den aktuellen HEAD und implementiere die folgenden Änderungen möglichst evolutionär. Bestehende Quality-/Safety-Gates dürfen nicht einfach entfernt werden.

## Hauptziele

1. Typische Runs sollen deutlich weniger Input-Tokens verbrauchen.
2. Codequalität, QA, UAT und Release-Sicherheit sollen ungefähr gleich bleiben.
3. Jede Rolle/Phase/Aufgabenklasse muss ein eigenes Modell verwenden können.
4. Modelle unterschiedlicher Provider müssen gleichzeitig unterstützt werden:
   - lokale OpenAI-kompatible APIs / LM Studio
   - OpenAI
   - OpenRouter
   - KIE.ai
   - Anthropic oder weitere Provider
5. Modellwahl darf nicht nur vom Host Cursor/OpenCode abhängen, sondern muss Teil von its-magic selbst sein.

---

# P0 – Context Pack statt Full Memory Reads

Das aktuell größte Tokenproblem sind wiederholte Reads großer Memory-Artefakte in neuen Subagent-Kontexten.

Implementiere einen deterministischen `Phase Context Pack Builder`.

Beispiel:

```text
scripts/build_phase_context.py
```

Input:

```text
phase
role
work_item_id
sprint_id
run_id
token_profile
```

Output beispielsweise:

```text
.its-magic/runtime/context-packs/<run>/<phase>.json
```

Der Pack soll nur enthalten:

```text
- aktive Story / Bug
- relevante Acceptance Criteria
- aktuelles Ziel
- aktueller Sprint/Task
- relevante Architecture-Sektion
- relevante Decisions
- Handoff-Delta der vorherigen Phase
- geänderte Source-Files / relevante Symbole
- offene Blocker
```

NICHT automatisch laden:

```text
- kompletten backlog.md
- komplette acceptance.md
- komplette architecture.md
- komplette state history
- alte Sprints
- alte Handoffs
- state archives
- token-cost history
- sämtliche Decisions
```

Regel:

> pack first -> targeted read -> bounded expansion

Ein Agent darf zusätzliche Dateien nur lesen, wenn der Context Pack nicht ausreicht.

Implementiere Limits:

```json
{
  "context": {
    "initial_budget_tokens": 6000,
    "expansion_budget_tokens": 4000,
    "max_expansions": 2,
    "max_single_artifact_tokens": 3000
  }
}
```

Bei Überschreitung nicht blind weiterlesen, sondern gezielt kleinere Sections/Symbole suchen.

---

# P0 – Große Memory-Dokumente sharden

Insbesondere:

```text
docs/engineering/architecture.md
docs/engineering/state.md
handoffs/po_to_tl.md
docs/product/backlog.md
docs/product/acceptance.md
```

dürfen nicht dauerhaft als große lineare LLM-Memory-Flächen verwendet werden.

Zielstruktur beispielsweise:

```text
docs/engineering/architecture.md
    -> nur Core Architecture + Index

docs/engineering/architecture/
    US-xxxx.md
    BUG-xxxx.md
```

Analog soll geprüft werden, ob Acceptance story-spezifisch extrahierbar bzw. shardbar ist.

`state.md` soll nur ACTIVE STATE enthalten:

```text
active story
active phase
active sprint/task
objective
blockers
next action
relevant refs
```

Historische Runtime-/Isolation-/Token-Proofs gehören nicht in normalen LLM-Kontext.

---

# P0 – Machine Evidence vom LLM Memory trennen

Diese Daten müssen weiterhin erhalten bleiben, aber normalerweise NICHT in Prompts landen:

```text
runtime proof
isolation proof
token metrics
status reconciliation details
hashes
validator evidence
archive verification
```

Verschiebe maschinenlesbare Daten z. B. nach:

```text
.its-magic/runtime/
.its-magic/evidence/
.its-magic/metrics/
```

bevorzugt JSON/JSONL.

`state.md` enthält dann nur Referenzen:

```text
runtime_evidence_ref: ...
token_metrics_ref: ...
```

Die Sicherheitsgarantie soll bleiben.

Nur die Tokenkosten der Beweisdaten sollen verschwinden.

---

# P0 – Always-On Rules drastisch verkleinern

Prüfe `.cursor/rules`, `.opencode`, Commands, Agents und Skills auf duplizierte Workflow-Regeln.

Es soll nur einen sehr kleinen permanenten Kernel geben:

```text
1. Canonical repo state beats chat memory.
2. Work only on active scope.
3. Start with generated Context Pack.
4. Use targeted reads before broad reads.
5. Never invent evidence.
6. Respect artifact ownership.
7. Mandatory QA/UAT/release gates may not be bypassed.
8. Persist only meaningful deltas.
```

Detailregeln sollen phase-/role-spezifisch geladen werden.

Vermeide, dieselben Regeln gleichzeitig in:

```text
rule
command
agent
skill
runbook
```

vollständig zu wiederholen.

Langfristig möglichst aus einem kanonischen Phase Contract generieren.

---

# P1 – Handoffs werden Delta-Handoffs

Handoffs sollen NICHT die komplette Story erneut zusammenfassen.

Neues Format ungefähr:

```yaml
story: US-xxxx
from: architecture
to: execute

changed:
  - API contract changed
  - DEC-xxxx accepted

open:
  - retry behaviour unresolved

required_reads:
  - docs/product/...
  - docs/engineering/architecture/US-xxxx.md

do_not_reload:
  - old sprint history
```

Ziel: typischer Handoff nur wenige hundert Tokens.

---

# P1 – Memory Audit: deterministic first

`/memory-audit` darf nicht standardmäßig alle Memory-Dokumente an ein LLM schicken.

Neue Reihenfolge:

```text
git diff
hash comparison
cross-reference validation
status validation
schema validation
        ↓
unresolved semantic problem?
        ↓ yes
targeted LLM analysis
```

Wenn deterministisch kein Drift gefunden wird:

```text
0 LLM calls
```

---

# P1 – Read Deduplication

Innerhalb einer Phase:

> Gleiche unveränderte Datei/Section darf nicht mehrfach vollständig gelesen werden.

Tracke mindestens:

```text
path
sha256
section/symbol
estimated_tokens
```

Große doppelte Reads sollen in Benchmarks sichtbar werden.

---

# MODEL ROUTING V2

Dieser Teil ist genauso wichtig wie die Tokenoptimierung.

Die existierende Modellkonfiguration soll zu einem echten **Model Router** ausgebaut werden.

## Grundprinzip

its-magic arbeitet intern NICHT direkt mit konkreten Models.

Stattdessen:

```text
Task/Phase
    ↓
logical model profile
    ↓
router
    ↓
provider + model + parameters
```

Beispiel:

```text
intake          -> fast
curator         -> cheap
research        -> reasoning
architecture    -> expert
execute         -> coding
qa              -> reviewer
security-review -> critical
```

---

# Zentrale host-neutrale Routing-Konfiguration

Erzeuge eine kanonische Konfiguration, z. B.:

```text
.its-magic/model-routing.json
```

Cursor/OpenCode-spezifische Model Catalogs dürfen weiterhin Adapter sein, aber NICHT die Source of Truth für Routing.

Beispiel:

```json
{
  "profiles": {
    "cheap": {
      "provider": "lmstudio",
      "model": "qwen3-coder",
      "fallback": "balanced"
    },

    "fast": {
      "provider": "openrouter",
      "model": "minimax/minimax-m2.7",
      "fallback": "balanced"
    },

    "balanced": {
      "provider": "openai",
      "model": "gpt-5.6-terra",
      "reasoning": "medium",
      "fallback": "expert"
    },

    "expert": {
      "provider": "openai",
      "model": "gpt-5.6-sol",
      "reasoning": "high"
    },

    "local-code": {
      "provider": "lmstudio",
      "model": "qwen3-coder-next"
    }
  },

  "roles": {
    "po": "fast",
    "tech-lead": "expert",
    "dev": "balanced",
    "qa": "balanced",
    "release": "cheap",
    "curator": "cheap"
  },

  "phases": {
    "intake": "fast",
    "research": "balanced",
    "architecture": "expert",
    "sprint-plan": "balanced",
    "execute": "balanced",
    "qa": "balanced",
    "verify-work": "balanced",
    "release": "cheap",
    "refresh-context": "cheap"
  }
}
```

---

# Routing-Priorität

Modellauflösung soll deterministisch sein:

```text
1. explicit invocation override
2. task override
3. phase override
4. role override
5. complexity routing
6. global default
```

Beispiel:

```text
/auto model=expert
```

oder intern:

```text
execute US-0140:
task.model = local-code
```

überschreibt die normalen Regeln.

---

# Provider-Abstraktion

Provider und Modell müssen getrennt modelliert werden.

Nicht:

```text
MODEL_DEV=gpt-5
```

sondern logisch:

```json
{
  "provider": "lmstudio",
  "model": "qwen3-coder-next"
}
```

Provider Registry beispielsweise:

```json
{
  "providers": {
    "lmstudio": {
      "type": "openai-compatible",
      "base_url": "http://localhost:1234/v1",
      "api_key_env": "LMSTUDIO_API_KEY"
    },

    "openai": {
      "type": "openai",
      "api_key_env": "OPENAI_API_KEY"
    },

    "openrouter": {
      "type": "openai-compatible",
      "base_url": "https://openrouter.ai/api/v1",
      "api_key_env": "OPENROUTER_API_KEY"
    },

    "kie": {
      "type": "openai-compatible",
      "base_url": "...",
      "api_key_env": "KIE_API_KEY"
    }
  }
}
```

Keine Secrets in Repo-Konfiguration.

---

# Wichtig: Provider wechseln dürfen

Folgender Flow muss funktionieren:

```text
/intake
  Local/cheap model

      ↓

/architecture
  OpenAI high-reasoning model

      ↓

/execute
  coding model via OpenRouter

      ↓

/qa
  anderes Modell / anderer Provider

      ↓

/refresh-context
  lokales Modell
```

Frische Subagents machen diesen Providerwechsel sogar besonders passend.

---

# Complexity Router

Zusätzlich zu festen Rollen soll ein kleiner deterministischer Complexity Classifier existieren.

Klassen:

```text
trivial
low
normal
high
critical
```

Bewertung möglichst zuerst OHNE LLM:

```text
changed files
estimated LOC
number of components
API/schema change
security/auth
migration
architecture impact
unknown dependencies
failing tests
```

Beispiel:

```text
trivial:
  docs
  formatting
  state update
  summarization
  simple file lookup

low:
  localized implementation
  isolated tests
  simple bug

normal:
  standard feature

high:
  multi-component feature
  architecture changes
  difficult debugging

critical:
  security
  auth
  destructive migration
  release blocker
```

Routing:

```text
trivial -> local cheap
low     -> local/cheap cloud
normal  -> balanced
high    -> expert
critical -> strongest configured model
```

---

# Model Capability Requirements

Nicht jedes Modell darf jede Rolle übernehmen.

Profile sollen Capabilities deklarieren können:

```json
{
  "capabilities": [
    "code",
    "tools",
    "reasoning",
    "large_context"
  ]
}
```

Eine Phase kann Anforderungen deklarieren:

```yaml
architecture:
  requires:
    - reasoning
    - large_context

execute:
  requires:
    - code
    - tools
```

Router darf nur kompatible Modelle auswählen.

Wenn nicht kompatibel:

```text
fallback chain
```

statt still ein falsches Modell zu benutzen.

---

# Fallback Chains

Beispiel:

```text
local-code
    ↓ unavailable
balanced
    ↓ unavailable
expert
```

Fallback-Gründe loggen:

```text
MODEL_UNAVAILABLE
MODEL_CAPABILITY_MISMATCH
MODEL_CONTEXT_TOO_SMALL
PROVIDER_UNAVAILABLE
MODEL_RATE_LIMITED
```

Aber keine umfangreichen Logs in `state.md`.

---

# Optional: Escalation während einer Phase

Sehr wichtig für Kostenoptimierung:

Eine Phase darf billig starten und bei Problemen auf ein stärkeres Modell eskalieren.

Beispiel:

```text
execute
    ↓
local model
    ↓
tests fail repeatedly / uncertainty high
    ↓
OpenAI expert model
```

Konfigurierbar:

```json
{
  "escalation": {
    "max_failures": 2,
    "on_context_overflow": true,
    "on_repeated_test_failure": true,
    "on_uncertainty": true
  }
}
```

So muss nicht jede Aufgabe von Beginn an das teuerste Modell verwenden.

---

# Role + Task Overrides

Neben Phase/Role Routing müssen einzelne Task-Typen konfigurierbar sein.

Beispiel:

```json
{
  "tasks": {
    "summarize": "cheap",
    "context-pack": "cheap",
    "documentation": "cheap",
    "code-search": "local-code",
    "implementation": "balanced",
    "debug-complex": "expert",
    "architecture-decision": "expert",
    "security-review": "critical"
  }
}
```

Damit kann innerhalb derselben Rolle das Modell wechseln.

---

# Token Profile und Model Profile NICHT vermischen

Diese beiden Konzepte getrennt halten:

```text
TOKEN_PROFILE
  bestimmt wie viel Context geladen wird

MODEL_PROFILE
  bestimmt welches Modell arbeitet
```

Beispiele:

```text
TOKEN_PROFILE=lean
MODEL_PROFILE=expert
```

ist legitim:

> sehr wenig, aber hochrelevanter Kontext + starkes Modell.

Und:

```text
TOKEN_PROFILE=balanced
MODEL_PROFILE=local
```

ebenfalls.

---

# Empfohlene Default-Verteilung

Nicht zwingend konkrete Modellnamen hardcoden.

Logische Defaults:

```text
Curator / Context Compression:
    cheap/local

Intake / einfache PO-Arbeit:
    cheap/fast

Research:
    balanced

Architecture:
    expert

Sprint Planning:
    balanced

Code Search / Repo Mapping:
    cheap/local

Execute simple:
    local-code

Execute normal:
    balanced coding

Execute complex:
    expert coding

QA:
    bevorzugt anderes Modell als Implementierung,
    falls konfiguriert

Security:
    strongest configured

Release:
    cheap/balanced
```

Besonders wichtig:

> QA sollte optional bewusst ein anderes Modell als DEV verwenden können.

Das reduziert gemeinsame Fehlerbilder.

---

# Routing muss beobachtbar sein

Pro Phase nur kompakt loggen:

```json
{
  "phase": "execute",
  "role": "dev",
  "task": "implementation",
  "complexity": "normal",
  "profile": "balanced",
  "provider": "openai",
  "model": "...",
  "reason": "phase+complexity",
  "fallback": false
}
```

Damit später analysierbar ist:

```text
welches Modell
welcher Provider
welche Tokens
welche Kosten
welche Qualität
```

---

# Benchmark erweitern

Vergleiche nicht nur Tokens.

Pro Run speichern:

```text
input tokens
cached input
output tokens
requests
provider
model
phase
context pack size
context expansions
duplicate reads
latency
estimated/actual cost
test result
QA cycles
acceptance result
UAT result
release result
```

Wichtige Kennzahl:

```text
quality / token
```

und:

```text
quality / €
```

Testmatrix:

```text
tiny bug
small feature
normal feature
cross-cutting feature
hard debugging
pause/resume
QA repair loop
```

Vergleiche:

```text
current framework
vs
new context-pack architecture
```

und:

```text
all-expert-model
vs
dynamic routing
```

---

# Qualitätsmechanismen NICHT entfernen

Beibehalten:

```text
fresh subagent contexts
canonical repo memory
QA
UAT / verify-work
release gate
decision gates
tests
artifact ownership
runtime verification bei relevanten Anwendungen
security-sensitive escalation
```

Optimiert werden soll:

```text
was davon das Modell lesen muss
wie oft es gelesen wird
welches Modell es liest
```

---

# Zielwerte

Nach Umsetzung:

```text
typischer logical input:
-40 bis -55 %

duplicate large reads:
< 10 %

static bootstrap pro Phase:
< 1500 Tokens

Context Pack:
meist < 8k Tokens

QA/UAT Qualität:
nicht relevant schlechter als vorher
```

Durch Model Routing zusätzlich:

```text
teure Frontier-Model-Tokens:
deutlich reduzieren

lokale Modelle:
für einfache/deterministische Aufgaben bevorzugen

Frontier Modelle:
für schwierige Reasoning-/Coding-/Security-Aufgaben reservieren
```

---

# Implementierungsreihenfolge

1. Bestehendes Model-Routing vollständig inventarisieren.
2. Bestehende Token-/Context-Reads instrumentieren.
3. Provider Registry + Model Router v2 bauen.
4. Phase/Role/Task/Complexity Resolution implementieren.
5. Fallback + escalation implementieren.
6. Phase Context Pack Builder implementieren.
7. `/auto` auf pack-first umstellen.
8. Always-on Rules reduzieren.
9. State/Architecture/Handoff Sharding.
10. Memory Audit delta-first.
11. Token + Model Routing Benchmark erweitern.
12. Erst danach Defaults auf neues Verhalten umstellen.

Bestehende Konfigurationen müssen möglichst migrationsfähig bleiben.

Alte `MODEL_*` Einstellungen wenn möglich als Compatibility Adapter auf das neue Routing abbilden, statt sie abrupt zu entfernen.