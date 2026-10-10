#!/usr/bin/env python3
"""Verify active vs template/scripts/ bytes match for DEC-0063 intake gate modules (BUG-0001).

Scoped modes (DEC-0073 §10 / US-0090):
  --scope=intake          (default) DEC-0063 intake pair table.
  --scope=caveman-compress DEC-0073 caveman input-compression pair table.
  --scope=readme-feature-coverage DEC-0074 README feature-coverage pair table.
  --scope=downstream-ci-guard   DEC-0075 downstream CI guard script pair table.
  --scope=us-0092               DEC-0078 full-autonomy outer driver + probe surfaces.
  --scope=us-0093               DEC-0079 browser UAT probe surfaces.
  --scope=us-0095               DEC-0080 native in-chat auto-chain surfaces.
  --scope=bug-0012              DEC-0081 native-chain compliance surfaces (BUG-0012).
  --scope=us-0096               DEC-0082 delivery modes surfaces (US-0096).
  --scope=project-readme        DEC-0083 project README bootstrap surfaces (US-0097).
  --scope=dev-environment       DEC-0084 dev auto-launch profile surfaces (US-0098).
  --scope=sovereign-parallel-dev DEC-0108 parallel instance arbitrage surfaces (US-0108).
  --scope=sovereign-self-healing-deploy DEC-0109 self-healing deploy loop surfaces (US-0109).
  --scope=release-trigger-adapter DEC-0111 release trigger adapter surfaces (US-0111).
  --scope=us-0119               DEC-0119 autonomous-autonomy preset surfaces (US-0119).
  --scope=us-0120               US-0120 dedicated /closure phase surfaces.
  --scope=opencode-adapter       US-0121 OpenCode host pack + --host cursor/opencode/both surfaces.
  --scope=sovereign-critic       US-0127 sovereign critic hygiene script pair.
  --scope=sovereign-convergence  US-0110 convergence lib + validator pair table.
  --scope=bug-0015               BUG-0015 OpenCode /auto dispatch attach surfaces.
  --scope=bug-0016               BUG-0016 OpenCode Layer-1 agent permission surfaces.
  --scope=bug-0019               BUG-0019 OpenCode /auto slash listing surfaces.
  --scope=autonomy-flags         BUG-0032 semantic declared-mirror drift-detect
                                 (AUTONOMY_PRESET / AUTONOMY_STOP_POLICY across the
                                 config baseline and the live scratchpad; a dedicated
                                 SEMANTIC scope, NOT a byte-pair SCOPES entry;
                                 drift-DETECT only, not drift-FIX).
  --scope=all              union of all byte-pair tables, plus the semantic
                           autonomy-flags drift-detect invoked after them.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

INTAKE_TEMPLATE_PAIRS: tuple[tuple[str, str], ...] = (
    ("scripts/intake_evidence_validate.py", "template/scripts/intake_evidence_validate.py"),
    ("scripts/intake_evidence_lib.py", "template/scripts/intake_evidence_lib.py"),
    ("scripts/intake_bug_routing_guard.py", "template/scripts/intake_bug_routing_guard.py"),
    ("scripts/intake_bug_resume_brief_refresh.py", "template/scripts/intake_bug_resume_brief_refresh.py"),
    ("scripts/check_intake_template_parity.py", "template/scripts/check_intake_template_parity.py"),
)

# DEC-0073 §10 / US-0090 — Caveman input-compression surface pairs. Contents
# must be byte-identical between active and template paths; installer delivers
# template copies (BUG-0003 / DEC-0066).
CAVEMAN_COMPRESS_PAIRS: tuple[tuple[str, str], ...] = (
    ("scripts/caveman_compress_input.py", "template/scripts/caveman_compress_input.py"),
    ("docs/engineering/context/installer-owned-paths.manifest",
     "template/docs/engineering/context/installer-owned-paths.manifest"),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    ("docs/engineering/auto-orchestration-reference.md",
     "template/docs/engineering/auto-orchestration-reference.md"),
)

README_FEATURE_COVERAGE_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/validate_readme_feature_coverage.py",
        "template/scripts/validate_readme_feature_coverage.py",
    ),
    (
        "scripts/readme_feature_coverage_lib.py",
        "template/scripts/readme_feature_coverage_lib.py",
    ),
    (
        "docs/engineering/context/readme-section-affinity.json",
        "template/docs/engineering/context/readme-section-affinity.json",
    ),
    (".cursor/commands/release.md", "template/.cursor/commands/release.md"),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

US0092_PAIRS: tuple[tuple[str, str], ...] = (
    ("scripts/auto_outer_driver.py", "template/scripts/auto_outer_driver.py"),
    ("scripts/uat_probe_lib.py", "template/scripts/uat_probe_lib.py"),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
    (".cursor/commands/auto.md", "template/.cursor/commands/auto.md"),
    (".cursor/commands/verify-work.md", "template/.cursor/commands/verify-work.md"),
    (".cursor/commands/qa.md", "template/.cursor/commands/qa.md"),
    (
        "docs/engineering/auto-orchestration-reference.md",
        "template/docs/engineering/auto-orchestration-reference.md",
    ),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
)

US0093_PAIRS: tuple[tuple[str, str], ...] = (
    ("scripts/uat_probe_lib.py", "template/scripts/uat_probe_lib.py"),
    (".cursor/commands/verify-work.md", "template/.cursor/commands/verify-work.md"),
    (".cursor/commands/qa.md", "template/.cursor/commands/qa.md"),
    (".cursor/commands/execute.md", "template/.cursor/commands/execute.md"),
    (
        ".cursor/scratchpad.local.example.md",
        "template/.cursor/scratchpad.local.example.md",
    ),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    (
        "docs/engineering/auto-orchestration-reference.md",
        "template/docs/engineering/auto-orchestration-reference.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
)

US0095_PAIRS: tuple[tuple[str, str], ...] = (
    (".cursor/commands/auto.md", "template/.cursor/commands/auto.md"),
    (
        "docs/engineering/auto-orchestration-reference.md",
        "template/docs/engineering/auto-orchestration-reference.md",
    ),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    ("README.md", "template/README.md"),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

BUG0012_PAIRS: tuple[tuple[str, str], ...] = (
    (".cursor/commands/auto.md", "template/.cursor/commands/auto.md"),
    (
        "docs/engineering/auto-orchestration-reference.md",
        "template/docs/engineering/auto-orchestration-reference.md",
    ),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

US0096_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".cursor/scratchpad.local.example.md",
        "template/.cursor/scratchpad.local.example.md",
    ),
    (".cursor/commands/auto.md", "template/.cursor/commands/auto.md"),
    (
        "docs/engineering/auto-orchestration-reference.md",
        "template/docs/engineering/auto-orchestration-reference.md",
    ),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    (".cursor/commands/quick.md", "template/.cursor/commands/quick.md"),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
    ("scripts/pack_json_validate.py", "template/scripts/pack_json_validate.py"),
)

PROJECT_README_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/validate_project_readme_coverage.py",
        "template/scripts/validate_project_readme_coverage.py",
    ),
    (
        "scripts/project_readme_coverage_lib.py",
        "template/scripts/project_readme_coverage_lib.py",
    ),
    (".cursor/commands/execute.md", "template/.cursor/commands/execute.md"),
    (".cursor/commands/release.md", "template/.cursor/commands/release.md"),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
    (
        ".cursor/scratchpad.local.example.md",
        "template/.cursor/scratchpad.local.example.md",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

DEV_ENVIRONMENT_PAIRS: tuple[tuple[str, str], ...] = (
    (".cursor/commands/execute.md", "template/.cursor/commands/execute.md"),
    (".cursor/scratchpad.md", "template/.cursor/scratchpad.md"),
    (
        ".cursor/scratchpad.local.example.md",
        "template/.cursor/scratchpad.local.example.md",
    ),
    (
        "template/.cursor/dev-environment.json.example",
        "template/.cursor/dev-environment.json.example",
    ),
    (
        "scripts/dev_environment_lib.py",
        "template/scripts/dev_environment_lib.py",
    ),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    (
        "docs/engineering/auto-orchestration-reference.md",
        "template/docs/engineering/auto-orchestration-reference.md",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

RELEASE_CHANGELOG_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/release_changelog_lib.py",
        "template/scripts/release_changelog_lib.py",
    ),
    (
        "scripts/release_changelog_validate.py",
        "template/scripts/release_changelog_validate.py",
    ),
    (
        "scripts/release_changelog_backfill.py",
        "template/scripts/release_changelog_backfill.py",
    ),
    (".cursor/commands/release.md", "template/.cursor/commands/release.md"),
    ("scripts/release-all.sh", "template/scripts/release-all.sh"),
    (
        "template/handoffs/releases/vX.Y.Z-release-notes.md.example",
        "template/handoffs/releases/vX.Y.Z-release-notes.md.example",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

MODEL_TIER_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/model_tier_lib.py",
        "template/scripts/model_tier_lib.py",
    ),
    (
        "scripts/model_tier_validate.py",
        "template/scripts/model_tier_validate.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        ".cursor/scratchpad.md",
        "template/.cursor/scratchpad.md",
    ),
    (
        ".cursor/scratchpad.local.example.md",
        "template/.cursor/scratchpad.local.example.md",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

MODEL_TIER_OVERRIDES_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".cursor/scratchpad.md",
        "template/.cursor/scratchpad.md",
    ),
    (
        ".cursor/scratchpad.local.example.md",
        "template/.cursor/scratchpad.local.example.md",
    ),
    (
        ".cursor/model-catalog.local.example.role-based-balanced.json",
        "template/.cursor/model-catalog.local.example.role-based-balanced.json",
    ),
    (
        ".cursor/model-catalog.local.example.role-based-highend.json",
        "template/.cursor/model-catalog.local.example.role-based-highend.json",
    ),
    (
        "scripts/model_tier_lib.py",
        "template/scripts/model_tier_lib.py",
    ),
    (
        "scripts/model_tier_validate.py",
        "template/scripts/model_tier_validate.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        ".cursor/model-catalog.local.example.role-based-balanced_cursor_only.json",
        "template/.cursor/model-catalog.local.example.role-based-balanced_cursor_only.json",
    ),
)

DOWNSTREAM_CI_GUARD_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/check_downstream_ci_guard.py",
        "template/scripts/check_downstream_ci_guard.py",
    ),
    (
        "scripts/downstream_ci_guard_lib.py",
        "template/scripts/downstream_ci_guard_lib.py",
    ),
)

SOVEREIGN_ROLE_MANIFEST_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".cursor/sovereign-role-manifest.yaml",
        "template/.cursor/sovereign-role-manifest.yaml.example",
    ),
    (
        ".cursor/scratchpad.md",
        "template/.cursor/scratchpad.md",
    ),
    (
        "scripts/sovereign_role_manifest_validate.py",
        "template/scripts/sovereign_role_manifest_validate.py",
    ),
    (
        "scripts/sovereign_role_manifest_lib.py",
        "template/scripts/sovereign_role_manifest_lib.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/reason_codes.md",
        "template/docs/engineering/reason_codes.md",
    ),
    (
        "handoffs/sovereign_role_reviews.jsonl",
        "template/handoffs/sovereign_role_reviews.jsonl",
    ),
)

SOVEREIGN_PARALLEL_DEV_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".cursor/scratchpad.md",
        "template/.cursor/scratchpad.md",
    ),
    (
        "scripts/parallel_dev_arbiter.py",
        "template/scripts/parallel_dev_arbiter.py",
    ),
    (
        "tests/us0108_contract_test.py",
        "template/tests/us0108_contract_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/reason_codes.md",
        "template/docs/engineering/reason_codes.md",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

SOVEREIGN_SELF_HEALING_DEPLOY_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".cursor/scratchpad.md",
        "template/.cursor/scratchpad.md",
    ),
    (
        "scripts/self_healing_deploy_lib.py",
        "template/scripts/self_healing_deploy_lib.py",
    ),
    (
        "scripts/self_healing_deploy_validate.py",
        "template/scripts/self_healing_deploy_validate.py",
    ),
    (
        "tests/us0109_contract_test.py",
        "template/tests/us0109_contract_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/reason_codes.md",
        "template/docs/engineering/reason_codes.md",
    ),
)

# US-0111 release trigger adapter parity pairs
RELEASE_TRIGGER_ADAPTER_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/release_trigger_adapters.py",
        "template/scripts/release_trigger_adapters.py",
    ),
    (
        "tests/us0111_contract_test.py",
        "template/tests/us0111_contract_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/reason_codes.md",
        "template/docs/engineering/reason_codes.md",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

# DEC-0118 §6 / US-0118 — Work-kind routing surface pairs. Contents must
# be byte-identical between active and template paths; installer delivers
# template copies (BUG-0003 / DEC-0066). 6 surface pairs per R-0106 Q6
# LOCKED. Note: scratchpad key parity is structural (key presence) via
# BUG-0013 test, NOT byte-parity (active scratchpad carries project-local
# overrides like DELIVERY_MODE=ultra_lean that must not leak to template).
WORK_KIND_ROUTING_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/work_kind_classify_lib.py",
        "template/scripts/work_kind_classify_lib.py",
    ),
    (
        "scripts/work_kind_routing_lib.py",
        "template/scripts/work_kind_routing_lib.py",
    ),
    (
        "tests/us0118_contract_test.py",
        "template/tests/us0118_contract_test.py",
    ),
    (".cursor/commands/auto.md", "template/.cursor/commands/auto.md"),
    (".cursor/commands/intake.md", "template/.cursor/commands/intake.md"),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

# DEC-0119 §6 / US-0119 — Autonomous-autonomy preset surfaces. Contents must
# be byte-identical between active and template paths. 8 surface pairs.
AUTONOMY_PRESET_PAIRS: tuple[tuple[str, str], ...] = (
    ("scripts/autonomy_preset_lib.py", "template/scripts/autonomy_preset_lib.py"),
    ("scripts/validate_autonomy_stop_matrix.py", "template/scripts/validate_autonomy_stop_matrix.py"),
    ("docs/engineering/autonomy-stop-matrix.md", "template/docs/engineering/autonomy-stop-matrix.md"),
    ("docs/engineering/context/installer-owned-paths.manifest", "template/docs/engineering/context/installer-owned-paths.manifest"),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    (".cursor/commands/auto.md", "template/.cursor/commands/auto.md"),
    ("tests/us0119_autonomy_preset_test.py", "template/tests/us0119_autonomy_preset_test.py"),
)

# US-0120 — Dedicated /closure phase surfaces. Contents must be byte-identical
# between active and template paths.
CLOSURE_PHASE_PAIRS: tuple[tuple[str, str], ...] = (
    (".cursor/commands/closure.md", "template/.cursor/commands/closure.md"),
    (".cursor/commands/release.md", "template/.cursor/commands/release.md"),
    (".cursor/commands/auto.md", "template/.cursor/commands/auto.md"),
    (
        "scripts/validate_closure_verification.py",
        "template/scripts/validate_closure_verification.py",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
)

# US-0121 — OpenCode adapter host pack + --host cursor/opencode/both surfaces
# (DEC-0120). Pairs the manifest, the parity checker itself (edited in
# lockstep), and the contract test file. Pack files under template/.opencode/
# are template-only (Q9 YAGNI: no kit-repo active .opencode/ mirror), so they
# are not parity-paired here; the contract test (marker 11) asserts manifest
# membership for the pack rows.
OPENCODE_ADAPTER_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
    (
        "scripts/check_intake_template_parity.py",
        "template/scripts/check_intake_template_parity.py",
    ),
    (
        "tests/us0121_host_mode_test.py",
        "template/tests/us0121_host_mode_test.py",
    ),
    (
        "tests/us0122_contract_test.py",
        "template/tests/us0122_contract_test.py",
    ),
    (
        "tests/us0123_contract_test.py",
        "template/tests/us0123_contract_test.py",
    ),
    (
        "tests/us0124_contract_test.py",
        "template/tests/us0124_contract_test.py",
    ),
    (
        "tests/us0125_contract_test.py",
        "template/tests/us0125_contract_test.py",
    ),
    (
        "tests/us0126_contract_test.py",
        "template/tests/us0126_contract_test.py",
    ),
    (
        "scripts/model_tier_validate.py",
        "template/scripts/model_tier_validate.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    # BUG-0016 / DEC-0122 §7 — active↔template agent inventory byte-identical
    (".opencode/agents/po.md", "template/.opencode/agents/po.md"),
    (".opencode/agents/tech-lead.md", "template/.opencode/agents/tech-lead.md"),
    (".opencode/agents/dev.md", "template/.opencode/agents/dev.md"),
    (".opencode/agents/qa.md", "template/.opencode/agents/qa.md"),
    (".opencode/agents/release.md", "template/.opencode/agents/release.md"),
    (".opencode/agents/curator.md", "template/.opencode/agents/curator.md"),
    (".opencode/agents/security.md", "template/.opencode/agents/security.md"),
    (".opencode/agents/auto.md", "template/.opencode/agents/auto.md"),
    (
        "tests/bug0016_contract_test.py",
        "template/tests/bug0016_contract_test.py",
    ),
)

# BUG-0016 additive: Layer-1 permission agent surfaces + contract test.
BUG0016_PAIRS: tuple[tuple[str, str], ...] = (
    (".opencode/agents/po.md", "template/.opencode/agents/po.md"),
    (".opencode/agents/tech-lead.md", "template/.opencode/agents/tech-lead.md"),
    (".opencode/agents/dev.md", "template/.opencode/agents/dev.md"),
    (".opencode/agents/qa.md", "template/.opencode/agents/qa.md"),
    (".opencode/agents/release.md", "template/.opencode/agents/release.md"),
    (".opencode/agents/curator.md", "template/.opencode/agents/curator.md"),
    (".opencode/agents/security.md", "template/.opencode/agents/security.md"),
    (".opencode/agents/auto.md", "template/.opencode/agents/auto.md"),
    (
        "tests/bug0016_contract_test.py",
        "template/tests/bug0016_contract_test.py",
    ),
    (
        "tests/us0122_contract_test.py",
        "template/tests/us0122_contract_test.py",
    ),
)

# US-0127 additive: hygiene CLI pair. Existing scopes unchanged.
SOVEREIGN_CRITIC_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/sovereign_critic_hygiene.py",
        "template/scripts/sovereign_critic_hygiene.py",
    ),
    (
        "scripts/sovereign_critic_lib.py",
        "template/scripts/sovereign_critic_lib.py",
    ),
)

# Confirmed / added if missing (architecture DQ5 + T-006): convergence lib mirror.
SOVEREIGN_CONVERGENCE_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/sovereign_convergence_lib.py",
        "template/scripts/sovereign_convergence_lib.py",
    ),
    (
        "scripts/sovereign_convergence_validate.py",
        "template/scripts/sovereign_convergence_validate.py",
    ),
    (
        ".cursor/commands/qa.md",
        "template/.cursor/commands/qa.md",
    ),
    (
        ".cursor/commands/verify-work.md",
        "template/.cursor/commands/verify-work.md",
    ),
)

# BUG-0015 additive: OpenCode /auto dispatch attach surfaces (plugin/command/bridge/test).
BUG0015_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".opencode/plugins/orchestrator.ts",
        "template/.opencode/plugins/orchestrator.ts",
    ),
    (
        "scripts/opencode_auto_bridge.py",
        "template/scripts/opencode_auto_bridge.py",
    ),
    (
        "tests/bug0015_contract_test.py",
        "template/tests/bug0015_contract_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
)

# BUG-0019 historical evidence retained after BUG-0030 command migration.
BUG0019_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".opencode/plugins/orchestrator.ts",
        "template/.opencode/plugins/orchestrator.ts",
    ),
    (
        "tests/bug0019_opencode_auto_slash_listing_test.py",
        "template/tests/bug0019_opencode_auto_slash_listing_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
)

# BUG-0020 additive: project tui.json CLI TUI load path (keep BUG0019_PAIRS).
BUG0020_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".opencode/tui.json",
        "template/.opencode/tui.json",
    ),
    (
        ".opencode/plugins/orchestrator.ts",
        "template/.opencode/plugins/orchestrator.ts",
    ),
    (
        "tests/bug0020_opencode_desktop_command_info_listing_test.py",
        "template/tests/bug0020_opencode_desktop_command_info_listing_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
)

# BUG-0021 historical evidence retained after BUG-0030 command migration.
BUG0021_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".opencode/tui.json",
        "template/.opencode/tui.json",
    ),
    (
        ".opencode/plugins/orchestrator.ts",
        "template/.opencode/plugins/orchestrator.ts",
    ),
    (
        "tests/bug0021_opencode_cli_tui_plugin_load_test.py",
        "template/tests/bug0021_opencode_cli_tui_plugin_load_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
)

# BUG-0023 historical evidence retained after BUG-0030 command migration.
BUG0023_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".opencode/plugins/orchestrator.ts",
        "template/.opencode/plugins/orchestrator.ts",
    ),
    (
        "tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py",
        "template/tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
)

# BUG-0024 historical evidence retained after BUG-0030 command migration.
BUG0024_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".opencode/plugins/orchestrator.ts",
        "template/.opencode/plugins/orchestrator.ts",
    ),
    (
        "tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py",
        "template/tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
)

# BUG-0027 additive: OpenCode manual-phase persist surfaces (keep BUG0024_PAIRS).
BUG0027_PAIRS: tuple[tuple[str, str], ...] = (
    (
        ".opencode/plugins/orchestrator.ts",
        "template/.opencode/plugins/orchestrator.ts",
    ),
    (
        "scripts/opencode_auto_bridge.py",
        "template/scripts/opencode_auto_bridge.py",
    ),
    (".opencode/agents/dev.md", "template/.opencode/agents/dev.md"),
    (".opencode/agents/qa.md", "template/.opencode/agents/qa.md"),
    (
        ".opencode/commands/intake.md",
        "template/.opencode/commands/intake.md",
    ),
    (
        ".opencode/commands/execute.md",
        "template/.opencode/commands/execute.md",
    ),
    (
        ".opencode/commands/discovery.md",
        "template/.opencode/commands/discovery.md",
    ),
    (".opencode/commands/qa.md", "template/.opencode/commands/qa.md"),
    (
        ".opencode/commands/verify-work.md",
        "template/.opencode/commands/verify-work.md",
    ),
    (
        "tests/bug0027_opencode_manual_phase_persist_test.py",
        "template/tests/bug0027_opencode_manual_phase_persist_test.py",
    ),
    (
        "tests/bug0027_persist_harness.mjs",
        "template/tests/bug0027_persist_harness.mjs",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
)


def check_release_changelog_semantics(root: Path) -> tuple[bool, str]:
    """Check the shared changelog contract without conflating lifecycle ledgers.

    The active changelog records this repository's released history. The template
    is a clean install baseline and therefore intentionally omits that history.
    Both must nevertheless retain the common US-0100 format anchors used by the
    release tools. This is semantic parity, not an unsafe byte-copy of release
    history into newly generated repositories.
    """
    required = ("# Changelog", "Keep a Changelog", "## [Unreleased]")
    for rel in ("CHANGELOG.md", "template/CHANGELOG.md"):
        path = root / rel
        if not path.is_file():
            return False, f"missing file: {rel}"
        text = path.read_text(encoding="utf-8")
        for marker in required:
            if marker not in text:
                return False, f"semantic mismatch: {rel} missing {marker!r}"
    return True, ""

# BUG-0030: documented Markdown /auto command and retired private TUI/RPC route.
BUG0030_PAIRS: tuple[tuple[str, str], ...] = (
    (".opencode/commands/auto.md", "template/.opencode/commands/auto.md"),
    (".opencode/tui.json", "template/.opencode/tui.json"),
    (
        "tests/bug0030_opencode_auto_command_test.py",
        "template/tests/bug0030_opencode_auto_command_test.py",
    ),
    ("docs/engineering/runbook.md", "template/docs/engineering/runbook.md"),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
)

# BUG-0033 additive (R-0159 DQ3): the five thin OpenCode command bodies that
# carry the DQ1/DQ2 diagnostics-only `## Stop conditions` + `## Fail-safe reason
# codes` pair, plus the BUG-0033 10-marker parity test and its template twin.
# Byte-identity enforces active==template for every pair (the same guarantee the
# T-001 edits establish). The test-file pair is byte-identical by T-004.
BUG0033_PAIRS: tuple[tuple[str, str], ...] = (
    (".opencode/commands/closure.md", "template/.opencode/commands/closure.md"),
    (".opencode/commands/ask.md", "template/.opencode/commands/ask.md"),
    (".opencode/commands/auto.md", "template/.opencode/commands/auto.md"),
    (
        ".opencode/commands/refresh-context.md",
        "template/.opencode/commands/refresh-context.md",
    ),
    (".opencode/commands/execute.md", "template/.opencode/commands/execute.md"),
    (
        "tests/bug0033_opencode_command_parity_test.py",
        "template/tests/bug0033_opencode_command_parity_test.py",
    ),
)

# US-0129 additive: linkage guard + refresh-context wiring + contract test.
ARCH_LINKAGE_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/arch_linkage_guard.py",
        "template/scripts/arch_linkage_guard.py",
    ),
    (
        ".cursor/commands/refresh-context.md",
        "template/.cursor/commands/refresh-context.md",
    ),
    (
        "tests/us0129_contract_test.py",
        "template/tests/us0129_contract_test.py",
    ),
    (
        "docs/engineering/reason_codes.md",
        "template/docs/engineering/reason_codes.md",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        ".cursor/scratchpad.md",
        "template/.cursor/scratchpad.md",
    ),
)

# US-0131 additive: host-neutral runtime config surfaces.
US0131_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/host_runtime_config_lib.py",
        "template/scripts/host_runtime_config_lib.py",
    ),
    (
        ".its-magic/config.example.json",
        "template/.its-magic/config.example.json",
    ),
    (
        "tests/us0131_contract_test.py",
        "template/tests/us0131_contract_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
)

# US-0132 additive: model-config contract surfaces.
US0132_PAIRS: tuple[tuple[str, str], ...] = (
    (
        "scripts/model_tier_validate.py",
        "template/scripts/model_tier_validate.py",
    ),
    (
        "scripts/model_tier_lib.py",
        "template/scripts/model_tier_lib.py",
    ),
    (
        "tests/us0132_contract_test.py",
        "template/tests/us0132_contract_test.py",
    ),
    (
        "docs/engineering/runbook.md",
        "template/docs/engineering/runbook.md",
    ),
    (
        "docs/engineering/context/installer-owned-paths.manifest",
        "template/docs/engineering/context/installer-owned-paths.manifest",
    ),
    (
        "README.md",
        "template/README.md",
    ),
)

SCOPES: dict[str, tuple[tuple[str, str], ...]] = {
    "intake": INTAKE_TEMPLATE_PAIRS,
    "caveman-compress": CAVEMAN_COMPRESS_PAIRS,
    "readme-feature-coverage": README_FEATURE_COVERAGE_PAIRS,
    "downstream-ci-guard": DOWNSTREAM_CI_GUARD_PAIRS,
    "us-0092": US0092_PAIRS,
    "us-0093": US0093_PAIRS,
    "us-0095": US0095_PAIRS,
    "bug-0012": BUG0012_PAIRS,
    "us-0096": US0096_PAIRS,
    "project-readme": PROJECT_README_PAIRS,
    "dev-environment": DEV_ENVIRONMENT_PAIRS,
    "release-changelog": RELEASE_CHANGELOG_PAIRS,
    "model-tier": MODEL_TIER_PAIRS,
    "model-tier-overrides": MODEL_TIER_OVERRIDES_PAIRS,
    "sovereign-role-manifest": SOVEREIGN_ROLE_MANIFEST_PAIRS,
    "sovereign-parallel-dev": SOVEREIGN_PARALLEL_DEV_PAIRS,
    "sovereign-self-healing-deploy": SOVEREIGN_SELF_HEALING_DEPLOY_PAIRS,
    "release-trigger-adapter": RELEASE_TRIGGER_ADAPTER_PAIRS,
    "work-kind-routing": WORK_KIND_ROUTING_PAIRS,
    "us-0119": AUTONOMY_PRESET_PAIRS,
    "us-0120": CLOSURE_PHASE_PAIRS,
    "opencode-adapter": OPENCODE_ADAPTER_PAIRS,
    "sovereign-critic": SOVEREIGN_CRITIC_PAIRS,
    "sovereign-convergence": SOVEREIGN_CONVERGENCE_PAIRS,
    "arch-linkage": ARCH_LINKAGE_PAIRS,
    "bug-0015": BUG0015_PAIRS,
    "bug-0016": BUG0016_PAIRS,
    "bug-0019": BUG0019_PAIRS,
    "bug-0020": BUG0020_PAIRS,
    "bug-0021": BUG0021_PAIRS,
    "bug-0023": BUG0023_PAIRS,
    "bug-0024": BUG0024_PAIRS,
    "bug-0027": BUG0027_PAIRS,
    "bug-0030": BUG0030_PAIRS,
    "bug-0033": BUG0033_PAIRS,
    "us-0131": US0131_PAIRS,
    "us-0132": US0132_PAIRS,
    # BUG-0032 (R-0156 DQ1): a dedicated SEMANTIC scope, NOT a byte-pair table.
    # The empty tuple is only an argparse-registered sentinel; the real check
    # runs in check_autonomy_flags() and is invoked by main() before the byte
    # loop for --scope=autonomy-flags and AFTER the byte loop for --scope=all.
    # It intentionally fails on the real repo until the operator remediates
    # the observed drift (drift-DETECT, not drift-FIX; T-005 = operator step).
    "autonomy-flags": (),
    "all": (
        INTAKE_TEMPLATE_PAIRS
        + CAVEMAN_COMPRESS_PAIRS
        + README_FEATURE_COVERAGE_PAIRS
        + DOWNSTREAM_CI_GUARD_PAIRS
        + US0092_PAIRS
        + US0093_PAIRS
        + US0095_PAIRS
        + BUG0012_PAIRS
        + US0096_PAIRS
        + PROJECT_README_PAIRS
        + DEV_ENVIRONMENT_PAIRS
        + RELEASE_CHANGELOG_PAIRS
        + MODEL_TIER_PAIRS
        + MODEL_TIER_OVERRIDES_PAIRS
        + SOVEREIGN_ROLE_MANIFEST_PAIRS
        + SOVEREIGN_SELF_HEALING_DEPLOY_PAIRS
        + RELEASE_TRIGGER_ADAPTER_PAIRS
        + WORK_KIND_ROUTING_PAIRS
        + AUTONOMY_PRESET_PAIRS
        + CLOSURE_PHASE_PAIRS
        + OPENCODE_ADAPTER_PAIRS
        + SOVEREIGN_CRITIC_PAIRS
        + SOVEREIGN_CONVERGENCE_PAIRS
        + ARCH_LINKAGE_PAIRS
        + BUG0015_PAIRS
        + BUG0016_PAIRS
        + BUG0019_PAIRS
        + BUG0020_PAIRS
        + BUG0021_PAIRS
        + BUG0023_PAIRS
        + BUG0024_PAIRS
        + BUG0027_PAIRS
        + BUG0030_PAIRS
        + BUG0033_PAIRS
        + US0131_PAIRS
        + US0132_PAIRS
    ),
}


# ---------------------------------------------------------------------------
# BUG-0032 (R-0156 DQ1/DQ2/DQ3, AC-2/AC-3) — semantic declared-mirror
# drift-detect for exactly two autonomy keys.  A dedicated SEMANTIC scope,
# NOT a byte-pair SCOPES entry.  Reads the shared baseline (JSONC
# ``.its-magic/config.json shared.<key>``) against the live scratchpad
# (``.cursor/scratchpad.md`` ``KEY=VALUE``) and fails CLOSED on any
# divergence / missing / duplicate / unreadable / unparseable input.
#
# Drift-DETECT only (NOT drift-FIX).  Remediation is the operator's
# live-wins sync, documented in ``runbook.md`` (§ AUTONOMY_FLAGS_DRIFT) —
# this scope must never mutate either surface (T-005 is an operator step).
# ---------------------------------------------------------------------------

AUTONOMY_FLAGS_SCOPE = "autonomy-flags"
# Fixed key order (R-0156 DQ1): AUTONOMY_PRESET first, then AUTONOMY_STOP_POLICY.
AUTONOMY_FLAGS_KEYS: tuple[str, ...] = ("AUTONOMY_PRESET", "AUTONOMY_STOP_POLICY")
_AUTONOMY_CONFIG_REL = ".its-magic/config.json"
_AUTONOMY_SCRATCHPAD_REL = ".cursor/scratchpad.md"
_MISSING = "<missing>"
_OK_BANNER = "[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags"
_DRIFT_PREFIX = "[AUTONOMY_FLAGS_DRIFT] scope=autonomy-flags"


def _strip_jsonc(text: str) -> str:
    """Strip line comments (``//``) and block comments from JSONC text.

    Local mirror of ``host_runtime_config_lib.strip_jsonc`` so this checker stays
    stdlib-only.  Comment markers that appear inside JSON strings are preserved.
    """
    out: list[str] = []
    i = 0
    n = len(text or "")
    in_string = False
    escape = False
    while i < n:
        ch = text[i]
        if in_string:
            out.append(ch)
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            i += 1
            continue
        if ch == '"':
            in_string = True
            out.append(ch)
            i += 1
            continue
        if ch == "/" and i + 1 < n:
            nxt = text[i + 1]
            if nxt == "/":
                i += 2
                while i < n and text[i] not in "\n\r":
                    i += 1
                continue
            if nxt == "*":
                i += 2
                while i + 1 < n and not (text[i] == "*" and text[i + 1] == "/"):
                    out.append(text[i] if text[i] in "\n\r" else " ")
                    i += 1
                i += 2
                continue
        out.append(ch)
        i += 1
    return "".join(out)


def _config_shared_values(config_path: Path) -> tuple[dict[str, str], bool]:
    """Return (shared mapping as str->str, errored).

    ``errored`` is True when the config file is missing, unreadable, not valid
    JSON (after JSONC comment stripping), not an object, or ``shared`` is not an
    object.  Unevaluable input is treated as drift so the scope fails closed.
    """
    try:
        raw = config_path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return {}, True
    try:
        data = json.loads(_strip_jsonc(raw))
    except (json.JSONDecodeError, ValueError):
        return {}, True
    if not isinstance(data, dict):
        return {}, True
    shared = data.get("shared")
    if not isinstance(shared, dict):
        return {}, True
    out: dict[str, str] = {}
    for key, value in shared.items():
        if isinstance(value, str):
            out[key] = value
        elif isinstance(value, bool):
            out[key] = "true" if value else "false"
        elif isinstance(value, (int, float)):
            out[key] = json.dumps(value)
        # Nested objects/arrays on autonomy keys are not scalar; leave them out
        # so the key is reported as <missing> (fail-closed).
    return out, False


def _scratchpad_assignments(scratchpad_path: Path) -> tuple[dict[str, list[str]], bool]:
    """Return (exact KEY=VALUE assignment map key->list-of-values, errored).

    Only non-comment, ``KEY=VALUE`` lines are considered.  ``errored`` is True
    when the scratchpad is missing or unreadable (unevaluable -> fail closed).
    Duplicate assignment = the same key appears on more than one line.
    """
    try:
        raw = scratchpad_path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return {}, True
    out: dict[str, list[str]] = {}
    for line in raw.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, _, value = stripped.partition("=")
        key = key.strip()
        if not key:
            continue
        out.setdefault(key, []).append(value.strip())
    return out, False


def _scratch_value(values: dict[str, list[str]], key: str) -> str | None:
    """Return the single value for ``key`` exactly assigned once, else None.

    None => the key is unevaluable for parity: missing, empty, or duplicated.
    """
    if key not in values:
        return None
    vals = values[key]
    if len(vals) != 1:  # duplicate assignment (or zero)
        return None
    if vals[0] == "":  # present but empty — not a usable value
        return None
    return vals[0]


def check_autonomy_flags(root: Path) -> int:
    """BUG-0032 / --scope=autonomy-flags semantic drift-detect (drift-DETECT).

    Both keys present exactly once AND equal  => ``0`` + exact banner.
    Any mismatch / missing / duplicate / unreadable / unparseable => ``1``,
    one fixed-order line per affected key (AUTONOMY_PRESET first), NO banner.
    ``--repo`` redirects both inputs so fixtures are fully isolated.
    Never writes to either surface.
    """
    config_path = root / _AUTONOMY_CONFIG_REL
    scratchpad_path = root / _AUTONOMY_SCRATCHPAD_REL

    config_map, config_errored = _config_shared_values(config_path)
    scratch_map, scratch_errored = _scratchpad_assignments(scratchpad_path)

    lines: list[str] = []
    for key in AUTONOMY_FLAGS_KEYS:
        # Baseline (config) value.
        if config_errored or key not in config_map:
            config_val = _MISSING
        else:
            config_val = config_map[key]
        # Live (scratchpad) value.
        live_val = None if scratch_errored else _scratch_value(scratch_map, key)
        scratch_val = _MISSING if live_val is None else live_val

        affected = (
            config_val != scratch_val
            or config_val == _MISSING
            or scratch_val == _MISSING
        )
        if affected:
            lines.append(
                f"{_DRIFT_PREFIX} key={key} "
                f"config={config_val} scratchpad={scratch_val}"
            )

    if lines:
        for line in lines:
            print(line)
        return 1
    print(_OK_BANNER)
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--repo",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Repository root",
    )
    p.add_argument(
        "--scope",
        choices=sorted(SCOPES.keys()),
        default="intake",
        help="Parity pair table to verify.",
    )
    args = p.parse_args()
    root: Path = args.repo

    # BUG-0032 (R-0156 DQ1): dedicated SEMANTIC scope, NOT a byte-pair table.
    # Short-circuit branch — runs the drift-detect against
    # .its-magic/config.json and .cursor/scratchpad.md only, then returns the
    # semantic verdict and skips the byte loop entirely (R-0156 DQ1 + arch §1).
    if args.scope == AUTONOMY_FLAGS_SCOPE:
        return check_autonomy_flags(root)

    pairs = SCOPES[args.scope]
    failed = False
    for rel_active, rel_tpl in pairs:
        a = root / rel_active
        t = root / rel_tpl
        if not a.is_file() or not t.is_file():
            print(f"[INTAKE_TEMPLATE_PARITY_ERROR] missing file: {rel_active} or {rel_tpl}")
            failed = True
            continue
        ba = a.read_bytes()
        bt = t.read_bytes()
        if ba != bt:
            print(
                f"[INTAKE_TEMPLATE_PARITY_ERROR] mismatch: {rel_active} ({len(ba)}b) "
                f"!= {rel_tpl} ({len(bt)}b)"
            )
            failed = True
    if failed:
        return 2
    if args.scope == "release-changelog":
        semantic_ok, detail = check_release_changelog_semantics(root)
        if not semantic_ok:
            print(f"[INTAKE_TEMPLATE_PARITY_ERROR] {detail}")
            return 2
    # BUG-0032 (R-0156 DQ1): --scope=all invokes the semantic autonomy-flags
    # drift-detect AFTER the byte-pair checks and therefore intentionally fails
    # until the operator remediates the observed drift (drift-DETECT, T-005).
    if args.scope == "all":
        return check_autonomy_flags(root)
    print(f"[INTAKE_TEMPLATE_PARITY_OK] scope={args.scope}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
