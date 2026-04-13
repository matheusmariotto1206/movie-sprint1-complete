import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, movieId }) => favoriteService.remove(userId, movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });
};
