const API_KEY = '7b6443e4bf25a988fa8244295962cf11';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


const formatMovieData = (movie) => ({
  id: `movie-${movie.id}`,
  title: movie.title || movie.name,
  type: 'Filme',
  genre: movie.genre_ids?.[0] ? getGenreName(movie.genre_ids[0]) : 'Geral',
  description: movie.overview || 'Sem descrição disponível',
  rating: movie.vote_average || 0,
  poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
  image: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
  releaseDate: movie.release_date,
  runtime: movie.runtime,
});

const formatTVData = (tv) => ({
  id: `tv-${tv.id}`,
  title: tv.name || tv.original_name,
  type: 'Série',
  genre: tv.genre_ids?.[0] ? getGenreName(tv.genre_ids[0]) : 'Geral',
  description: tv.overview || 'Sem descrição disponível',
  rating: tv.vote_average || 0,
  poster: tv.poster_path ? `${IMAGE_BASE_URL}${tv.poster_path}` : null,
  image: tv.backdrop_path ? `${IMAGE_BASE_URL}${tv.backdrop_path}` : null,
  releaseDate: tv.first_air_date,
  seasons: tv.number_of_seasons,
  episodes: tv.number_of_episodes,
});

// Mapeamento de gêneros
const getGenreName = (genreId) => {
  const genres = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Western'
  };
  return genres[genreId] || 'Geral';
};

// Buscar filmes populares
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results.map(formatMovieData);
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    throw error;
  }
};

// Buscar séries populares
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results.map(formatTVData);
  } catch (error) {
    console.error('Erro ao buscar séries populares:', error);
    throw error;
  }
};


export const searchMovies = async (query) => {
  try {
    if (!query || query.trim().length < 3) {
      return [];
    }

    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results.map(formatMovieData);
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    throw error;
  }
};


export const searchTVShows = async (query) => {
  try {
    if (!query || query.trim().length < 3) {
      return [];
    }

    const response = await fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results.map(formatTVData);
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
    throw error;
  }
};


export const getMovieDetails = async (movieId) => {
  try {
    const numericId = movieId.toString().replace('movie-', '');
    const response = await fetch(
      `${BASE_URL}/movie/${numericId}?api_key=${API_KEY}&language=pt-BR`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return formatMovieData(data);
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    throw error;
  }
};


export const getTVShowDetails = async (tvId) => {
  try {
    const numericId = tvId.toString().replace('tv-', '');
    const response = await fetch(
      `${BASE_URL}/tv/${numericId}?api_key=${API_KEY}&language=pt-BR`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return formatTVData(data);
  } catch (error) {
    console.error('Erro ao buscar detalhes da série:', error);
    throw error;
  }
};


export const searchMulti = async (query) => {
  try {
    if (!query || query.trim().length < 3) {
      return [];
    }

    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(item => {
        if (item.media_type === 'movie') {
          return formatMovieData(item);
        } else {
          return formatTVData(item);
        }
      });
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    throw error;
  }
};


export const getImageUrl = (path) => {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
};