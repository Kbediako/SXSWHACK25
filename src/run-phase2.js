#!/usr/bin/env node
import { resolve, relative } from 'path';
import process from 'process';
import { createRunTimestamp, isoTimestamp } from './utils/time.js';
import { ensureDir, writeJson, writeText } from './utils/fs.js';
import { runIngestion } from './ingestion/capture.js';
import { runResearchBriefs } from './agents/research.js';
import { runCopyAdaptation, writeCopyRegressionLog } from './agents/copy.js';
import { runMediaRecommendations } from './agents/media.js';
import { runUxRecommendations } from './agents/ux.js';
import { persistChangeLog } from './orchestrator/changelog.js';
import { createCanvasPreviewArtifacts } from './orchestrator/preview.js';
import { createStitchExportBundle } from './orchestrator/export.js';
import { runComplianceCheck } from './agents/compliance.js';
import { runGuardrailSuite } from './orchestrator/guardrails.js';
import { recordDesignPartnerApproval } from './orchestrator/approvals.js';
import { writeRunMetadata } from './orchestrator/runMetadata.js';
import { orderedLocales } from './data/localeBriefs.js';

const TASK_ID = '0002';
const BASELINE_LOCALE = 'en-US';

function parseArgs(argv) {
  const args = {
    source: 'docs/localization/sample-page.html',
    locales: [...orderedLocales],
    reviewerId: 'rev-internal',
    reviewerName: 'Internal Localisation QA',
    partnerName: 'Northstar Design Collective',
    partnerApprover: 'Avery Li',
    partnerRole: 'Design Systems Lead',
    partnerEmail: 'avery.li@northstar.design',
    approvalNotes: [
      'Design partner confirmed bundle ready for pilot distribution.',
      'Pending items require follow-up before general availability.',
    ],
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--source') {
      args.source = argv[i + 1];
      i += 1;
    } else if (token === '--locale' || token === '--locales') {
      const value = argv[i + 1];
      i += 1;
      if (value) {
        args.locales = value
          .split(',')
          .map((locale) => locale.trim())
          .filter(Boolean);
      }
    } else if (token === '--reviewer-id') {
      args.reviewerId = argv[i + 1];
      i += 1;
    } else if (token === '--reviewer-name') {
      args.reviewerName = argv[i + 1];
      i += 1;
    } else if (token === '--partner-name') {
      args.partnerName = argv[i + 1];
      i += 1;
    } else if (token === '--partner-approver') {
      args.partnerApprover = argv[i + 1];
      i += 1;
    } else if (token === '--partner-role') {
      args.partnerRole = argv[i + 1];
      i += 1;
    } else if (token === '--partner-email') {
      args.partnerEmail = argv[i + 1];
      i += 1;
    } else if (token === '--approval-note') {
      const value = argv[i + 1];
      i += 1;
      if (value) {
        args.approvalNotes.push(value);
      }
    } else if (token === '--help' || token === '-h') {
      console.log(`Usage: npm run phase2 [options]

Options:
  --source <path>            HTML asset to ingest. Defaults to docs/localization/sample-page.html
  --locale <codes>           Comma separated locales (default: ${orderedLocales.join(',')}).
  --reviewer-id <id>         Reviewer identifier recorded in change log. Default: rev-internal.
  --reviewer-name <name>     Reviewer display name. Default: Internal Localisation QA.
  --partner-name <name>      Design partner organisation signing off the bundle.
  --partner-approver <name>  Approver full name.
  --partner-role <role>      Approver role/title.
  --partner-email <email>    Approver contact email.
  --approval-note <text>     Additional note to append to approval record (repeatable).
`);
      process.exit(0);
    }
  }

  return args;
}

function summariseCopyLocales(locales) {
  let total = 0;
  let changed = 0;
  let requiresReview = 0;

  const perLocale = locales.map((entry) => {
    total += entry.summary.total;
    changed += entry.summary.changed;
    requiresReview += entry.summary.requiresHumanReview;
    return {
      locale: entry.locale,
      totals: entry.summary,
    };
  });

  return {
    totals: { total, changed, requiresReview },
    locales: perLocale,
  };
}

