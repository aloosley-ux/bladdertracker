# Required Image Assets for App Store Submission

This document lists every image asset needed for iOS and Android store builds.
Hand this to a designer — each entry includes the exact file name, pixel
dimensions, and target folder path.

---

## App Icon

### iOS (all required sizes)

Place inside `ios/App/App/Assets.xcassets/AppIcon.appiconset/`.
Xcode expects a `Contents.json` manifest; the easiest approach is to use a
1024×1024 source and generate all sizes with a tool like
[appicon.co](https://appicon.co) or the Xcode asset catalog.

| Size (px) | Scale | Usage | File name |
|-----------|-------|-------|-----------|
| 20×20 | 2x | iPad Notifications | icon-20@2x.png |
| 20×20 | 3x | iPhone Notifications | icon-20@3x.png |
| 29×29 | 2x | iPad Settings | icon-29@2x.png |
| 29×29 | 3x | iPhone Settings | icon-29@3x.png |
| 40×40 | 2x | iPad Spotlight | icon-40@2x.png |
| 40×40 | 3x | iPhone Spotlight | icon-40@3x.png |
| 60×60 | 2x | iPhone App | icon-60@2x.png |
| 60×60 | 3x | iPhone App | icon-60@3x.png |
| 76×76 | 2x | iPad App | icon-76@2x.png |
| 83.5×83.5 | 2x | iPad Pro App | icon-83.5@2x.png |
| 1024×1024 | 1x | App Store | icon-1024.png |

> **Tip**: Apple now accepts a single 1024×1024 icon in Xcode 15+ and
> auto-generates all sizes. Provide the full set as a fallback.

### Android

Place inside `android/app/src/main/res/`.

#### Launcher icon (standard — mipmap folders)

| Folder | Size (px) | File name |
|--------|-----------|-----------|
| mipmap-mdpi | 48×48 | ic_launcher.png |
| mipmap-hdpi | 72×72 | ic_launcher.png |
| mipmap-xhdpi | 96×96 | ic_launcher.png |
| mipmap-xxhdpi | 144×144 | ic_launcher.png |
| mipmap-xxxhdpi | 192×192 | ic_launcher.png |

#### Adaptive icon (Android 8+)

Requires a **foreground** layer and a **background** layer:

| Folder | Size (px) | File name |
|--------|-----------|-----------|
| mipmap-mdpi | 108×108 | ic_launcher_foreground.png |
| mipmap-hdpi | 162×162 | ic_launcher_foreground.png |
| mipmap-xhdpi | 216×216 | ic_launcher_foreground.png |
| mipmap-xxhdpi | 324×324 | ic_launcher_foreground.png |
| mipmap-xxxhdpi | 432×432 | ic_launcher_foreground.png |

Background can be a solid colour defined in
`android/app/src/main/res/values/ic_launcher_background.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#f8f5ff</color>
</resources>
```

#### Play Store icon

| Size (px) | File name | Notes |
|-----------|-----------|-------|
| 512×512 | playstore-icon.png | PNG, no transparency, uploaded to Play Console |

---

## Splash Screen

### iOS — Launch Storyboard (recommended)

Capacitor uses a Launch Storyboard (`ios/App/App/Base.lproj/LaunchScreen.storyboard`)
by default. It auto-scales to all device sizes.

To customise:
1. Open `ios/App/App/Assets.xcassets/Splash.imageset/`
2. Add a centered logo image (recommend 600×600 with transparent background)
3. Set the storyboard background colour to `#f8f5ff` in Interface Builder

| Asset | Size (px) | File name |
|-------|-----------|-----------|
| Splash logo @1x | 200×200 | splash-logo.png |
| Splash logo @2x | 400×400 | splash-logo@2x.png |
| Splash logo @3x | 600×600 | splash-logo@3x.png |

### Android — Splash drawable

Place a centered logo in `android/app/src/main/res/drawable/splash.png`.
The SplashScreen plugin uses this together with the `backgroundColor`
configured in `capacitor.config.ts`.

| Folder | Size (px) | File name |
|--------|-----------|-----------|
| drawable-mdpi | 200×200 | splash.png |
| drawable-hdpi | 300×300 | splash.png |
| drawable-xhdpi | 400×400 | splash.png |
| drawable-xxhdpi | 600×600 | splash.png |
| drawable-xxxhdpi | 900×900 | splash.png |

---

## App Store Screenshots

### iOS

| Device | Size (px) | Orientation | Min required |
|--------|-----------|-------------|-------------|
| iPhone 6.9" (16 Pro Max) | 1320×2868 | Portrait | 3 |
| iPhone 6.7" (15 Pro Max) | 1290×2796 | Portrait | 3 |
| iPhone 6.5" (11 Pro Max) | 1242×2688 | Portrait | 3 |
| iPhone 5.5" (8 Plus) | 1242×2208 | Portrait | 3 |
| iPad Pro 12.9" (6th gen) | 2048×2732 | Portrait | 3 |
| iPad Pro 12.9" (2nd gen) | 2048×2732 | Portrait | 3 (if supporting older iPads) |

### Android (Play Store)

| Type | Size (px) | Notes |
|------|-----------|-------|
| Phone screenshots | 1080×1920 min | 2–8 required, JPEG or PNG |
| 7" tablet | 1200×1920 | Optional but recommended |
| 10" tablet | 1600×2560 | Optional but recommended |
| Feature graphic | 1024×500 | Required, displayed at top of listing |

---

## Source Files to Provide

A designer should provide these master assets:

1. **App icon** — 1024×1024 PNG, no rounded corners (OS adds them)
2. **Adaptive icon foreground** — 432×432 PNG with transparency, logo centred
   in the safe zone (66% of total area)
3. **Splash logo** — 600×600 PNG with transparency
4. **Feature graphic** — 1024×500 PNG/JPEG for Play Store
5. **Screenshots** — at least 3 per device size listed above

Place generated assets in `public/icons/` and the platform-specific folders
listed above after running `npx cap add ios` / `npx cap add android`.
