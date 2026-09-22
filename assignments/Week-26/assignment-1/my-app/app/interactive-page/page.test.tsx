import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ClientPage from './page'

describe("ClientPage Component", () => {
    it("renders the page correctly", () => {
      render(<ClientPage />);
  
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to the Client Page");
  
      expect(
        screen.getByText(/This page is generated on the client side/i)
      ).toBeInTheDocument();
  
      expect(screen.getByRole("button", { name: /Count: 0/i })).toBeInTheDocument();
    });
  
    it("increments count when button is clicked", () => {
      render(<ClientPage />);
      
      const button = screen.getByRole("button", { name: /Count: 0/i });
  
      fireEvent.click(button);
      fireEvent.click(button);
  
      expect(screen.getByRole("button", { name: /Count: 2/i })).toBeInTheDocument();
    });
  });
  