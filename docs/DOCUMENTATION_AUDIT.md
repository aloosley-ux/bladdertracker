# Documentation Audit

Last updated: March 2026

## Overall documentation health

Documentation is now **mostly aligned** with the current codebase. The largest problems were concentrated in role/permission descriptions, setup/testing expectations, cloud-vs-local behavior, stale issue-process files, and a few API/storage details that had drifted from the implementation.

## Files reviewed

- `README.md`
- `CONTRIBUTING.md`
- `GDPR.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `.env.example`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/MODULES.md`
- `docs/Onboarding.md`
- `docs/PROJECT_PLAN.md`
- `docs/REPO_STATUS.md`
- `docs/ISSUES_PROCESS.md`
- `docs/issues-archive.md`
- `docs/ISSUE_DRAFTS.md` (removed as obsolete)
- `docs/GITHUB_ISSUES_DRAFT.md` (removed as obsolete)

## Summary of key inaccuracies found

| File | Status before audit | Key issues found | Action taken |
|---|---|---|---|
| `README.md` | Partially accurate | Overstated role support, wrong API details, misleading import claims, stale test/build assumptions, missing leap local-only caveat | Updated |
| `CONTRIBUTING.md` | Partially accurate | Claimed docs/tests were fully aligned, omitted `/gdpr` and `/audit-trail`, lacked admin-key guidance, overstated `npm test` portability | Updated |
| `GDPR.md` | Partially accurate | Treated cloud storage as universal, omitted local-mode PBKDF2, understated sleep/food fields, inaccurate role descriptions | Updated |
| `docs/API.md` | Partially accurate | Needed stronger wording on registration role limits, import/export access checks, and local-only leaps | Updated |
| `docs/ARCHITECTURE.md` | Partially accurate | Therapist/specialist behavior outdated; no explicit local-only leap persistence note | Updated |
| `docs/MODULES.md` | Partially accurate | Missing note that leap diary/symptom data has no cloud API; import caveat not documented | Updated |
| `docs/Onboarding.md` | Partially accurate | Needed clearer wording around invite-only roles and current import template scope | Updated |
| `docs/PROJECT_PLAN.md` | Inaccurate | Pointed to obsolete draft-issue file and outdated integration-test claim | Updated |
| `docs/REPO_STATUS.md` | Inaccurate | Claimed deployed integration test was passing generically | Updated |
| `docs/issues-archive.md` | Inaccurate | Archived role summary contradicted current invite behavior; referenced nonexistent doc | Updated |
| `docs/ISSUE_DRAFTS.md` / `docs/GITHUB_ISSUES_DRAFT.md` | Obsolete | Stale draft-only tracking files contradicted current issue workflow | Removed |

## Files changed

- `README.md`
- `CONTRIBUTING.md`
- `GDPR.md`
- `.env.example`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `CHANGELOG.md`
- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/MODULES.md`
- `docs/Onboarding.md`
- `docs/PROJECT_PLAN.md`
- `docs/REPO_STATUS.md`
- `docs/issues-archive.md`
- `docs/DOCUMENTATION_AUDIT.md` (new)
- `docs/ISSUE_DRAFTS.md` (removed)
- `docs/GITHUB_ISSUES_DRAFT.md` (removed)

## Missing docs that were added

- This audit report: `docs/DOCUMENTATION_AUDIT.md`
- Inline clarification for local-only/deployed-host behavior in `src/test/integration/api-auth.integration.test.ts`

## Code changes made because the docs uncovered real implementation drift

These changes were made to keep the docs aligned with safe, intended behavior rather than documenting vulnerabilities as if they were features:

- `/api/auth` now rejects self-registration for unsupported roles such as `admin`, `therapist`, and `specialist`.
- `/api/data` now checks whether the signed-in user can access the requested child before importing or exporting that child's data.
- The in-app Settings role guidance now matches the actual permission model more closely.

## Validation run

- `npm install` ✅
- `npm run lint` ✅
- `npm run build` ✅
- `npx tsc --project tsconfig.api.json --noEmit` ✅
- Focused new API handler tests ✅
- `npm test` ⚠️ one existing live integration test depends on resolving a deployed Vercel hostname and failed in this environment for DNS/network reasons

## Unresolved items requiring human confirmation

1. **Leap persistence in cloud mode**
   - Leap diary entries and leap symptom logs have no cloud API route today and are handled through local storage helpers.
   - If cloud users are expected to retain or share leap history across devices, this needs a product/implementation decision rather than more documentation wording.

2. **Live deployed-host integration test strategy**
   - `src/test/integration/api-auth.integration.test.ts` currently points at a fixed deployed hostname.
   - Decide whether that test should remain live, become configurable, or move behind an explicit integration-test flag.
