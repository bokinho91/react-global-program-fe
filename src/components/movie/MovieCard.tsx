import React from "react";
import type { Movie } from "../../types/Types";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <div>
        <img 
          src={movie.poster_path} 
          alt={movie.title}
        />
      </div>
      <h3>{movie.title}</h3>
      <div className="movie-info">
        <span>{movie.genres.join(", ")}</span>
        <span>{new Date(movie.release_date).getFullYear()}</span>
      </div>

    </div>
  );
}

export default MovieCard;