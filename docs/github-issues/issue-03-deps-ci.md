# Add scheduled dependency & security checks to CI

Labels: ci, security
Severity: low

## Description
CI currently runs install/test/lint/build. Add a scheduled job to detect vulnerable or outdated dependencies and open a report or PR for critical findings.

## Proposed fix
- Add `.github/workflows/deps.yml` that runs weekly and executes `npm audit --json` or Dependabot.
- Optionally create automated PRs or issues for high/critical vulnerabilities.

## Acceptance criteria
- A scheduled workflow exists that performs dependency checks weekly.
- High/critical issues are surfaced as PRs or issues.
