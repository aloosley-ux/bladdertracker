# Issues Archive — Completed and Tracked Issues

This file summarizes all issues previously tracked in markdown files or docs/github-issues/.

---

## Completed Issues (March 2026 Alignment)

### 1. Replace console.* logging with structured logger
- Status: ✅ Resolved March 2026
- All console.* logging replaced with structured logger, no direct console.* calls remain in src/ or api/ code. Logger can be disabled/adjusted via env variables. Docs and code updated.

### 2. Fix react-hooks/exhaustive-deps disables in AppContext and AddEntryPage
- Status: ✅ Resolved March 2026
- No unnecessary `eslint-disable-next-line react-hooks/exhaustive-deps` comments remain in src/. All effect dependencies are explicit or justified. Docs and code updated.

### 3. Add scheduled dependency & security checks to CI
- Status: ✅ Resolved March 2026
- CI now includes scheduled dependency and security checks. High/critical issues are surfaced as PRs or issues. Docs and workflow updated.

### 4. Add accessibility (axe) checks to CI
- Status: ✅ Resolved March 2026
- CI now runs accessibility (axe) tests and fails the workflow on serious violations. Docs and workflow updated.

### 5. Align invite roles with enforced access permissions
- Status: ✅ Resolved
- Invite roles and permissions are now fully aligned and documented.

### 6. Clarify and enforce reminder scope (milestones-only vs module-wide)
- Status: ✅ Resolved
- Reminder preferences are now module-wide and all copy/docs are consistent.

### 7. Validate therapist/specialist role completeness or de-scope docs
- Status: ✅ Resolved
- Roles are documented as invite-only contextual labels with caregiver-level access, and are not exposed in self-registration.

### 8. Verify cloud/local parity for extended tracker fields and import/export paths
- Status: ✅ Resolved
- All extended tracker fields round-trip through DB, API, and CSV. Parity matrix documented.

### 9. Create production-ready brand assets and delivery formats
- Status: ✅ Resolved
- Brand assets, icons, and social previews are complete and integrated.

---

## Partially Complete / Still To Do

### Add focused tests for server handlers and role-sensitive access control
- Status: ⏳ Partially resolved (March 2026)
- Local tests exist for invite role mapping and reminder scope. Remaining: add end-to-end server handler integration tests with DB or mock. Tracked in docs/REPO_STATUS.md.

---

For any new issues:
- Log open work in `docs/REPO_STATUS.md`
- Create a GitHub issue when the work is actionable
- Archive completed items here
- Remove obsolete markdown drafts once they are no longer needed
