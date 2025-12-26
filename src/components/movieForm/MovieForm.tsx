import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Movie } from "../../types/Types";

interface MovieFormProps {
  movie?: Partial<Movie>;
  onSubmit?: (movieData: Partial<Movie>) => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters'),
  release_date: Yup.string()
    .required('Release date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  poster_path: Yup.string()
    .required('Movie URL is required')
    .url('Must be a valid URL'),
  overview: Yup.string().required('Overview is required'),
  runtime: Yup.number()
    .min(0, 'Runtime must be positive')
    .integer('Runtime must be a whole number'),
  genres: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one genre is required'),
});

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSubmit }) => {
  const [genreInput, setGenreInput] = useState("");

  const formik = useFormik({
    initialValues: {
      title: movie?.title || "",
      release_date: movie?.release_date || "",
      poster_path: movie?.poster_path || "",
      overview: movie?.overview || "",
      runtime: movie?.runtime || 0,
      genres: movie?.genres || [],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Submitting form data:', values);
      onSubmit?.(values);
    },
  });

  const handleAddGenre = () => {
    if (genreInput.trim() && !formik.values.genres?.includes(genreInput.trim())) {
      formik.setFieldValue('genres', [...(formik.values.genres || []), genreInput.trim()]);
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    formik.setFieldValue(
      'genres',
      formik.values.genres?.filter(g => g !== genreToRemove) || []
    );
  };

  const handleReset = () => {
    formik.resetForm();
    setGenreInput("");
  };

  return (
    <form onSubmit={formik.handleSubmit} className="movie-form">
      <div>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter movie title"
        />
        {formik.touched.title && formik.errors.title && (
          <div className="error-message">{formik.errors.title}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="release_date">Release Date *</label>
        <input
          type="date"
          id="release_date"
          name="release_date"
          value={formik.values.release_date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.release_date && formik.errors.release_date && (
          <div className="error-message">{formik.errors.release_date}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="poster_path">Movie URL *</label>
        <input
          type="url"
          id="poster_path"
          name="poster_path"
          value={formik.values.poster_path}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="https://example.com/poster.jpg"
        />
        {formik.touched.poster_path && formik.errors.poster_path && (
          <div className="error-message">{formik.errors.poster_path}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="overview">Overview *</label>
        <textarea
          id="overview"
          name="overview"
          value={formik.values.overview}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={4}
          placeholder="Enter movie overview"
        />
        {formik.touched.overview && formik.errors.overview && (
          <div className="error-message">{formik.errors.overview}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="runtime">Runtime (minutes)</label>
        <input
          type="number"
          id="runtime"
          name="runtime"
          value={formik.values.runtime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          min="0"
          placeholder="0"
        />
        {formik.touched.runtime && formik.errors.runtime && (
          <div className="error-message">{formik.errors.runtime}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="genres">Genres *</label>
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
        {formik.touched.genres && formik.errors.genres && (
          <div className="error-message">{formik.errors.genres}</div>
        )}
        {formik.values.genres && formik.values.genres.length > 0 && (
          <div className="genres-list">
            {formik.values.genres.map((genre) => (
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