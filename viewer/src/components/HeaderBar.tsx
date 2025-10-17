import { Button, Group, Stack, Text, Title } from '@mantine/core';
import type { RunManifest } from '@/types/manifest';

interface HeaderBarProps {
  manifest: RunManifest;
}

export function HeaderBar({ manifest }: HeaderBarProps) {
  const runDate = new Date(manifest.runTimestamp);
  const formattedDate = Number.isNaN(runDate.getTime())
    ? manifest.runTimestamp
    : runDate.toLocaleString();

  const changeLogHref = manifest.changelog?.yaml ? `/${manifest.changelog.yaml}` : undefined;
  const stitchHref = manifest.exports?.stitchBundle ? `/${manifest.exports.stitchBundle}` : undefined;

  return (
    <Group justify="space-between" align="flex-end" p="md">
      <Stack gap={0}>
        <Title order={2}>Localization Orchestrator Viewer</Title>
        <Text size="sm" c="dimmed">
          Task {manifest.taskId} • {formattedDate} • Reviewer: {manifest.reviewer?.name ?? 'Unknown'}
        </Text>
      </Stack>
      <Group>
        <Button component="a" href={changeLogHref} download disabled={!changeLogHref} variant="default">
          Open Change Log
        </Button>
        <Button component="a" href={stitchHref} download disabled={!stitchHref}>
          Download Stitch Bundle
        </Button>
      </Group>
    </Group>
  );
}
