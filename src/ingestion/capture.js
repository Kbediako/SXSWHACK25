import { chromium } from 'playwright';
import { createHash } from 'crypto';
import { resolve, relative } from 'path';
import { ensureDir, writeJson, writeText } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';

/**
 * Capture a DOM snapshot and screenshot for a given HTML source.
 * @param {object} params
 * @param {string} params.sourcePath - Relative path to the HTML asset to ingest.
 * @param {string} params.runRoot - Absolute path to the timestamped run root.
 * @param {string} params.taskId - For manifest tagging.
 * @returns {Promise<object>} Paths to generated artifacts.
 */
export async function runIngestion({ sourcePath, runRoot, taskId }) {
  const sourceAbsolute = resolve(process.cwd(), sourcePath);
  const ingestionDir = resolve(runRoot, 'ingestion');
  await ensureDir(ingestionDir);

  const screenshotPath = resolve(ingestionDir, 'base.png');
  const domPath = resolve(ingestionDir, 'dom.html');
  const manifestPath = resolve(ingestionDir, 'manifest.json');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const networkEvents = [];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await context.newPage();

    page.on('requestfinished', async (request) => {
      const response = await request.response();
      networkEvents.push({
        type: 'finished',
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        status: response?.status(),
      });
    });

    page.on('requestfailed', (request) => {
      networkEvents.push({
        type: 'failed',
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        error: request.failure()?.errorText ?? null,
      });
    });

    const fileUrl = `file://${sourceAbsolute}`;
    const navigation = await page.goto(fileUrl, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await page.waitForTimeout(1000);

    await page.screenshot({ path: screenshotPath, fullPage: true });

    const html = await page.content();
    await writeText(domPath, html);

    const digest = createHash('sha256').update(html).digest('hex');

    const manifest = {
      taskId,
      phase: 'phase-0',
      recordedAt: isoTimestamp(),
      source: {
        path: relative(process.cwd(), sourceAbsolute),
        url: fileUrl,
        status: navigation?.status(),
      },
      output: {
        manifest: relative(process.cwd(), manifestPath),
        screenshot: relative(process.cwd(), screenshotPath),
        domSnapshot: relative(process.cwd(), domPath),
      },
      browser: {
        name: 'chromium',
        version: browser.version(),
        viewport: page.viewportSize(),
      },
      digest: {
        algorithm: 'sha256',
        value: digest,
      },
      title: await page.title(),
      network: networkEvents.slice(0, 50),
      notes: [
        'Ingestion executed in headless Chromium with automation evasion headers.',
        'DOM snapshot stored as UTF-8 HTML for downstream diffing.',
      ],
    };

    await writeJson(manifestPath, manifest);

    return {
      manifestPath,
      screenshotPath,
      domPath,
      manifest,
    };
  } finally {
    await context.close();
    await browser.close();
  }
}
