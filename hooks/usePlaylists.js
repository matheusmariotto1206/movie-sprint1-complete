import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '../services/playlistService';

export const usePlaylists = () => {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: () => playlistService.getAll(),
  });
};

export const usePlaylist = (id) => {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: () => playlistService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (list) => playlistService.create(list),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
  });
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...list }) => playlistService.update(id, list),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
  });
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => playlistService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
  });
};

export const useAddMovieToList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, movieId }) => playlistService.addMovie(listId, movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
  });
};

export const useRemoveMovieFromList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, movieId }) => playlistService.removeMovie(listId, movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
  });
};
