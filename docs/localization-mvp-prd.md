# PRD — Localisation Orchestrator MVP

## 1. Executive Summary
- **Problem**: Global brands struggle to localise digital experiences beyond literal translation, causing cultural misalignment, compliance risks, and inconsistent branding when scaling into new regions.citeturn2search0
- **Opportunity**: Software localisation spend is projected to grow from USD 5.5B in 2024 to USD 7.5B by 2030 (5.4% CAGR), while 70% of enterprises are adopting AI-driven localisation tooling by 2025, signalling demand for scalable automation.citeturn1search4turn2search2
- **Vision**: Provide a no-code localisation cockpit where product managers upload existing web experiences, trigger AI agent workflows tailored to a target locale, and receive an annotated mockup plus change log ready for design/dev handoff.
- **MVP Outcome**: Ship a browser-based experience that ingests a marketing webpage (URL or HTML), orchestrates specialised AI agents (research, copy, media, UX), visualises proposed updates in a live canvas, and exports Stitch-style packages (full-page image + HTML) with rationale notes.

## 2. Target Users & Personas
- **Primary Persona — Global Product Manager (GPM)**: Owns go-to-market for new regions, needs culturally aware creative direction, minimal engineering dependency, and clear audit trails for stakeholders.
- **Secondary Persona — Regional Marketing Lead (RML)**: Validates cultural nuance, plans campaigns, requires contextual briefs and editable assets.
- **Tertiary Persona — Front-End Engineering Lead (FEL)**: Implements approved layouts; needs structured diff views, component-level descriptions, and performance guardrails.

## 3. User Needs & Jobs To Be Done
- Assess cultural, linguistic, and regulatory fit for a target country within hours instead of weeks.citeturn2search4turn2search5
- Generate marketing copy, imagery, and UX adjustments that maintain brand consistency while reflecting local norms.citeturn2search0turn2search8
- Export localisation-ready assets into existing design/dev pipelines (Stitch-style zip, HTML diff, Jira) with traceable rationale.
- Collaborate asynchronously with AI agents via an iterative feedback loop, capturing decisions in a change log for compliance.

## 4. Market & Competitive Landscape

### Market Validation (2024–2025)
- Updated global TAM: USD 71.53B in 2024 with 5.39% CAGR through 2030, materially higher than the prior USD 9.5B baseline used in the original draft.citeturn0search11
- SAM for initial locales totals USD 30.67B, anchored by the United States, United Kingdom, and Japan language services spend.citeturn3search1turn4search0turn5search0
- SOM target: focus on design partners representing ~USD 12M annual localisation budgets (five PM orgs with USD 2–3M each), equating to ~0.04% share of SAM in the first pilot year.

| Metric | United States | United Kingdom | Japan | Notes |
| --- | --- | --- | --- | --- |
| 2024 market size (SAM component) | USD 26.70B | GBP 1.94–2.20B (≈USD 2.43–2.76B using FY24 average FX 1.25) | USD 1.54B | Sources: Market.us US forecast; Nimdzi/ATC 2024 update; Deep Market Insights Japan report.citeturn3search1turn4search0turn5search0 |
| CAGR to 2029/2030 | 4.5% | 6.5% | 5.8% | Aligns with country-level drivers (regulated verticals, ecommerce).citeturn3search1turn4search0turn5search0 |
| Delta vs. prior PRD | +USD 21.20B (US), +USD ~2.4B (UK), +USD ~1.5B (JP) | Prior doc understated TAM and lacked locale splits; adoption assumption of 70% AI by 2025 now calibrated to 55% current usage and 81% hybrid plans.citeturn18search0 |

### Campaign Volume Signals
- **United States**: BIA projects USD 171.9B local advertising in 2025 with 52% digital; we will align ingestion backlog with high-volume verticals (retail, healthcare, finance).citeturn6search0
- **United Kingdom**: AA/WARC forecasts GBP 39.5B total ad spend in 2025 (5.8% YoY) with digital formats at 77% share, underscoring localisation demand for multi-channel creatives.citeturn7search1
- **Japan**: Dentsu reports JPY 7.67T (≈USD 50.4B) advertising expenditure in 2024; internet ads exceeded 43% share, reinforcing the need for Japanese-first experience optimisation.citeturn8search0

