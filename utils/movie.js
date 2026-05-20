export const getMovieTitle = (movie) => movie?.title || movie?.titulo || 'Sem título';
export const getMovieGenre = (movie) => movie?.genre || movie?.genero || '';
export const getMovieYear = (movie) => movie?.releaseDate || movie?.ano || '';
export const getMoviePoster = (movie) => movie?.posterUrl || movie?.poster_url || null;
