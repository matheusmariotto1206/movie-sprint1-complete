import { api } from './api';

export const movieService = {
  getAll: async (page = 0) => {
    const data = await api.get(`/movies?page=${page}&size=20`);
    return data.content || data;
  },
  getById: async (id) => {
    return api.get(`/movies/${id}`);
  },
  getReviews: async (movieId) => {
    return api.get(`/movies/${movieId}/reviews`);
  },
};