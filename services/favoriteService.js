import { api } from './api';

const FAVORITES_NAME = 'Favoritos';

/** Cache do id da lista principal de favoritos por usuário. */
const favListCache = new Map();

export const clearFavoriteListCache = (userId) => {
  if (userId != null) favListCache.delete(String(userId));
  else favListCache.clear();
};

const sameMovieId = (a, b) => Number(a) === Number(b);

const belongsToUser = (list, userName) => {
  if (list.name !== FAVORITES_NAME) return false;
  if (!userName) return true;
  return list.userName === userName;
};

const fetchAllLists = async () => {
  const data = await api.get('/lists?page=0&size=100');
  return data.content || data || [];
};

/** Todas as listas "Favoritos" deste usuário (pode haver mais de uma no H2). */
const getUserFavoritosLists = async (userId, userName) => {
  const lists = await fetchAllLists();
  return lists.filter((l) => belongsToUser(l, userName));
};

/** Lista principal: a que já tem filmes ou a de menor id (mais antiga). */
const resolvePrimaryListId = async (userId, userName) => {
  const key = String(userId);
  if (favListCache.has(key)) return favListCache.get(key);

  let lists = await getUserFavoritosLists(userId, userName);

  if (!lists.length) {
    const created = await api.post('/lists', {
      name: FAVORITES_NAME,
      userId: Number(userId),
    });
    favListCache.set(key, created.id);
    return created.id;
  }

  if (lists.length === 1) {
    favListCache.set(key, lists[0].id);
    return lists[0].id;
  }

  let best = lists[0];
  let bestCount = -1;
  for (const summary of lists) {
    const detail = await api.get(`/lists/${summary.id}`);
    const count = (detail.movies || []).length;
    if (count > bestCount) {
      bestCount = count;
      best = summary;
    }
  }

  favListCache.set(key, best.id);
  return best.id;
};

/** Em qual lista o filme está (busca em todas as listas Favoritos do usuário). */
const findListIdWithMovie = async (userId, userName, movieId) => {
  const lists = await getUserFavoritosLists(userId, userName);
  for (const summary of lists) {
    const detail = await api.get(`/lists/${summary.id}`);
    if ((detail.movies || []).some((m) => sameMovieId(m.id, movieId))) {
      return summary.id;
    }
  }
  return null;
};

export const favoriteService = {
  getAll: async (userId, userName) => {
    const lists = await getUserFavoritosLists(userId, userName);
    if (!lists.length) return [];

    const byId = new Map();
    for (const summary of lists) {
      const detail = await api.get(`/lists/${summary.id}`);
      for (const movie of detail.movies || []) {
        byId.set(Number(movie.id), movie);
      }
    }
    return Array.from(byId.values());
  },

  add: async (userId, userName, movieId) => {
    const listId = await resolvePrimaryListId(userId, userName);
    return api.post(`/lists/${listId}/movies/${movieId}`);
  },

  remove: async (userId, userName, movieId) => {
    clearFavoriteListCache(userId);

    let listId = await findListIdWithMovie(userId, userName, movieId);
    if (listId == null) {
      return null;
    }

    try {
      return await api.delete(`/lists/${listId}/movies/${movieId}`);
    } catch (error) {
      const msg = String(error?.message || '');
      if (msg.includes('404') || msg.includes('NoSuchElement') || msg.includes('não está')) {
        clearFavoriteListCache(userId);
        listId = await findListIdWithMovie(userId, userName, movieId);
        if (listId == null) return null;
        return api.delete(`/lists/${listId}/movies/${movieId}`);
      }
      throw error;
    }
  },
};
