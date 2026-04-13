import { useState, useEffect } from 'react';
import { getTopMovies } from '../services/apexService';

export function useTopMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await getTopMovies();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  return { movies, loading, error, refetch: fetchMovies };
}
