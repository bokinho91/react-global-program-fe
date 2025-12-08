import React from "react";
import type { Movie } from "../../types/Types";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  oneEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, oneEditMovie, onDeleteMovie, onSelectMovie}) => {
  return (
      
    <div className="movie-card-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onEdit={oneEditMovie} onDelete={onDeleteMovie} onSelectMovie={onSelectMovie} />
        ))}
    </div>
  );
}

export default MovieList;