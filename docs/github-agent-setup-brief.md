# GitHub Agent / Copilot Repo Setup Brief

This document is the source of truth for preparing this repository for GitHub coding agents and Copilot-style agent workflows.

The repository is a React + Vite project. The setup must be based on the real codebase, not generic assumptions.

## Objective

Prepare the repo so coding agents can:
- understand the project structure quickly
- follow the repo’s existing conventions
- build, lint, test, and validate changes reliably
- receive better structured user requests
- produce safer pull requests that are easier to review

## Important rule

Inspect the repository first before creating or changing files.

Do not dump generic templates into the repo.

Prefer improving what already exists over replacing it without reason.

## First inspect these areas

Review and understand:
- package.json
- lockfile and package manager
- Vite config
- TypeScript / JavaScript setup
- linting setup
- formatting setup
- test setup
- existing GitHub workflows
- existing .github files
- README and docs
- src folder structure
- shared UI/component patterns
- routing/page structure if present
- environment variable usage
- build and validation scripts

Determine:
- whether npm, pnpm, or yarn is used
- whether TypeScript is used
- whether Vitest, Playwright, Cypress, or other tests exist
- whether ESLint / Prettier exist
- whether there is already issue / PR / repo guidance
- which files already overlap with the requested setup

## Required outputs

Create or improve the following where appropriate.

### 1. Repo-wide instructions
Create or improve:

`.github/copilot-instructions.md`

This should include:
- real stack summary
- package manager
- main scripts
- validation order
- practical coding rules based on the repo
- instruction to keep changes minimal and scoped
- instruction to update tests where relevant
- instruction to update docs when behaviour changes
- instruction to avoid unnecessary dependencies

Keep it concise and useful.

### 2. Main agent guide
Create or improve:

`AGENTS.md`

This should include:
- project purpose
- important architecture notes found in the repo
- key directories and their purpose
- how to approach bug fixes, features, and UI work
- what to check before editing shared components
- how to run and validate the project
- pull request expectations

Keep it operational, not fluffy.

### 3. Path-specific instructions
If genuinely useful, create files under:

`.github/instructions/`

Only create these if the repo has clearly distinct areas that need separate rules.

Possible examples:
- frontend instructions
- UI/accessibility instructions
- testing instructions

Do not create unnecessary files.

### 4. Issue forms
Create a practical structure under:

`.github/ISSUE_TEMPLATE/`

Include sensible forms such as:
- bug report
- feature request
- UI/polish request

These should capture:
- problem or opportunity
- expected behaviour or outcome
- steps to reproduce where relevant
- acceptance criteria
- affected page/module
- screenshots or visual references
- priority/impact if useful

### 5. Pull request template
Create or improve:

`.github/pull_request_template.md`

Include:
- summary
- why / linked issue
- validation performed
- risks / follow-up
- docs updated

Make it suitable for agent-generated PRs and human review.

### 6. CODEOWNERS
Create or improve:

`CODEOWNERS`

Use a simple, sensible default if ownership information is limited.

### 7. Copilot setup workflow
Create or improve:

`.github/workflows/copilot-setup-steps.yml`

This should:
- use the real package manager
- use a sensible Node version based on the repo if detectable
- install dependencies
- run appropriate existing validation commands
- avoid calling scripts that do not exist

Align it with existing CI where possible.

### 8. CI review
Review existing CI workflows.

If the repo lacks sensible validation, create or improve a workflow for available checks such as:
- install
- lint
- typecheck
- test
- build

Keep it lightweight and practical.

### 9. Supporting docs
Update or create docs only where genuinely useful, for example:
- README development/validation sections
- docs/architecture.md
- docs/testing.md
- docs/ui-rules.md

Only document what is supported by the real repo.

## Quality rules

When doing this work:
- prefer improving existing files
- keep the setup clean and maintainable
- do not add unnecessary complexity
- do not add dependencies unless clearly needed
- do not invent scripts or tooling
- do not break existing workflows
- preserve repo conventions and structure
- keep all instructions actionable
- avoid filler wording

## React/Vite expectations

Where supported by the repo, reflect:
- shared component reuse
- route/page organisation
- hook/state patterns
- accessibility expectations
- theme/dark mode consistency if present
- test expectations for components/utilities
- avoiding duplicate components/styles
- dependency caution for bundle size

## Preferred output shape

Aim for something like this where appropriate:

.github/
  copilot-instructions.md
  pull_request_template.md
  ISSUE_TEMPLATE/
    bug_report.yml
    feature_request.yml
    ui_polish.yml
    config.yml
  workflows/
    ci.yml
    copilot-setup-steps.yml
  instructions/
    frontend.instructions.md
    testing.instructions.md

AGENTS.md
CODEOWNERS
docs/
  architecture.md
  testing.md
  ui-rules.md

Do not force every file if unnecessary.

## Validation

After making changes:
- run relevant validation commands if available
- ensure YAML and markdown are clean
- ensure instructions match the real repo
- fix any issues introduced by the setup work

## Final response required from the agent

When finished, provide:
1. repo assessment summary
2. files created and modified
3. reasons for setup choices
4. assumptions made
5. follow-up recommendations

If something cannot be completed from the repo evidence, say so clearly instead of guessing.
