import { resolve, relative } from 'path';
import { writeText, ensureDir } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';
import { localeBriefTemplates } from '../data/localeBriefs.js';

function renderSection(title, items) {
  return [`## ${title}`, '', ...items.map((item) => `- ${item}`), ''].join('\n');
}

function renderReferences(references) {
  if (!references.length) {
    return '';
  }

  const lines = references.map(({ label, url }) => `- [${label}](${url})`);
  return ['## References', '', ...lines, ''].join('\n');
}

/**
 * Generate locale research briefs and agent logs.
 * @param {object} params
 * @param {string[]} params.locales
 * @param {string} params.runRoot
 * @param {string} params.docsLocaleDir
 * @param {string} params.taskId
 */
export async function runResearchBriefs({
  locales,
  runRoot,
  docsLocaleDir = resolve(process.cwd(), 'docs/localization/locales'),
  taskId,
}) {
  await ensureDir(docsLocaleDir);

  const agentsDir = resolve(runRoot, 'agents');
  await ensureDir(agentsDir);
  const logPath = resolve(agentsDir, 'research.log');
  const logLines = [];

  const generated = [];

  for (const locale of locales) {
    const template = localeBriefTemplates[locale];
    if (!template) {
      logLines.push(`[WARN] ${isoTimestamp()} :: no template defined for locale ${locale}`);
      continue;
    }

    const timestamp = isoTimestamp();
    const filePath = resolve(docsLocaleDir, `${locale}.md`);
    const header = [
      `# Localization Brief — ${template.name} (${locale})`,
      '',
      `Last generated: ${timestamp}`,
      '',
    ].join('\n');

    const sections = [
      renderSection('Cultural Insights', template.culturalInsights),
      renderSection('Linguistic Guidelines', template.linguisticGuidelines),
      renderSection('Regulatory & Compliance', template.regulatoryNotes),
      renderSection('Tone & Voice', template.tone),
      renderReferences(template.references),
    ]
      .filter(Boolean)
      .join('\n');

    const documentBody = `${header}${sections}`;
    await writeText(filePath, documentBody);

    logLines.push(
      `[INFO] ${timestamp} :: generated locale brief ${locale} -> ${relative(process.cwd(), filePath)}`
    );

    generated.push({
      locale,
      path: filePath,
      relativePath: relative(process.cwd(), filePath),
    });
  }

  if (!generated.length) {
    logLines.push(
      `[ERROR] ${isoTimestamp()} :: no locale briefs generated; verify templates for locales=${locales.join(
        ','
      )}`
    );
  }

  const manifest = {
    taskId,
    phase: 'phase-0',
    recordedAt: isoTimestamp(),
    locales: generated.map(({ locale, relativePath }) => ({
      locale,
      path: relativePath,
    })),
  };

  const manifestPath = resolve(agentsDir, 'research-manifest.json');

  await writeText(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeText(logPath, logLines.join('\n') + '\n');

  return {
    logPath,
    manifestPath,
    entries: generated,
  };
}
