import { api } from './api';

export const playlistService = {
  getAll: async (page = 0) => {
    const data = await api.get(`/lists?page=${page}&size=20`);
    return data.content || data;
  },
  getById: async (id) => {
    return api.get(`/lists/${id}`);
  },
  create: async (list) => {
    return api.post('/lists', list);
  },
  update: async (id, list) => {
    return api.patch(`/lists/${id}`, list);
  },
  delete: async (id) => {
    return api.delete(`/lists/${id}`);
  },
  addMovie: async (listId, movieId) => {
    return api.post(`/lists/${listId}/movies/${movieId}`);
  },
  removeMovie: async (listId, movieId) => {
    return api.delete(`/lists/${listId}/movies/${movieId}`);
  },
};
