import type { LoaderFunctionArgs } from 'react-router-dom';
import type { Movie } from '../../types/Types';

export const loadMovieToEdit = ({ params }: LoaderFunctionArgs): Promise<Movie> => {
  const movieId = params.movieId as string;
  return fetch(`http://localhost:4000/movies/${movieId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data: Movie) => data);
};
