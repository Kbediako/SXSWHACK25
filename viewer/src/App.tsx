import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppShell,
  Center,
  Container,
  Loader,
  Tabs,
  Text,
  Alert,
} from '@mantine/core';
import { HeaderBar } from '@/components/HeaderBar';
import { LocaleSidebar, DEFAULT_LOCALE } from '@/components/LocaleSidebar';
import { RecommendationTable } from '@/components/RecommendationTable';
import { GuardrailSummary } from '@/components/GuardrailSummary';
import { VisualPreview } from '@/components/VisualPreview';
import { useRunData } from '@/hooks/useRunData';
import type { RecommendationEntry } from '@/types/manifest';

const LOCALIZED_PLACEHOLDER = '/localized/index.html';

export default function App() {
  const { data, loading, error } = useRunData();
  const [selectedLocale, setSelectedLocale] = useState(DEFAULT_LOCALE);
  const [activeTab, setActiveTab] = useState<string | null>('preview');
  const initializedLocale = useRef(false);

  useEffect(() => {
    if (!initializedLocale.current && data?.locales?.length) {
      initializedLocale.current = true;
      setSelectedLocale(data.locales[0] ?? DEFAULT_LOCALE);
    }
  }, [data?.locales]);

  const filteredCopy = useMemo(() => filterByLocale(data?.copy ?? [], selectedLocale), [data, selectedLocale]);
  const filteredMedia = useMemo(() => filterByLocale(data?.media ?? [], selectedLocale), [data, selectedLocale]);
  const filteredUx = useMemo(() => filterByLocale(data?.ux ?? [], selectedLocale), [data, selectedLocale]);

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !data) {
    return (
      <Center h="100vh">
        <Alert color="red" title="Failed to load run data">
          {error ?? 'Unknown error'}
        </Alert>
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 96 }}
      navbar={{ width: 220, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <HeaderBar manifest={data.manifest} />
      </AppShell.Header>
      <AppShell.Navbar>
        <LocaleSidebar
          locales={data.locales}
          selected={selectedLocale}
          onSelect={setSelectedLocale}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size="xl">
          <Tabs value={activeTab} onChange={setActiveTab} keepMounted={false}>
            <Tabs.List>
              <Tabs.Tab value="preview">Visual Preview</Tabs.Tab>
              <Tabs.Tab value="copy">Copy</Tabs.Tab>
              <Tabs.Tab value="media">Media</Tabs.Tab>
              <Tabs.Tab value="ux">UX</Tabs.Tab>
              <Tabs.Tab value="guardrails">Guardrails</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="preview" mt="md">
              <VisualPreview
                baselineSrc={`/${data.manifest.ingestionDom}`}
                localizedSrc={LOCALIZED_PLACEHOLDER}
              />
              <Text size="xs" c="dimmed" mt="sm">
                {/* TODO: Replace placeholder localized iframe source with generated localized DOM artifact. */}
                Localized view currently points to a placeholder file. Update the manifest once localized DOM is available.
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="copy" mt="md">
              <RecommendationTable
                entries={filteredCopy}
                emptyMessage="No copy recommendations for this locale."
              />
            </Tabs.Panel>

            <Tabs.Panel value="media" mt="md">
              <RecommendationTable
                entries={filteredMedia}
                emptyMessage="No media recommendations for this locale."
              />
            </Tabs.Panel>

            <Tabs.Panel value="ux" mt="md">
              <RecommendationTable
                entries={filteredUx}
                emptyMessage="No UX recommendations for this locale."
              />
            </Tabs.Panel>

            <Tabs.Panel value="guardrails" mt="md">
              <GuardrailSummary manifest={data.guardrails} />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

function filterByLocale(entries: RecommendationEntry[], locale: string) {
  if (!entries) return [];
  if (locale === DEFAULT_LOCALE) {
    return entries;
  }
  return entries.filter((entry) => entry.locale === locale);
}