### Competitive Teardown
- **Smartcat Figma Plugin (2024)**: Offers in-canvas translation, memory leverage, unlimited editor seats, and one-click brand terminology sync, but lacks orchestrated research agents or structured compliance exports.citeturn9search0turn9search4
- **Figma AI Translate & Make (2025)**: Provides AI copy generation and code handoff within paid Editor seats (USD 25–35/user) capped by monthly Run credits, yet omits locale research, audit trails, or multi-agent approvals.citeturn9search1turn9search2
- **Google Stitch Generative UI**: Delivers HTML + asset ZIP exports with embedded component annotations; validates our Stitch-style export goal and highlights the need for parity on rationale notes.citeturn14news12turn14search0turn14search8
- **General LLM tooling**: Continues to exhibit cultural/idiomatic gaps without retrieval and human-in-loop checkpoints, supporting our multi-agent approach.citeturn2academia12turn2academia16

#### MVP Requirement Mapping
| Gap | Competitive Behaviour | MVP Response |
| --- | --- | --- |
| Locale research & compliance provenance | Smartcat/Figma lack automated compliance briefs or locale governance logs.citeturn9search0turn9search1 | Persist agent-generated compliance brief + change log per locale (Section 7) and integrate new blueprint checklist. |
| Multi-agent workflow transparency | Existing plugins surface translation suggestions without sequencing rationale or role separation.citeturn9search4turn9search2 | Maintain orchestrator timeline view and per-agent decision trace. |
| Export fidelity & rationale | Stitch outputs structured ZIPs but minimal rationale; competitors export raw diffs only.citeturn14news12turn14search0 | Deliver Stitch-style ZIP + screenshot + rationale metadata (Section 7 outputs) with ingestion spike validation (Section 11). |
| Cost-to-value for teams | Smartcat unlimited editors (flat) vs. Figma AI priced per seat + credit.citeturn9search0turn9search1 | Offer workspace pricing based on page credits + compliance add-on to stay cost-competitive for PM orgs. |

**Differentiators**: Multi-agent orchestration with contextual research, compliance-ready change logs, Stitch-aligned exports, and governance coverage across US, UK, and Japan locales.

## 5. Scope
- **In Scope (MVP)**:
  - Web landing pages or marketing microsites (HTML/CSS + assets).
  - Target locales: English → {American English, UK English, Japanese} to validate cross-regional nuance.
  - Outputs: Annotated mockup, textual change log, marketing brief, and Stitch-style export (zip with full-page capture + HTML).
  - User feedback loop: Approve, reject, or request tweaks per change item; regenerate assets with persisted context.
- **Out of Scope (MVP)**:
  - Complex web apps or authenticated flows.
  - Offline content localisation (e.g., PDFs, video subtitles).
  - Fully automated production deployment; development teams own implementation beyond mockup/HTML export.

## 6. Experience Narrative
1. **Intake**: User uploads HTML or pastes URL, selects target country, optionally provides brand tone, audience segments, campaign goal.
2. **Brief Generation**: Research Agent compiles local insights—holidays, demographics, compliance triggers—and recommends messaging pillars.citeturn2search5turn2search9
3. **Design Workspace**: Live preview renders original page. Agents annotate sections with proposed copy, imagery, layout adjustments, and highlight cultural considerations.
4. **Review & Feedback**: User toggles between original vs. localised diff, leaves inline comments, and requests refinements (e.g., adjust tone, emphasise product benefit).
5. **Export & Handoff**: Approved changes generate a Stitch-style export (zip with full-page image and HTML of the adapted screen) plus change log summarising rationale, research citations, and metrics impacts.
6. **Iteration Loop**: System stores session context; subsequent requests reuse research findings and user preferences.

## 7. Functional Requirements
- **Input Processing**
  - Fetch and sanitise HTML/CSS from URL or uploaded zip; maintain component mapping for diff visualisation.
  - Extract textual content for localisation and classify asset types (hero copy, CTA, metadata, imagery).
- **Agent Orchestration**
  - Orchestrator Agent sequences Research → Copy → Media → UX agents, resolves conflicts, and consolidates outputs.
  - Research Agent queries knowledge base/APIs for cultural, seasonal, and regulatory insights; caches per locale.
  - Copy Agent performs translation, tone adaptation, and transcreation with brand glossary support.
  - Media Agent recommends imagery (Gemini 2.5 Flash, stock APIs) and alt text; flags culturally sensitive visuals.
  - UX Agent suggests layout adjustments (spacing, RTL/LTR, form fields) and accessibility compliance (WCAG AA).
