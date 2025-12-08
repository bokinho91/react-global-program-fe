import SortMovies from "./SortMovies"
import type { Meta, StoryObj} from "@storybook/react-vite"
import { expect, fn, userEvent, within } from '@storybook/test';

const meta = {
  title: 'Components/Movie/SortMovies',
  component: SortMovies,
  args: {
    handleSortChange: () => {},
  },
} satisfies Meta<typeof SortMovies>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handleSortChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox') as HTMLSelectElement;
    
    expect(select.value).toBe('release_date');
    
    const selectedOption = canvas.getByRole('option', { name: /Release Date/i }) as HTMLOptionElement;
    expect(selectedOption.selected).toBe(true);
    
    expect(args.handleSortChange).not.toHaveBeenCalled();
  },
};

export const ChangeSortToTitle: Story = {
  args: {
    handleSortChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox');
    
    await user.selectOptions(select, 'title');
    await user.selectOptions(select, 'release_date');
    await user.selectOptions(select, 'title');
    
    expect(args.handleSortChange).toHaveBeenCalledWith('title');
    expect(args.handleSortChange).toHaveBeenCalledTimes(3);
    
    expect((select as HTMLSelectElement).value).toBe('title');
  },
};

export const ChangeSortBackToReleaseDate: Story = {
  args: {
    handleSortChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox');
    
    await user.selectOptions(select, 'title');
    
    await user.selectOptions(select, 'release_date');
    
    expect(args.handleSortChange).toHaveBeenCalledTimes(2);
    expect(args.handleSortChange).toHaveBeenNthCalledWith(1, 'title');
    expect(args.handleSortChange).toHaveBeenNthCalledWith(2, 'release_date');
  },
};

export const AllOptionsAvailable: Story = {
  args: {
    handleSortChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByRole('option', { name: /Release Date/i })).toBeInTheDocument();
    expect(canvas.getByRole('option', { name: /Title/i })).toBeInTheDocument();
    
    const options = canvas.getAllByRole('option');
    expect(options).toHaveLength(2);
  },
};