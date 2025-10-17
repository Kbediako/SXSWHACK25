import { Badge, Button, Group, Stack, Text, Title } from '@mantine/core';
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
    <Group
      justify="space-between"
      align="center"
      h="100%"
      px="lg"
      style={{ backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--mantine-color-dark-4)' }}
    >
      <Stack gap={4}>
        <Group gap="xs" align="center">
          <Title order={3} fw={600}>
            Localization Orchestrator Viewer
          </Title>
          <Badge color="blue" variant="light" radius="sm">
            Task&nbsp;{manifest.taskId}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          {formattedDate} • Reviewer: {manifest.reviewer?.name ?? 'Unknown'}
        </Text>
      </Stack>
      <Group gap="xs">
        <Button
          component="a"
          href={changeLogHref}
          download
          disabled={!changeLogHref}
          variant="light"
          color="gray"
          radius="md"
        >
          Change Log
        </Button>
        <Button
          component="a"
          href={stitchHref}
          download
          disabled={!stitchHref}
          variant="filled"
          color="blue"
          radius="md"
        >
          Stitch Bundle
        </Button>
      </Group>
    </Group>
  );
}
