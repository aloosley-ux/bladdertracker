/**
 * usePushNotifications — registers for native push notifications via Capacitor
 * and sends device tokens to the API for storage.
 *
 * Handles:
 * - Requesting permission on first call (with graceful denial)
 * - Registering the device token with POST /api/notifications (action: 'register-device')
 * - Foreground notification display via app notification system
 * - Notification tap routing (navigates to relevant page)
 *
 * Only activates on native Capacitor platforms (iOS/Android). On the web this
 * hook is a no-op.
 */
import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  type Token,
  type PushNotificationSchema,
  type ActionPerformed,
} from '@capacitor/push-notifications';

interface UsePushNotificationsOptions {
  /** Whether the user is authenticated. Push registration is skipped until true. */
  isAuthenticated: boolean;
  /** Callback invoked when a foreground notification arrives. */
  onForegroundNotification?: (notification: PushNotificationSchema) => void;
  /** Callback invoked when the user taps a notification. Receives the data payload. */
  onNotificationAction?: (data: Record<string, unknown>) => void;
}

// usePushNotifications — hook to register push notifications on native platforms.
export function usePushNotifications({
  isAuthenticated,
  onForegroundNotification,
  onNotificationAction,
}: UsePushNotificationsOptions): void {
  const registeredRef = useRef(false);

  useEffect(() => {
    // Only run on native Capacitor platforms
    if (!Capacitor.isNativePlatform()) return;
    if (!isAuthenticated) return;
    if (registeredRef.current) return;

    let cancelled = false;

    async function register() {
      try {
        const permResult = await PushNotifications.requestPermissions();
        if (permResult.receive !== 'granted') {
          // User denied — do not re-ask until next app launch
          return;
        }

        await PushNotifications.register();
      } catch {
        // Push not supported or failed — degrade gracefully
      }
    }

    // Listen for the device token after registration
    const tokenListener = PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        if (cancelled) return;
        registeredRef.current = true;

        try {
          await fetch('/api/notifications', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'register-device',
              token: token.value,
              platform: Capacitor.getPlatform(), // 'ios' | 'android'
            }),
          });
        } catch {
          // Token registration failed — will retry on next app launch
        }
      },
    );

    // Handle registration errors
    const errorListener = PushNotifications.addListener(
      'registrationError',
      () => {
        // Push registration failed — degrade gracefully
      },
    );

    // Handle foreground notifications
    const foregroundListener = PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        if (cancelled) return;
        onForegroundNotification?.(notification);
      },
    );

    // Handle notification taps
    const actionListener = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        if (cancelled) return;
        const data = (action.notification.data ?? {}) as Record<string, unknown>;
        onNotificationAction?.(data);
      },
    );

    void register();

    return () => {
      cancelled = true;
      void tokenListener.then((l) => l.remove());
      void errorListener.then((l) => l.remove());
      void foregroundListener.then((l) => l.remove());
      void actionListener.then((l) => l.remove());
    };
  }, [isAuthenticated, onForegroundNotification, onNotificationAction]);
}
