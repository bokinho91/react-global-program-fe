import React, { useState } from "react";
import type { Movie } from "../../types/Types";

interface MovieFormProps {
  movie?: Partial<Movie>;
  onSubmit?: (movieData: Partial<Movie>) => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Movie>>({
    title: movie?.title || "",
    release_date: movie?.release_date || "",
    poster_path: movie?.poster_path || "",
    overview: movie?.overview || "",
    runtime: movie?.runtime || 0,
    genres: movie?.genres || [],
  });

  const [genreInput, setGenreInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'runtime' ? Number(value) : value
    }));
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genres?.includes(genreInput.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...(prev.genres || []), genreInput.trim()]
      }));
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres?.filter(g => g !== genreToRemove) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      title: "",
      release_date: "",
      poster_path: "",
      overview: "",
      runtime: 0,
      genres: [],
    });
    setGenreInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <div>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter movie title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="release_date">Release Date *</label>
        <input
          type="date"
          id="release_date"
          name="release_date"
          value={formData.release_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="poster_path">Movie URL *</label>
        <input
          type="url"
          id="poster_path"
          name="poster_path"
          value={formData.poster_path}
          onChange={handleChange}
          required
          placeholder="https://example.com/poster.jpg"
        />
      </div>

      <div className="form-group">
        <label htmlFor="overview">Overview</label>
        <textarea
          id="overview"
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          rows={4}
          placeholder="Enter movie overview"
        />
      </div>

      <div className="form-group">
        <label htmlFor="runtime">Runtime (minutes)</label>
        <input
          type="number"
          id="runtime"
          name="runtime"
          value={formData.runtime}
          onChange={handleChange}
          min="0"
          placeholder="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="genres">Genres</label>
        <div className="genre-input-wrapper">
          <input
            type="text"
            id="genres"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
            placeholder="Enter genre and press Add"
          />
          <button type="button" onClick={handleAddGenre}>Add Genre</button>
        </div>
        {formData.genres && formData.genres.length > 0 && (
          <div className="genres-list">
            {formData.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
                <button type="button" onClick={() => handleRemoveGenre(genre)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      </div>
      <div className="form-actions">
        <button type="button" onClick={handleReset}>Reset</button>
        <button type="submit">{movie ? 'Update' : 'Submit'}</button>
      </div>
    </form>
  );
}

export default MovieForm;