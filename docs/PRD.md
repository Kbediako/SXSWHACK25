# PRD — Codex Orchestrator Bootstrap (Mirror)

> **Source of truth:** `tasks/0001-prd-sxswhack25.md`  
> **Last mirrored:** 2025-10-17 — see `.runs/0001/2025-10-17T00-15-14Z/manifest.json`

## Summary
- Establish deterministic Codex MCP workflow for SXSWHACK25.
- Capture guardrail logs (`spec-guard`, lint, eval) with manifest evidence.

## Goals
- Reuse orchestrator checkout at `/Users/asabeko/Documents/Code/CO`.
- Anchor MCP server to `/Users/asabeko/Documents/Code/SXSWHACK25`.
- Keep `/tasks` and `.runs` artifacts in sync for review.

## Notes
- Guardrail commands and MCP session metadata live in `.runs/`.
- Update mirror notes when canonical PRD changes.
