import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

/**
 * Ensure that a directory exists, creating it recursively if missing.
 * @param {string} targetDir
 */
export async function ensureDir(targetDir) {
  await mkdir(targetDir, { recursive: true });
}

/**
 * Write UTF-8 text to disk, creating parent directories if required.
 * @param {string} filePath
 * @param {string} contents
 */
export async function writeText(filePath, contents) {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, contents, 'utf8');
}

/**
 * Write a JSON payload to disk with stable formatting.
 * @param {string} filePath
 * @param {unknown} data
 */
export async function writeJson(filePath, data) {
  await writeText(filePath, `${JSON.stringify(data, null, 2)}\n`);
}
