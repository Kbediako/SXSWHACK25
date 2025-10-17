import { Badge, Card, Center, Group, SimpleGrid, Stack, Text } from '@mantine/core';

interface VisualPreviewProps {
  baselineSrc: string;
  localizedSrc: string;
  locale?: string;
  localizedAvailable: boolean;
  emptyMessage: string;
}

export function VisualPreview({ baselineSrc, localizedSrc, locale, localizedAvailable, emptyMessage }: VisualPreviewProps) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      <PreviewCard title="Baseline DOM" src={baselineSrc} badgeLabel="baseline" badgeColor="gray" />
      <PreviewCard
        title="Localized DOM"
        src={localizedSrc}
        badgeLabel={locale ?? 'select a locale'}
        badgeColor={localizedAvailable ? 'blue' : 'gray'}
        unavailableMessage={localizedAvailable ? undefined : emptyMessage}
      />
    </SimpleGrid>
  );
}

interface PreviewCardProps {
  title: string;
  src: string;
  badgeLabel: string;
  badgeColor: string;
  unavailableMessage?: string;
}

function PreviewCard({ title, src, badgeLabel, badgeColor, unavailableMessage }: PreviewCardProps) {
  const normalizedBadge = badgeLabel.toUpperCase();

  return (
    <Card withBorder padding="sm" radius="md" h="100%">
      <Group justify="space-between" align="center" mb="xs">
        <Text fw={600}>{title}</Text>
        <Badge color={badgeColor} variant="light" style={{ textTransform: 'uppercase' }}>
          {normalizedBadge}
        </Badge>
      </Group>
      <Card.Section>
        {unavailableMessage ? (
          <Center h="70vh" bg="var(--mantine-color-dark-6)" c="dimmed" px="lg" ta="center">
            <Stack gap="xs" align="center">
              <Text fw={600} size="sm">
                Preview unavailable
              </Text>
              <Text size="sm" c="dimmed">
                {unavailableMessage}
              </Text>
            </Stack>
          </Center>
        ) : (
          <iframe
            title={title}
            src={src}
            style={{ border: 'none', width: '100%', height: '70vh', backgroundColor: '#1f1f1f' }}
          />
        )}
      </Card.Section>
    </Card>
  );
}
