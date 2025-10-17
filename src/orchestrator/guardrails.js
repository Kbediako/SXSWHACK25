import { spawn } from 'child_process';
import { resolve, relative } from 'path';
import { ensureDir, writeText } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';

async function runGuardrailCommand({ command, args, logPath, cwd }) {
  await ensureDir(resolve(logPath, '..'));

  const startedAt = isoTimestamp();
  const cmdLabel = `${command} ${args.join(' ')}`.trim();

  return new Promise((resolvePromise) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', async (code) => {
      const finishedAt = isoTimestamp();
      const lines = [
        `[COMMAND] ${startedAt} :: ${cmdLabel}`,
        `[EXIT] ${finishedAt} :: code=${code ?? 'null'}`,
        '--- stdout ---',
        stdout.trim() ? stdout.trimEnd() : '(empty)',
        '--- stderr ---',
        stderr.trim() ? stderr.trimEnd() : '(empty)',
      ];

      await writeText(logPath, lines.join('\n') + '\n');

      resolvePromise({
        command: cmdLabel,
        logPath,
        exitCode: code ?? 0,
        stdout,
        stderr,
        startedAt,
        finishedAt,
      });
    });
  });
}

/**
 * Execute spec/lint/eval guardrails and archive logs for the run.
 * @param {object} params
 * @param {string} params.runRoot
 * @param {string} params.taskId
 */
export async function runGuardrailSuite({ runRoot, taskId }) {
  const guardrailDir = resolve(runRoot, 'guardrails');
  await ensureDir(guardrailDir);

  const cwd = process.cwd();

  const commands = [
    {
      name: 'specGuard',
      command: 'bash',
      args: ['scripts/spec-guard.sh', '--dry-run'],
      logFile: 'spec-guard.log',
    },
    {
      name: 'lint',
      command: 'npm',
      args: ['run', 'lint'],
      logFile: 'lint.log',
    },
    {
      name: 'evalTest',
      command: 'npm',
      args: ['run', 'eval:test'],
      logFile: 'eval-test.log',
    },
  ];

  const results = {};

  for (const entry of commands) {
    const logPath = resolve(guardrailDir, entry.logFile);
    const outcome = await runGuardrailCommand({
      command: entry.command,
      args: entry.args,
      logPath,
      cwd,
    });

    results[entry.name] = {
      exitCode: outcome.exitCode,
      logPath,
      relativeLogPath: relative(cwd, logPath),
    };
  }

  const manifest = {
    taskId,
    recordedAt: isoTimestamp(),
    logs: Object.fromEntries(
      Object.entries(results).map(([name, value]) => [
        name,
        {
          exitCode: value.exitCode,
          log: value.relativeLogPath,
        },
      ])
    ),
  };

  const manifestPath = resolve(guardrailDir, 'manifest.json');
  await writeText(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  return {
    logs: results,
    manifestPath,
    manifest,
  };
}
