import { describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import MovieForm from './MovieForm';


describe('MovieForm', () => {
  test('Edit form - should render input fields with initial values from props', () => {
    const initialMovie = {
        id: 27205,
        title: "Inception",
        tagline: "Your mind is the scene of the crime.",
        vote_average: 8.2,
        vote_count: 16798,
        release_date: "2010-07-14",
        poster_path: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
        overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
        budget: 160000000,
        revenue: 825532764,
        genres: [
        "Action",
        "Thriller",
        "Science Fiction",
        "Mystery",
        "Adventure"
        ],
        runtime: 148
        }

    render(<MovieForm movie={initialMovie} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText('Title *')).toHaveValue('Inception');

    initialMovie.genres.forEach((genre) => {
    expect(screen.getByText(genre)).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Runtime (minutes)')).toHaveValue(148);
    expect(screen.getByLabelText('Movie URL *')).toHaveValue('https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg');
    expect(screen.getByLabelText('Overview')).toHaveValue(initialMovie.overview);
    expect(screen.getByLabelText('Release Date *')).toHaveValue('2010-07-14');
  });

  test('New form - should render empty input fields', () => {
    render(<MovieForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText('Title *')).toHaveValue('');
    expect(screen.getByLabelText('Runtime (minutes)')).toHaveValue(0);
    expect(screen.getByLabelText('Movie URL *')).toHaveValue('');
    expect(screen.getByLabelText('Overview')).toHaveValue('');
    expect(screen.getByLabelText('Release Date *')).toHaveValue('');
  });

  test('should call onSubmit with correct data after filling the form and submitting', () => {
    const mockOnSubmit = jest.fn();
    render(<MovieForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'The Matrix' } });
    fireEvent.change(screen.getByLabelText('Release Date *'), { target: { value: '1999-03-31' } });
    fireEvent.change(screen.getByLabelText('Movie URL *'), { target: { value: 'https://example.com/matrix.jpg' } });
    fireEvent.change(screen.getByLabelText('Overview'), { target: { value: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.' } });
    fireEvent.change(screen.getByLabelText('Runtime (minutes)'), { target: { value: '136' } });

    fireEvent.change(screen.getByLabelText('Genres'), { target: { value: 'Action' } });
    const addGenreButton = screen.getByText('Add Genre');
    fireEvent.click(addGenreButton);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'The Matrix',
      release_date: '1999-03-31',
      poster_path: 'https://example.com/matrix.jpg',
      overview: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
      runtime: 136,
      genres: ['Action'],
    });
    
  });
});

