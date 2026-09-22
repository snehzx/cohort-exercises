import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../Navbar';
import { describe, it, expect } from '@jest/globals';

describe('Navbar Component', () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  it('renders Event Booking title', () => {
    expect(screen.getByText('Event Booking')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    expect(screen.getByRole('link', { name: /events/i })).toHaveAttribute('href', '/events');
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/signin');
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup');
  });
});

