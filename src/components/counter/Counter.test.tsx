import { describe, expect, test, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('counter', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    render(<Counter initialValue={0} />);
  });

  test('renders with initial value', () => {
    expect(screen.getByText("0")).toBeInTheDocument();
  });
  test('test increment', async () => {
    
    const incrementButton = screen.getByText('Increment');
    await user.click(incrementButton);
    
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test('test decrement', async () => {
    
    const decrementButton = screen.getByText('Decrement');
    await user.click(decrementButton);
    
    expect(screen.getByText("-1")).toBeInTheDocument();
  });
});