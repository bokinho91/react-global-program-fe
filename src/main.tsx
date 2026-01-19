import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import MovieInfo from './components/movie/MovieInfo.tsx'
import { loadMovieInfo } from './components/movie/movieLoader.ts'
import AddMovieForm from './components/movieForm/AddMovieForm.tsx'
import EditMovieForm from './components/movieForm/EditMovieForm.tsx'
import { loadMovieToEdit } from './components/movieForm/movieFormLoader.ts'

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
