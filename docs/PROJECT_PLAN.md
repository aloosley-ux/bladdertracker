# Project Plan (Maintained Summary)

This file now serves as a lightweight planning index.

The previous long-form epic/task log had become mostly historical and was hard to maintain as a living backlog. Active outstanding work is now tracked in:

- `docs/REPO_STATUS.md` (single source of truth for remaining work)
- GitHub issues (or `docs/GITHUB_ISSUES_DRAFT.md` when issue creation is unavailable)

## Current status snapshot (March 2026)

### Confirmed complete foundations
- CI pipeline exists and runs lint/test/build/API type-check.
- Core route/accessibility/storage tests are present.
- AddEntry, Leaps, and Settings have been decomposed into component folders.
- PWA manifest/service worker integration is present.
- Admin promotion key handling has been moved to env-driven flows.
- Core documentation set exists (`README`, `API`, `MODULES`, `ARCHITECTURE`, onboarding, privacy/security docs).

### Active priorities
1. Keep role and invite documentation aligned with actual enforced permissions.
2. Expand automated coverage for server handlers and role-sensitive behaviours.
3. Resolve known cloud/local parity gaps and other validated product gaps listed in `docs/REPO_STATUS.md`.

## Planning policy going forward

- Do not add new backlog narratives in multiple docs.
- Add/update work items in `docs/REPO_STATUS.md` first.
- Open a GitHub issue for each confirmed actionable item.
- Close or update status docs in the same PR that changes behaviour.
