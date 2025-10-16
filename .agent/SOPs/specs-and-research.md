# SOP: Specs and Research

## When to Write a Mini-Spec
- Cross-service or module change
- Database or schema migration, backfill, or data transform
- Security, permissions, secrets, or PII handling
- External API integration or contract change
- Performance or SLO risk including indexes, caching, or fan-out adjustments
- Novel or first-time pattern in this codebase

## Process Hooks
- Phase A (PRD): create a spec stub at `tasks/specs/<id>-<slug>.md` when triggers apply and link it from the PRD.
- Phase B (Tasks): parent tasks that need specs must include subtask 1: "Write/Update mini-spec and obtain approval" before implementation.
- Processing: if a subtask touches `src/**` or `migrations/**` and a required spec is missing or older than allowed, STOP and request "APPROVE SPEC".

## Staleness Rule
- Significant changes require a mini-spec with `last_review` within 30 days. Refresh the spec before proceeding if it is stale.

## Research Notes
- Capture investigations and benchmarks in `/tasks/research` with links back to the parent PRD and tasks.
