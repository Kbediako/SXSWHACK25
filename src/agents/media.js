import { resolve, relative } from 'path';
import { ensureDir, writeJson, writeText } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';
import { mediaRecommendationCatalog } from '../data/mediaRecommendations.js';

export async function runMediaRecommendations({ locales, runRoot, taskId }) {
  const agentsDir = resolve(runRoot, 'agents');
  await ensureDir(agentsDir);

  const logLines = [];
  const localeEntries = [];
  let totalRecommendations = 0;

  for (const locale of locales) {
    const recommendations = mediaRecommendationCatalog[locale];
    if (!recommendations || recommendations.length === 0) {
      logLines.push(
        `[WARN] ${isoTimestamp()} :: no media recommendations defined for locale=${locale}`
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
      `[INFO] ${isoTimestamp()} :: locale=${locale} media_recommendations=${recommendations.length}`
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

  const outputPath = resolve(agentsDir, 'media.json');
  const logPath = resolve(agentsDir, 'media.log');

  await writeJson(outputPath, payload);
  await writeText(logPath, logLines.join('\n') + '\n');

  return {
    outputPath,
    logPath,
    locales: localeEntries,
    relativeOutputPath: relative(process.cwd(), outputPath),
  };
}
