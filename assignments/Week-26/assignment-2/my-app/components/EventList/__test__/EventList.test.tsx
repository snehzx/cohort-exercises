import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventList from '../EventList';

const mockEvents = [
  {
    id: 1,
    title: "Summer Concert",
    description: "An amazing outdoor concert",
    date: "2024-07-15",
    location: "Central Park"
  },
  {
    id: 2,
    title: "Tech Conference",
    description: "Annual technology conference",
    date: "2024-08-20",
    location: "Convention Center"
  }
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockEvents)
  })
) as jest.Mock;

describe('EventList Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('fetches and renders events', async () => {
    render(<EventList />);

    expect(fetch).toHaveBeenCalledWith('/api/event');

    await waitFor(() => {
      expect(screen.getByText('Summer Concert')).toBeInTheDocument();
    });

    mockEvents.forEach(event => {
      expect(screen.getByText(event.title)).toBeInTheDocument();
      expect(screen.getByText(event.description)).toBeInTheDocument();
      expect(screen.getByText(event.date)).toBeInTheDocument();
      expect(screen.getByText(`📍 ${event.location}`)).toBeInTheDocument();
    });
  });

  it('renders correct number of event cards', async () => {
    render(<EventList />);

    await waitFor(() => {
      const eventCards = screen.getAllByRole('heading', { level: 2 });
      expect(eventCards).toHaveLength(mockEvents.length);
    });
  });

  it('applies correct styling to event cards', async () => {
    render(<EventList />);

    await waitFor(() => {
      const eventCards = document.querySelectorAll('.border');
      expect(eventCards).toHaveLength(mockEvents.length);
      eventCards.forEach(card => {
        expect(card).toHaveClass('p-4', 'border');
      });
    });
  });
});
