import { resolve, relative } from 'path';
import yaml from 'js-yaml';
import { ensureDir, writeJson, writeText } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';

function buildCopyItems({ copyEntries, baselineLocale, reviewerId }) {
  const items = [];
  let accepted = 0;
  let pending = 0;

  for (const entry of copyEntries) {
    for (const item of entry.items) {
      const status =
        entry.locale === baselineLocale
          ? 'baseline'
          : item.requiresHumanReview
          ? 'pending-review'
          : item.diffStatus === 'changed'
          ? 'accepted'
          : 'no-change';

      if (status === 'accepted') {
        accepted += 1;
      }
      if (status === 'pending-review') {
        pending += 1;
      }

      items.push({
        id: `copy-${item.id}-${entry.locale}`,
        type: 'copy',
        locale: entry.locale,
        selector: item.selector,
        status,
        decided_at: isoTimestamp(),
        reviewer_id: reviewerId,
        rationale: item.rationale,
        proposed_text: item.proposedText,
        baseline_text: item.baselineText,
        requires_human_review: item.requiresHumanReview,
        compliance_notes: item.complianceNotes ?? [],
      });
    }
  }

  return {
    items,
    totals: {
      accepted,
      pending,
    },
  };
}

function buildMediaItems({ mediaEntries, reviewerId }) {
  const items = [];
  let accepted = 0;
  let pending = 0;

  for (const entry of mediaEntries) {
    for (const item of entry.recommendations) {
      const status = item.requiresHumanReview ? 'pending-review' : 'accepted';
      if (status === 'accepted') {
        accepted += 1;
      } else {
        pending += 1;
      }

      items.push({
        id: `media-${item.id}-${entry.locale}`,
        type: 'media',
        locale: entry.locale,
        slot: item.slot,
        status,
        decided_at: isoTimestamp(),
        reviewer_id: reviewerId,
        action: item.action,
        asset_suggestion: item.assetSuggestion,
        alt_text: item.altText,
        rationale: item.rationale,
        requires_human_review: item.requiresHumanReview,
        notes: item.notes ?? [],
      });
    }
  }

  return {
    items,
    totals: {
      accepted,
      pending,
    },
  };
}

function buildUxItems({ uxEntries, reviewerId }) {
  const items = [];
  let accepted = 0;
  let pending = 0;

  for (const entry of uxEntries) {
    for (const item of entry.recommendations) {
      const status = item.requiresHumanReview ? 'pending-review' : 'accepted';
      if (status === 'accepted') {
        accepted += 1;
      } else {
        pending += 1;
      }

      items.push({
        id: `ux-${item.id}-${entry.locale}`,
        type: 'ux',
        locale: entry.locale,
        selector: item.selector,
        status,
        decided_at: isoTimestamp(),
        reviewer_id: reviewerId,
        recommendation: item.recommendation,
        rationale: item.rationale,
        accessibility_impact: item.accessibilityImpact,
        requires_human_review: item.requiresHumanReview,
      });
    }
  }

  return {
    items,
    totals: {
      accepted,
      pending,
    },
  };
}

export async function persistChangeLog({
  runRoot,
  runTimestamp,
  taskId,
  baselineLocale,
  copyEntries,
  mediaEntries,
  uxEntries,
  reviewer = { id: 'rev-internal', name: 'Internal Localisation QA' },
}) {
  const tmpRoot = resolve(process.cwd(), 'tmp', 'localization-mvp', runTimestamp);
  await ensureDir(tmpRoot);

  const changelogPath = resolve(tmpRoot, 'changelog.yaml');
  const manifestPath = resolve(tmpRoot, 'manifest.json');

  const reviewerId = reviewer.id;

  const copySection = buildCopyItems({ copyEntries, baselineLocale, reviewerId });
  const mediaSection = buildMediaItems({ mediaEntries, reviewerId });
  const uxSection = buildUxItems({ uxEntries, reviewerId });

  const yamlDoc = {
    task_id: taskId,
    run_id: runTimestamp,
    recorded_at: isoTimestamp(),
    baseline_locale: baselineLocale,
    reviewer,
    totals: {
      copy: copySection.totals,
      media: mediaSection.totals,
      ux: uxSection.totals,
    },
    items: [...copySection.items, ...mediaSection.items, ...uxSection.items],
  };

  await writeText(changelogPath, yaml.dump(yamlDoc, { lineWidth: 120 }));
  await writeJson(manifestPath, yamlDoc);

  const uiDir = resolve(runRoot, 'ui');
  await ensureDir(uiDir);
  const uiLogPath = resolve(uiDir, 'changelog-verification.log');

  const uiLogLines = [
    `[INFO] ${isoTimestamp()} :: change_log_written=${relative(process.cwd(), changelogPath)}`,
    `[INFO] ${isoTimestamp()} :: totals copy=${copySection.totals.accepted} accepted / ${copySection.totals.pending} pending | media=${mediaSection.totals.accepted}/${mediaSection.totals.pending} | ux=${uxSection.totals.accepted}/${uxSection.totals.pending}`,
  ];

  await writeText(uiLogPath, uiLogLines.join('\n') + '\n');

  return {
    changelogPath,
    manifestPath,
    uiLogPath,
    relativeChangelogPath: relative(process.cwd(), changelogPath),
  };
}
