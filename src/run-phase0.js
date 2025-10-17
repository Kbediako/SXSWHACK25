#!/usr/bin/env node
import { resolve, relative } from 'path';
import process from 'process';
import { createRunTimestamp, isoTimestamp } from './utils/time.js';
import { ensureDir, writeJson } from './utils/fs.js';
import { runIngestion } from './ingestion/capture.js';
import { runResearchBriefs } from './agents/research.js';
import { orderedLocales } from './data/localeBriefs.js';

const TASK_ID = '0002';

function parseArgs(argv) {
  const args = {
    source: 'docs/localization/sample-page.html',
    locales: [...orderedLocales],
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
        args.locales = value.split(',').map((locale) => locale.trim()).filter(Boolean);
      }
    } else if (token === '--help' || token === '-h') {
      console.log(`Usage: npm run phase0 [--source <path>] [--locale en-US,en-GB,ja]

Options:
  --source   Relative path to the HTML asset to ingest. Defaults to docs/localization/sample-page.html
  --locale   Comma-separated list of locale codes to generate briefs for.
`);
      process.exit(0);
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const runTimestamp = createRunTimestamp();
  const runRoot = resolve(process.cwd(), '.runs', TASK_ID, runTimestamp);

  await ensureDir(runRoot);

  console.log(`Phase 0 run started at ${runTimestamp}`);
  console.log(`Run root: ${relative(process.cwd(), runRoot)}`);

  const ingestion = await runIngestion({
    sourcePath: args.source,
    runRoot,
    taskId: TASK_ID,
  });

  console.log(
    `Ingestion completed. Manifest: ${relative(process.cwd(), ingestion.manifestPath)}`
  );

  const research = await runResearchBriefs({
    locales: args.locales,
    runRoot,
    taskId: TASK_ID,
  });

  console.log(
    `Research briefs generated for locales: ${research.entries.map((entry) => entry.locale).join(', ')}`
  );

  const phaseDir = resolve(runRoot, 'phase-0');
  await ensureDir(phaseDir);
  const phaseManifestPath = resolve(runRoot, 'phase-0-manifest.json');

  const summary = {
    taskId: TASK_ID,
    phase: 'phase-0',
    recordedAt: isoTimestamp(),
    runRoot: relative(process.cwd(), runRoot),
    ingestion: {
      manifest: relative(process.cwd(), ingestion.manifestPath),
      screenshot: relative(process.cwd(), ingestion.screenshotPath),
      domSnapshot: relative(process.cwd(), ingestion.domPath),
    },
    research: {
      manifest: relative(process.cwd(), research.manifestPath),
      log: relative(process.cwd(), resolve(runRoot, 'agents/research.log')),
      locales: research.entries.map(({ locale, relativePath }) => ({ locale, path: relativePath })),
    },
    notes: [
      'Phase 0 skeleton ensures ingestion + research agents run end-to-end.',
      'Outputs are stored under .runs/0002/<timestamp>/ for downstream guardrails.',
    ],
  };

  await writeJson(phaseManifestPath, summary);
  await writeJson(resolve(phaseDir, 'summary.json'), summary);

  console.log(`Phase summary written to ${relative(process.cwd(), phaseManifestPath)}`);
  console.log('Phase 0 pipeline complete.');
}

main().catch((error) => {
  console.error('[phase0] fatal error:', error);
  process.exitCode = 1;
});
