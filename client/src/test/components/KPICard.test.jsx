import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KPICard from '../../components/dashboard/KPICard'

describe('KPICard Component', () => {
  it('renders title and value', () => {
    render(<KPICard title="Total Onboarding" value={14} icon="👥" />)
    expect(screen.getByText('Total Onboarding')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
  })

  it('renders change percentage if provided', () => {
    render(<KPICard title="Completed" value={8} change={12} />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })
})

