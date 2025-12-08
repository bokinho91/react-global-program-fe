import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from '@storybook/testing-library';
import Counter from './Counter';

const meta = {
  title: 'Components/Counter',
  component: Counter,
  args: {
    initialValue: 0,
  },
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StartAt10: Story = {
  args: {
    initialValue: 10,
  },
};

export const StartAtMinus5: Story = {
  args: {
    initialValue: -5,
  },
};

export const IncrementTwice: Story = {
  args: {
    initialValue: 0,
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const incrementButton = canvas.getByRole('button', { name: /increment/i });

    await user.click(incrementButton);
    await user.click(incrementButton);
  },
};

export const DecrementThrice: Story = {
  args: {
    initialValue: 0,
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const decrementButton = canvas.getByRole('button', { name: /decrement/i });

    await user.click(decrementButton);
    await user.click(decrementButton);
    await user.click(decrementButton);
  },
};


