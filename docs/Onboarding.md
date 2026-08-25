# Onboarding Guide

## Welcome

EveryStep is a mobile-first diary for continence, routines, milestones, and related support tracking.

## Create an account

1. Open the app and choose **Get started**.
2. Enter name, email, and password.
3. Choose one of the currently exposed signup roles:
   - Parent
   - Caregiver
   - School staff

> Note: The wider role type system includes additional roles (`therapist`, `specialist`, `admin`), but the signup UI currently exposes the three roles above.
> `therapist` and `specialist` are invite-only labels in the current build; they are not self-service signup roles.

## Add a child profile

1. Go to **Profiles**.
2. Select **Add child**.
3. Enter name and date of birth.

## Start logging

Use **Dashboard** quick actions or **Add Entry**.

Core modules:
- Drinks
- Wee
- Poo
- Sleep
- Toilet visits
- Meals

Optional modules (enable per child in Settings):
- Mood
- Sensory
- Medication
- Therapy
- Routines
- Leaps

Milestones has its own dedicated page.

## Invite collaborators

From **Profiles**, create invite links for allowed roles in the current UI.

Current invite-role behaviour is role-dependent in-app (for example parent/admin can invite broader roles than school staff). If you are documenting policy-level permissions, validate against `src/pages/ProfilesPage.tsx` and `api/invites.ts` before publishing claims.

## Reports and history

- **Log**: full chronological entry history with filters.
- **Reports**: charts and trend summaries.
- **Calendar**: date-based browsing.
- **Milestones / Leaps**: developmental tracking pages.

## Privacy and data

In **Settings** you can:
- Export child data
- Import supported diary data (the built-in CSV / JSON / XLSX template covers drinks, urine, and bowel entries)
- Clear local browser data
- Delete account data
- Review GDPR policy and audit history

## Accessibility

Settings includes:
- Light / Dark / High-contrast themes
- Dyslexia-friendly font toggle

Keyboard navigation and skip-link support are included in the app shell.
