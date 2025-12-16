
import { useEffect, useState, useMemo } from 'react'
import './App.css'
import Counter from './components/counter/Counter'
import SearchForm from './components/searchForm/SearchForm'
import type { Movie, MoviesResponse } from './types/Types'
import GenresList from './components/genres/GenresList'
import MovieList from './components/movie/MovieList'
import MovieInfo from './components/movie/MovieInfo'
import SortMovies from './components/movie/SortMovies'
import MovieForm from './components/movieForm/MovieForm'
import Dialog from './components/dialog/Dialog'

function App() {
const [selectedGenre, setSelectedGenre] = useState<string>('All');
const [uniqueGenres, setUniqueGenres] = useState<string[]>([]);
const [movieList, setMovieList] = useState<Movie[]>([]);
const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
const [isMovieInfoVisible, setIsMovieInfoVisible] = useState<boolean>(false);
const [sortBy, setSortBy] = useState<string>('release_date');
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);

function sortMovies(movies: Movie[], sortBy: string): Movie[] {
const sorted = [...movies];

if (sortBy === "release_date") {
  return sorted.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
}

if (sortBy === "title") {
  return sorted.sort((a, b) => a.title.localeCompare(b.title));
}

return sorted;
}

useEffect(() => {
  const fetchMovies = async () => {
    const response:MoviesResponse = await fetch(`http://localhost:4000/movies`).then(res=> res.json())
    const movies:Movie[] = response.data
    setMovieList(movies)
    const sortedDefault = movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    setFilteredMovies(sortedDefault)
  }
  fetchMovies();
    }, [])
    
  useEffect(() => {
    const fetchGenres = async () => {
      const movies:MoviesResponse = await fetch('http://localhost:4000/movies?limit=3000').then(res => res.json());
      const genres: string[] = movies.data.map((movie: { genres:  string[] }) => movie.genres).flat();
      const unique: string[] = Array.from(new Set(genres)) || [];
      setUniqueGenres(unique);
    };

    fetchGenres();
  }, [])

  const sortedMovies = useMemo(() => {
    return sortMovies(filteredMovies, sortBy);
  }, [filteredMovies, sortBy]);

  const onSelect = (selectedGenre: string) => {
    setSelectedGenre(selectedGenre);
    if (selectedGenre !== 'All') {
      const filtered = movieList.filter((movie) =>
        movie.genres.includes(selectedGenre)
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movieList);
    }
  } 

  const onSearch = async(query: string) => {
    try {
      const searchedMovies = movieList.filter((movie: { title: string }) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredMovies(searchedMovies)
      
    } catch (error) {
      console.error("Error fetching movies:", error)
    }
  }

  const onEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setIsEditModalOpen(true);
  };

  const onDeleteMovie = (movie: Movie) => {
    console.log("Delete movie with ID:", movie.id);
  };

  const handleUpdateMovie = async (movieData: Partial<Movie>) => {
    try {
      console.log("Update movie:", editingMovie?.id, movieData);
    
      setIsEditModalOpen(false);
      setEditingMovie(null);
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleAddMovie = async (movieData: Partial<Movie>) => {
    try {
      console.log("Add movie:", movieData);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const selectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsMovieInfoVisible(true);
  }

  const toggleMovieInfo = () => {
    setIsMovieInfoVisible(!isMovieInfoVisible);
  }

const handleSortChange = (newSortBy: string) => {
  setSortBy(newSortBy);
}



  return (
    <>
    <span>COUNTER</span>
     <Counter initialValue={0} />

     <div className="movie-app-container">
      <section><button onClick={() => setIsModalOpen(true)}>Add Movie</button></section>
      
      {/* Add Movie Dialog */}
      <Dialog title='Add Movie' isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MovieForm onSubmit={handleAddMovie} />
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog title='Edit Movie' isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {editingMovie && <MovieForm movie={editingMovie} onSubmit={handleUpdateMovie} />}
      </Dialog>

     <span>SEARCH</span>
     <SearchForm initialQuery="" onSearch={onSearch} />
     {selectedMovie && isMovieInfoVisible && <MovieInfo movie={selectedMovie} onClose={toggleMovieInfo} />}
     <span>GENRES</span>
      <div>
        <GenresList genreList={['All', ...uniqueGenres]} selectedGenre={selectedGenre} onSelect={onSelect} />
        <SortMovies  handleSortChange={handleSortChange} />
      </div>
     <span><strong>{filteredMovies.length}</strong> movies found</span>
     <span><strong>{sortedMovies.length}</strong> movies found</span>
     <MovieList onSelectMovie={selectMovie} movies={sortedMovies} oneEditMovie={onEditMovie} onDeleteMovie={onDeleteMovie} />
    </div>
    </>
  )
}

export default App
