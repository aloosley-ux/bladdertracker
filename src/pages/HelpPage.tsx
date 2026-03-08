import { useEffect, useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Image,
  Shield,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import AssetPlaceholder from '../components/AssetPlaceholder';

const ONBOARDING_KEY = 'bt_onboarding_seen';

const ONBOARDING_STEPS = [
  {
    title: 'Create your account',
    description: 'Register with your name, email address, and a secure password.',
  },
  {
    title: 'Add a child profile',
    description: 'Go to the Profiles page and create a profile for each child you want to track.',
  },
  {
    title: 'Start logging entries',
    description: 'Use the Dashboard or Add Entry page to record drinks, toilet visits, meals, and more.',
  },
  {
    title: 'Review reports',
    description: 'Check the Reports page for charts and trends that help you spot patterns over time.',
  },
  {
    title: 'Invite caregivers',
    description: 'Share access with teachers, nurses, or family members via the Profiles page.',
  },
];

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'What modules are available?',
    answer:
      'BladderTracker includes 12 tracker modules: Drinks, Urine, Bowel, Toilet Attempts, Sleep, Food & Diet, Medication, Mood, Sensory, Therapy, Routine, and Milestones. Enable only the ones relevant to your child in Settings.',
  },
  {
    question: 'How do I export my data?',
    answer:
      'Go to Settings → Data & Privacy and tap the Export button. Your data will be downloaded as a file you can share with your care team.',
  },
  {
    question: 'Can multiple people track the same child?',
    answer:
      'Yes. Use the caregiver invite feature on the Profiles page to share access with teachers, school nurses, or other family members.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. All data is encrypted in transit and at rest. The platform is designed with GDPR compliance in mind and follows NHS data-handling best practices.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Navigate to Settings → Data & Privacy → Delete Account. This will permanently remove your account and all associated data.',
  },
  {
    question: 'What is the Bristol Stool Scale?',
    answer:
      'The Bristol Stool Scale is a medical classification that categorises human faeces into seven types based on shape and consistency. It is widely used by healthcare professionals to monitor bowel health.',
  },
];

