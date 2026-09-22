import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ServerPage from './page'

describe("ServerPage Component", () => {
  it("renders the page correctly", () => {
    render(<ServerPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Welcome to the Server Page"
    );

    expect(
      screen.getByText((content) => 
        content.includes("This page is statically generated using")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) => 
        content.includes("pre-rendered on the server")
      )
    ).toBeInTheDocument();
  });
});
