# Git Workflow

## The rule

**Nothing reaches main without tests passing.** Two gates enforce this:

1. **Pre-push hook** (`.git/hooks/pre-push`) — runs tsc + lint + vitest locally in ~30s.
   If anything fails, the push is blocked. Catches mistakes instantly.
2. **Branch protection** (GitHub) — requires the `ci` status check to pass before a PR
   can be merged. Even if you bypass the hook, CI must be green on the PR.

Both gates run the exact same checks. The hook is the fast early warning; CI is the
authoritative cloud check.

## Branching

- `main` is protected — never push directly to it.
- One branch per task/feature, branched from latest main:
  ```
  git checkout main && git pull
  git checkout -b feature/<short-name>
  ```
- Keep branches short-lived. If a branch lives more than a day, rebase it on main.

## Workflow

```
# 1. Create branch
git checkout -b feature/x

# 2. Code + test LOCALLY first
npm test                       # must pass before push
npm run build                  # must build clean

# 3. Commit + push (pre-push hook runs automatically)
git add .
git commit -m "x"
git push                       # blocked if local checks fail

# 4. Open PR
gh pr create --title "x" --fill

# 5. CI runs automatically (GitHub Actions)
#    Vercel posts a preview URL in PR comments
#    Test the preview in your browser

# 6. Merge (only if CI is green)
gh pr merge --squash
```

## When to test

- **Before every push** — `npm test` + `npm run build`. The hook enforces this.
- **After every PR** — click the Vercel preview URL and click through the app like a real user.
- **Before every merge** — CI green + you've tested the preview.

## Checklist before opening a PR

- [ ] `npm test` passes locally
- [ ] `npm run build` completes clean
- [ ] `npx tsc --noEmit` (frontend) and `npx tsc --project tsconfig.api.json --noEmit` (API) both clean
- [ ] `npm run lint` clean
- [ ] Branch is up to date with main (`git rebase main`)
- [ ] PR description explains what changed and how to test it
