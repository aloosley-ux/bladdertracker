# Issues Process and Workflow

_Last updated: March 2026_

This document defines the single, up-to-date process for handling issues in the BladderTracker repository. It covers how to log, track, process, and archive issues, ensuring a clean and transparent workflow.

---

## 1. Where to Log Issues

- **Active/Unresolved Issues:**
  - Log all new, confirmed issues in `docs/REPO_STATUS.md`.
  - For actionable tasks, also create a GitHub Issue using the appropriate template (bug, feature, documentation).
  - If GitHub Issues is unavailable, draft in markdown and add to `docs/REPO_STATUS.md` until it can be published.

- **Completed/Resolved Issues:**
  - Once resolved, archive the issue in `docs/issues-archive.md` with a summary and resolution date.
  - Remove the item from `docs/REPO_STATUS.md` and close any related GitHub Issue.

---

## 2. Issue Lifecycle

1. **Discovery:**
   - Confirm the issue is new (search `docs/REPO_STATUS.md` and open GitHub Issues).
   - If valid, add to `docs/REPO_STATUS.md` with a clear description, scope, and acceptance criteria.
   - For security issues, follow `SECURITY.md` and do not log publicly.

2. **Drafting:**
   - Use GitHub Issue templates for bugs, features, or documentation improvements.
   - If working offline, draft in markdown and add to `docs/REPO_STATUS.md`.

3. **Processing:**
   - Work on the issue as tracked in `docs/REPO_STATUS.md` and/or GitHub Issues.
   - Update status and notes as progress is made.

4. **Resolution:**
   - When resolved, move the summary to `docs/issues-archive.md`.
   - Remove from `docs/REPO_STATUS.md` and close any related GitHub Issue.
   - Ensure documentation and changelog are updated if needed.

---

## 3. Cleaning Up Issues

- **Regularly review** `docs/REPO_STATUS.md` and GitHub Issues to ensure only active work is listed.
- **Archive** all completed issues in `docs/issues-archive.md`.
- **Delete** obsolete drafts or markdown files once issues are published or resolved.
- **Keep the repo clean:** Only `docs/REPO_STATUS.md` (open), `docs/issues-archive.md` (closed), and GitHub Issues should be used for tracking.

---

## 4. Security and Sensitive Issues

- Never log security vulnerabilities or sensitive data in public issues.
- Follow the process in `SECURITY.md` for responsible disclosure.

---

## 5. Summary

- **Single source of truth for open issues:** `docs/REPO_STATUS.md`
- **Archive for completed issues:** `docs/issues-archive.md`
- **Public/actionable tasks:** GitHub Issues (with templates)
- **Security:** Follow `SECURITY.md`

For any questions, refer to this document or ask a maintainer.