- **User Interaction**
  - Canvas diff view showing original vs. proposed design; highlight text expansion, RTL handling, imagery swaps.
  - Commenting and approval controls per change (approve/reject/request iteration).
  - Change log dashboard capturing description, responsible agent, research rationale, and status timestamps.
- **Outputs**
  - Stitch-style export (zip containing full-screen capture and HTML of the adapted page).
  - Downloadable HTML/CSS bundle with annotations in JSON/YAML for dev teams.
  - Marketing brief summarising key messages, campaign suggestions, and compliance checklist per locale.
- **Compliance Blueprint (Locale Obligations)**

| Locale | Obligation & Source | Acceptance Criteria | Owner | Due Date |
| --- | --- | --- | --- | --- |
| United States (CPRA) | Annual cybersecurity audits and risk assessments with CPPA attestation for high-risk processing beginning January 1, 2026; first compliance certification due April 1 each year starting 2028.citeturn11search0turn11search2 | 1) Inventory qualifying data flows & risk thresholds completed by 2025-12-01.<br>2) Launch automated risk assessment workflow tied to orchestration events by 2026-01-15.<br>3) Produce audit-ready evidence bundle (change logs, access trails) and complete CPPA submission rehearsal by 2027-10-01. | US Compliance PM (M. Ortiz) | 2026-01-15 |
| United Kingdom (ASA/CAP) | Mandatory disclosure and audit logging for AI-generated or materially altered creatives, plus assurance of human oversight before launch.citeturn12search0turn12search1turn12search3 | 1) Publish AI disclosure decision tree and reviewer checklist inside the product brief by 2025-11-15.<br>2) Enable locale-specific change log fields capturing AI usage rationale by 2025-12-01.<br>3) Integrate ASA sampling export (CSV) from change logs for quarterly audits starting 2026-01-10. | UK Marketing Compliance Lead (E. Singh) | 2025-12-01 |
| Japan (APPI & CBPR) | Updated 2025 APPI rules require documented consent/notification for cross-border transfers and encourage CBPR certification.citeturn13search0turn13search1turn13search5 | 1) Map hosting + model inference regions and generate bilingual transfer notices by 2025-12-15.<br>2) Add per-locale data residency tags to Stitch export metadata by 2026-01-05.<br>3) Submit CBPR intake package (policies, impact assessment) to JIPDEC by 2026-03-31. | JP Data Governance Lead (R. Nakamura) | 2026-03-31 |

## 8. Non-Functional Requirements
- **Performance**: Generate first localisation draft within 3 minutes for pages under 3 MB.
- **Reliability**: Ensure deterministic agent orchestration with retry semantics; log every agent decision for auditing.
- **Security & Compliance**: Encrypt uploads at rest/in transit; redact PII; align with regional regulations (GDPR, LGPD, PIPL).citeturn2search4turn2search5
- **Explainability**: Every output must reference research snippets and agent rationale to build trust and support compliance reviews.
- **Accessibility**: Enforce WCAG 2.2 AA checks across proposed designs, including color contrast and keyboard navigation guidance.citeturn2search8

## 9. Data & ML Guardrails
- Maintain locale-specific style guides, glossaries, and banned terms; allow user-provided overrides.
- Capture human-in-the-loop feedback to fine-tune agent prompts and update retrieval cache.
- Flag low-confidence translations (idioms, humour) for manual review based on LLM uncertainty heuristics.citeturn2academia12
- Store synthetic imagery provenance (prompt, model version) for downstream governance.

## 10. UX & UI Principles
- Minimalist dashboard with focus on localisation diff; emphasise consistent brand palette.
- Persistent side panel summarising research insights, recommended holidays, value propositions, and tone guidance.
- Provide locale toggle (e.g., EN-AU vs. EN-US) with instant preview switch.
- Integrate responsive testing (desktop/tablet/mobile) with simulated text expansion per locale.

## 11. Ingestion Feasibility Spike (September 2025)
- **Scope**: Captured three representative marketing pages (US, UK, JP) via scripted HTML retrieval (`curl -L -A 'Mozilla/5.0'`) and packaged Stitch-style ZIPs (HTML-only) to assess fidelity, asset handling, and export structure readiness.
- **Method**: Parsed DOM for asset counts, inspected hydration markers, and logged export artefact sizes; screenshots are pending headless rendering integration.

