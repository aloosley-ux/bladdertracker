# Security Policy

EveryStep handles sensitive child-health and caregiver data. Please report security concerns responsibly and avoid sharing exploit details publicly.

## Supported versions

The project is currently maintained on the latest default branch state.

| Version / branch | Supported |
|------------------|-----------|
| `main` | ✅ |
| Older commits, forks, or stale deployments | ❌ |

## How to report a vulnerability

Please **do not open a public GitHub issue** for vulnerabilities that could expose accounts, child data, authentication flows, exports, or deployment secrets.

Instead, use one of the following:

1. **GitHub private vulnerability reporting / security advisory** for this repository, if available.
2. **Direct maintainer contact** via [privacy@childdevelopmenttracker.co.uk](mailto:privacy@childdevelopmenttracker.co.uk) with the subject line `Security report: EveryStep`.

Please include:

- A short summary of the issue
- The affected area (`auth`, exports, invites, child access, API endpoint, deployment config, etc.)
- Reproduction steps or a proof of concept
- Any known impact or suggested mitigation
- Whether the issue affects local mode, cloud mode, or both

## What to avoid in reports

- Do not include real child data, production credentials, or personal information
- Do not post exploit details in public issues, pull requests, or discussions
- Do not run destructive tests against production systems without permission

## Disclosure expectations

- We will aim to acknowledge responsible reports promptly
- Please allow time for triage and remediation before public disclosure
- If a report requires a coordinated fix, we may ask for a temporary embargo window

## Scope notes

Security-sensitive areas in this repo include:

- Authentication and session handling
- Child access control and caregiver invites
- Export, import, and deletion flows
- Environment variable handling and deployment configuration
- Storage of health and developmental records in local or cloud mode
