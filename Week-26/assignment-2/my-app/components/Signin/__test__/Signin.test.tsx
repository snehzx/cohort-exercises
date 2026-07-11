import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Signin } from '../Signin';
import { useRouter } from 'next/navigation';
import axios from 'axios';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('axios');

describe('Signin Component', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (axios.put as jest.Mock).mockReset();
  });

  it('renders signin form correctly', () => {
    render(<Signin />);

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    render(<Signin />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });


  it('handles successful signin', async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: {} });
    render(<Signin />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/user', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on failed signin', async () => {
    (axios.put as jest.Mock).mockRejectedValueOnce(new Error());
    render(<Signin />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials. Try again.')).toBeInTheDocument();
    });
  });

  it('displays server error message', async () => {
    const errorMessage = 'User not found';
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { error: errorMessage } });
    render(<Signin />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state during signin', async () => {
    (axios.put as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<Signin />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