| Locale | Page (Captured 2025-10-16) | HTML Size | `<script>` | `<img>` | Export Artefact | Fidelity Findings | Outstanding Issues |
| --- | --- | --- | --- | --- | --- | --- | --- |
| US | https://mailchimp.com/solutions/email-marketing/ | 340,591 B | 35 | 57 | `mailchimp_us_stitch.zip` (78 KB) | Page defaults to `lang="en"` regardless of locale, LivePerson (`lpTag`) injection requires script sandboxing, hero copy renders after hydration. | Need headless screenshot capture; add rule to strip chat scripts; confirm locale override path for en-GB variant. |
| UK | https://www.shopify.com/uk/retail | 419,022 B | 4 | 30 | `shopify_uk_stitch.zip` (73 KB) | `meta name="ssr" content="false"` indicates client-side render; article cards absent without JS execution; fonts pulled from `cdn.shopify.com` (CORS). | Integrate Playwright batch render for stitched screenshots; whitelist CDN domains; queue delta diff once hydrated DOM available. |
| JP | https://corp.rakuten.co.jp/ | 80,032 B | 15 | 61 | `rakuten_jp_stitch.zip` (13 KB) | Static nav content in Japanese with toggled EN links; relies on `r.r10s.jp` scripts for carousel and analytics; inline alt text present. | Mirror asset fetcher to resolve relative asset paths; add CDN caching for `.r10s.jp`; localise change log output to JP language pack. |

- **Follow-Ups**:
  1. Add headless rendering worker (Playwright) to generate PNGs & hydrated HTML diffs for Stitch exports.
  2. Extend asset allowlist/denylist to handle chat widgets and third-party analytics observed in Mailchimp/Rakuten captures.
  3. Implement retry strategy for sites returning anti-bot blocks (e.g., Microsoft marketing pages returning 403 without additional headers during this spike).

## 12. Success Metrics
- **Activation**: >60% of onboarded PMs complete first localisation run within 7 days.
- **Efficiency**: Reduce time-to-localised mockup from baseline 3 weeks to <1 day.citeturn2search0
- **Quality**: ≥80% of change log items accepted without manual rewrite after first iteration (tracked per locale).
- **Adoption**: Secure 5 design partner teams and 10 live campaigns by end of Pilot Phase.
- **Trust**: <5% of exports flagged for cultural misalignment by regional reviewers (qualitative audits).

## 13. Release Plan
- **Phase 0 — Foundations**: Set up Codex SDK canvas, HTML ingestion, basic diff viewer, manual upload export path. Internal alpha with seed page.
- **Phase 1 — Guided Localisation**: Implement research + copy agents, change log MVP, Stitch-style export pipeline, and live preview. Beta with 2 partner PMs.
- **Phase 2 — Multi-Agent Expansion**: Add media + UX agents, compliance checklist, Gemini image generation, and iterative feedback loops.
- **Phase 3 — Pilot Launch**: Enable multi-locale support, analytics dashboards, marketing brief export, and customer success playbook.

## 14. Risks & Mitigations
- **Cultural Missteps**: AI outputs could still miss nuance; mitigate with human review checkpoints and locale-specific validators.citeturn2academia12turn2academia16
- **Regulatory Drift**: Changing compliance requirements per region; integrate periodic policy refresh and legal review workflow.citeturn2search4
- **Model Bias & Hallucinations**: Use retrieval-augmented prompts anchored to vetted research sources and maintain change logs for traceability.
- **Workflow Adoption**: PMs may resist new tooling; provide templates, guided tours, and export compatibility with existing processes (Stitch-style zip handoff, Jira).
- **Performance Constraints**: Heavy pages may slow processing; enforce upload limits and progressive rendering fallback.

## 15. Decisions & Follow-Ups
- Additional pilot locales: none required for MVP; focus on American English, UK English, and Japanese.
- Third-party localisation integrations: defer; maintain a native workflow for MVP.
- User permissions: keep a simple, guardrailed flow without granular role overrides.
- Deployment: on-prem/private model hosting not required for quick MVP; reassess post-pilot.
- Browser automation: standardise on the chromedevtools MCP tooling (no Playwright) for future ingestion captures and export validation automation.

## 16. Appendices
- **A. Research Snapshot**: Cultural localisation challenges (Ulatus, Linguise, Globalization Partners, Eldris) emphasise need for contextual insight and compliance rigour.citeturn2search0turn2search2turn2search4turn2search5
- **B. Export Reference**: Team directive is to mirror Stitch export behaviour (zip containing HTML and full-page capture), ensuring familiarity for downstream reviewers.
- **C. Multi-Agent Research**: Recent studies validate multi-agent approaches for culturally aware translation, guiding our architecture choices.citeturn2academia16
