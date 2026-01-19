import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Dialog from '../dialog/Dialog';
import MovieForm from './MovieForm';
import type { Movie } from '../../types/Types';

const AddMovieForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleClose = () => {
    // Preserve search params when closing
    const paramsString = searchParams.toString();
    navigate(`/${paramsString ? `?${paramsString}` : ''}`);
  };

  const handleSubmit = async (movieData: Partial<Movie>) => {
    try {
      console.log('Adding new movie:', movieData);
      const response = await axios.post<Movie>('http://localhost:4000/movies', movieData);
      const newMovie = response.data;
      
      console.log('Movie created successfully:', newMovie);
      
      const paramsString = searchParams.toString();
      navigate(`/${newMovie.id}${paramsString ? `?${paramsString}` : ''}`);
      
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <Dialog title="Add Movie" isOpen={true} onClose={handleClose}>
      <MovieForm onSubmit={handleSubmit} />
    </Dialog>
  );
};

export default AddMovieForm;
