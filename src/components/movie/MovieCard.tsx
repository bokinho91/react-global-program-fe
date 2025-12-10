import React, { useState, useRef, useEffect } from "react";
import type { Movie } from "../../types/Types";
import { BsThreeDotsVertical } from "react-icons/bs";

interface MovieCardProps {
  movie: Movie;
  onEdit?: (movie: Movie) => void;
  onDelete?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onEdit, onDelete, onSelectMovie }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    if (onEdit) {
      onEdit(movie);
    }
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (onDelete) {
      onDelete(movie);
    }
  };

  return (
    <div className="movie-card" onClick={() => onSelectMovie && onSelectMovie(movie)}>
      <div className="movie-menu-container" ref={menuRef}>
        <button 
          className="movie-dots-menu" 
          onClick={handleToggleMenu}
          aria-label="Movie options"
        >
          <BsThreeDotsVertical />
        </button>
        
        {isMenuOpen && (
          <div className="movie-context-menu">
            <button onClick={handleEdit} className="menu-item">
              Edit
            </button>
            <button onClick={handleDelete} className="menu-item">
              Delete
            </button>
          </div>
        )}
      </div>

      <div>
        <img 
          src={movie.poster_path} 
          alt={movie.title}
        />
      </div>
      <h3>{movie.title}</h3>
      <p className="movie-card-genres-release">
        <span>{movie.genres.join(", ")}</span>
        <span>{new Date(movie.release_date).getFullYear()}</span>
      </p>
    </div>
  );
}

export default MovieCard;