const ACCESSIBILITY_FEATURES = [
  'Large tap/click zones on all controls [1]',
  'High-contrast theme and coloured module coding [3]',
  'Dyslexia-friendly font (Atkinson Hyperlegible) toggle in Settings [7]',
  'Full keyboard navigation support',
  'Screen reader compatible (ARIA labels throughout)',
  'Clear, simple language used across all pages',
  'Step-by-step onboarding and guided forms [5][6]',
  'WCAG 2.1 AA compliance',
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="pb-20">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] px-4 pb-4 pt-6">
        <div className="flex flex-col items-center text-center px-4">
          <HelpCircle size={28} className="text-lavender-500 mb-1" />
          <h1 className="mt-1 text-base font-bold text-gray-900">Help &amp; Support</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Guidance, tips, and accessibility information
          </p>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {/* ── Getting Started ───────────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
            <BookOpen size={16} className="text-lavender-500" />
            Getting Started
          </h2>

          <ol className="space-y-3">
            {ONBOARDING_STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lavender-100 text-xs font-bold text-lavender-600">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
            <HelpCircle size={16} className="text-lavender-500" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-gray-50 ring-1 ring-black/5 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-lavender-50"
                  aria-expanded={openFaq === i}
                >
                  <span>{item.question}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="shrink-0 text-lavender-500" />
                  ) : (
                    <ChevronDown size={16} className="shrink-0 text-gray-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-xs text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Accessibility ──────────────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Accessibility size={16} className="text-lavender-500" />
            Accessibility
          </h2>

          <ul className="space-y-2">
            {ACCESSIBILITY_FEATURES.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-0.5 text-lavender-400">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Contact / Support ──────────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Shield size={16} className="text-lavender-500" />
            Support
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            For additional support, please contact your care team or administrator.
          </p>
        </section>

        {/* ── UI Asset Showcase & Handoff (#18–#27) ─────────────── */}
        {/* These placeholders indicate where branded assets should go once provided.
            Asset handoff: supply final files at the paths listed and remove these placeholders. */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
            <Image size={16} className="text-lavender-500" />
            UI Assets — Designer Handoff (#18–#27)
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            The following placeholders mark where branded visual assets should be placed.
            Replace each <code className="bg-gray-100 px-1 rounded">src</code> with the real asset
            once it has been produced by the design team.
          </p>

          <div className="space-y-4">
            {/* #19 Mascot & Logo */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">🐾 Mascot &amp; Logo (#19)</p>
              <div className="flex flex-wrap gap-3 items-start">
                <div className="flex flex-col items-center gap-1">
                  {/* Replace: /assets/mascot-wave.png — friendly character welcoming users */}
                  <AssetPlaceholder
                    src="/assets/mascot-wave.png"
                    alt="BladderTracker mascot waving hello — a friendly character that greets users on the onboarding screen"
                    width={80} height={80}
                    issueRef="19"
                  />
                  <span className="text-[9px] text-gray-400">mascot-wave.png</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  {/* Replace: /assets/logo-full.svg — full horizontal logo */}
                  <AssetPlaceholder
                    src="/assets/logo-full.svg"
                    alt="BladderTracker full logo — wordmark with droplet icon, horizontal layout"
                    width={160} height={48}
                    issueRef="19"
                  />
                  <span className="text-[9px] text-gray-400">logo-full.svg</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  {/* Replace: /assets/logo-icon.svg — icon-only mark */}
                  <AssetPlaceholder
                    src="/assets/logo-icon.svg"
                    alt="BladderTracker logo mark — icon-only droplet symbol for favicons and app icons"
                    width={48} height={48}
                    issueRef="19"
                  />
                  <span className="text-[9px] text-gray-400">logo-icon.svg</span>
                </div>
              </div>
            </div>

            {/* #20 Tracker & Entry Icons */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">🎨 Tracker &amp; Entry Icons (#20)</p>
              <div className="flex flex-wrap gap-2 items-start">
                {[
                  { file: 'icon-drinks.svg', alt: 'Custom drinks tracker icon — a glass of water with bubbles' },
                  { file: 'icon-urine.svg', alt: 'Custom urine tracker icon — droplet with measurement lines' },
                  { file: 'icon-bowel.svg', alt: 'Custom bowel tracker icon — Bristol stool chart abstract' },
                  { file: 'icon-sleep.svg', alt: 'Custom sleep tracker icon — moon and stars' },
                  { file: 'icon-toilet.svg', alt: 'Custom toilet attempt icon — toilet with success star' },
                  { file: 'icon-food.svg', alt: 'Custom food tracker icon — plate with fork and spoon' },
                ].map(({ file, alt }) => (
                  <div key={file} className="flex flex-col items-center gap-1">
                    <AssetPlaceholder src={`/assets/icons/${file}`} alt={alt} width={40} height={40} issueRef="20" />
                    <span className="text-[8px] text-gray-400 max-w-[48px] text-center leading-tight">{file.replace('icon-', '').replace('.svg', '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* #21 Calendar, Cards & Backgrounds */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">📅 Calendar &amp; Backgrounds (#21)</p>
              <div className="flex flex-wrap gap-2 items-start">
                <div className="flex flex-col items-center gap-1">
                  <AssetPlaceholder
                    src="/assets/bg-dashboard.jpg"
                    alt="Dashboard hero background — soft lavender gradient with abstract childlike shapes"
                    width={120} height={60}
                    issueRef="21"
                  />
                  <span className="text-[9px] text-gray-400">bg-dashboard.jpg</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <AssetPlaceholder
                    src="/assets/card-leaps.png"
                    alt="Leaps module card banner — rainbow arc with baby silhouette representing developmental stages"
                    width={120} height={60}
                    issueRef="21"
                  />
                  <span className="text-[9px] text-gray-400">card-leaps.png</span>
                </div>
              </div>
            </div>

            {/* #22 Charts & Data Visualization */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">📊 Charts &amp; Data Visualisation (#22)</p>
              <AssetPlaceholder
                src="/assets/chart-empty-state.svg"
                alt="Empty state illustration for charts — a simple line chart with a magnifying glass and 'No data yet' text"
                width="100%" height={80}
                issueRef="22"
              />
            </div>

            {/* #23 Navigation Bar Icons */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">🧭 Navigation Icons (#23)</p>
              <div className="flex flex-wrap gap-2 items-start">
                {[
                  { file: 'nav-home.svg', alt: 'Bottom nav home icon — house shape with heart' },
                  { file: 'nav-log.svg', alt: 'Bottom nav log icon — clipboard with pencil' },
                  { file: 'nav-reports.svg', alt: 'Bottom nav reports icon — bar chart with upward trend' },
                  { file: 'nav-calendar.svg', alt: 'Bottom nav calendar icon — monthly grid with highlighted day' },
                  { file: 'nav-profile.svg', alt: 'Bottom nav profile icon — person silhouette with badge' },
                ].map(({ file, alt }) => (
                  <div key={file} className="flex flex-col items-center gap-1">
                    <AssetPlaceholder src={`/assets/nav/${file}`} alt={alt} width={36} height={36} issueRef="23" />
                    <span className="text-[8px] text-gray-400">{file.replace('nav-', '').replace('.svg', '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* #25 Brand/Illustration Moments */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">✨ Brand Illustrations (#25)</p>
              <div className="flex flex-wrap gap-3 items-start">
                <div className="flex flex-col items-center gap-1">
                  <AssetPlaceholder
                    src="/assets/illustration-success.svg"
                    alt="Success moment illustration — child pumping fist, confetti, and 'Well done!' text"
                    width={100} height={80}
                    issueRef="25"
                  />
                  <span className="text-[9px] text-gray-400">illustration-success.svg</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <AssetPlaceholder
                    src="/assets/illustration-leap.svg"
                    alt="Leap milestone illustration — baby jumping through rainbow arc representing a developmental leap"
                    width={100} height={80}
                    issueRef="25"
                  />
                  <span className="text-[9px] text-gray-400">illustration-leap.svg</span>
                </div>
              </div>
            </div>

            {/* #26 Accessibility Variants */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">♿ Accessibility Icon Variants (#26)</p>
              <div className="flex flex-wrap gap-2 items-start">
                {[
                  { file: 'icon-drinks-hc.svg', alt: 'High-contrast drinks icon — bold black outline on white background' },
                  { file: 'icon-urine-hc.svg', alt: 'High-contrast urine icon — bold black outline on white background' },
                  { file: 'icon-bowel-hc.svg', alt: 'High-contrast bowel icon — bold black outline on white background' },
                ].map(({ file, alt }) => (
                  <div key={file} className="flex flex-col items-center gap-1">
                    <AssetPlaceholder src={`/assets/icons/hc/${file}`} alt={alt} width={40} height={40} issueRef="26" />
                    <span className="text-[8px] text-gray-400 max-w-[48px] text-center leading-tight">{file}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                High-contrast variants should be supplied as SVG with thick stroke outlines.
                They are used when <code className="bg-gray-100 px-1 rounded">data-theme=&quot;high-contrast&quot;</code> is active.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
            <strong>Asset handoff checklist:</strong>
            <ul className="mt-1 space-y-0.5 list-disc list-inside">
              <li>Place final SVG/PNG files at the paths shown above (under <code>/public/assets/</code>)</li>
              <li>Ensure each asset has a descriptive file name matching its placeholder path</li>
              <li>High-contrast variants go in <code>/public/assets/icons/hc/</code></li>
              <li>Once all placeholders are replaced, remove this section from HelpPage</li>
            </ul>
          </div>
        </section>

        {/* ── Navigation links ───────────────────────────────────── */}
        <div className="flex gap-3">
          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-lavender-50 py-3 text-sm font-semibold text-lavender-600 ring-1 ring-lavender-100 transition hover:bg-lavender-100"
          >
            Dashboard
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/settings"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-lavender-50 py-3 text-sm font-semibold text-lavender-600 ring-1 ring-lavender-100 transition hover:bg-lavender-100"
          >
            Settings
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Welcome / Onboarding Modal ─────────────────────────────────────────
// Shown automatically when a logged-in user has no child profiles yet.
// Matches the step-by-step mockup [6] from the UI specification.
// Dismissed state is stored in sessionStorage so it does not re-appear
// within the same browser session.

const ONBOARDING_MODAL_STEPS = [
  {
    step: 1,
    title: 'Add Profile',
    description: 'Create a profile for each child you want to track.',
    cta: 'Add Profile',
    to: '/settings',
  },
  {
    step: 2,
    title: 'Enable Modules',
    description: 'Choose which tracker modules are relevant — e.g. Drinks, Toilet, Sleep.',
    cta: 'Go to Settings',
    to: '/settings',
  },
  {
    step: 3,
    title: 'Make First Entry',
    description: 'Tap any module on the Dashboard to start logging straight away.',
    cta: 'Open Dashboard',
    to: '/',
  },
];

export function WelcomeModal() {
  const { children } = useApp();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(ONBOARDING_KEY) === 'true'; } catch { return false; }
  });

  const dismiss = () => {
    try { sessionStorage.setItem(ONBOARDING_KEY, 'true'); } catch { /* ignore */ }
    setDismissed(true);
  };

  // Only show when user has no children yet and has not dismissed this session
  if (dismissed || children.length > 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to BladderTracker"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          aria-label="Dismiss welcome screen"
        >
          <X size={16} />
        </button>

        {/* Branding header */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender-100 text-3xl">
            🐙
          </div>
          <h2 className="text-lg font-bold text-gray-900">Welcome to BladderTracker!</h2>
          <p className="mt-1 text-xs text-gray-500">A simple, NHS-style autism &amp; development diary.</p>
        </div>

        {/* Step-by-step guide [6] */}
        <ol className="mb-5 space-y-4">
          {ONBOARDING_MODAL_STEPS.map(({ step, title, description, cta, to }) => (
            <li key={step} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lavender-100 text-xs font-bold text-lavender-700">
                  {step}
                </span>
                <span className="text-sm font-semibold text-gray-800">{title}</span>
              </div>
              <p className="ml-8 text-xs text-gray-500">{description}</p>
              <button
                onClick={() => { dismiss(); navigate(to); }}
                className="ml-8 w-[calc(100%-2rem)] rounded-xl bg-lavender-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-lavender-600 active:scale-95"
              >
                {cta}
              </button>
            </li>
          ))}
        </ol>

        <button
          onClick={dismiss}
          className="w-full rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
