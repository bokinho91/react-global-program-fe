
import { useEffect, useState, useMemo, useCallback, useRef} from 'react'
import axios from 'axios'
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
const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
const [isMovieInfoVisible, setIsMovieInfoVisible] = useState<boolean>(false);
const [sortBy, setSortBy] = useState<string>('release_date');
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [searchedQuery, setSearchedQuery] = useState<string>("");
const movieInfoTargetRef = useRef<HTMLDivElement>(null);

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
    console.log("Fetching movies with sortBy:", sortBy, "and searchedQuery:", searchedQuery, "and selectedGenre:", selectedGenre);
    
    const params: { [key: string]: string } = {
      sortBy: sortBy || 'release_date'
    };
    
    // If a genre is selected, filter by genre
    if (selectedGenre !== 'All') {
      params.filter = selectedGenre;
      params.searchBy = 'genres';
    }
    
    // If there's a search query, add it to params
    if (searchedQuery) {
      params.search = searchedQuery;
      params.searchBy = 'title';
    }
    
    console.log("API params:", params);
    const response:MoviesResponse = await axios.get(`http://localhost:4000/movies`, {params}).then(res=> res.data)
    const movies:Movie[] = response.data
    console.log("Received movies:", movies.length);
    setFilteredMovies(movies)
  }
  fetchMovies();
    }, [searchedQuery,sortBy, selectedGenre])
    
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
    console.log("Selected genre:", selectedGenre);
  } 

  const onSearch = async(query: string) => {
    setSearchedQuery(query);
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

  const handleCloseAddModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const selectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsMovieInfoVisible(true);
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
      <Dialog title='Add Movie' isOpen={isModalOpen} onClose={handleCloseAddModal}>
        <MovieForm onSubmit={handleAddMovie} />
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog title='Edit Movie' isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        {editingMovie && <MovieForm movie={editingMovie} onSubmit={handleUpdateMovie} />}
      </Dialog>

     <span>SEARCH</span>
     <SearchForm initialQuery="" onSearch={onSearch} />
     {selectedMovie && isMovieInfoVisible && <MovieInfo ref={movieInfoTargetRef} movie={selectedMovie} onClose={toggleMovieInfo} />}
     <span>GENRES</span>
      <div>
        <GenresList genreList={['All', ...uniqueGenres]} selectedGenre={selectedGenre} onSelect={onSelect} />
        <SortMovies  handleSortChange={handleSortChange} />
      </div>
     <span><strong>{filteredMovies.length}</strong> movies found</span>
     <MovieList onSelectMovie={selectMovie} movies={sortedMovies} oneEditMovie={onEditMovie} onDeleteMovie={onDeleteMovie} />
    </div>
    </>
  )
}

export default App
