import { useCallback, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  useLastNotificationResponse,
  clearLastNotificationResponseAsync,
} from 'expo-notifications';
import { useRouter } from 'expo-router';
import { getNavigationTarget, setupNotifications } from '../services/notificationService';

const navigateToPath = (router, path) => {
  if (!path) return;
  InteractionManager.runAfterInteractions(() => {
    setTimeout(() => {
      router.navigate(path);
    }, 150);
  });
};

export const useNotificationSetup = (enabled) => {
  const router = useRouter();
  const pendingPathRef = useRef(null);
  const handledIdsRef = useRef(new Set());

  const handleResponse = useCallback(
    (response) => {
      if (!response) return;

      const id = response.notification.request.identifier;
      if (handledIdsRef.current.has(id)) return;

      if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;

      const data = response.notification.request.content.data;
      const path = getNavigationTarget(data);
      if (!path) return;

      handledIdsRef.current.add(id);

      if (!enabled) {
        pendingPathRef.current = path;
        return;
      }

      navigateToPath(router, path);
      clearLastNotificationResponseAsync();
    },
    [enabled, router]
  );

  useEffect(() => {
    setupNotifications();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (pendingPathRef.current) {
      const path = pendingPathRef.current;
      pendingPathRef.current = null;
      navigateToPath(router, path);
    }

    Notifications.getLastNotificationResponseAsync().then(handleResponse);

    const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);
    return () => subscription.remove();
  }, [enabled, handleResponse, router]);

  const lastResponse = useLastNotificationResponse();
  useEffect(() => {
    if (!enabled || !lastResponse) return;
    handleResponse(lastResponse);
  }, [enabled, lastResponse, handleResponse]);
};
