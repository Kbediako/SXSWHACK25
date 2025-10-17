import { Card, Group, SimpleGrid, Text } from '@mantine/core';

interface VisualPreviewProps {
  baselineSrc: string;
  localizedSrc: string;
}

export function VisualPreview({ baselineSrc, localizedSrc }: VisualPreviewProps) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      <PreviewCard title="Baseline DOM" src={baselineSrc} />
      <PreviewCard title="Localized DOM" src={localizedSrc} />
    </SimpleGrid>
  );
}

interface PreviewCardProps {
  title: string;
  src: string;
}

function PreviewCard({ title, src }: PreviewCardProps) {
  return (
    <Card withBorder padding="sm" radius="md" h="100%">
      <Group justify="space-between" align="center" mb="xs">
        <Text fw={600}>{title}</Text>
      </Group>
      <Card.Section>
        <iframe
          title={title}
          src={src}
          style={{ border: 'none', width: '100%', height: '70vh', backgroundColor: '#1f1f1f' }}
        >
          {/* TODO: Replace iframe fallback with real localized DOM markup when available. */}
        </iframe>
      </Card.Section>
    </Card>
  );
}
