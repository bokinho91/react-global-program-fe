import React from "react";
import type { Movie } from "../../types/Types";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
      
    <div className="movie-card-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
    </div>
  );
}

export default MovieList;