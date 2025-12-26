import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import MovieInfo, { loadMovieInfo } from './components/movie/MovieInfo.tsx'
import AddMovieForm from './components/movieForm/AddMovieForm.tsx'
import EditMovieForm, { loadMovieToEdit } from './components/movieForm/EditMovieForm.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/new',
        element: <AddMovieForm />,
      },
      {
        path: '/:movieId',
        element: <MovieInfo />,
        loader: loadMovieInfo
      },
      {
        path: '/:movieId/edit',
        element: <EditMovieForm />,
        loader: loadMovieToEdit
      }
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
