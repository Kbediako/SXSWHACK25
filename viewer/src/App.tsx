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
import type { RecommendationEntry, RunManifest } from '@/types/manifest';

const PLACEHOLDER_SRC = '/localized/placeholder.html';

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
  const localizedPreview = useMemo(
    () => resolveLocalizedPreview(data?.manifest, selectedLocale),
    [data?.manifest, selectedLocale],
  );

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
                localizedSrc={localizedPreview.src}
                locale={localizedPreview.locale}
                localizedAvailable={localizedPreview.available}
                emptyMessage={localizedPreview.message}
              />
              <Text size="xs" c="dimmed" mt="sm">
                {localizedPreview.available
                  ? 'Preview compares baseline DOM with the localized snapshot for the selected locale.'
                  : localizedPreview.message}
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

interface LocalizedPreviewState {
  src: string;
  locale?: string;
  available: boolean;
  message: string;
}

function resolveLocalizedPreview(manifest: RunManifest | undefined, locale: string): LocalizedPreviewState {
  const baseMessage = 'Select a locale from the sidebar to load a localized DOM snapshot.';

  if (!manifest || !locale || locale === DEFAULT_LOCALE) {
    return {
      src: PLACEHOLDER_SRC,
      available: false,
      message: baseMessage,
    };
  }

  const mappedPath = manifest.localizedDom?.[locale];

  if (mappedPath) {
    return {
      src: mappedPath.startsWith('/') ? mappedPath : `/${mappedPath}`,
      locale,
      available: true,
      message: `Showing localized DOM snapshot configured for ${locale}.`,
    };
  }

  return {
    src: PLACEHOLDER_SRC,
    locale,
    available: false,
    message: `No localized DOM snapshot registered for ${locale}. Add a file at localized/${locale}/index.html or update run-manifest.json to point to the correct asset.`,
  };
}
