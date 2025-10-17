import { resolve, relative } from 'path';
import { spawn } from 'child_process';
import { ensureDir, writeJson, writeText } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';
import ffmpegPath from 'ffmpeg-static';

async function generateCanvasPreviewVideo({ screenshotPath, outputPath }) {
  if (!ffmpegPath) {
    throw new Error('FFmpeg binary unavailable; cannot generate canvas preview video.');
  }

  const args = [
    '-y',
    '-loop',
    '1',
    '-i',
    screenshotPath,
    '-vf',
    'scale=1280:-2,format=yuv420p',
    '-t',
    '5',
    '-c:v',
    'libx264',
    '-movflags',
    '+faststart',
    '-an',
    outputPath,
  ];

  await new Promise((resolvePromise, rejectPromise) => {
    const ffmpegProcess = spawn(ffmpegPath, args, { stdio: 'ignore' });
    ffmpegProcess.on('error', rejectPromise);
    ffmpegProcess.on('exit', (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`FFmpeg exited with code ${code} while generating canvas preview.`));
      }
    });
  });
}

export async function createCanvasPreviewArtifacts({
  runTimestamp,
  runRoot,
  taskId,
  locales,
  screenshotPath,
  copySummary,
  mediaSummary,
  uxSummary,
}) {
  const previewDir = resolve(process.cwd(), 'tmp', 'previews', 'localization-mvp', runTimestamp);
  await ensureDir(previewDir);

  const placeholderVideoPath = resolve(previewDir, 'canvas-review.mp4');
  const metadataPath = resolve(previewDir, 'metadata.json');
  const notesPath = resolve(previewDir, 'notes.txt');

  await generateCanvasPreviewVideo({
    screenshotPath,
    outputPath: placeholderVideoPath,
  });

  const metadata = {
    taskId,
    runId: runTimestamp,
    recordedAt: isoTimestamp(),
    locales,
    copySummary,
    mediaSummary,
    uxSummary,
    previewMethod: 'ingestion-screenshot-loop',
    sourceScreenshot: relative(process.cwd(), screenshotPath),
    notes: [
      'Canvas video currently renders a five-second loop derived from the ingestion baseline screenshot.',
      'Replace with live canvas recording when the interactive reviewer flow is available.',
    ],
  };

  await writeJson(metadataPath, metadata);
  const noteTimestamp = isoTimestamp();
  await writeText(
    notesPath,
    [
      `[INFO] ${noteTimestamp} :: Canvas preview video generated from ingestion screenshot for locales=${locales.join(', ')}`,
      `[INFO] ${noteTimestamp} :: Upgrade to live canvas recording when the interactive reviewer UI is available.`,
    ].join('\n') + '\n'
  );

  return {
    previewDir,
    videoPath: placeholderVideoPath,
    metadataPath,
    notesPath,
    relativeVideoPath: relative(process.cwd(), placeholderVideoPath),
  };
}
