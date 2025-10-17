# Task List — Localization Orchestrator MVP (0002)

## Checklist
- [ ] Capture ingestion baseline for reference page (`docs/localization/sample-page.html`) and store manifest/logs under `.runs/0002/<timestamp>/ingestion/` (Evidence: `.runs/0002/<timestamp>/ingestion/manifest.json`, `.runs/0002/<timestamp>/ingestion/base.png`).
- [ ] Produce locale research brief templates and run at least one recorded agent session per locale (Evidence: `docs/localization/locales/{en-US,en-GB,ja}.md`, `.runs/0002/<timestamp>/agents/research.log`).
- [ ] Implement copy adaptation agent with regression harness comparing seed locales (Evidence: `.runs/0002/<timestamp>/agents/copy.json`, `.runs/0002/<timestamp>/regression/copy-diff.log`).
- [ ] Ship media/UX agent recommendations with reviewer workflow in canvas (Evidence: `.runs/0002/<timestamp>/agents/{media.json,ux.json}`, `tmp/previews/localization-mvp/<timestamp>/canvas-review.mp4`).
- [ ] Persist change log decisions with audit metadata and surface in UI (Evidence: `tmp/localization-mvp/<run-id>/changelog.yaml`, `.runs/0002/<timestamp>/ui/changelog-verification.log`).
- [ ] Deliver Stitch export bundle with manifest and rationale notes (Evidence: `exports/localization-mvp/<timestamp>/localized-page.zip`, `exports/localization-mvp/<timestamp>/manifest.json`).
- [ ] Document compliance + retention posture for localisation runs (Evidence: `docs/localization/compliance.md`, `.runs/0002/<timestamp>/agents/compliance-check.log`).
- [ ] Execute guardrail suite post-implementation and archive outputs (Evidence: `.runs/0002/<timestamp>/guardrails/spec-guard.log`, `.runs/0002/<timestamp>/guardrails/lint.log`, `.runs/0002/<timestamp>/guardrails/eval-test.log`).

## Milestones & Exit Criteria
- **Phase 0 — Pipeline Skeleton**: Ingestion + research agent completes end-to-end; manifests stored under `.runs/0002/<timestamp>/phase-0/`.
- **Phase 1 — Guided Localisation**: Copy/media/UX agents integrated; canvas review video captured in `tmp/previews/localization-mvp/<timestamp>/`.
- **Phase 2 — Pilot Prep**: Stitch bundle validated by design partner sign-off recorded in `docs/localization/approvals/<timestamp>.md`.

## Notes
- Reference PRD at `docs/localization-mvp-prd.md` and spec at `tasks/specs/spec-0002-localization-mvp.md` for detailed requirements.
- Ensure Redis/PostgreSQL containers are provisioned via docker-compose (to be defined) before agent orchestration work begins.
- Log retention target: 30 days minimum within `.runs/0002/`; confirm final policy once stakeholders answer open questions.

## Guardrails to Run After Implementation
- `scripts/spec-guard.sh --dry-run > .runs/0002/<timestamp>/guardrails/spec-guard.log`
- `npm run lint > .runs/0002/<timestamp>/guardrails/lint.log`
- `npm run eval:test > .runs/0002/<timestamp>/guardrails/eval-test.log`
