/**
 * Return a filesystem-safe timestamp string derived from ISO format.
 * Example: 2025-10-17T14-15-00-123Z
 */
export function createRunTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

/**
 * ISO 8601 timestamp for logs/manifests.
 */
export function isoTimestamp(date = new Date()) {
  return date.toISOString();
}
