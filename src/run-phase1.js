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
    } else if (token === '--help' || token === '-h') {
      console.log(`Usage: npm run phase1 [--source <path>] [--locale en-US,en-GB,ja]
Options:
  --source          Relative path to the HTML asset to ingest. Defaults to docs/localization/sample-page.html
  --locale          Comma-separated list of locale codes to run through guided localisation.
  --reviewer-id     Reviewer identifier recorded in the change log. Defaults to rev-internal.
  --reviewer-name   Reviewer display name for change log manifests.
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

  console.log(`Phase 1 run started at ${runTimestamp}`);
  console.log(`Run root: ${relative(process.cwd(), runRoot)}`);

  const ingestion = await runIngestion({
    sourcePath: args.source,
    runRoot,
    taskId: TASK_ID,
  });

  console.log(
    `Ingestion complete. Manifest: ${relative(process.cwd(), ingestion.manifestPath)}`
  );

  const research = await runResearchBriefs({
    locales: args.locales,
    runRoot,
    taskId: TASK_ID,
  });

  console.log(
    `Research briefs refreshed: ${research.entries
      .map((entry) => entry.locale)
      .join(', ')}`
  );

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

  console.log(
    `Copy recommendations written to ${relative(process.cwd(), copy.outputPath)}`
  );

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

  const phaseDir = resolve(runRoot, 'phase-1');
  await ensureDir(phaseDir);
  const phaseManifestPath = resolve(runRoot, 'phase-1-manifest.json');
  const phaseSummaryPath = resolve(phaseDir, 'summary.json');

  const phaseSummary = {
    taskId: TASK_ID,
    phase: 'phase-1',
    recordedAt: isoTimestamp(),
    runRoot: relative(process.cwd(), runRoot),
    ingestion: {
      manifest: relative(process.cwd(), ingestion.manifestPath),
      screenshot: relative(process.cwd(), ingestion.screenshotPath),
    },
    research: {
      manifest: relative(process.cwd(), resolve(runRoot, 'agents/research-manifest.json')),
      log: relative(process.cwd(), resolve(runRoot, 'agents/research.log')),
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
    changelog: {
      yaml: changeLog.relativeChangelogPath,
      uiLog: relative(process.cwd(), changeLog.uiLogPath),
    },
    preview: {
      video: preview.relativeVideoPath,
      metadata: relative(process.cwd(), preview.metadataPath),
      notes: relative(process.cwd(), preview.notesPath),
    },
    notes: [
      'Phase 1 integrates copy, media, and UX agent outputs with an ingestion-derived canvas preview video.',
      'Review pending items in changelog YAML before shipping locale bundle.',
    ],
  };

  await writeJson(phaseManifestPath, phaseSummary);
  await writeJson(phaseSummaryPath, phaseSummary);

  const reviewLogPath = resolve(runRoot, 'phase-1-review.log');
  const reviewLogLines = [
    `[INFO] ${isoTimestamp()} :: phase-1 manifest=${relative(process.cwd(), phaseManifestPath)}`,
    `[INFO] ${isoTimestamp()} :: copy changes=${copySummary.totals.changed} requires_review=${copySummary.totals.requiresReview}`,
    `[INFO] ${isoTimestamp()} :: media recommendations=${mediaSummary.totals.total} requires_review=${mediaSummary.totals.requiresReview}`,
    `[INFO] ${isoTimestamp()} :: ux recommendations=${uxSummary.totals.total} requires_review=${uxSummary.totals.requiresReview}`,
    `[INFO] ${isoTimestamp()} :: changelog=${changeLog.relativeChangelogPath}`,
    `[INFO] ${isoTimestamp()} :: preview_video=${preview.relativeVideoPath}`,
  ];
  await writeText(reviewLogPath, reviewLogLines.join('\n') + '\n');

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
    phaseManifest: phaseManifestPath,
    phaseSummary: phaseSummaryPath,
    reviewLog: reviewLogPath,
  };

  await writeRunMetadata({
    runRoot,
    runTimestamp,
    taskId: TASK_ID,
    phase: 'phase-1',
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
    },
  });

  console.log(`Phase 1 manifest written to ${relative(process.cwd(), phaseManifestPath)}`);
  console.log(
    `Changelog stored to ${changeLog.relativeChangelogPath} (UI log ${relative(
      process.cwd(),
      changeLog.uiLogPath
    )})`
  );
  console.log(`Phase 1 pipeline complete.`);
}

main().catch((error) => {
  console.error('[phase1] fatal error:', error);
  process.exitCode = 1;
});
