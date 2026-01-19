import type { Movie } from "../../types/Types";
import React from "react";
import { IoMdClose } from "react-icons/io";
import ImageWithFallback from "../../utilities/ImageWithFallback";
import { useLoaderData, useOutletContext, useNavigate, type LoaderFunctionArgs } from "react-router-dom";

interface OutletContext {
  toggleMovieInfo: () => void;
  movieInfoTargetRef: React.RefObject<HTMLDivElement>;
}

const MovieInfo: React.FC = () => {
  const movie = useLoaderData() as Movie;
  const navigate = useNavigate();
  const context = useOutletContext<OutletContext>();
  
  context.movieInfoTargetRef.current?.focus();

  const handleClose = () => {

    const currentParams = new URLSearchParams(window.location.search);
    const paramsString = currentParams.toString();
    navigate(`/${paramsString ? `?${paramsString}` : ''}`);
  };

  if (!movie) {
    return <div>No movie data available.</div>;
  }
  

  return (
    <div className="movie-info" ref={context?.movieInfoTargetRef}>

      <div className="movie-info-header">
        <p>netflixroulette</p>
        <p className="movie-info__close" onClick={handleClose}><IoMdClose  /></p>
      </div>
      <section>
        <div>
          {<ImageWithFallback src={movie.poster_path} alt={movie.title} />}
        </div>
        <div>
          <h2>{movie.title} <span className="movie-info_rating">{movie.vote_average}</span></h2>
          <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
          <p className="red-text">{new Date(movie.release_date).getFullYear()} {Math.floor(movie.runtime/60)}h {movie.runtime%60}m</p>
          <p > </p>
          <p><strong>Overview:</strong> {movie.overview}</p>
        </div>
      </section>
  
    </div>
  );
};

export default MovieInfo;

export const loadMovieInfo = ({ params }: LoaderFunctionArgs): Promise<Movie> => {
  const movieId = params.movieId as string;
  return fetch(`http://localhost:4000/movies/${movieId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data: Movie) => data);
}