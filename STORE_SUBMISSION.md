# App Store Submission Checklist

End-to-end guide for submitting EveryStep to the iOS App Store and
Google Play Store.

---

## Prerequisites

- [ ] App icon assets generated (see `ASSETS_REQUIRED.md`)
- [ ] Splash screen assets generated
- [ ] Screenshots captured for all required device sizes
- [ ] Privacy policy published at a public URL
- [ ] Push notification certificates/keys configured (see `NATIVE_SETUP.md`)
- [ ] Production environment variables set in Vercel dashboard

---

## iOS App Store

### Required metadata

| Field | Value / Notes |
|-------|---------------|
| App Name | EveryStep |
| Subtitle | Child development & continence diary |
| Bundle ID | com.everystep.app |
| SKU | com.everystep.app |
| Primary Language | English (UK) |
| Category | Health & Fitness (primary), Medical (secondary) |
| Content Rights | Does not contain third-party content |
| Age Rating | 4+ (no objectionable content) |
| Privacy Policy URL | `https://your-domain.com/privacy` (required) |
| Support URL | `https://your-domain.com/help` |
| Marketing URL | `https://your-domain.com` (optional) |
| Description | Up to 4000 characters describing the app |
| Keywords | bladder, continence, autism, SEND, child development, diary, tracker |
| What's New | First release (describe key features) |
| Promotional Text | 170 characters, can be updated without new build |

### Screenshot sizes

See `ASSETS_REQUIRED.md` for exact pixel dimensions. At minimum:

- [ ] iPhone 6.9" — 3 screenshots (1320×2868)
- [ ] iPhone 6.7" — 3 screenshots (1290×2796)
- [ ] iPhone 6.5" — 3 screenshots (1242×2688)
- [ ] iPhone 5.5" — 3 screenshots (1242×2208)
- [ ] iPad Pro 12.9" — 3 screenshots (2048×2732)

### Export compliance

- [ ] Does the app use encryption? **Yes** (HTTPS/TLS for API calls, JWT)
- [ ] Is it exempt under the EAR? **Yes** — standard HTTPS qualifies for the
  exemption. Select "Yes" to the question about using only standard encryption.
- [ ] No custom encryption algorithms used.

### App Review notes

Provide test credentials for the reviewer:
```
Email: reviewer@example.com
Password: (create a test account before submission)
```

Note: The app works in offline/localStorage mode without credentials. Mention
this in the review notes as an alternative testing path.

---

## Google Play Store

### Required metadata

| Field | Value / Notes |
|-------|---------------|
| App name | EveryStep |
| Short description | 80 characters max |
| Full description | 4000 characters max |
| Application type | Application |
| Category | Health & Fitness |
| Content rating | Complete the IARC questionnaire (likely "Everyone") |
| Target audience | Not directed at children under 13 (it is used BY adults FOR children) |
| Privacy policy URL | `https://your-domain.com/privacy` (required) |
| Email | Contact email for store listing |

### Screenshot sizes

- [ ] Phone — 2–8 screenshots, minimum 1080×1920
- [ ] 7" tablet — optional but recommended (1200×1920)
- [ ] 10" tablet — optional but recommended (1600×2560)
- [ ] Feature graphic — 1024×500 (required)

### Content rating questionnaire

Answer these for the IARC rating:
- Violence: None
- Sexuality: None
- Language: None
- Controlled substance: None (medication tracking is not substance promotion)
- User interaction: Users can share data with caregivers
- Location sharing: No
- Sensitive content: Health data (declare in data safety section)

### Data safety section

| Data type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Email address | Yes | No | Account authentication |
| Name | Yes | No | User profile |
| Health info (continence/development data) | Yes | Yes (with invited caregivers only) | App functionality |
| App interactions | No | No | — |
| Device identifiers (push token) | Yes | No | Push notifications |

Security practices:
- [ ] Data is encrypted in transit (HTTPS)
- [ ] Data can be deleted by user (GDPR compliance, in-app deletion)
- [ ] Follows Google's User Data policy

