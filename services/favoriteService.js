import { api } from './api';

let favListId = null;

const getFavListId = async (userId) => {
  if (favListId) return favListId;
  const data = await api.get('/lists?page=0&size=100');
  const lists = data.content || data;
  let favList = lists.find((l) => l.name === 'Favoritos');
  if (!favList) {
    favList = await api.post('/lists', { name: 'Favoritos', userId: Number(userId) });
  }
  favListId = favList.id;
  return favListId;
};

export const favoriteService = {
  getAll: async (userId) => {
    const listId = await getFavListId(userId);
    const data = await api.get(`/lists/${listId}`);
    return data.movies || [];
  },
  add: async (userId, movieId) => {
    const listId = await getFavListId(userId);
    return api.post(`/lists/${listId}/movies/${movieId}`);
  },
  remove: async (userId, movieId) => {
    const listId = await getFavListId(userId);
    return api.delete(`/lists/${listId}/movies/${movieId}`);
  },
};
