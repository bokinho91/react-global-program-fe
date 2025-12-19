import type { Meta, StoryObj } from '@storybook/react';
import { fn, expect, userEvent, within } from '@storybook/test';
import MovieForm from './MovieForm';


const meta = {
  title: 'Components/MovieForm',
  component: MovieForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MovieForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: fn(),
  },
};

// Edit mode with all fields populated
export const EditMode: Story = {
  args: {
    movie: {
      id: 1,
      title: 'The Shawshank Redemption',
      release_date: '1994-09-23',
      poster_path: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      runtime: 142,
      genres: ['Drama', 'Crime'],
      vote_average: 8.7,
    },
    onSubmit: fn(),
  },
};

// Partial data in edit mode
export const PartialData: Story = {
  args: {
    movie: {
      title: 'Inception',
      release_date: '2010-07-16',
      poster_path: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    },
    onSubmit: fn(),
  },
};

// Form with long overview text
export const LongOverview: Story = {
  args: {
    movie: {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      release_date: '2001-12-19',
      poster_path: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      overview: 'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed. This is an extremely long overview to test how the form handles lengthy text content in the textarea field.',
      runtime: 178,
      genres: ['Adventure', 'Fantasy', 'Action'],
    },
    onSubmit: fn(),
  },
};

// Multiple genres
export const ManyGenres: Story = {
  args: {
    movie: {
      title: 'Everything Everywhere All at Once',
      release_date: '2022-03-25',
      poster_path: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
      genres: ['Action', 'Adventure', 'Comedy', 'Science Fiction', 'Fantasy', 'Thriller'],
      runtime: 139,
    },
    onSubmit: fn(),
  },
};

// Test form submission with valid data
export const SubmitValidForm: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Fill out the form
    await user.type(canvas.getByLabelText(/title/i), 'The Matrix');
    await user.type(canvas.getByLabelText(/release date/i), '1999-03-31');
    await user.type(canvas.getByLabelText(/movie url/i), 'https://example.com/matrix.jpg');
    await user.type(canvas.getByLabelText(/overview/i), 'A computer hacker learns about the true nature of reality.');
    await user.clear(canvas.getByLabelText(/runtime/i));
    await user.type(canvas.getByLabelText(/runtime/i), '136');

    // Add genres
    const genreInput = canvas.getByPlaceholderText(/enter genre/i);
    await user.type(genreInput, 'Action');
    await user.click(canvas.getByRole('button', { name: /add genre/i }));
    
    await user.type(genreInput, 'Science Fiction');
    await user.click(canvas.getByRole('button', { name: /add genre/i }));

    // Submit form
    await user.click(canvas.getByRole('button', { name: /submit/i }));

    // Verify onSubmit was called with correct data
    await expect(args.onSubmit).toHaveBeenCalledWith({
      title: 'The Matrix',
      release_date: '1999-03-31',
      poster_path: 'https://example.com/matrix.jpg',
      overview: 'A computer hacker learns about the true nature of reality.',
      runtime: 136,
      genres: ['Action', 'Sci-Fi'],
    });
  },
};

// Test adding genre
export const AddGenre: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    const genreInput = canvas.getByPlaceholderText(/enter genre/i);
    await user.type(genreInput, 'Horror');
    await user.click(canvas.getByRole('button', { name: /add genre/i }));

    // Verify genre appears in the list
    await expect(canvas.getByText('Horror')).toBeInTheDocument();
    // Input should be cleared
    await expect(genreInput).toHaveValue('');
  },
};

// Test adding genre with Enter key
export const AddGenreWithEnterKey: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    const genreInput = canvas.getByPlaceholderText(/enter genre/i);
    await user.type(genreInput, 'Comedy{Enter}');

    await expect(canvas.getByText('Comedy')).toBeInTheDocument();
    await expect(genreInput).toHaveValue('');
  },
};

// Test removing genre
export const RemoveGenre: Story = {
  args: {
    movie: {
      title: 'Test Movie',
      genres: ['Action', 'Drama', 'Thriller'],
    },
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Find and click the × button for "Drama"
    const dramaTag = canvas.getByText('Drama').closest('.genre-tag');
    const removeButton = within(dramaTag).getByRole('button', { name: '×' });
    await user.click(removeButton);

    // Drama should be removed
    await expect(canvas.queryByText('Drama')).not.toBeInTheDocument();
    // Others should still exist
    await expect(canvas.getByText('Action')).toBeInTheDocument();
    await expect(canvas.getByText('Thriller')).toBeInTheDocument();
  },
};

// Test duplicate genre prevention
export const PreventDuplicateGenre: Story = {
  args: {
    movie: {
      genres: ['Action'],
    },
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    const genreInput = canvas.getByPlaceholderText(/enter genre/i);
    
    // Try to add "Action" again
    await user.type(genreInput, 'Action');
    await user.click(canvas.getByRole('button', { name: /add genre/i }));

    // Should only have one "Action" tag
    const actionTags = canvas.getAllByText('Action');
    await expect(actionTags).toHaveLength(1);
  },
};

// Test reset button
export const ResetForm: Story = {
  args: {
    movie: {
      title: 'Test Movie',
      release_date: '2023-01-01',
      genres: ['Action', 'Drama'],
    },
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Click reset button
    await user.click(canvas.getByRole('button', { name: /reset/i }));

    // All fields should be cleared
    await expect(canvas.getByLabelText(/title/i)).toHaveValue('');
    await expect(canvas.getByLabelText(/release date/i)).toHaveValue('');
    await expect(canvas.queryByText('Action')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Drama')).not.toBeInTheDocument();
  },
};

// Test update button text in edit mode
export const UpdateButtonText: Story = {
  args: {
    movie: {
      title: 'Existing Movie',
    },
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Should show "Update" instead of "Submit"
    await expect(canvas.getByRole('button', { name: /update/i })).toBeInTheDocument();
  },
};

// Test required fields validation (browser native)
export const RequiredFields: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify required attribute on fields
    const titleInput = canvas.getByLabelText(/title/i);
    const dateInput = canvas.getByLabelText(/release date/i);
    const urlInput = canvas.getByLabelText(/movie url/i);
    
    await expect(titleInput).toBeRequired();
    await expect(dateInput).toBeRequired();
    await expect(urlInput).toBeRequired();
  },
};

// Test runtime number input
export const RuntimeInput: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    const runtimeInput = canvas.getByLabelText(/runtime/i);
    
    // Clear and add a number
    await user.clear(runtimeInput);
    await user.type(runtimeInput, '120');
    
    await expect(runtimeInput).toHaveValue(120);
  },
};