import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEvent from '../AddEvent';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));


describe('AddEvent Component', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn();
    // global.alert = jest.fn();
    window.alert = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<AddEvent />);

    expect(screen.getByRole('heading', { name: 'Add Event' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add event/i })).toBeInTheDocument();
  });

  it('updates form fields on user input', () => {
    render(<AddEvent />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const descriptionInput = screen.getByRole('textbox', { name: /description/i });
    const dateInput = screen.getByLabelText(/date & time/i);
    const locationInput = screen.getByRole('textbox', { name: /location/i });

    fireEvent.change(titleInput, { target: { value: 'Test Event' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-01T12:00' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });

    expect(titleInput).toHaveValue('Test Event');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(dateInput).toHaveValue('2024-01-01T12:00');
    expect(locationInput).toHaveValue('Test Location');
  });


  it('shows alert when submitting with empty fields', () => {
    render(<AddEvent />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields.');
  });


  it('submits form successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<AddEvent />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const descriptionInput = screen.getByRole('textbox', { name: /description/i });
    const dateInput = screen.getByLabelText(/date & time/i);
    const locationInput = screen.getByRole('textbox', { name: /location/i });
    const submitButton = screen.getByRole('button', { name: /add event/i });

    fireEvent.change(titleInput, { target: { value: 'Test Event' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-01T12:00' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });
});
