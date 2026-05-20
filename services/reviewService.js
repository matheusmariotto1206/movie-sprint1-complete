import { api } from './api';

export const reviewService = {
  getAll: async () => {
    const result = await api.get('/reviews');
    return result?.content || [];
  },

  getById: async (id) => {
    return await api.get(`/reviews/${id}`);
  },

  create: async (review) => {
    const { movieTitle, ...payload } = review;
    return await api.post('/reviews', {
      userId: Number(payload.userId),
      movieId: Number(payload.movieId),
      rating: Number(payload.rating),
      comments: payload.comments,
    });
  },

  update: async (id, review) => {
    return await api.put(`/reviews/${id}`, {
      rating: Number(review.rating),
      comments: review.comments,
    });
  },

  delete: async (id) => {
    return await api.delete(`/reviews/${id}`);
  },
};
