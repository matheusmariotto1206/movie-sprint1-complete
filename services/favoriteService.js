import { api } from './api';

/** Lista "Favoritos" por usuário (evita ID fixo 3 de outro usuário ou backend reiniciado). */
const favListCache = new Map();

export const clearFavoriteListCache = (userId) => {
  if (userId != null) favListCache.delete(String(userId));
  else favListCache.clear();
};

const getFavListId = async (userId, userName) => {
  const key = String(userId);
  if (favListCache.has(key)) return favListCache.get(key);

  const data = await api.get('/lists?page=0&size=100');
  const lists = data.content || data || [];

  let favList = lists.find(
    (l) =>
      l.name === 'Favoritos' &&
      (userName ? l.userName === userName : true)
  );

  if (!favList) {
    favList = await api.post('/lists', {
      name: 'Favoritos',
      userId: Number(userId),
    });
  }

  favListCache.set(key, favList.id);
  return favList.id;
};

const withListRetry = async (userId, userName, action) => {
  try {
    return await action(await getFavListId(userId, userName));
  } catch (error) {
    const msg = String(error?.message || '');
    if (msg.includes('404') || msg.includes('NoSuchElement')) {
      clearFavoriteListCache(userId);
      return await action(await getFavListId(userId, userName));
    }
    throw error;
  }
};

export const favoriteService = {
  getAll: async (userId, userName) => {
    const listId = await getFavListId(userId, userName);
    const data = await api.get(`/lists/${listId}`);
    return data.movies || [];
  },

  add: async (userId, userName, movieId) =>
    withListRetry(userId, userName, (listId) =>
      api.post(`/lists/${listId}/movies/${movieId}`)
    ),

  remove: async (userId, userName, movieId) =>
    withListRetry(userId, userName, (listId) =>
      api.delete(`/lists/${listId}/movies/${movieId}`)
    ),
};
