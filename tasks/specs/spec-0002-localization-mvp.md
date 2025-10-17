# Spec — Localization Orchestrator MVP (Task 0002)

last_review: 2025-10-17

## 1. Purpose & Scope
- Deliver the first end-to-end localisation workflow that ingests an existing marketing webpage and produces locale-aware recommendations plus Stitch-compatible exports.
- Target locales for MVP: American English (baseline), UK English, and Japanese.
- Outcomes: human-reviewable change log, annotated visual preview, and export bundle ready for design/development handoff.

## 2. Goals
1. Support URL ingestion and raw HTML upload with deterministic rendering suitable for diffing.
2. Orchestrate specialised AI agents (research, copy, media, UX) with auditable prompts, inputs, and outputs.
3. Provide a web canvas that previews proposed changes alongside an actionable change log.
4. Export Stitch-style packages (PNG preview + HTML diff + rationale notes) for downstream tooling.
5. Maintain compliance, locale research context, and review traceability for each run.

## 3. Non-Goals
- Automated deployment of changes to production websites.
- Support for more than three locales or right-to-left layouts in MVP.
- Integration with third-party localisation platforms (memoQ, Smartling) beyond export-ready assets.
- Offline desktop packaging or mobile app experiences.

## 4. Primary User Journey (GPM)
1. Paste a marketing page URL or upload HTML.
2. Select target locale and provide campaign brief (optional prompts).
3. Trigger localisation run; agents compute research insights, copy adjustments, media recommendations, and UX deltas.
4. Review side-by-side canvas with annotations and accept/reject changes into a change log.
5. Export Stitch bundle for design/dev review and share change log via download or Jira integration (skeleton).

## 5. Functional Requirements
### 5.1 Ingestion & Rendering
- Fetch page using headless Chromium worker with anti-bot header strategy and retry logic.
- Persist DOM snapshot, critical assets, and request metadata for reproducibility.
- Generate baseline PNG and DOM digest for diffing.
- Evidence of baseline capture stored at `.runs/0002/<timestamp>/ingestion/manifest.json` and `.runs/0002/<timestamp>/ingestion/base.png`.

### 5.2 Locale Research Agent
- Compile cultural, linguistic, and regulatory considerations per locale with citations.
- Use retrieval-augmented prompting seeded with curated locale briefs (store briefs in `docs/localization/locales/<locale>.md`).
- Persist agent transcript at `.runs/0002/<timestamp>/agents/research.log`.

### 5.3 Copy Adaptation Agent
- Generate localised copy suggestions with tone, spelling, and compliance adjustments.
- Emit diff-ready payload (JSON) with element identifiers and rationale.
- Save output to `.runs/0002/<timestamp>/agents/copy.json` and QA harness logs at `.runs/0002/<timestamp>/agents/copy-eval.log`.

### 5.4 Media & UX Agents
- Recommend imagery replacements and layout tweaks, including alt text updates and spacing guidance.
- Produce structured recommendations stored at `.runs/0002/<timestamp>/agents/media.json` and `ux.json`.
- Flag items requiring human validation.

### 5.5 Change Log Management
- Aggregate accepted agent recommendations into a versioned change log (`tmp/localization-mvp/<run-id>/changelog.yaml`).
- Track reviewer decisions (accepted/rejected) with timestamps and reviewer ID.

### 5.6 Canvas Experience
- Render original vs. localised preview with annotation overlays.
- Support inline justification popovers pulling from change log entries.
- Record QA screenshots/video captures at `tmp/previews/localization-mvp/<timestamp>/`.

### 5.7 Export Pipeline
- Assemble Stitch-style bundle containing PNG preview, hydrated HTML diff, change log, and agent rationale summary.
- Store bundles under `exports/localization-mvp/<timestamp>/localized-page.zip` with manifest `exports/localization-mvp/<timestamp>/manifest.json`.

### 5.8 Compliance & Audit
- Each run writes metadata `run.json` including locale, agents executed, model versions, prompts hash, and reviewers.
- Retain artifacts 30 days minimum within `.runs/0002/`.

