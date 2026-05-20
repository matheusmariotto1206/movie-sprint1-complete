import { useQuery } from '@tanstack/react-query';
import { movieService } from '../services/movieService';

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: () => movieService.getAll(),
  });
};

export const useMovie = (id) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieService.getById(id),
    enabled: !!id,
  });
};

export const useMovieReviews = (movieId) => {
  return useQuery({
    queryKey: ['movieReviews', movieId],
    queryFn: () => movieService.getReviews(movieId),
    enabled: !!movieId,
  });
};
