import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import MovieInfo, { loadMovieInfo } from './components/movie/MovieInfo.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{
      path: '/:movieId',
      element: <MovieInfo />,
      loader: loadMovieInfo
    }],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
