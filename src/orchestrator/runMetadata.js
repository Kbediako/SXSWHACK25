import { resolve, relative } from 'path';
import { ensureDir, writeJson } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';

export async function writeRunMetadata({
  runRoot,
  runTimestamp,
  taskId,
  phase = 'phase-1',
  sourcePath,
  locales,
  baselineLocale,
  reviewer,
  agents,
  artifacts,
  summaries,
}) {
  await ensureDir(runRoot);

  const payload = {
    taskId,
    runId: runTimestamp,
    phase,
    recordedAt: isoTimestamp(),
    baselineLocale,
    locales,
    reviewer,
    source: {
      path: relative(process.cwd(), sourcePath),
    },
    agents,
    summaries,
    artifacts: Object.fromEntries(
      Object.entries(artifacts).map(([key, value]) => {
        if (!value) {
          return [key, value];
        }

        if (Array.isArray(value)) {
          return [
            key,
            value.map((entry) =>
              typeof entry === 'string' ? relative(process.cwd(), entry) : entry
            ),
          ];
        }

        if (typeof value === 'string') {
          return [key, relative(process.cwd(), value)];
        }

        return [
          key,
          Object.fromEntries(
            Object.entries(value).map(([innerKey, innerValue]) => {
              if (typeof innerValue === 'string') {
                return [innerKey, relative(process.cwd(), innerValue)];
              }
              if (Array.isArray(innerValue)) {
                return [
                  innerKey,
                  innerValue.map((entry) =>
                    typeof entry === 'string' ? relative(process.cwd(), entry) : entry
                  ),
                ];
              }
              return [innerKey, innerValue];
            })
          ),
        ];
      })
    ),
  };

  await writeJson(resolve(runRoot, 'run.json'), payload);

  return payload;
}
