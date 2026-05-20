import { useQuery } from '@tanstack/react-query';
import { getTopMovies } from '../services/apexService';

export const useTopMovies = () => {
  return useQuery({
    queryKey: ['apex', 'top-movies'],
    queryFn: getTopMovies,
    retry: 1,
    staleTime: 60_000,
  });
};
