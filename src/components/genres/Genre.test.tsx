import { describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenresList from './GenresList';
import '@testing-library/jest-dom';

describe('GenresList', () => {
  const genres = ['Action', 'Comedy', 'Drama', 'Thriller'];

  test('should render all genres passed in props', () => {
    render(<GenresList genreList={genres} selectedGenre="" onSelect={jest.fn()} />);

    const renderedGenres = genres.map(g => screen.getByText(g));
    expect(renderedGenres).toHaveLength(4);
    expect(renderedGenres).toEqual([
      expect.objectContaining({ textContent: 'Action' }),
      expect.objectContaining({ textContent: 'Comedy' }),
      expect.objectContaining({ textContent: 'Drama' }),
      expect.objectContaining({ textContent: 'Thriller' }),
    ]);
  });

  test('should highlight selected genre passed in props', () => {
    render(<GenresList genreList={genres} selectedGenre="Comedy" onSelect={jest.fn()} />);

    const comedyButton = screen.getByRole('button', { name: 'Comedy' });
    const actionButton = screen.getByRole('button', { name: 'Action' });

    expect(comedyButton).toHaveStyle({ backgroundColor: 'red' });
    expect(actionButton).toHaveStyle({ backgroundColor: expect.not.stringContaining('red') });
  });

  test('should call onChange with correct genre after clicking genre button', async () => {
    const mockOnSelect = jest.fn();
    render(<GenresList genreList={genres} selectedGenre="" onSelect={mockOnSelect} />);

    const button = screen.getByText("Comedy");  
    fireEvent.click(button);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith("Comedy");

  });
});