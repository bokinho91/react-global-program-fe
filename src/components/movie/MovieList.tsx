import React, {useState, useRef} from "react";
import type { Movie } from "../../types/Types";
import MovieCard from "./MovieCard";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SearchForm from "../searchForm/SearchForm";


interface MovieListProps {
  movies: Movie[];
  oneEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
  initialQuery: string;
  onSearch: (query: string) => void;
}

const MovieList: React.FC<MovieListProps> = (
  { movies, 
    oneEditMovie, 
    onDeleteMovie, 
    initialQuery, 
    onSearch }) => {
    
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const movieInfoTargetRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const [isMovieInfoVisible, setIsMovieInfoVisible] = useState(false);
    const location = useLocation();

    const selectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    
    // Preserve search params when navigating to movie detail
    const currentParams = new URLSearchParams(location.search);
    const paramsString = currentParams.toString();
    navigate(`/${movie.id}${paramsString ? `?${paramsString}` : ''}`);
    
    if (movieInfoTargetRef.current) {
      movieInfoTargetRef.current.scrollIntoView({
        behavior: 'smooth', 
        block: 'start',
      });
    }
  }

    const toggleMovieInfo = () => {
      setIsMovieInfoVisible(!isMovieInfoVisible);
    }
  return (
    <>
     {location.pathname === '/' && <><span>SEARCH</span>
     <SearchForm initialQuery={initialQuery} onSearch={onSearch} /></>}

     <Outlet context={
      { selectedMovie, 
        toggleMovieInfo, 
        movieInfoTargetRef }} 
      />


    <div className="movie-card-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onEdit={oneEditMovie} onDelete={onDeleteMovie} onSelectMovie={selectMovie} />
        ))}
    </div>
    </>
      
  );
}

export default MovieList;