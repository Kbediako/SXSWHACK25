export const localeBriefTemplates = {
  'en-US': {
    name: 'American English',
    culturalInsights: [
      'Highlight inclusive, plain-language messaging that resonates with broad U.S. audiences and avoids idioms that may alienate international readers.',
      'Surface accessibility commitments early—Section 508 compliance and WCAG alignment remain expectations for enterprise buyers.',
      'Feature quantitative proof points and customer evidence; U.S. stakeholders rely heavily on metrics during evaluation.',
    ],
    linguisticGuidelines: [
      'Prefer US spellings (e.g., “localization”, “organization”) and spell out measurements in imperial units with metric conversions where relevant.',
      'Adopt active voice with concise sentences (15–20 words) in alignment with Plain Language Guidelines.',
      'Capitalize product names (StitchFlow) consistently; avoid sentence case in CTA buttons.',
    ],
    regulatoryNotes: [
      'Clarify data residency and privacy posture with references to CCPA/CPRA where customer data processing is implied.',
      'Include an accessibility statement or link that references current WCAG conformance testing cadence.',
      'Document export controls or ITAR restrictions when marketing to U.S. federal or defense-aligned buyers.',
    ],
    tone: [
      'Confident and consultative, balancing innovation language with pragmatic implementation support.',
      'Avoid jargon that presumes deep localization expertise; define specialist terms on first use.',
    ],
    references: [
      {
        label: 'Plain Language Guidelines',
        url: 'https://www.plainlanguage.gov/guidelines/',
      },
      {
        label: 'U.S. Web Design System Content Guide',
        url: 'https://designsystem.digital.gov/documentation/content-guide/',
      },
      {
        label: 'Section508.gov Accessibility Requirements',
        url: 'https://www.section508.gov/manage/laws-and-policies/',
      },
    ],
  },
  'en-GB': {
    name: 'United Kingdom English',
    culturalInsights: [
      'Emphasise outcomes for distributed teams and acknowledge procurement governance common in the UK public and enterprise sectors.',
      'Feature sustainability or ESG positioning where relevant—UK buyers increasingly weigh ethical sourcing in vendor selection.',
      'Lead with social proof from European or UK-region clients to establish immediate relevance.',
    ],
    linguisticGuidelines: [
      'Use British spellings (“localisation”, “optimise”) and reference currencies in GBP (£) with metric units.',
      'Adopt GOV.UK style for numerals (e.g., use “per cent” in narrative sentences) and avoid title case in headings.',
      'Ensure CTA verbs align with British usage (e.g., “Book a demo” instead of “Schedule a demo”).',
    ],
    regulatoryNotes: [
      'Reference UK GDPR alignment and data hosting within the UK or EU where applicable.',
      'Note compliance with the Equality Act 2010 for accessibility, including captioning on multimedia assets.',
      'Acknowledge cookie consent mechanisms that adhere to ICO guidance and PECR regulations.',
    ],
    tone: [
      'Professional and collaborative, with measured claims backed by evidence.',
      'Avoid overly promotional superlatives; focus on tangible benefits and partnership language.',
    ],
    references: [
      {
        label: 'GOV.UK Content Design Guidance',
        url: 'https://www.gov.uk/guidance/style-guide',
      },
      {
        label: 'Equality Act 2010 Overview',
        url: 'https://www.legislation.gov.uk/ukpga/2010/15/contents',
      },
      {
        label: 'ICO Cookie and PECR Guidance',
        url: 'https://ico.org.uk/for-organisations/guide-to-pecr/cookies-and-similar-technologies/',
      },
    ],
  },
  ja: {
    name: 'Japanese',
    culturalInsights: [
      'Demonstrate respect for consensus-driven decision making—acknowledge how StitchFlow supports internal approvals and ringi processes.',
      'Highlight proven reliability, uptime, and customer support availability in Japan Standard Time.',
      'Reference localization of documentation and onboarding assets to reduce perceived implementation friction.',
    ],
    linguisticGuidelines: [
      'Use polite but direct business Japanese (丁寧語) and favor full-width punctuation for native typography consistency.',
      'Provide katakana transliterations for specialized terms on first mention and avoid unexplained English abbreviations.',
      'Maintain consistent typography when mixing Latin characters and kana; avoid emoji and casual slang.',
    ],
    regulatoryNotes: [
      'Clarify alignment with the Act on Specified Commercial Transactions for ecommerce workflows.',
      'Note adherence to APPI (Act on the Protection of Personal Information) and outline data residency options in the APAC region.',
      'Address WCAG compliance using resources from the Web Accessibility Infrastructure Committee (WAIC) to demonstrate local best practice.',
    ],
    tone: [
      'Reassuring and detail-oriented, emphasising long-term partnership and risk mitigation.',
      'Provide concrete implementation support examples (training, localized collateral) to build trust.',
    ],
    references: [
      {
        label: 'METI — Act on Specified Commercial Transactions',
        url: 'https://www.meti.go.jp/english/policy/economy/consumer/act_specified_commercial_transactions.html',
      },
      {
        label: 'Personal Information Protection Commission (APPI)',
        url: 'https://www.ppc.go.jp/en/legal/',
      },
      {
        label: 'WAIC — WCAG 2.1 Japanese Resources',
        url: 'https://waic.jp/docs/WCAG21/Overview.html',
      },
    ],
  },
};

export const orderedLocales = Object.keys(localeBriefTemplates);