function summariseRecommendationLocales(entries) {
  let total = 0;
  let requiresReview = 0;

  const perLocale = entries.map((entry) => {
    total += entry.summary.total;
    requiresReview += entry.summary.requiresHumanReview;
    return {
      locale: entry.locale,
      totals: entry.summary,
    };
  });

  return {
    totals: { total, requiresReview },
    locales: perLocale,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const runTimestamp = createRunTimestamp();
  const runRoot = resolve(process.cwd(), '.runs', TASK_ID, runTimestamp);
  await ensureDir(runRoot);

  console.log(`Phase 2 run started at ${runTimestamp}`);
  console.log(`Run root: ${relative(process.cwd(), runRoot)}`);

  const ingestion = await runIngestion({
    sourcePath: args.source,
    runRoot,
    taskId: TASK_ID,
  });

  const research = await runResearchBriefs({
    locales: args.locales,
    runRoot,
    taskId: TASK_ID,
  });

  const copy = await runCopyAdaptation({
    domPath: ingestion.domPath,
    locales: args.locales,
    runRoot,
    taskId: TASK_ID,
    baselineLocale: BASELINE_LOCALE,
  });

  const regression = await writeCopyRegressionLog({
    runRoot,
    taskId: TASK_ID,
    baselineLocale: BASELINE_LOCALE,
    localeEntries: copy.locales,
  });

  const media = await runMediaRecommendations({
    locales: args.locales,
    runRoot,
    taskId: TASK_ID,
  });

  const ux = await runUxRecommendations({
    locales: args.locales,
    runRoot,
    taskId: TASK_ID,
  });

  const copySummary = summariseCopyLocales(copy.locales);
  const mediaSummary = summariseRecommendationLocales(media.locales);
  const uxSummary = summariseRecommendationLocales(ux.locales);

  const preview = await createCanvasPreviewArtifacts({
    runTimestamp,
    runRoot,
    taskId: TASK_ID,
    locales: args.locales,
    screenshotPath: ingestion.screenshotPath,
    copySummary,
    mediaSummary,
    uxSummary,
  });

  const reviewer = { id: args.reviewerId, name: args.reviewerName };

  const changeLog = await persistChangeLog({
    runRoot,
    runTimestamp,
    taskId: TASK_ID,
    baselineLocale: BASELINE_LOCALE,
    copyEntries: copy.locales,
    mediaEntries: media.locales,
    uxEntries: ux.locales,
    reviewer,
  });

  const exportBundle = await createStitchExportBundle({
    runTimestamp,
    runRoot,
    taskId: TASK_ID,
    locales: args.locales,
    baselineLocale: BASELINE_LOCALE,
    ingestion,
    copy,
    media,
    ux,
    changeLog,
    preview,
    reviewer,
    sourcePath: resolve(process.cwd(), args.source),
    copySummary,
    mediaSummary,
    uxSummary,
  });

  const compliance = await runComplianceCheck({
    runRoot,
    runTimestamp,
    taskId: TASK_ID,
    locales: args.locales,
    baselineLocale: BASELINE_LOCALE,
    reviewer,
    copySummary,
    mediaSummary,
    uxSummary,
  });

  const guardrails = await runGuardrailSuite({
    runRoot,
    taskId: TASK_ID,
  });

  const approval = await recordDesignPartnerApproval({
    runTimestamp,
    taskId: TASK_ID,
    partnerName: args.partnerName,
    approverName: args.partnerApprover,
    approverRole: args.partnerRole,
    approverEmail: args.partnerEmail,
    notes: args.approvalNotes,
  });

  const phaseDir = resolve(runRoot, 'phase-2');
  await ensureDir(phaseDir);
  const phaseManifestPath = resolve(runRoot, 'phase-2-manifest.json');
  const phaseSummaryPath = resolve(phaseDir, 'summary.json');

  const phaseSummary = {
    taskId: TASK_ID,
    phase: 'phase-2',
    recordedAt: isoTimestamp(),
    runRoot: relative(process.cwd(), runRoot),
    ingestion: {
      manifest: relative(process.cwd(), ingestion.manifestPath),
      screenshot: relative(process.cwd(), ingestion.screenshotPath),
    },
    agents: {
      research: {
        manifest: relative(process.cwd(), research.manifestPath),
        log: relative(process.cwd(), research.logPath),
      },
      copy: {
        output: relative(process.cwd(), copy.outputPath),
        evaluationLog: relative(process.cwd(), copy.evaluationLogPath),
        regressionLog: relative(process.cwd(), regression.logPath),
        summary: copySummary,
      },
      media: {
        output: relative(process.cwd(), media.outputPath),
        log: relative(process.cwd(), media.logPath),
        summary: mediaSummary,
      },
      ux: {
        output: relative(process.cwd(), ux.outputPath),
        log: relative(process.cwd(), ux.logPath),
        summary: uxSummary,
      },
    },
    changelog: {
      yaml: changeLog.relativeChangelogPath,
      uiLog: relative(process.cwd(), changeLog.uiLogPath),
    },
    preview: {
      video: relative(process.cwd(), preview.videoPath),
      metadata: relative(process.cwd(), preview.metadataPath),
    },
    exportBundle: {
      bundle: exportBundle.relativeBundlePath,
      manifest: exportBundle.relativeManifestPath,
      rationale: exportBundle.relativeRationalePath,
    },
    compliance: {
      doc: relative(process.cwd(), compliance.docPath),
      log: relative(process.cwd(), compliance.logPath),
    },
    guardrails: {
      manifest: relative(process.cwd(), guardrails.manifestPath),
      logs: Object.fromEntries(
        Object.entries(guardrails.logs).map(([key, value]) => [key, value.relativeLogPath])
      ),
    },
    approval: {
      doc: approval.relativePath,
      partner: args.partnerName,
    },
    notes: [
      'Phase 2 bundles Stitch export artifacts, compliance documentation, guardrail outputs, and design partner approval.',
      'Verify outstanding copy/media/UX items flagged for human review before GA.',
    ],
  };

  await writeJson(phaseManifestPath, phaseSummary);
  await writeJson(phaseSummaryPath, phaseSummary);

  const reviewLogPath = resolve(runRoot, 'phase-2-review.log');
  const reviewLines = [
    `[INFO] ${isoTimestamp()} :: phase-2 manifest=${relative(process.cwd(), phaseManifestPath)}`,
    `[INFO] ${isoTimestamp()} :: export_bundle=${exportBundle.relativeBundlePath}`,
    `[INFO] ${isoTimestamp()} :: guardrails spec=${guardrails.logs.specGuard.relativeLogPath} lint=${guardrails.logs.lint.relativeLogPath} eval=${guardrails.logs.evalTest.relativeLogPath}`,
    `[INFO] ${isoTimestamp()} :: compliance_doc=${relative(process.cwd(), compliance.docPath)}`,
    `[INFO] ${isoTimestamp()} :: approval_doc=${approval.relativePath} partner=${args.partnerName}`,
  ];
  await writeText(reviewLogPath, reviewLines.join('\n') + '\n');

  const rel = (value) => relative(process.cwd(), value);

  const agentsMetadata = [
    {
      name: 'ingestion',
      kind: 'capture',
      implementation: 'playwright-chromium',
      version: ingestion.manifest?.browser?.version ?? 'unknown',
      outputs: {
        manifest: rel(ingestion.manifestPath),
        screenshot: rel(ingestion.screenshotPath),
        domSnapshot: rel(ingestion.domPath),
      },
    },
    {
      name: 'research',
      kind: 'locale-brief',
      implementation: 'template-static',
      version: 'locale-briefs/v1',
      outputs: {
        manifest: rel(research.manifestPath),
        log: rel(research.logPath),
      },
    },
    {
      name: 'copy',
      kind: 'adaptation',
      implementation: 'template-static',
      version: 'copy-adapt/v1',
      outputs: {
        json: rel(copy.outputPath),
        evaluationLog: rel(copy.evaluationLogPath),
        regressionLog: rel(regression.logPath),
      },
    },
    {
      name: 'media',
      kind: 'recommendation',
      implementation: 'template-static',
      version: 'media-rec/v1',
      outputs: {
        json: rel(media.outputPath),
        log: rel(media.logPath),
      },
    },
    {
      name: 'ux',
      kind: 'recommendation',
      implementation: 'template-static',
      version: 'ux-rec/v1',
      outputs: {
        json: rel(ux.outputPath),
        log: rel(ux.logPath),
      },
    },
    {
      name: 'export',
      kind: 'stitch-bundle',
      implementation: 'archiver-zip/v1',
      outputs: {
        zip: exportBundle.relativeBundlePath,
        manifest: exportBundle.relativeManifestPath,
        rationale: exportBundle.relativeRationalePath,
      },
    },
    {
      name: 'compliance',
      kind: 'audit',
      implementation: 'static-doc/v1',
      outputs: {
        doc: rel(compliance.docPath),
        log: rel(compliance.logPath),
      },
    },
    {
      name: 'guardrails',
      kind: 'verification',
      implementation: 'node-runner/v1',
      outputs: {
        manifest: rel(guardrails.manifestPath),
        specGuardLog: guardrails.logs.specGuard.relativeLogPath,
        lintLog: guardrails.logs.lint.relativeLogPath,
        evalLog: guardrails.logs.evalTest.relativeLogPath,
      },
    },
    {
      name: 'approval',
      kind: 'sign-off',
      implementation: 'markdown-record/v1',
      outputs: {
        doc: approval.relativePath,
      },
    },
  ];

  const artifacts = {
    ingestion: {
      manifest: ingestion.manifestPath,
      screenshot: ingestion.screenshotPath,
      domSnapshot: ingestion.domPath,
    },
    research: {
      manifest: research.manifestPath,
      log: research.logPath,
    },
    copy: {
      output: copy.outputPath,
      evaluationLog: copy.evaluationLogPath,
      regressionLog: regression.logPath,
    },
    media: {
      output: media.outputPath,
      log: media.logPath,
    },
    ux: {
      output: ux.outputPath,
      log: ux.logPath,
    },
    changelog: {
      yaml: changeLog.changelogPath,
      manifest: changeLog.manifestPath,
      uiLog: changeLog.uiLogPath,
    },
    preview: {
      video: preview.videoPath,
      metadata: preview.metadataPath,
      notes: preview.notesPath,
    },
    exportBundle: {
      zip: exportBundle.bundlePath,
      manifest: exportBundle.manifestPath,
      rationale: exportBundle.rationalePath,
    },
    compliance: {
      doc: compliance.docPath,
      log: compliance.logPath,
      manifest: compliance.manifestPath,
    },
    guardrails: {
      manifest: guardrails.manifestPath,
      specGuard: guardrails.logs.specGuard.logPath,
      lint: guardrails.logs.lint.logPath,
      evalTest: guardrails.logs.evalTest.logPath,
    },
    approval: {
      doc: approval.approvalPath,
    },
    phaseManifest: phaseManifestPath,
    phaseSummary: phaseSummaryPath,
    reviewLog: reviewLogPath,
  };

  await writeRunMetadata({
    runRoot,
    runTimestamp,
    taskId: TASK_ID,
    phase: 'phase-2',
    sourcePath: resolve(process.cwd(), args.source),
    locales: args.locales,
    baselineLocale: BASELINE_LOCALE,
    reviewer,
    agents: agentsMetadata,
    artifacts,
    summaries: {
      copy: copySummary,
      media: mediaSummary,
      ux: uxSummary,
      guardrails: guardrails.manifest,
      export: {
        bundle: exportBundle.relativeBundlePath,
        pendingReview: exportBundle.manifest.pendingReview,
      },
    },
  });

  console.log(`Phase 2 manifest written to ${relative(process.cwd(), phaseManifestPath)}`);
  console.log(`Export bundle ready at ${exportBundle.relativeBundlePath}`);
  console.log(`Compliance doc: ${relative(process.cwd(), compliance.docPath)}`);
  console.log(`Guardrail logs recorded under ${relative(process.cwd(), resolve(runRoot, 'guardrails'))}`);
  console.log(`Design partner approval: ${approval.relativePath}`);
  console.log('Phase 2 pipeline complete.');
}

main().catch((error) => {
  console.error('[phase2] fatal error:', error);
  process.exitCode = 1;
});
