import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../../components/ui/Button'

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('handles onClick callback', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Submit</Button>)
    fireEvent.click(screen.getByText('Submit'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables button when loading or disabled prop is set', () => {
    render(<Button disabled>Disabled Action</Button>)
    expect(screen.getByText('Disabled Action')).toBeDisabled()
  })
})

