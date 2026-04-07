import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Database, Eye, Trash2, Clock, Mail } from 'lucide-react';

// GdprPage — information page explaining data collection, storage, and GDPR compliance.
export default function GdprPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3">
        <div className="mb-4 flex items-center gap-3">
          <Link
            to="/settings"
            aria-label="Back to settings"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-sm ring-1 ring-[var(--border-color)] hover:bg-lavender-50"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">GDPR &amp; Data Protection</h1>
            <p className="text-sm text-[var(--text-secondary)]">How we collect, store, and protect your data</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4">
        {/* Data collected */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Database size={16} className="text-lavender-500" /> Data We Collect
          </h2>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">User account information</h3>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>Name, email address, and role — used for login and access control</li>
                <li>Password — securely hashed with bcrypt, never stored in plaintext</li>
                <li>Account creation date — for record-keeping</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Child profiles</h3>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>Child&apos;s name, date of birth, and optional due date</li>
                <li>Used for age-appropriate tracking and milestone benchmarking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Tracker &amp; diary data</h3>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>Daily entries for drinks, toileting, sleep, food, mood, therapy, and more</li>
                <li>Developmental milestones and leap symptom logs</li>
                <li>Notes and observations added by carers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Audit trail</h3>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>A record of account actions (e.g. login, data export, role changes)</li>
                <li>Used for security and transparency</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Storage approach */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Shield size={16} className="text-lavender-500" /> How Data Is Stored
          </h2>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Local-first storage</h3>
              <p className="mt-1">
                By default, all data is stored locally on your device using browser localStorage.
                No data leaves your device unless you opt into cloud sync.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Cloud storage (optional)</h3>
              <p className="mt-1">
                When cloud mode is enabled, data is stored securely in a PostgreSQL database
                hosted by Neon (encrypted at rest and in transit). The application is hosted on
                Vercel&apos;s global edge network. Both processors are bound by data processing
                agreements compliant with UK GDPR standards.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Security measures</h3>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>Passwords are hashed with bcrypt — never stored in plaintext</li>
                <li>Authentication tokens use JWT with expiry</li>
                <li>All API connections use HTTPS encryption</li>
                <li>Role-based access ensures data isolation between families</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Your rights */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Eye size={16} className="text-lavender-500" /> Your Rights
          </h2>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              Under the UK General Data Protection Regulation (UK GDPR) and the Data Protection
              Act 2018, you have the following rights:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[var(--bg-primary)] p-3">
                <p className="font-semibold text-[var(--text-primary)]">📥 Right to access</p>
                <p className="mt-1 text-xs">You can export all your data at any time from Settings.</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-primary)] p-3">
                <p className="font-semibold text-[var(--text-primary)]">✏️ Right to rectification</p>
                <p className="mt-1 text-xs">You can edit any entry or profile in the app.</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-primary)] p-3">
                <p className="font-semibold text-[var(--text-primary)]">🗑️ Right to erasure</p>
                <p className="mt-1 text-xs">You can delete all data or your account from Settings.</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-primary)] p-3">
                <p className="font-semibold text-[var(--text-primary)]">📦 Right to portability</p>
                <p className="mt-1 text-xs">Export your data as JSON to take it elsewhere.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data deletion */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Trash2 size={16} className="text-lavender-500" /> Data Deletion
          </h2>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p>
              You can permanently delete all your data at any time from the
              <Link to="/settings" className="mx-1 text-lavender-600 underline underline-offset-2">Settings</Link>
              page under &quot;Data &amp; Privacy&quot;.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Local mode:</strong> Clears all localStorage entries immediately.</li>
              <li><strong>Cloud mode:</strong> Permanently deletes your account and all associated records from the database.</li>
            </ul>
            <p>Once deleted, data cannot be recovered.</p>
          </div>
        </section>

        {/* Retention */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Clock size={16} className="text-lavender-500" /> Data Retention
          </h2>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p>
              We retain your data only for as long as you actively use the service.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your data is retained while your account exists.</li>
              <li>If you delete your account, all data is permanently removed.</li>
              <li>We do not sell, share, or process your data for marketing purposes.</li>
              <li>Audit trail records are retained alongside your account for security transparency.</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Mail size={16} className="text-lavender-500" /> Contact &amp; Support
          </h2>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p>If you have questions about data protection or wish to exercise your rights:</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@childdevelopmenttracker.co.uk" className="text-lavender-600 underline underline-offset-2">
                privacy@childdevelopmenttracker.co.uk
              </a>
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              This policy complies with the UK GDPR, Data Protection Act 2018, and the Age Appropriate Design Code (Children&apos;s Code).
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
