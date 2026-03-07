import { useEffect, useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
    description:
      'Use the Dashboard or Add Entry page to record drinks, toilet visits, meals, and more.',
  },
  {
    title: 'Review reports',
    description:
      'Check the Reports page for charts and trends that help you spot patterns over time.',
  },
  {
    title: 'Invite caregivers',
    description:
      'Share access with teachers, nurses, or family members via the Profiles page.',
  },
];

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'What modules are available?',
    answer:
      'BladderTracker includes 12 modules: Drinks, Urine Output, Bowel Movements, Toilet Attempts, Sleep, Food & Diet, Medication, Mood & Behaviour, Symptoms, Wetness / Accidents, Exercises, and Appointments.',
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
  'Full keyboard navigation support',
  'High-contrast theme available in Settings',
  'Screen reader compatible (ARIA labels throughout)',
  'Clear, simple language used across all pages',
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
