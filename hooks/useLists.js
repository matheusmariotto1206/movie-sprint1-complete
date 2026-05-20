import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listService } from '../services/listService';

export const useLists = () => {
  return useQuery({
    queryKey: ['lists'],
    queryFn: listService.getAll,
  });
};

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => listService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => listService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => listService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useAddMovieToList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, movieId }) => listService.addMovie(listId, movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

export const useRemoveMovieFromList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, movieId }) => listService.removeMovie(listId, movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};
