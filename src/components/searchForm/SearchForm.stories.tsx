
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/test';
import SearchForm from './SearchForm';
import { fn } from '@storybook/test';


const meta = {
  title: 'Components/SearchForm',
  component: SearchForm,
  args: {
    initialQuery: "",
  },
} satisfies Meta<typeof SearchForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchMovie: Story = {
  args: {
    initialQuery: '',
    onSearch: fn().mockResolvedValue({data:[{title: 'Inception'}]}),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('What do you want to watch?');
    const searchButton = canvas.getByRole('button', { name: /search/i });

    await user.type(input, 'Inception');
    await user.click(searchButton);

    expect(await canvas.findAllByDisplayValue('Inception')).toHaveLength(1);

    expect(args.onSearch).toHaveBeenCalledTimes(1);

    expect(args.onSearch).toHaveBeenCalledWith('Inception');


    const result = await (args.onSearch as ReturnType<typeof fn>).mock.results[0].value;
    expect(result).toEqual({data:[{title: 'Inception'}]});  },
};

export const SearchByEnterKey: Story = {
  args: {
    initialQuery: '',
    onSearch: () => {},
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('What do you want to watch?');

    await user.type(input, 'The Matrix{Enter}');
  },
};

export const WithInitialQuery: Story = {
  args: {
    initialQuery: 'Star Wars',
    onSearch: () => {},
  },
};

export const ClearAndSearch: Story = {
  args: {
    initialQuery: 'Initial text',
    onSearch: () => {},
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('What do you want to watch?');
    const searchButton = canvas.getByRole('button', { name: /search/i });

    await user.clear(input);
    await user.type(input, 'New search');
    await user.click(searchButton);
  },
}

export const TypeWithoutSearching: Story = {
  args: {
    initialQuery: '',
    onSearch: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('What do you want to watch?');

    await user.type(input, 'Just typing');
    // No search action performed
    expect(args.onSearch).not.toHaveBeenCalled();
  },
};

export const PressNonEnterKey: Story = {
  args: {
    initialQuery: '',
    onSearch: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('What do you want to watch?');

    await user.type(input, 'Test');
    await user.keyboard('{Escape}');
    // Tests the else branch in handleKeyPress when key !== 'Enter'
    expect(args.onSearch).not.toHaveBeenCalled();
  },
};

export const EmptySearch: Story = {
  args: {
    initialQuery: '',
    onSearch: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const searchButton = canvas.getByRole('button', { name: /search/i });

    await user.click(searchButton);
    // Tests searching with empty string
    expect(args.onSearch).toHaveBeenCalledWith('');
  },
};

export const SearchWithInitialValue: Story = {
  args: {
    initialQuery: 'Avatar',
    onSearch: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const searchButton = canvas.getByRole('button', { name: /search/i });

    // Search without typing - uses initial query value
    await user.click(searchButton);
    expect(args.onSearch).toHaveBeenCalledWith('Avatar');
  },
};

export const EnterKeyWithInitialValue: Story = {
  args: {
    initialQuery: 'Matrix',
    onSearch: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('What do you want to watch?');

    // Press Enter without typing - uses initial query value
    await user.click(input);
    await user.keyboard('{Enter}');
    expect(args.onSearch).toHaveBeenCalledWith('Matrix');
  },
};
