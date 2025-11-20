
import { useEffect, useState } from 'react'
import './App.css'
import Counter from './components/counter/Counter'
import SearchForm from './components/SerchForm'
import type { Movie, MoviesResponse } from './types/Types'
import GenresList from './components/genres/GenresList'
import MovieList from './components/movie/MovieList'


function App() {
const [selectedGenre, setSelectedGenre] = useState<string>('All');
const [uniqueGenres, setUniqueGenres] = useState<string[]>([]);
const [movieList, setMovieList] = useState<Movie[]>([]);
const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

useEffect(() => {
  const fetchMovies = async () => {
    const response:MoviesResponse = await fetch(`http://localhost:4000/movies`).then(res=> res.json())
    const movies:Movie[] = response.data
    setMovieList(movies)
    setFilteredMovies(movies)
  }
  fetchMovies();
    }, [])
    
    useEffect(() => {
      const fetchGenres = async () => {
        const movies:MoviesResponse = await fetch('http://localhost:4000/movies?limit=3000').then(res => res.json());
        const genres: string[] = movies.data.map((movie: { genres:  string[] }) => movie.genres).flat();
        const unique: string[] = Array.from(new Set(genres)) || [];
        setUniqueGenres(unique);
        console.log('Genres fetched', unique);
      };
  
      fetchGenres();
    }, [])


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
    console.log("Selected genre:", selectedGenre)
  } 

  const onSearch = async(query: string) => {
    try {
      const searchedMovies = movieList.filter((movie: { title: string }) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredMovies(searchedMovies)
      
      console.log("Searched Movies:", searchedMovies)
    } catch (error) {
      console.error("Error fetching movies:", error)
    }
  }

  


  return (
    <>
    <span>COUNTER</span>
     <Counter initialValue={0} />
     <span>SEARCH</span>
     <SearchForm initialQuery="" onSearch={onSearch} />
     <span>GENRES</span>
     <GenresList genreList={['All', ...uniqueGenres]} selectedGenre={selectedGenre} onSelect={onSelect} />
     <span><strong>{filteredMovies.length}</strong> movies found</span>
     <MovieList movies={filteredMovies} />
    </>
  )
}

export default App
