import { Anchor, Group, Paper, SimpleGrid, Stack, Text, Chip } from '@mantine/core';
import type { GuardrailCheck, GuardrailManifest } from '@/types/manifest';

interface GuardrailSummaryProps {
  manifest: GuardrailManifest;
}

export function GuardrailSummary({ manifest }: GuardrailSummaryProps) {
  return (
    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
      <GuardrailSection title="Specification" checks={manifest.spec} />
      <GuardrailSection title="Lint" checks={manifest.lint} />
      <GuardrailSection title="Evaluations" checks={manifest.eval} />
    </SimpleGrid>
  );
}

interface GuardrailSectionProps {
  title: string;
  checks: GuardrailCheck[];
}

function GuardrailSection({ title, checks }: GuardrailSectionProps) {
  return (
    <Paper withBorder shadow="xs" p="md" radius="md">
      <Stack gap="sm">
        <Text fw={600}>{title}</Text>
        {checks.length === 0 ? (
          <Text size="sm" c="dimmed">
            No checks reported.
          </Text>
        ) : (
          checks.map((check) => {
            const color = check.status === 'pass' ? 'teal' : 'red';
            const label = check.status === 'pass' ? 'Pass' : 'Fail';
            return (
              <Stack key={check.id} gap={4}>
                <Group justify="space-between" align="flex-start">
                  <Text fw={500}>{check.label}</Text>
                  <Chip checked readOnly variant="filled" color={color} size="sm" radius="sm">
                    {label}
                  </Chip>
                </Group>
                {check.details ? (
                  <Text size="xs" c="dimmed">
                    {check.details}
                  </Text>
                ) : null}
                {check.id && check.id.startsWith('http') ? (
                  <Anchor href={check.id} size="xs" target="_blank" rel="noreferrer">
                    View details
                  </Anchor>
                ) : null}
              </Stack>
            );
          })
        )}
      </Stack>
    </Paper>
  );
}
