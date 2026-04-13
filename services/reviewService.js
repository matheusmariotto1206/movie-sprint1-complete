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
    return await api.post('/reviews', {
      userId: Number(review.userId),
      movieId: Number(review.movieId),
      rating: Number(review.rating),
      comments: review.comments,
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
