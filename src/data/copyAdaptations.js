export const copyAdaptationCatalog = [
  {
    id: 'hero-headline',
    selector: 'header h1',
    category: 'hero',
    variants: {
      'en-US': {
        text: 'Launch Every Locale with Confidence',
        rationale: 'Baseline hero message retained for U.S. audiences.',
        complianceNotes: ['No region-specific disclaimers required in hero headline.'],
        requiresHumanReview: false,
      },
      'en-GB': {
        text: 'Launch Every Market with Confidence',
        rationale:
          'Emphasises multi-market readiness and keeps tone confident while aligning with UK marketing language preferences.',
        complianceNotes: ['Aligns with Equality Act guidance by focusing on inclusive language.'],
        requiresHumanReview: false,
      },
      ja: {
        text: 'すべての市場を自信を持ってローンチしましょう',
        rationale:
          'Provides an encouraging call-to-action in polite Japanese, emphasising partnership and momentum.',
        complianceNotes: ['Avoids specific performance claims to remain conservative for Japanese regulations.'],
        requiresHumanReview: true,
      },
    },
  },
  {
    id: 'hero-subhead',
    selector: 'header p',
    category: 'hero',
    variants: {
      'en-US': {
        text: 'StitchFlow orchestrates translation, copy, and UX updates across regions so your team can preview, approve, and ship localized web experiences in record time.',
        rationale: 'Baseline positioning statement for U.S. audiences.',
        complianceNotes: ['References localisation velocity benefits without quantitative promises.'],
        requiresHumanReview: false,
      },
      'en-GB': {
        text: 'StitchFlow orchestrates translation, copy, and UX updates across regions so your team can preview, approve, and ship localised web experiences without slowing delivery programmes.',
        rationale:
          'Uses British spellings and directly addresses programme delivery expectations common in UK organisations.',
        complianceNotes: ['Mentions delivery programmes—a key procurement consideration noted in locale brief.'],
        requiresHumanReview: false,
      },
      ja: {
        text: 'StitchFlowは翻訳、コピー、UXの更新を一つのワークフローにまとめ、チームがキャンバス上でレビューして承認し、迅速にローカライズ版をリリースできるよう支援します。',
        rationale:
          'Explains the orchestrated workflow in formal Japanese (丁寧語) while highlighting shared review visibility.',
        complianceNotes: ['Keeps claims qualitative to respect APPI advertising guidance.'],
        requiresHumanReview: true,
      },
    },
  },
  {
    id: 'ops-paragraph',
    selector: 'section[aria-labelledby=\"ops\"] p',
    category: 'value-prop',
    variants: {
      'en-US': {
        text: 'Localizing digital journeys is more than translation—teams need alignment on tone, imagery, accessibility, and regional compliance. StitchFlow threads each workflow together with human-in-the-loop checkpoints and granular change logs.',
        rationale: 'Baseline narrative on localisation complexity for U.S. teams.',
        complianceNotes: ['Highlights accessibility expectations (Section 508) noted in locale brief.'],
        requiresHumanReview: false,
      },
      'en-GB': {
        text: 'Localising digital journeys is more than translation—teams need alignment on tone, imagery, accessibility, and regional compliance. StitchFlow threads each workflow together with human-in-the-loop checkpoints and granular change logs tailored for UK governance.',
        rationale:
          'Switches to British spelling and explicitly nods to UK governance expectations surfaced in the brief.',
        complianceNotes: ['References governance without naming specific regulations, avoiding legal overreach.'],
        requiresHumanReview: false,
      },
      ja: {
        text: 'デジタル体験のローカライズは単なる翻訳ではありません。トーンやビジュアル、アクセシビリティ、地域のコンプライアンスまで整合させる必要があります。StitchFlowは各ワークフローをヒューマンチェックと詳細なチェンジログでつなげます。',
        rationale:
          'Provides a succinct explanation aligned to Japanese consensus-building norms and highlights auditability.',
        complianceNotes: ['Mentionsコンプライアンス (compliance) consistent with brief guidance from METI and APPI.'],
        requiresHumanReview: true,
      },
    },
  },
  {
    id: 'cta-paragraph',
    selector: 'section[aria-labelledby=\"cta\"] p',
    category: 'cta',
    variants: {
      'en-US': {
        text: 'Request a tailored walkthrough for your localization program.',
        rationale: 'Baseline CTA copy supporting demo request.',
        complianceNotes: ['Uses “program” to match U.S. spelling norms.'],
        requiresHumanReview: false,
      },
      'en-GB': {
        text: 'Request a tailored walkthrough for your localisation programme.',
        rationale: 'Adapts to UK spelling and references “programme” to match procurement language.',
        complianceNotes: ['Keeps call-to-action compliant with UK marketing standards (CAP Code).'],
        requiresHumanReview: false,
      },
      ja: {
        text: '貴社のローカライゼーション計画に合わせたウォークスルーをご依頼ください。',
        rationale:
          'Uses polite request language and emphasises tailoring to the customer’s localisation framework.',
        complianceNotes: ['Formality level aligns with expectations for B2B marketing content in Japan.'],
        requiresHumanReview: true,
      },
    },
  },
  {
    id: 'cta-button',
    selector: 'section[aria-labelledby=\"cta\"] button',
    category: 'cta',
    variants: {
      'en-US': {
        text: 'Request localized demo',
        rationale: 'Baseline button label encouraging demo request.',
        complianceNotes: ['Button label aligns with baseline product messaging.'],
        requiresHumanReview: false,
      },
      'en-GB': {
        text: 'Book a localisation walkthrough',
        rationale: 'Switches to UK-preferred verb (“Book”) and British spelling for localisation.',
        complianceNotes: ['Encourages booking language common in UK marketing flows.'],
        requiresHumanReview: false,
      },
      ja: {
        text: 'ローカライズ済みデモを依頼',
        rationale: 'Direct imperative phrasing commonly used in Japanese enterprise CTAs.',
        complianceNotes: ['Avoids guarantee phrasing, consistent with APPI marketing guidance.'],
        requiresHumanReview: true,
      },
    },
  },
];
