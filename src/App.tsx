
import { useEffect, useState } from 'react'
import './App.css'
import Counter from './components/counter/Counter'
import SearchForm from './components/SerchForm'
import type { MoviesResponse } from './types/Types'
import GenresList from './components/genres/GenresList'


function App() {
const [selectedGenre, setSelectedGenre] = useState<string>('All');
const [uniqueGenres, setUniqueGenres] = useState<string[]>([]);
  const onSelect = (selectedGenre: string) => {
    setSelectedGenre(selectedGenre);
    console.log("Selected genre:", selectedGenre)
  } 


  const onSearch = async(query: string) => {
    try {
      const movies = await fetch(`http://localhost:4000/movies`).then(res=> res.json())

      const searchedMovie = movies.data.filter((movie: { title: string }) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      )
      console.log("Fetched Movies:", movies)
      console.log("Searched Movie:", searchedMovie)
    } catch (error) {
      console.error("Error fetching movies:", error)
    }
  }

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

  return (
    <>
    <span>COUNTER</span>
     <Counter initialValue={0} />
     <span>SEARCH</span>
     <SearchForm initialQuery="" onSearch={onSearch} />
     <span>GENRES</span>
     <GenresList genreList={['All', ...uniqueGenres]} selectedGenre={selectedGenre} onSelect={onSelect} />
    </>
  )
}

export default App
