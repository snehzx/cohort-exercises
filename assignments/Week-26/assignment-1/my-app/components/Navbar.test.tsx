import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Navbar } from './Navbar'

describe('Navbar Component', () => {
  it('renders the welcome text', () => {
    render(<Navbar />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('renders all navigation links with correct hrefs', () => {
    render(<Navbar />)
    
    const homeLink = screen.getByRole('link', { name: 'Home' })
    const serverLink = screen.getByRole('link', { name: 'Server Page' })
    const clientLink = screen.getByRole('link', { name: 'Client Page' })

    expect(homeLink).toHaveAttribute('href', '/')
    expect(serverLink).toHaveAttribute('href', '/static-page')
    expect(clientLink).toHaveAttribute('href', '/interactive-page')
  })

  it('applies correct styling classes to navigation links', () => {
    render(<Navbar />)
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveClass('hover:text-green-400', 'transition', 'duration-300')
    })
  })
})
