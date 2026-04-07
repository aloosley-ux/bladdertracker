# Native Platform Setup — Push Notifications

This document describes the native platform configuration required for push
notifications to work after running `npx cap add ios` / `npx cap add android`.

---

## iOS — APNs (Apple Push Notification service)

### 1. Xcode capabilities (automatic)

When you open the project in Xcode after `npx cap add ios`, add the following
capability in **Signing & Capabilities**:

- **Push Notifications** — enables APNs entitlement

### 2. Info.plist keys

Capacitor's `@capacitor/push-notifications` plugin adds most keys automatically.
Verify these are present in `ios/App/App/Info.plist`:

```xml
<!-- Required: background modes for remote notifications -->
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

### 3. APNs key setup

1. Go to [Apple Developer → Keys](https://developer.apple.com/account/resources/authkeys/list)
2. Create a new key with **Apple Push Notifications service (APNs)** enabled
3. Download the `.p8` key file — you will need:
   - **Key ID** (10 characters)
   - **Team ID** (from Membership page)
   - The `.p8` file contents
4. Store these securely — they are needed by your push notification server

### 4. Provisioning profile

Ensure your provisioning profile includes the Push Notifications entitlement.
If using automatic signing in Xcode, this is handled automatically.

---

## Android — FCM (Firebase Cloud Messaging)

### 1. Firebase project setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Add an Android app with package name `com.bladdertracker.app`
4. Download `google-services.json` and place it in `android/app/`

### 2. AndroidManifest.xml permissions

These should be added automatically by the Capacitor plugin. Verify they exist
in `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Push notification permissions (added by @capacitor/push-notifications) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

<!-- Inside <application> tag: FCM service -->
<service
    android:name="com.google.firebase.messaging.FirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

### 3. Android 13+ (API 33) runtime permission

Android 13 requires runtime permission for notifications. The
`@capacitor/push-notifications` plugin handles this via
`PushNotifications.requestPermissions()` in the `usePushNotifications` hook.

### 4. Notification channel (optional)

For custom notification appearance on Android 8+, create a notification channel
in `android/app/src/main/java/.../MainActivity.java`:

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    NotificationChannel channel = new NotificationChannel(
        "bladdertracker_default",
        "BladderTracker",
        NotificationManager.IMPORTANCE_DEFAULT
    );
    NotificationManager manager = getSystemService(NotificationManager.class);
    manager.createNotificationChannel(channel);
}
```

---

## Server-side token storage

Device tokens are stored via `POST /api/notifications` with:

```json
{
  "action": "register-device",
  "token": "<device-token>",
  "platform": "ios" | "android"
}
```

The `device_tokens` table is created by the migration (`api/_lib/db.ts`):

```sql
CREATE TABLE IF NOT EXISTS device_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform VARCHAR(10) NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, token)
);
```

---

## Sending push notifications (future work)

Server-side push sending is not yet implemented. When ready:

- **iOS**: Use the APNs HTTP/2 API with the `.p8` key
- **Android**: Use the FCM HTTP v1 API with a Firebase service account
- Libraries: `apn` (npm) for iOS, `firebase-admin` for Android, or a
  unified service like OneSignal / Pusher Beams
