# GDPR & Data Protection Policy

**BladderTracker**
**Last updated: March 2026**

---

## 1. Introduction

BladderTracker is a comprehensive developmental tracking platform designed for children with autism and developmental needs. The application enables parents, caregivers, therapists, educators, and specialists to log daily activities, track developmental milestones, and collaborate on a child's progress through a mobile-first progressive web application.

This policy explains how we collect, use, store, and protect personal data in accordance with the **UK General Data Protection Regulation (UK GDPR)**, the **Data Protection Act 2018**, and the **Age Appropriate Design Code** (Children's Code). Because our application processes sensitive health-related data about children, we take our data protection obligations extremely seriously.

This policy applies to all users of BladderTracker, including parents, caregivers, school administrators, therapists, and specialists.

---

## 2. Data Controller

The data controller responsible for your personal data is:

**BladderTracker**
Email: [privacy@childdevelopmenttracker.co.uk](mailto:privacy@childdevelopmenttracker.co.uk)

If you have any questions about this policy or how we handle your data, please contact us using the details provided in [Section 13](#13-contact-information).

We use the following data processors (sub-processors) to deliver the service:

| Processor | Purpose | Location |
|-----------|---------|----------|
| **Neon** (Neon Tech, Inc.) | PostgreSQL database hosting | Cloud (US/EU regions) |
| **Vercel** (Vercel Inc.) | Application hosting and serverless functions | Cloud (global edge network) |

Each sub-processor is bound by data processing agreements that require them to protect your data in accordance with UK GDPR standards.

---

## 3. What Data We Collect

We collect and process the following categories of personal data:

### 3.1 User Account Information

| Data | Purpose |
|------|---------|
| Full name | Identify you within the app and to other care team members |
| Email address | Account login, caregiver invitations, and notifications |
| Password | Secure account authentication — bcrypt-hashed in cloud mode and PBKDF2-hashed in local/offline mode; we never store plaintext passwords |
| Role | Determine your access permissions (see Section 3.7) |
| Avatar | Optional profile personalisation |
| Account creation date | Record-keeping |

### 3.2 Child Profiles

| Data | Purpose |
|------|---------|
| Child's name | Identify the child within the app |
| Date of birth | Age-appropriate tracking and milestone benchmarking |
| Due date (optional, leaps helper) | Improve leap prediction accuracy where supported |
| Avatar | Optional profile personalisation |
| Created by (user reference) | Ownership and access control |

### 3.3 Health Diary Entries

We collect detailed health and development diary entries across the following tracker modules. All entries record the child, date, time, notes, and the user who created them.

#### Drinks (Fluid Intake)
- Drink type (cup, beaker, bottle, sippy cup, other)
- Amount in millilitres

#### Urine
- Wet/dry status
- Pass/no pass
- Volume in millilitres
- Urgency level (1–5 scale)
- Leakage amount (none, small, medium, large)

#### Bowel Movements
- Bristol Stool Scale type (1–7)
- Amount (small, medium, large)
- Location (toilet, nappy)
- Whether laxatives were given
- Optional image reference

#### Sleep
- Event type (sleep onset, wake, nap start, nap end)
- Duration in minutes
- Quality rating (1–5 scale)
- Nighttime events
- Bedtime
- Sleep onset minutes
- Night activity flag

#### Toilet Attempts
- Outcome (success, failure, no event)
- Whether supervised
- Whether prompted
- Duration in minutes

#### Food (Dietary Intake)
- Meal type (breakfast, lunch, dinner, snack)
- Description of food consumed
- Portion size
- Whether it was a new food being tried
- Texture
- Acceptance / refusal outcome

#### Mood
- Mood level (1–5 scale, from very distressed to very happy)
- Triggers

#### Sensory
- Sensory type (tactile, auditory, visual, gustatory, olfactory, vestibular, proprioceptive)
- Response (seeking, avoiding, neutral)
- Intensity (1–5 scale)

#### Medication
- Medication name
- Dosage
- Whether administered

#### Therapy Sessions
- Therapy type (speech, occupational, physical, behavioural, other)
- Provider name
- Duration in minutes
- Goals

#### Routines
- Routine name
- Whether completed
- Duration in minutes

### 3.4 Milestones and Development Tracking

| Data | Purpose |
|------|---------|
| Milestone name and description | Track developmental achievements |
| Category (speech, motor, social, cognitive, self-care, routine, sensory, other) | Organise milestones by developmental area |
| Status (not started, in progress, achieved) | Monitor progress over time |
| Date achieved | Record when milestones are reached |

### 3.5 Caregiver Invitations and Access Permissions

| Data | Purpose |
|------|---------|
| Invitee email address | Deliver the invitation |
| Assigned role | Determine access level for the invited user |
| Invitation token | Secure, unique link for accepting the invitation |
| Invitation status (pending, accepted, declined) | Track invitation lifecycle |
| Child access records | Control which users can view or edit which children's data |

### 3.6 Audit Trail

We maintain an immutable audit log of user actions within the application. Each audit event records:

- The user who performed the action
- The action taken (e.g., "Added mood entry", "Created secure invite", "Imported diary data")
- The subject of the action
- Additional detail
- Timestamp

This audit trail supports accountability, safeguarding, and your right to understand how your data has been accessed and modified.

### 3.7 User Roles

The application implements six distinct roles with differing levels of access:

| Role | Access Level |
|------|-------------|
| **Admin** | Full system access including user management |
| **Parent** | Full access to own children; can invite caregivers and manage child profiles |
| **Caregiver** | View and edit entries for children they have been invited to access |
| **School Admin** | Caregiver-level diary access plus caregiver-invite workflow for linked children |
| **Therapist** | Invite-only contextual label; currently maps to caregiver-level diary access |
| **Specialist** | Invite-only contextual label; currently maps to caregiver-level diary access |

---

## 4. Legal Basis for Processing

We process your personal data on the following legal bases under Article 6 of the UK GDPR:

### 4.1 Consent (Article 6(1)(a))

- **Account creation:** You provide explicit consent when you register for an account and agree to this policy.
- **Child data entry:** Parents and guardians consent to the processing of their child's data when they create a child profile and begin logging entries.
- **Caregiver sharing:** You consent to share your child's data with specific individuals when you send a caregiver invitation.

You may withdraw your consent at any time by deleting your account (see [Section 12](#12-exercising-your-rights)).

### 4.2 Legitimate Interests (Article 6(1)(f))

- **Security and fraud prevention:** We process audit trail data and authentication data to protect accounts and detect unauthorised access.
- **Service improvement:** We may use aggregated, anonymised usage patterns to improve the application.

### 4.3 Special Category Data (Article 9)

Health diary entries (bladder, bowel, sleep, medication, therapy, and sensory data) constitute **special category data** under Article 9 of the UK GDPR. We process this data on the basis of:

- **Explicit consent** (Article 9(2)(a)) — provided by the parent or guardian when creating entries.
- **Health and social care purposes** (Article 9(2)(h)) — where the data is used to support the child's medical or therapeutic care, managed by or under the responsibility of a health professional or care team member.

---

## 5. How We Use Your Data

We use your data for the following purposes:

| Purpose | Data Used |
|---------|-----------|
| **Account authentication** | Email, hashed password, JWT session tokens |
| **Tracking child development** | All health diary entries, milestones |
| **Sharing with the care team** | Child profiles and entries shared via caregiver invitations |
| **Generating diary exports** | All tracker entries compiled into CSV format |
| **Maintaining accountability** | Audit trail of user actions |
| **Sending notifications** | User ID, notification content |
| **Access control** | User roles, child access permissions |

We do **not** use your data for:
- Advertising or marketing to third parties
- Automated decision-making or profiling
- Selling or renting to any third party
- Any purpose unrelated to the child's development tracking and care

---

## 6. Data Storage and Security

### 6.1 Storage modes

- **Cloud mode:** Application data is stored in a **Neon PostgreSQL** serverless database. Neon provides encryption at rest and in transit.
- **Local/offline mode:** Application data is stored in this browser's `localStorage` on this device and is not synced to a backend unless you explicitly run the cloud mode build.

### 6.2 Password Security

- **Cloud mode:** Passwords are hashed using **bcrypt** with a cost factor of 12 before storage.
- **Local/offline mode:** Passwords are derived client-side using PBKDF2 via the Web Crypto API and stored only in browser storage on that device.

We never store, log, or transmit plaintext passwords.

### 6.3 Session Authentication

- Sessions are managed using **JSON Web Tokens (JWT)** signed with the HS256 algorithm.
- Tokens are stored in **httpOnly cookies** (named `bt_session`), which cannot be accessed by client-side JavaScript, protecting against cross-site scripting (XSS) attacks.
- Sessions expire after **7 days**, after which you must re-authenticate.
- In production, cookies are transmitted only over **HTTPS** (Secure flag) with **SameSite=Lax** to protect against cross-site request forgery (CSRF).

### 6.4 Role-Based Access Control

The application enforces strict role-based access control with six defined roles (see [Section 3.7](#37-user-roles)). Every API request verifies the user's session and role before granting access to any data.

### 6.5 Data Isolation

- Each child's data is isolated and accessible only to the parent who created the profile and any users who have been explicitly invited via the caregiver invitation system.
- All database queries are filtered by the authenticated user's accessible child list, preventing cross-user data access.
- The `child_access` table enforces a strict permission boundary between users.

### 6.6 Application Hosting

The application is hosted on **Vercel**, which provides:
- HTTPS encryption for all traffic
- Serverless function isolation
- DDoS protection
- SOC 2 Type II compliance

---

## 7. Your Rights Under UK GDPR

Under Articles 15–22 of the UK GDPR, you have the following rights:

### 7.1 Right of Access (Article 15)

You have the right to obtain confirmation that your data is being processed and to request a copy of your personal data. You can:
- View all your diary entries, milestones, and child profiles within the app at any time.
- Export your data in CSV format (see [Section 12](#12-exercising-your-rights)).
- View your audit trail on your profile page to see a history of actions taken on your account.

### 7.2 Right to Rectification (Article 16)

You have the right to have inaccurate personal data corrected. You can:
- Edit any diary entry (drinks, urine, bowel, sleep, toilet attempts, food, mood, sensory, medication, therapy, and routine entries) directly within the app.
- Update child profiles (name, date of birth, avatar).
- Update your account details (name, email, avatar).

### 7.3 Right to Erasure — Right to Be Forgotten (Article 17)

You have the right to have your personal data deleted. You can:
- **Delete individual entries** from any tracker module.
- **Delete a child profile** and all associated data (all tracker entries, milestones, invitations, and access permissions are permanently removed).
- **Delete your entire account** and all associated data. This performs a complete cascading deletion of:
  - Your account and personal details
  - All children you created and their associated data
  - All diary entries across all tracker modules
  - All milestones
  - All caregiver invitations you sent
  - All notifications
  - All audit events
  - All access permissions

Account deletion is **permanent and irreversible**. A confirmation step requiring you to type "DELETE MY ACCOUNT" is enforced to prevent accidental deletion.

### 7.4 Right to Restrict Processing (Article 18)

You have the right to request that we restrict the processing of your data in certain circumstances. You can:
- Disable specific tracker modules for a child, preventing new entries of that type.
- Revoke caregiver access to limit who can view or edit a child's data.
- Contact us to request further processing restrictions.

### 7.5 Right to Data Portability (Article 20)

You have the right to receive your data in a structured, commonly used, and machine-readable format. You can:
- **Export diary data as CSV** for any child, including drinks, urine, bowel, sleep, toilet attempt, and food entries.
- **Import diary data from CSV** to transfer data into the application.

CSV files can be opened in any spreadsheet application (e.g., Microsoft Excel, Google Sheets) or processed by other software.

### 7.6 Right to Object (Article 21)

You have the right to object to the processing of your data where we rely on legitimate interests. If you object, we will cease processing unless we can demonstrate compelling legitimate grounds. Contact us using the details in [Section 13](#13-contact-information) to exercise this right.

### 7.7 Rights Related to Automated Decision-Making (Article 22)

BladderTracker does **not** carry out any automated decision-making or profiling. All data is presented as entered by users, and no automated assessments or decisions are made about your child.

---

## 8. Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| **User accounts** | Retained until you delete your account |
| **Child profiles** | Retained until the parent deletes the child profile or their account |
| **Diary entries** | Retained until individually deleted, or until the associated child profile or account is deleted |
| **Milestones** | Retained until individually deleted, or until the associated child profile or account is deleted |
| **Caregiver invitations** | Retained until the associated child profile or account is deleted |
| **Audit events** | Retained until the associated account is deleted |
| **Notifications** | Retained until the associated account is deleted |
| **Session tokens (JWT)** | Automatically expire after 7 days |

When you delete your account, **all associated data is permanently and irrecoverably removed** from our database through a cascading deletion process. We do not retain any personal data after account deletion.

We do not currently implement automatic data expiry. If you wish to have data removed, you may delete it at any time through the application or by contacting us.

---

## 9. Children's Data

### 9.1 Special Protections for Children

BladderTracker is designed specifically to process children's data. We recognise the heightened responsibility this entails and have implemented the following safeguards:

- **Parental control:** Only parents and guardians can create child profiles. Children do not create their own accounts or interact with the application directly.
- **Purpose limitation:** Children's data is used exclusively for developmental tracking, health monitoring, and supporting the child's care team. It is never used for marketing, profiling, or any unrelated purpose.
- **Data minimisation:** We collect only the data necessary for each tracker module. Modules can be individually enabled or disabled per child.
- **Access restrictions:** Children's data is accessible only to the parent who created the profile and users explicitly invited by that parent.

### 9.2 UK Age Appropriate Design Code

We have designed the application with the **ICO's Age Appropriate Design Code** (Children's Code) in mind:

- **Best interests of the child:** Data processing is carried out in the best interests of the child's health and development.
- **Data minimisation:** Parents choose which tracker modules to enable, ensuring only relevant data is collected.
- **Transparency:** This policy clearly explains what data is collected and how it is used.
- **No detrimental use:** Children's data is never used in ways that could be detrimental to their health or wellbeing.
- **No nudge techniques:** The application does not use nudge techniques, rewards, or gamification to encourage excessive data entry.
- **Default privacy:** Extended tracker modules (mood, sensory, medication, therapy, routine) are disabled by default and must be explicitly enabled by the parent.
- **Parental controls:** Parents have full control over their child's data, including the ability to export, restrict, and delete it.

### 9.3 Safeguarding

The audit trail records who created, edited, or deleted each entry and when, supporting safeguarding by maintaining a transparent record of all interactions with a child's data.

---

## 10. Data Sharing

### 10.1 Within the Application

Your child's data is shared **only** with users you have explicitly invited through the caregiver invitation system. When you send an invitation:

1. You specify the recipient's email address and their role (caregiver, school admin, therapist, or specialist).
2. A secure, unique invitation link is generated.
3. The recipient must have a registered account with the matching email address to accept the invitation.
4. Once accepted, the recipient gains access to the child's data according to their assigned role permissions.

You can revoke access at any time by removing the caregiver's access to a child.

### 10.2 Third Parties

We do **not** share your personal data with any third parties for their own purposes. Our sub-processors (Neon and Vercel) process data solely on our behalf to deliver the service, under binding data processing agreements.

We may disclose personal data if required by law, regulation, or legal process (e.g., a court order or safeguarding obligation).

### 10.3 No Sale of Data

We will never sell, rent, or trade your personal data or your child's data to any third party.

---

## 11. International Transfers

Our sub-processors (Neon and Vercel) may process data outside the United Kingdom. Where data is transferred internationally, we ensure appropriate safeguards are in place:

- **Standard Contractual Clauses (SCCs):** Our sub-processors use UK-approved International Data Transfer Agreements or Addenda.
- **Adequacy decisions:** Where applicable, transfers are made to countries or territories recognised by the UK government as providing an adequate level of data protection.
- **Encryption:** All data is encrypted in transit (TLS/HTTPS) and at rest.

You can contact us for further details about the specific safeguards in place for international transfers.

---

## 12. Exercising Your Rights

### 12.1 Export Your Data

1. Log in to your account.
2. Navigate to the child's diary page.
3. Use the **Export** feature to download a CSV file containing all diary entries for that child.

### 12.2 Edit Your Data

1. Log in to your account.
2. Navigate to the relevant diary entry, child profile, or account settings.
3. Edit the information directly within the app.

### 12.3 Delete Individual Entries

1. Log in to your account.
2. Navigate to the diary entry you wish to delete.
3. Use the delete option on the entry. Deletion is immediate and permanent.

### 12.4 Delete a Child Profile

1. Log in to your account.
2. Navigate to the child's settings.
3. Select **Delete Child**. You will be asked to type the child's name to confirm.
4. All associated data (entries, milestones, invitations, access permissions) will be permanently deleted.

### 12.5 Delete Your Account

1. Log in to your account.
2. Navigate to your **Profile** page.
3. Select **Delete Account**.
4. Type **"DELETE MY ACCOUNT"** to confirm.
5. Your account and all associated data will be permanently and irrecoverably deleted.

### 12.6 Other Requests

For any other data protection requests — including requests to restrict processing, object to processing, or obtain a copy of your data in a different format — please contact us using the details in [Section 13](#13-contact-information). We will respond to your request within **one calendar month**, as required by UK GDPR.

---

## 13. Contact Information

If you have any questions, concerns, or requests regarding this policy or your personal data, please contact us:

**Email:** [privacy@childdevelopmenttracker.co.uk](mailto:privacy@childdevelopmenttracker.co.uk)

You also have the right to lodge a complaint with the **Information Commissioner's Office (ICO)**, the UK's independent data protection authority:

- **Website:** [https://ico.org.uk](https://ico.org.uk)
- **Telephone:** 0303 123 1113
- **Post:** Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF

We encourage you to contact us first so that we can try to resolve any concerns directly.

---

## 14. Changes to This Policy

We may update this policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes:

- We will update the **"Last updated"** date at the top of this document.
- We will notify you through an in-app notification.
- If the changes significantly affect how we process your data, we will seek your renewed consent where required.

We encourage you to review this policy periodically to stay informed about how we protect your data.

---

## Summary of Technical Safeguards

| Safeguard | Implementation |
|-----------|---------------|
| Password hashing | bcrypt with cost factor 12 |
| Session management | JWT (HS256) in httpOnly, Secure, SameSite=Lax cookies |
| Session expiry | 7 days |
| Transport encryption | HTTPS (TLS) enforced in production |
| Database encryption | Encryption at rest and in transit (Neon PostgreSQL) |
| Access control | Role-based with 6 distinct roles |
| Data isolation | Per-child access filtering on every query |
| Audit trail | Immutable log of all user actions |
| Account deletion | Full cascading deletion of all associated data |
| Data export | CSV export of all diary entries |
| Invitation security | Unique, cryptographically generated tokens |

---

*This policy is provided in plain English to ensure it is accessible to all users. If you require this policy in an alternative format, please contact us.*
