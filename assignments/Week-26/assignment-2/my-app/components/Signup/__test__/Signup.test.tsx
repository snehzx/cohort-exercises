import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Signup } from '../Signup';
import { useRouter } from 'next/navigation';
import axios from 'axios';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('axios');

describe('Signup Component', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (axios.post as jest.Mock).mockReset();
  });

  it('renders signup form correctly', () => {
    render(<Signup />);

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('updates form fields on user input', () => {
    render(<Signup />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('johndoe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('handles successful signup', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });
    render(<Signup />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/user', {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on failed signup', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error());
    render(<Signup />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Signup failed. Try again.')).toBeInTheDocument();
    });
  });

  it('displays server error message', async () => {
    const errorMessage = 'Email already exists';
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { error: errorMessage } });
    render(<Signup />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state during signup', async () => {
    (axios.post as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<Signup />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Signing up...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
