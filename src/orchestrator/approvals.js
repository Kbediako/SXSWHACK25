import { resolve, relative } from 'path';
import { ensureDir, writeText } from '../utils/fs.js';
import { isoTimestamp } from '../utils/time.js';

/**
 * Record design partner approval for the pilot bundle.
 * @param {object} params
 */
export async function recordDesignPartnerApproval({
  runTimestamp,
  taskId,
  partnerName,
  approverName,
  approverRole,
  approverEmail,
  decision = 'approved',
  notes = [],
}) {
  const approvalsDir = resolve(process.cwd(), 'docs', 'localization', 'approvals');
  await ensureDir(approvalsDir);

  const approvalPath = resolve(approvalsDir, `${runTimestamp}.md`);
  const recordedAt = isoTimestamp();

  const body = [
    `# Pilot Sign-off — ${partnerName}`,
    '',
    `- Task ID: ${taskId}`,
    `- Run ID: ${runTimestamp}`,
    `- Decision: ${decision.toUpperCase()}`,
    `- Recorded: ${recordedAt}`,
    `- Approver: ${approverName} (${approverRole})`,
    `- Contact: ${approverEmail}`,
    '',
    '## Notes',
    '',
    ...(notes.length ? notes.map((note) => `- ${note}`) : ['- No additional notes supplied.']),
    '',
    '## Next Actions',
    '',
    '- Share export bundle via secure channel with design partner ops.',
    '- Capture follow-up feedback within two business days.',
    '',
  ].join('\n');

  await writeText(approvalPath, body);

  return {
    approvalPath,
    recordedAt,
    relativePath: relative(process.cwd(), approvalPath),
  };
}
