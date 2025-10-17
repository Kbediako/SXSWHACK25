import { resolve, relative } from 'path';
import { ensureDir, writeJson, writeText } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';
import { uxRecommendationCatalog } from '../data/uxRecommendations.js';

export async function runUxRecommendations({ locales, runRoot, taskId }) {
  const agentsDir = resolve(runRoot, 'agents');
  await ensureDir(agentsDir);

  const logLines = [];
  const localeEntries = [];
  let totalRecommendations = 0;

  for (const locale of locales) {
    const recommendations = uxRecommendationCatalog[locale];
    if (!recommendations || recommendations.length === 0) {
      logLines.push(
        `[WARN] ${isoTimestamp()} :: no UX recommendations defined for locale=${locale}`
      );
      continue;
    }

    totalRecommendations += recommendations.length;
    localeEntries.push({
      locale,
      generatedAt: isoTimestamp(),
      recommendations,
      summary: {
        total: recommendations.length,
        requiresHumanReview: recommendations.filter((item) => item.requiresHumanReview).length,
      },
    });

    logLines.push(
      `[INFO] ${isoTimestamp()} :: locale=${locale} ux_recommendations=${recommendations.length}`
    );
  }

  const payload = {
    taskId,
    phase: 'phase-1',
    recordedAt: isoTimestamp(),
    totals: {
      localesProcessed: localeEntries.length,
      recommendationCount: totalRecommendations,
    },
    locales: localeEntries,
  };

  const outputPath = resolve(agentsDir, 'ux.json');
  const logPath = resolve(agentsDir, 'ux.log');

  await writeJson(outputPath, payload);
  await writeText(logPath, logLines.join('\n') + '\n');

  return {
    outputPath,
    logPath,
    locales: localeEntries,
    relativeOutputPath: relative(process.cwd(), outputPath),
  };
}
