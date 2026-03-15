import { useEffect, useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  HelpCircle,
  LockKeyhole,
  ShieldCheck,
  Shield,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import BrandIcon from '../components/BrandIcon';
import { BRAND, HELP_COPY, getModuleLabel } from '../content/presentation';

const ONBOARDING_KEY = 'bt_onboarding_seen';

const ONBOARDING_STEPS = [
  {
    title: 'Create your account',
    description: 'Register with your name, email address, and a secure password.',
  },
  {
    title: 'Add a child profile',
    description: 'Go to the Profiles page and create a profile for each child or family member you want to track.',
  },
  {
    title: 'Start logging entries',
    description: 'Use Today or Add an update to record drinks, wees, poos, toilet visits, meals, and more.',
  },
  {
    title: 'Review reports',
    description: 'Check the Reports page for charts and trends that help you spot patterns over time.',
  },
  {
    title: 'Invite caregivers',
    description: 'Share access with trusted school staff, therapists, or family members via the Profiles page.',
  },
];

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'What modules are available?',
    answer:
      `${BRAND.name} includes flexible modules such as ${getModuleLabel('drinks')}, ${getModuleLabel('urine')}, ${getModuleLabel('bowel')}, ${getModuleLabel('toilet')}, sleep, meals, mood, sensory notes, therapy, routines, milestones, and leaps. Turn on only the ones that are helpful for your family.`,
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
      'In cloud mode, data is sent over HTTPS and stored in Neon Postgres. In local mode, entries stay in this browser on this device. In both modes, you can review exports, remove children, or delete your account from Settings.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Navigate to Settings → Data & Privacy → Delete Account. This will permanently remove your account and all associated data.',
  },
  {
    question: 'What is the Bristol stool chart?',
    answer:
      HELP_COPY.bristolAnswer,
  },
];

const ACCESSIBILITY_FEATURES = [
  'Large tap targets and visible focus rings across navigation, forms, and actions',
  'Light, dark, and high-contrast themes for different visual needs',
  'Dyslexia-friendly font toggle (Atkinson Hyperlegible) in Settings',
  'Keyboard-friendly navigation across core diary, reports, and settings flows',
  'Plain language and shorter explanations to reduce cognitive load',
  'Step-by-step onboarding for first-time setup and profile creation',
];

const QUICK_LINKS = [
  {
    to: '/profiles',
    title: 'Profiles & access',
    description: 'Add children, choose the active profile, and invite trusted caregivers or school staff.',
    icon: Users,
  },
  {
    to: '/add',
    title: 'Add an entry',
    description: 'Log drinks, sleep, toilet visits, meals, mood, sensory notes, therapy, and routines.',
    icon: Sparkles,
  },
  {
    to: '/reports',
    title: 'Reports & review',
    description: 'Spot patterns over time, review milestones, and prepare information for care conversations.',
    icon: BookOpen,
  },
  {
    to: '/settings',
    title: 'Privacy & preferences',
    description: 'Choose modules, manage reminders, export records, and handle account deletion carefully.',
    icon: LockKeyhole,
  },
];

const PRIVACY_COMMITMENTS = [
  {
    title: 'Share thoughtfully',
    description: 'Invite only the people who genuinely need access to a child profile. Review roles before sharing.',
    icon: Users,
  },
  {
    title: 'Export with care',
    description: 'Use export when you are ready to share information with a clinician, school, or care team.',
    icon: Download,
  },
  {
    title: 'Delete deliberately',
    description: 'Removal and account deletion flows ask for confirmation so sensitive information is not lost by accident.',
    icon: ShieldCheck,
  },
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
      <div className="bg-[var(--bg-secondary)] px-4 pb-4 pt-6">
        <div className="flex flex-col items-center text-center px-4">
          <HelpCircle size={28} className="text-lavender-500 mb-1" />
          <h1 className="mt-1 text-base font-bold text-[var(--text-primary)]">Help &amp; support</h1>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            Calm guidance, privacy notes, and accessibility support
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
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-xs font-bold text-lavender-600 ring-1 ring-[var(--border-color)]">
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

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
            <Sparkles size={16} className="text-lavender-500" />
            Where to go next
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK_LINKS.map(({ to, title, description, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="rounded-2xl bg-[var(--bg-card)] p-4 ring-1 ring-[var(--border-color)] transition hover:ring-lavender-200"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-lavender-600 ring-1 ring-[var(--border-color)]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                >
                  <span>{item.question}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="shrink-0 text-lavender-500" />
                  ) : (
                    <ChevronDown size={16} className="shrink-0 text-gray-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className="px-4 pb-3 text-xs text-[var(--text-secondary)] leading-relaxed"
                  >
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

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
            <Shield size={16} className="text-lavender-500" />
            Privacy & data care
          </h2>
          <div className="space-y-3">
            {PRIVACY_COMMITMENTS.map(({ title, description, icon: Icon }) => (
              <div key={title} className="flex gap-3 rounded-2xl bg-[var(--bg-card)] p-4 ring-1 ring-[var(--border-color)]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-lavender-600 ring-1 ring-[var(--border-color)]">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
            {BRAND.name} is designed to support observation and care coordination. It does not replace medical advice or emergency support. If you are worried about a child&apos;s immediate health or safety, contact your local urgent care service, NHS 111, or emergency services.
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <ShieldCheck size={16} className="text-lavender-500" />
            Need more help?
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Start with your child&apos;s care team or your organisation&apos;s administrator if you need help with access, shared roles, or clinical interpretation of the information you have logged.
          </p>
          <div className="mt-4 flex gap-3">
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
        </section>
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
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          aria-label="Dismiss welcome screen"
        >
          <X size={16} />
        </button>

        {/* Branding header */}
        <div className="mb-5 flex flex-col items-center text-center">
          <BrandIcon width={96} className="mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Welcome to BladderTracker!</h2>
          <p className="mt-1 text-xs text-gray-500">A calm, secure diary for families, carers, and professionals.</p>
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
                type="button"
                onClick={() => { dismiss(); navigate(to); }}
                className="ml-8 w-[calc(100%-2rem)] rounded-xl bg-lavender-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-lavender-600 active:scale-95"
              >
                {cta}
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={dismiss}
          className="w-full rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
