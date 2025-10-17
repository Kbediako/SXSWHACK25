# Codex Orchestrator Bootstrap (Task 0001)

## Summary
- Establish a deterministic Codex MCP workflow for the SXSWHACK25 codebase.
- Ensure repository guardrails (spec guard, lint, eval) run cleanly with artifacts captured for review.

## Goals
- Provide a reproducible MCP session anchored to `/Users/asabeko/Documents/Code/SXSWHACK25`.
- Maintain `/tasks` as the canonical source for PRDs, task lists, and manifests with checkbox state reflecting progress.
- Capture command logs and manifests under `.runs/0001/<timestamp>/` for auditability.

## Non-Goals
- Ship production features or modify application runtime code.
- Update CI/CD integrations beyond documenting guardrail commands.

## Stakeholders
- Product: TBD — assign once roadmap owner is identified.
- Engineering: Codex orchestrator maintainer.
- Design: N/A for infrastructure workflow setup.
- QA: Guardrail reviewer (assign once test lead is identified).

## Requirements
- Launch a Codex MCP server rooted at `/Users/asabeko/Documents/Code/SXSWHACK25` and document connection details.
- Draft and maintain a `/tasks/tasks-0001-sxswhack25.md` checklist using `[ ]` → `[x]` updates tied to manifest evidence.
- Mirror canonical artifacts into `/docs` with timestamps and manifest references.
- Store logs for `scripts/spec-guard.sh --dry-run`, `npm run lint`, and `npm run eval:test` inside `.runs/0001/<timestamp>/`.
- Update `.runs/.../manifest.json` with every executed command, exit status, and log path.

## Open Questions
- Who owns ongoing guardrail maintenance after bootstrap?
- Are additional evaluation suites (integration, e2e) required for this repo?
- Should the MCP server run persistently on developer machines or only on demand?
- When should placeholder `npm run lint` / `npm run eval:test` scripts be replaced with real tooling?

## Metrics & Validation
- 100% of required guardrail commands complete with exit code `0` and logged artifacts.
- `/tasks` and `/docs` remain in sync with checkbox updates validated against manifests.
- Reviewers can reproduce any logged command using the manifest metadata without rerunning the orchestrator.
