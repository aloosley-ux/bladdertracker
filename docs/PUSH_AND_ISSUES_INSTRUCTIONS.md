# Push, PR and Issue Creation - Short Guide

This file contains copy-paste commands and step-by-step guidance to:
- run tests and lint locally
- keep a stable `testing` branch (staging)
- create short-lived feature branches targeting `testing`
- commit & push changes
- open PRs into `testing` and promote to `main`
- create repository issues from local markdown drafts

Prerequisites
- Node.js & npm installed
- git installed and repo cloned at `C:\GIT\bladdertracker`
- gh (GitHub CLI) installed and authenticated: `gh auth login` (or use GitHub Desktop)
- PowerShell (pwsh) recommended for multi-file commands

Overview (recommended flow)
1) Keep a long-lived `testing` branch as staging (merge feature branches into it).
2) For each change, create a short-lived feature branch from `testing`, open a PR into `testing`, run CI, then merge testing → main when ready.

1) Run tests and lint (verify before pushing)
PowerShell / CMD:

npm ci --no-audit --no-fund
npm run lint
npm test

2) Ensure the `testing` branch exists (one-time)

# fetch updates and create testing from origin/main if missing
git fetch origin --prune
git checkout -B testing origin/main 2>nul || git checkout -B testing
git push -u origin testing

Note: If your repo's default branch is `main`, this makes testing follow it. If your default branch differs, replace `origin/main` with the appropriate ref.

3) Create a feature branch from testing, commit, push

# start from testing
git checkout testing
# create a short-lived feature branch (use descriptive name)
git checkout -b feat/short-descriptive-name
# stage changes
git add -A
# commit with a clear message (edit message as needed)
git commit -m "Short summary of change" -m "Detailed description. Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
# push your branch to origin
git push -u origin feat/short-descriptive-name

4) Create a PR into `testing`

A) Using gh (one-liner):

gh pr create --repo aloosley-ux/bladdertracker --base testing --head feat/short-descriptive-name --title "Short summary of change" --body "Detailed description of change and testing instructions" --label "automated"

B) Using GitHub Desktop / Web UI:
- Publish the feature branch
- Click "Create Pull Request" → set base branch to `testing` → Create PR

5) After PR review and CI in `testing`, promote to `main`

A) Preferred: create a PR on GitHub from `testing` → `main` and merge after checks pass.

B) Locally (if you prefer command line):

# update local main and testing
git checkout main
git pull origin main
git checkout testing
git pull origin testing
# merge testing into main locally
git checkout main
git merge --no-ff testing
git push origin main

6) Create issues from local markdown drafts (docs/*.md)

Option A: (No PowerShell required) use gh with --body-file (works from CMD / Git Bash)
# ensure gh is authenticated, then run for each draft (example):
gh issue create --repo aloosley-ux/bladdertracker --title "Replace console.* logging with structured logger" --body-file docs\github-issues\issue-01-replace-console-logging.md --label "bug,tech-debt"

Option B: run the PowerShell script (creates all issues)
# ensure gh is authenticated, then:
pwsh .\create-issues.ps1

Option C: create issues one-by-one (PowerShell example)
# Example for the first issue
$body = Get-Content -Raw .\docs\github-issues\issue-01-replace-console-logging.md
gh issue create --repo aloosley-ux/bladdertracker --title "Replace console.* logging with structured logger" --body "$body" --label "bug,tech-debt"

Option D: bulk-create from all issue-*.md files (PowerShell)
Get-ChildItem .\docs\github-issues\issue-*.md | ForEach-Object {
  $path = $_.FullName
  $title = (Get-Content -Path $path -TotalCount 1) -replace '^#\s*',''
  gh issue create --repo aloosley-ux/bladdertracker --title $title --body (Get-Content -Raw $path)
}

7) Verification & troubleshooting
- Confirm branches remotely: git branch -r
- Confirm PRs: gh pr list --repo aloosley-ux/bladdertracker
- Confirm issues: gh issue list --repo aloosley-ux/bladdertracker
- If push fails: run `gh auth status` and `git remote -v`. Use GitHub Desktop to publish branches if preferred.

Notes & safety
- Always create short-lived feature branches for changes; do not push directly to `main` unless the change is trivial and you're the only maintainer.
- The commands above are non-destructive (no force pushes). Review commit messages before pushing.
- Local helper scripts in the repo root (optional):
  - run-tests.bat — install, lint, tests
  - push-and-run-tests.bat — interactive helper
  - push-and-create-issues.bat — non-interactive (requires gh + pwsh)

If you want, I can also:
- add a short checklist to each PR template for testing steps
- produce a single copy/paste block with all commands tailored to your preferred feature branch name

If anything fails, paste the terminal output here and I will diagnose and provide the exact fix."