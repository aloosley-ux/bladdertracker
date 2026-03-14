# create-issues.ps1
# Creates predefined issues using gh CLI. Run from repository root.
# Ensure you're authenticated: gh auth status

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "gh CLI not found. Install from https://cli.github.com/"
  exit 1
}

$repo = "aloosley-ux/bladdertracker"

$issues = @(
  @{ title = "Replace console.* logging with structured logger"; body = @"
Files referenced:
- api/auth.ts
- src/components/ErrorBoundary.tsx
- src/context/AppContext.tsx

Description:
Several places use console.* for error reporting. Use a structured logger and redact PII.

Proposed fix:
- Add a lightweight logging wrapper that respects NODE_ENV and redacts sensitive fields.
- Replace console.* usages with the logger in client/server code.
"@; labels = "bug,tech-debt" },

  @{ title = "Fix react-hooks/exhaustive-deps disables in AppContext and AddEntryPage"; body = @"
Files:
- src/context/AppContext.tsx
- src/pages/AddEntryPage.tsx

Description:
Two instances of disabling react-hooks/exhaustive-deps were found. Update dependency arrays or refactor to avoid stale closures.

Proposed fix:
- Re-enable the rule and update deps or add tests if omission is required.
"@; labels = "bug,linter" },

  @{ title = "Add scheduled dependency & security checks to CI"; body = @"
CI currently runs install/test/lint/build. Add weekly checks for dependency vulnerabilities (npm audit/Dependabot) and create PRs/issues for critical findings.
"@; labels = "ci,security" },

  @{ title = "Add accessibility (axe) checks to CI"; body = @"
Project has vitest-axe tests but CI doesn't run them separately. Add a CI job to run axe tests and fail for serious violations.
"@; labels = "accessibility,ci" },

  @{ title = "Use placeholders for example credentials in README/.env.example"; body = @"
Replace real-looking DB strings in README and .env.example with clear <PLACEHOLDER> tokens and add a contributor warning not to paste secrets.
"@; labels = "docs" },

  @{ title = "Add issue/PR templates prompting security checklist for data-handling changes"; body = @"
Add or improve .github/ISSUE_TEMPLATE and PR templates to prompt for security-sensitive data handling and GDPR considerations.
"@; labels = "infra,security" }
)

foreach ($issue in $issues) {
  Write-Output "Creating issue: $($issue.title)"
  gh issue create --repo $repo --title ($issue.title) --body ($issue.body) --label ($issue.labels) | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create issue: $($issue.title)"
  }
}

Write-Output "Done creating issues."
