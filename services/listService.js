import { api } from './api';

export const listService = {
  getAll: async () => {
    const result = await api.get('/lists');
    return result?.content || [];
  },

  getById: async (id) => {
    return await api.get(`/lists/${id}`);
  },

  create: async (data) => {
    return await api.post('/lists', {
      name: data.name,
      userId: Number(data.userId),
    });
  },

  update: async (id, data) => {
    return await api.patch(`/lists/${id}`, {
      name: data.name,
    });
  },

  delete: async (id) => {
    return await api.delete(`/lists/${id}`);
  },

  addMovie: async (listId, movieId) => {
    return await api.post(`/lists/${listId}/movies/${movieId}`);
  },

  removeMovie: async (listId, movieId) => {
    return await api.delete(`/lists/${listId}/movies/${movieId}`);
  },
};