---

## First Native Build — iOS

### 1. Add iOS platform

```bash
npm run build
npx cap add ios
npx cap sync
```

### 2. Open in Xcode

```bash
npx cap open ios
```

### 3. Configure signing

1. Select the **App** target in the project navigator
2. Go to **Signing & Capabilities**
3. Select your Team (Apple Developer account required)
4. Ensure **Automatically manage signing** is checked
5. Bundle Identifier should be `com.everystep.app`

### 4. Add capabilities

- **Push Notifications** — click "+ Capability" and add it
- Verify **Background Modes → Remote notifications** is checked

### 5. Set deployment target

- Minimum iOS version: **16.0** (covers 95%+ of devices)

### 6. Add app icon & splash

- Drag icons into `Assets.xcassets/AppIcon.appiconset/`
- Update splash in `Assets.xcassets/Splash.imageset/`

### 7. Build & archive

1. Select **Any iOS Device** as the build target
2. **Product → Archive**
3. Once archived, click **Distribute App**
4. Select **App Store Connect** → **Upload**

### 8. TestFlight

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select the app → **TestFlight** tab
3. Wait for build processing (5–30 minutes)
4. Add internal testers (up to 100)
5. Submit for external testing review if needed (up to 10,000 testers)

### 9. Submit for review

1. Fill in all metadata fields listed above
2. Upload screenshots
3. Select the build from TestFlight
4. Submit for App Review

---

## First Native Build — Android

### 1. Add Android platform

```bash
npm run build
npx cap add android
npx cap sync
```

### 2. Open in Android Studio

```bash
npx cap open android
```

### 3. Configure signing

1. **Build → Generate Signed Bundle / APK**
2. Create a new keystore (save it securely — you need it for every update):
   - Key store path: `android/app/everystep.jks`
   - Password: (choose a strong password)
   - Key alias: `everystep`
3. **Add the keystore to `.gitignore`** — never commit it

### 4. Add Firebase for push

1. Place `google-services.json` in `android/app/`
2. Verify the `applicationId` in `android/app/build.gradle` matches
   `com.everystep.app`

### 5. Set minimum SDK

- `minSdkVersion`: 23 (Android 6.0, covers 95%+ of devices)
- `targetSdkVersion`: 34 (latest stable)

### 6. Add app icon

- Use Android Studio's **Image Asset** wizard:
  Right-click `res` → **New → Image Asset**
- Select the 1024×1024 source icon
- It generates all mipmap sizes and adaptive icon layers

### 7. Build signed AAB

```bash
cd android
./gradlew bundleRelease
```

The signed AAB will be at
`android/app/build/outputs/bundle/release/app-release.aab`

### 8. Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create the app listing
3. **Production → Create new release**
4. Upload the `.aab` file
5. Fill in release notes

### 9. Internal testing

1. **Testing → Internal testing** → Create a new release
2. Upload the AAB
3. Add tester email addresses
4. Testers receive a link to install via Play Store

---

## Known Remaining Items

- [ ] **APNs key/certificate** — required for iOS push. Create in Apple
  Developer portal and configure on your push notification server.
- [ ] **Firebase project** — required for Android push. Create project and
  download `google-services.json`.
- [ ] **Real device testing** — test on physical iPhone and Android device
  before submission (simulators miss push notification and biometric issues).
- [ ] **Privacy policy page** — must be live at a public URL before either
  store will accept the submission.
- [ ] **Server-side push sending** — device tokens are stored but no server
  code sends pushes yet. Implement before enabling push notification features.
- [ ] **Deep linking** — configure Universal Links (iOS) and App Links
  (Android) if invite/share URLs should open the native app.
- [ ] **App Tracking Transparency** — the app does not track users, but if
  any analytics SDK is added later, iOS requires an ATT prompt.
- [ ] **Accessibility audit** — run VoiceOver (iOS) and TalkBack (Android)
  manual tests on a real device.
