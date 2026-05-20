import { Platform } from 'react-native';

const BASE = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export const API = {
  BASE_URL: BASE,
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    REGISTER: `${BASE}/auth/register`,
  },
  MOVIES: `${BASE}/movies`,
  REVIEWS: `${BASE}/reviews`,
  PLAYLISTS: `${BASE}/playlists`,
  FAVORITES: `${BASE}/favorites`,
} as const;
