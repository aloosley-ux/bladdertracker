/**
 * UK-focused developmental support resources.
 *
 * Links are prioritised from official/authoritative public-sector sources:
 * NHS, gov.uk, and established UK charities. All URLs should be stable and
 * official — prefer the root or well-known section URLs rather than deep
 * campaign URLs that may expire.
 *
 * Validated: March 2026.
 * Review annually or when a new major NHS/gov.uk restructure is announced.
 */

export interface SupportResource {
  /** Short emoji that summarises the resource type */
  emoji: string;
  label: string;
  url: string;
  /** Human-readable category for grouping */
  category: 'nhs' | 'gov' | 'health-visitor' | 'send' | 'early-years' | 'charity';
}

export const UK_SUPPORT_RESOURCES: SupportResource[] = [
  // ── NHS core development resources ──────────────────────────────────
  {
    emoji: '👶',
    label: 'NHS: Is my child developing normally?',
    url: 'https://www.nhs.uk/conditions/baby/babys-development/is-my-child-developing-normally/',
    category: 'nhs',
  },
  {
    emoji: '🏥',
    label: 'NHS Start for Life: Baby and toddler development',
    url: 'https://www.nhs.uk/start-for-life/baby/development/',
    category: 'nhs',
  },
  {
    emoji: '🩺',
    label: 'NHS: Find your GP practice',
    url: 'https://www.nhs.uk/service-search/find-a-gp',
    category: 'health-visitor',
  },
  {
    emoji: '👩‍⚕️',
    label: 'NHS: Health visitors — what they do and how to find yours',
    url: 'https://www.nhs.uk/conditions/baby/support-and-services/health-visitors/',
    category: 'health-visitor',
  },
  // ── Speech and language ─────────────────────────────────────────────
  {
    emoji: '🗣️',
    label: 'NHS: Speech and language delay in children',
    url: 'https://www.nhs.uk/conditions/developmental-language-disorder/',
    category: 'nhs',
  },
  // ── Autism and SEND ─────────────────────────────────────────────────
  {
    emoji: '🧩',
    label: 'NHS: Autism — signs, support, and diagnosis',
    url: 'https://www.nhs.uk/conditions/autism/',
    category: 'nhs',
  },
  {
    emoji: '📋',
    label: 'Gov.uk: SEND support for children (EHC plans and local offers)',
    url: 'https://www.gov.uk/children-with-special-educational-needs',
    category: 'send',
  },
  // ── Early years support ─────────────────────────────────────────────
  {
    emoji: '🏫',
    label: 'Gov.uk: Free early education and childcare',
    url: 'https://www.gov.uk/help-with-childcare-costs/free-childcare-and-education-for-2-to-4-year-olds',
    category: 'early-years',
  },
  // ── Local family support ─────────────────────────────────────────────
  {
    emoji: '📍',
    label: 'NHS: Find your local NHS services',
    url: 'https://www.nhs.uk/nhs-services/find-your-local-nhs-website/',
    category: 'nhs',
  },
  {
    emoji: '🌐',
    label: 'Family Lives: Support for parents and families',
    url: 'https://www.familylives.org.uk/',
    category: 'charity',
  },
];
