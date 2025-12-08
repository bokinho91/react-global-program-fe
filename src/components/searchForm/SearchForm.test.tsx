import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SearchForm from './SearchForm';

describe('search form', () => {
  test('should render input with initial value from props', () => {
    render(<SearchForm initialQuery="" onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('What do you want to watch?');
    expect(input).toHaveValue('');
  });

  test('calls onSearch with correct value after typing and clicking Submit button', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();
    render(<SearchForm initialQuery="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('What do you want to watch?');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Inception');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('Inception');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  test('calls onSearch with correct value after typing and pressing Enter key', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();
    render(<SearchForm initialQuery="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('What do you want to watch?');

    await user.type(input, 'The Matrix{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('The Matrix');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});