import { readFile } from 'fs/promises';
import { resolve, relative } from 'path';
import { load as loadHtml } from 'cheerio';
import { ensureDir, writeJson, writeText } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';
import { copyAdaptationCatalog } from '../data/copyAdaptations.js';

const NORMALIZE_WHITESPACE = (value) => value.replace(/\s+/g, ' ').trim();

function buildBaselineMap($, baselineLocale, evaluationLog) {
  const baseline = new Map();
  for (const item of copyAdaptationCatalog) {
    const variant = item.variants[baselineLocale];
    const domText = NORMALIZE_WHITESPACE($(item.selector).text() ?? '');
    const expected = variant ? NORMALIZE_WHITESPACE(variant.text) : null;
    const matches = expected ? domText === expected : false;

    baseline.set(item.id, {
      selector: item.selector,
      expected,
      actual: domText,
      category: item.category,
      requiresHumanReview: variant?.requiresHumanReview ?? false,
    });

    if (expected === null) {
      evaluationLog.push(
        `[WARN] ${isoTimestamp()} :: baseline locale ${baselineLocale} missing variant for item=${item.id}`
      );
    } else if (!matches) {
      evaluationLog.push(
        `[WARN] ${isoTimestamp()} :: selector=${item.selector} baseline mismatch; expected="${expected}" actual="${domText}"`
      );
    } else {
      evaluationLog.push(
        `[INFO] ${isoTimestamp()} :: baseline verified for item=${item.id} selector=${item.selector}`
      );
    }
  }

  return baseline;
}

function summariseLocaleItems(localeItems) {
  const totals = {
    total: localeItems.length,
    changed: 0,
    unchanged: 0,
    requiresHumanReview: 0,
  };

  for (const item of localeItems) {
    if (item.diffStatus === 'changed') {
      totals.changed += 1;
    } else {
      totals.unchanged += 1;
    }
    if (item.requiresHumanReview) {
      totals.requiresHumanReview += 1;
    }
  }

  return totals;
}

export async function runCopyAdaptation({
  domPath,
  locales,
  runRoot,
  taskId,
  baselineLocale = 'en-US',
}) {
  const html = await readFile(domPath, 'utf8');
  const $ = loadHtml(html);

  const agentsDir = resolve(runRoot, 'agents');
  await ensureDir(agentsDir);

  const evaluationLog = [];
  const baseline = buildBaselineMap($, baselineLocale, evaluationLog);

  const localeEntries = [];
  let totalChanges = 0;

  for (const locale of locales) {
    const localeItems = [];

    for (const item of copyAdaptationCatalog) {
      const variant = item.variants[locale];
      if (!variant) {
        evaluationLog.push(
          `[WARN] ${isoTimestamp()} :: no copy adaptation defined for item=${item.id} locale=${locale}`
        );
        continue;
      }

      const baselineRecord = baseline.get(item.id);
      const baselineText = baselineRecord ? baselineRecord.actual : '';
      const proposedText = variant.text;
      const diffStatus =
        NORMALIZE_WHITESPACE(proposedText) === NORMALIZE_WHITESPACE(baselineText)
          ? 'unchanged'
          : 'changed';
      const requiresHumanReview = Boolean(variant.requiresHumanReview);

      if (diffStatus === 'changed') {
        totalChanges += 1;
      }

      localeItems.push({
        id: item.id,
        selector: item.selector,
        category: item.category,
        baselineText,
        proposedText,
        diffStatus,
        rationale: variant.rationale,
        complianceNotes: variant.complianceNotes ?? [],
        requiresHumanReview,
        recommendedAction:
          locale === baselineLocale
            ? 'retain-baseline'
            : requiresHumanReview
            ? 'review-and-approve'
            : 'apply',
      });

      evaluationLog.push(
        `[INFO] ${isoTimestamp()} :: locale=${locale} item=${item.id} diff=${diffStatus} requires_human_review=${requiresHumanReview}`
      );
    }

    if (!localeItems.length) {
      continue;
    }

    localeEntries.push({
      locale,
      generatedAt: isoTimestamp(),
      items: localeItems,
      summary: summariseLocaleItems(localeItems),
    });
  }

  const payload = {
    taskId,
    phase: 'phase-1',
    recordedAt: isoTimestamp(),
    baselineLocale,
    totals: {
      localesProcessed: localeEntries.length,
      changeCount: totalChanges,
    },
    locales: localeEntries,
  };

  const copyPath = resolve(agentsDir, 'copy.json');
  const evaluationLogPath = resolve(agentsDir, 'copy-eval.log');

  await writeJson(copyPath, payload);
  await writeText(evaluationLogPath, evaluationLog.join('\n') + '\n');

  return {
    outputPath: copyPath,
    evaluationLogPath,
    baselineLocale,
    locales: localeEntries,
    baseline: Object.fromEntries(
      [...baseline.entries()].map(([id, record]) => [
        id,
        { ...record, actual: record.actual },
      ])
    ),
  };
}

export async function writeCopyRegressionLog({
  runRoot,
  taskId,
  baselineLocale,
  localeEntries,
}) {
  const regressionDir = resolve(runRoot, 'regression');
  await ensureDir(regressionDir);

  const logPath = resolve(regressionDir, 'copy-diff.log');
  const lines = [
    `[HEADER] ${isoTimestamp()} :: task=${taskId} baseline=${baselineLocale} locales=${localeEntries
      .map((entry) => entry.locale)
      .join(', ')}`,
  ];

  for (const entry of localeEntries) {
    for (const item of entry.items) {
      const statusLabel =
        item.diffStatus === 'changed'
          ? 'DIFF'
          : entry.locale === baselineLocale
          ? 'BASELINE'
          : 'PASS';
      lines.push(
        `[${statusLabel}] ${isoTimestamp()} :: locale=${entry.locale} item=${item.id} diff=${item.diffStatus} recommended=${item.recommendedAction}`
      );
    }
  }

  if (localeEntries.length === 0) {
    lines.push(`[WARN] ${isoTimestamp()} :: no locales processed; regression harness skipped.`);
  }

  await writeText(logPath, lines.join('\n') + '\n');

  return {
    logPath,
    relativeLogPath: relative(process.cwd(), logPath),
  };
}
