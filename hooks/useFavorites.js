import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';
import { notifyFavoriteAdded } from '../services/notificationService';

export const useFavorites = (userId) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => favoriteService.getAll(userId),
    enabled: !!userId,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, movieId }) => favoriteService.add(userId, movieId),
    onSuccess: (_, { movieTitle }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      if (movieTitle) notifyFavoriteAdded(movieTitle);
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, movieId }) => favoriteService.remove(userId, movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });
};
