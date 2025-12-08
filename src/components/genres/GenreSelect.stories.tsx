import type { Meta, StoryObj } from '@storybook/react-vite';
import GenreList from './GenresList';
import {  userEvent, within } from '@storybook/testing-library';
import { expect, fn } from '@storybook/test';


const meta = {
  title: 'Components/GenreSelect',
  component: GenreList,
  args: {
    genreList: ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance'],
    selectedGenre: '',
    onSelect: () => {},
  },
} satisfies Meta<typeof GenreList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedGenre: 'All',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const allButton = canvas.getByRole('button', { name: /All/i });
    
    expect(allButton).toHaveAttribute('style');
    expect(allButton.style.backgroundColor).toBe('red');
  },
};

export const WithSelectedGenre: Story = {
  args: {
    selectedGenre: 'Comedy',
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const comedyButton = canvas.getByRole('button', { name: /Comedy/i });
    const actionButton = canvas.getByRole('button', { name: /Action/i });
    
    await user.click(comedyButton);
    expect(comedyButton.style.backgroundColor).toBe('red');
    expect(actionButton.style.backgroundColor).not.toBe('red');
  },
};

export const ClickToSelectGenre: Story = {
  args: {
    selectedGenre: '',
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const dramaButton = canvas.getByRole('button', { name: /Drama/i });
    
    await user.click(dramaButton);
    expect(args.onSelect).toHaveBeenCalledWith('Drama');
    expect(args.onSelect).toHaveBeenCalledTimes(1);
  },
};

export const ClickMultipleGenres: Story = {
  args: {
    selectedGenre: 'Action',
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    
    const comedyButton = canvas.getByRole('button', { name: /Comedy/i });
    await user.click(comedyButton);
    
    const horrorButton = canvas.getByRole('button', { name: /Horror/i });
    await user.click(horrorButton);
    
    expect(args.onSelect).toHaveBeenCalledTimes(2);
    expect(args.onSelect).toHaveBeenNthCalledWith(1, 'Comedy');
    expect(args.onSelect).toHaveBeenNthCalledWith(2, 'Horror');
  },
};

export const EmptyGenreList: Story = {
  args: {
    genreList: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  },
};

export const NoSelectedGenre: Story = {
  args: {
    selectedGenre: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button.style.backgroundColor).not.toBe('red');
    });
  },
};

export const SingleGenre: Story = {
  args: {
    genreList: ['Action'],
    selectedGenre: 'Action',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].style.backgroundColor).toBe('red');
  },
};

export const SelectFirstGenre: Story = {
  args: {
    selectedGenre: 'All',
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const allButton = canvas.getByRole('button', { name: /All/i });
    
    expect(allButton.style.backgroundColor).toBe('red');
    await user.click(allButton);
    expect(args.onSelect).toHaveBeenCalledWith('All');
  },
};

export const SelectLastGenre: Story = {
  args: {
    selectedGenre: 'Romance',
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const romanceButton = canvas.getByRole('button', { name: /Romance/i });
    
    expect(romanceButton.style.backgroundColor).toBe('red');
    await user.click(romanceButton);
    expect(args.onSelect).toHaveBeenCalledWith('Romance');
  },
};

export const AllGenresRendered: Story = {
  args: {
    genreList: ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance'],
    selectedGenre: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByRole('button', { name: /All/i })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /Action/i })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /Comedy/i })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /Drama/i })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /Horror/i })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /Romance/i })).toBeInTheDocument();
  },
};

export const ClickUnselectedGenre: Story = {
  args: {
    selectedGenre: 'Action',
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const actionButton = canvas.getByRole('button', { name: /Action/i });
    const comedyButton = canvas.getByRole('button', { name: /Comedy/i });
    
    // Action is selected (red background)
    expect(actionButton.style.backgroundColor).toBe('red');
    // Comedy is not selected (no red background)
    expect(comedyButton.style.backgroundColor).not.toBe('red');
    
    // Click Comedy (unselected genre)
    await user.click(comedyButton);
    expect(args.onSelect).toHaveBeenCalledWith('Comedy');
  },
};