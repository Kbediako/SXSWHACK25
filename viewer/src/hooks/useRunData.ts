import { useEffect, useMemo, useState } from 'react';
import { fetchJson, fetchYaml } from '@/utils/yaml';
import type {
  CopyAgentPayload,
  GuardrailManifest,
  MediaAgentPayload,
  RecommendationEntry,
  ReviewStatus,
  RunManifest,
  UxAgentPayload,
} from '@/types/manifest';

export interface RunData {
  manifest: RunManifest;
  copy: RecommendationEntry[];
  media: RecommendationEntry[];
  ux: RecommendationEntry[];
  guardrails: GuardrailManifest;
  locales: string[];
}

interface UseRunDataState {
  loading: boolean;
  error?: string;
  data?: RunData;
}

function toPublicPath(path: string): string {
  if (!path) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export function useRunData(): UseRunDataState {
  const [state, setState] = useState<UseRunDataState>({ loading: true });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const manifest = await fetchJson<RunManifest>('/run-manifest.json');

        const [copyPayload, mediaPayload, uxPayload, guardrails] = await Promise.all([
          fetchJson<CopyAgentPayload>(toPublicPath(manifest.agents.copy.output)),
          fetchJson<MediaAgentPayload>(toPublicPath(manifest.agents.media.output)),
          fetchJson<UxAgentPayload>(toPublicPath(manifest.agents.ux.output)),
          fetchYaml<GuardrailManifest>(toPublicPath(manifest.guardrails.manifest)),
        ]);

        if (!active) {
          return;
        }

        const copy = normalizeCopyEntries(copyPayload);
        const media = normalizeMediaEntries(mediaPayload);
        const ux = normalizeUxEntries(uxPayload);

        const locales = collectLocales(copy, media, ux);

        setState({
          loading: false,
          data: {
            manifest,
            copy,
            media,
            ux,
            guardrails,
            locales,
          },
        });
      } catch (error) {
        if (!active) {
          return;
        }
        setState({
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => state, [state]);
}

function normalizeCopyEntries(payload: CopyAgentPayload | undefined): RecommendationEntry[] {
  if (!payload?.locales) return [];
  const entries: RecommendationEntry[] = [];
  payload.locales.forEach((bundle) => {
    bundle.items?.forEach((item, index) => {
      const status = deriveStatus({
        requiresHumanReview: item.requiresHumanReview,
        recommendedAction: item.recommendedAction,
      });

      const recommendation = item.proposedText
        ? item.baselineText && item.baselineText !== item.proposedText
          ? item.proposedText
          : item.proposedText
        : item.recommendedAction ?? 'Review recommendation';

      entries.push({
        id: item.id ?? `${bundle.locale}-copy-${index}`,
        locale: bundle.locale,
        target: item.selector ?? item.id ?? 'Copy item',
        recommendation,
        rationale: item.rationale ?? '',
        status,
      });
    });
  });
  return entries;
}

function normalizeMediaEntries(payload: MediaAgentPayload | undefined): RecommendationEntry[] {
  if (!payload?.locales) return [];
  const entries: RecommendationEntry[] = [];
  payload.locales.forEach((bundle) => {
    bundle.recommendations?.forEach((item, index) => {
      const status = item.requiresHumanReview ? 'requires_review' : 'approved';
      const summaryParts = [item.action ? titleCase(item.action.replace(/_/g, ' ')) : undefined];
      if (item.assetSuggestion) summaryParts.push(`Asset: ${item.assetSuggestion}`);
      if (item.altText) summaryParts.push(`Alt: ${item.altText}`);

      entries.push({
        id: item.id ?? `${bundle.locale}-media-${index}`,
        locale: bundle.locale,
        target: item.slot ?? item.id ?? 'Media slot',
        recommendation: summaryParts.filter(Boolean).join(' • ') || 'Media recommendation',
        rationale: item.rationale ?? (item.notes ? item.notes.join(' ') : ''),
        status,
      });
    });
  });
  return entries;
}

function normalizeUxEntries(payload: UxAgentPayload | undefined): RecommendationEntry[] {
  if (!payload?.locales) return [];
  const entries: RecommendationEntry[] = [];
  payload.locales.forEach((bundle) => {
    bundle.recommendations?.forEach((item, index) => {
      const status = item.requiresHumanReview ? 'requires_review' : 'approved';
      const rationale = [item.rationale, item.accessibilityImpact]
        .filter(Boolean)
        .join(' • ');

      entries.push({
        id: item.id ?? `${bundle.locale}-ux-${index}`,
        locale: bundle.locale,
        target: item.selector ?? item.id ?? 'UX selector',
        recommendation: item.recommendation ?? 'UX recommendation',
        rationale,
        status,
      });
    });
  });
  return entries;
}

function deriveStatus(options: { requiresHumanReview?: boolean; recommendedAction?: string | undefined }): ReviewStatus {
  if (options.requiresHumanReview) {
    return 'requires_review';
  }
  if (options.recommendedAction && options.recommendedAction.toLowerCase().includes('review')) {
    return 'requires_review';
  }
  return 'approved';
}

function collectLocales(...groups: RecommendationEntry[][]): string[] {
  const set = new Set<string>();
  groups.forEach((entries) => {
    entries.forEach((entry) => {
      set.add(entry.locale);
    });
  });
  return Array.from(set).sort();
}

function titleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ');
}
