import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let androidChannelReady = false;

export const setupNotifications = async () => {
  if (Platform.OS === 'android' && !androidChannelReady) {
    await Notifications.setNotificationChannelAsync('cinefinder-default', {
      name: 'CineFinder',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
    androidChannelReady = true;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

/** Android exige que todos os valores em `data` sejam strings. */
const toNotificationData = (payload) =>
  Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value == null ? '' : String(value)])
  );

const schedule = async (title, body, data) => {
  const granted = await setupNotifications();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: toNotificationData(data) },
    trigger: null,
  });
};

/** Disparada após favoritar filme (ação real do usuário + API). */
export const notifyFavoriteAdded = (movieTitle) =>
  schedule(
    'Filme nos favoritos',
    `${movieTitle} foi salvo na sua lista de favoritos.`,
    { screen: 'favoritos' }
  );

/** Disparada após criar review (ação real + API Spring). */
export const notifyReviewCreated = (movieTitle) =>
  schedule(
    'Review publicada',
    `Sua avaliação de "${movieTitle}" foi registrada.`,
    { screen: 'reviews' }
  );

export const getNavigationTarget = (data) => {
  const screen = data?.screen != null ? String(data.screen) : '';
  if (!screen) return null;

  const routes = {
    favoritos: '/(tabs)/favoritos',
    reviews: '/(tabs)/reviews',
    explore: '/(tabs)/explore',
  };

  if (screen === 'movie' && data.movieId) {
    return `/movie/${String(data.movieId)}`;
  }

  return routes[screen] || null;
};
