---
description: Run the cross-model critic hook as the tech-lead agent
agent: tech-lead
---

# /sovereign-critic

This OpenCode command runs as agent `tech-lead`. The lens contract is the existing `.cursor/commands/sovereign-critic.md`. This file points at that contract. It does not fork the rubric and it does not name a new Task role.

When `CROSS_MODEL_REVIEW=1`, `/auto` spawns a fresh Task whose agent is `tech-lead` and whose command is `/sovereign-critic`. `CROSS_MODEL_REVIEW=0` spawns nothing. The delivery-phase matrix is unchanged. A missing critic permission key does not emit `PHASE_ROLE_CAPABILITY_MISSING`. If `tech-lead` is missing from the Task allowlist, that missing allowlisted role still fail-closes with `PHASE_ROLE_CAPABILITY_MISSING`.