## 6. Technical Architecture
- **Frontend (Canvas UI)**: Next.js SPA (new) served from existing web app scaffold; communicates with orchestrator API via REST + WebSocket for progress updates.
- **Orchestrator API**: Node/TypeScript service controlling runs, persisting state in PostgreSQL (new Docker service for MVP) with tables for runs, change_items, reviewers, assets.
- **Agent Worker Pool**: Queue-backed workers (prefer BullMQ + Redis) executing specific prompt flows; each worker logs to `.runs/0002/<timestamp>/agents/*.log` and persists outputs to PostgreSQL JSONB fields.
- **Rendering Worker**: Headless Chromium (Playwright) job generating PNG + HTML diff assets; invoked via orchestrator after agent stage completes.
- **Storage**: PostgreSQL for metadata; S3-compatible bucket (or local `tmp/exports/`) for large artifacts (PNG, ZIP). Abstract via storage service for future cloud migration.
- **Auth**: For MVP reuse existing developer login (if available) or stub single-user auth; must gate by environment variable until proper auth lands.

### 6.1 Sequence Overview
1. User submits run request → Orchestrator records run stub.
2. Ingestion worker fetches page, stores DOM/assets, emits manifest.
3. Agents execute sequentially with dependencies: research → copy → media/ux; orchestrator collates outputs.
4. Rendering worker applies accepted suggestions to DOM, generates annotated canvas assets.
5. Canvas UI streams progress via WebSocket, enabling reviewers to accept/reject items.
6. Export pipeline packages final assets and updates run status to `ready_for_handoff`.

## 7. Data Model Sketch
- `runs`: id, locale, source_url, submitted_by, status, started_at, completed_at.
- `agent_outputs`: run_id, agent_type, payload_json, prompt_hash, created_at.
- `change_items`: run_id, element_selector, recommendation_json, status, reviewer_id, rationale.
- `artifacts`: run_id, type (png, html_diff, zip, log), path, checksum, created_at.
- `reviews`: run_id, reviewer_id, decision, notes, decided_at.

## 8. Observability & Telemetry
- Structured logs per worker with run_id correlation IDs.
- Metrics: run duration, agent latency, export size, reviewer accept rate (push to Prometheus or log-based metrics).
- Alerts: ingestion failure rate >10% per hour, export packaging errors, agent latency >5 minutes.

## 9. Testing & Validation
- Unit tests for prompt templating, change-log aggregation, and export manifest generation.
- Integration smoke: run seeded sample page (`docs/localization/sample-page.html`) through full pipeline, verify artifacts exist (script outputs manifest to `.runs/0002/<timestamp>/smoke/manifest.json`).
- Regression harness comparing agent outputs across seed locales, stored under `.runs/0002/<timestamp>/regression/`.
- UX review checklist capturing accessibility (contrast, alt text) recorded at `docs/localization/review-checklists/<timestamp>.md`.

## 10. Rollout Plan & Exit Criteria
- **Phase 0 — Pipeline Skeleton**: Complete ingestion + research agent, export placeholder; exit when `.runs/0002/.../phase-0-manifest.json` shows success.
- **Phase 1 — Guided Localisation**: Add copy + media/ux agents, interactive canvas beta for internal reviewers; exit after QA run recorded at `.runs/0002/.../phase-1-review.log`.
- **Phase 2 — Pilot Prep**: Harden compliance logging, add WebSocket updates, produce Stitch exports validated by design partners (approval doc in `docs/localization/approvals/<timestamp>.md`).

## 11. Risks & Mitigations
- **Rendering Drift**: Mitigate with deterministic browser version pinning and asset caching.
- **Compliance Coverage**: Involve legal reviewer in change log sign-off per locale before pilot.
- **Model Hallucinations**: Add guard prompts, run offline regression diffing to detect major copy changes beyond thresholds.
- **Performance**: Cap page size and enforce 5-minute timeout with user-facing retry guidance.

## 12. Dependencies
- Playwright (Chromium) runtime available in deployment environment.
- Redis/PostgreSQL containers or managed services for queue + persistence.
- Locale research briefs per target market (product marketing to supply sources).

## 13. Decisions (2025-10-17)
1. **Locale research & compliance ownership** — Product Marketing (GPM lead) curates locale briefs with Legal tagging compliance updates; review cadence every 30 days recorded in `docs/localization/compliance.md`.
2. **Design system tokens** — Leverage existing global token set as baseline and extend with locale-specific typography + spacing tokens for en-GB and ja; document extensions in `docs/localization/design-tokens.md` alongside implementation PRs.
3. **Export sign-off workflow** — Localized bundles require sequential approval: Product Marketing → Regional Marketing Lead → Compliance reviewer; approvals logged in `docs/localization/approvals/<timestamp>.md` before partner delivery.
4. **Artifact retention** — Retain `.runs/0002/` artifacts for 90 days; after export to long-term storage (`s3://localization-mvp-runs/` mirror), prune local copies per retention SOP captured in `docs/localization/compliance.md`.
