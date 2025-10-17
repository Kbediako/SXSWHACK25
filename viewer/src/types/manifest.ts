export type ReviewStatus = 'requires_review' | 'approved';

export interface CopyAgentItem {
  id?: string;
  selector?: string;
  proposedText?: string;
  baselineText?: string;
  rationale?: string;
  requiresHumanReview?: boolean;
  recommendedAction?: string;
}

export interface CopyAgentLocale {
  locale: string;
  items?: CopyAgentItem[];
}

export interface CopyAgentPayload {
  locales?: CopyAgentLocale[];
}

export interface MediaRecommendationItem {
  id?: string;
  slot?: string;
  action?: string;
  assetSuggestion?: string;
  altText?: string;
  rationale?: string;
  requiresHumanReview?: boolean;
  notes?: string[];
}

export interface MediaAgentLocale {
  locale: string;
  recommendations?: MediaRecommendationItem[];
}

export interface MediaAgentPayload {
  locales?: MediaAgentLocale[];
}

export interface UxRecommendationItem {
  id?: string;
  selector?: string;
  recommendation?: string;
  rationale?: string;
  accessibilityImpact?: string;
  requiresHumanReview?: boolean;
}

export interface UxAgentLocale {
  locale: string;
  recommendations?: UxRecommendationItem[];
}

export interface UxAgentPayload {
  locales?: UxAgentLocale[];
}

export interface RecommendationEntry {
  id: string;
  locale: string;
  target: string;
  recommendation: string;
  rationale: string;
  status: ReviewStatus;
}

export interface GuardrailCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail';
  details?: string;
}

export interface GuardrailManifest {
  spec: GuardrailCheck[];
  lint: GuardrailCheck[];
  eval: GuardrailCheck[];
}

export interface RunManifest {
  taskId: string;
  runTimestamp: string;
  reviewer: {
    name: string;
  };
  ingestion: {
    screenshot: string;
  };
  ingestionDom: string;
  preview: {
    video: string;
  };
  agents: {
    copy: { output: string };
    media: { output: string };
    ux: { output: string };
  };
  changelog: {
    yaml: string;
  };
  guardrails: {
    manifest: string;
  };
  exports?: {
    stitchBundle?: string;
  };
}
