
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Dialog from '../dialog/Dialog';
import MovieForm from './MovieForm';
import type { Movie } from '../../types/Types';

const EditMovieForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movie = useLoaderData() as Movie;
  
  const handleClose = () => {
    const paramsString = searchParams.toString();
    navigate(`/${paramsString ? `?${paramsString}` : ''}`);
  };

  const handleSubmit = async (movieData: Partial<Movie>) => {
    try {
      console.log('Editing movie:', movieData);
      
      const response = await axios.put<Movie>('http://localhost:4000/movies', {...movie, ...movieData});
      const updatedMovie = response.data;
      
      console.log('Movie updated successfully:', updatedMovie);
      
      const paramsString = searchParams.toString();
      navigate(`/${updatedMovie.id}${paramsString ? `?${paramsString}` : ''}`);
      
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <Dialog title="Edit Movie" isOpen={true} onClose={handleClose}>
      <MovieForm onSubmit={handleSubmit} movie={movie}/>
    </Dialog>
  );
};

export default EditMovieForm;