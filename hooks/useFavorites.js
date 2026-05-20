import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService, clearFavoriteListCache } from '../services/favoriteService';
import { notifyFavoriteAdded } from '../services/notificationService';

export const useFavorites = (userId, userName) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => favoriteService.getAll(userId, userName),
    enabled: !!userId,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, userName, movieId }) =>
      favoriteService.add(userId, userName, movieId),
    onSuccess: (_, { movieTitle }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      if (movieTitle) notifyFavoriteAdded(movieTitle);
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, userName, movieId }) =>
      favoriteService.remove(userId, userName, movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    onError: (err, { userId }) => {
      const msg = String(err?.message || '');
      if (msg.includes('404') || msg.includes('NoSuchElement') || msg.includes('não está')) {
        clearFavoriteListCache(userId);
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      }
    },
  });
};
