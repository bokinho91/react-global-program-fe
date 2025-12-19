import type { Movie } from "../../types/Types";
import React from "react";
import { IoMdClose } from "react-icons/io";
import ImageWithFallback from "../../utilities/ImageWithFallback";

interface MovieInfoProps {
  movie: Movie;
  onClose: () => void;
  ref: React.Ref<HTMLDivElement>;
}

const MovieInfo: React.FC<MovieInfoProps> = ({movie, onClose, ref}) => {
  return (
    <div className="movie-info" ref={ref}>

      <div className="movie-info-header">
        <p>netflixroulette</p>
        <p className="movie-info__magnifier" onClick={onClose}><IoMdClose  /></p>
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