import React from 'react'
import SearchInput from '../ui/SearchInput'
import Select from '../ui/Select'

export default function TaskFilters({ filters, onChange }) {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ]

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'IT', label: 'IT Setup' },
    { value: 'HR', label: 'HR Documentation' },
    { value: 'Training', label: 'Training' },
    { value: 'Workplace', label: 'Workplace Integration' }
  ]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
      <div style={{ flex: '1 1 200px' }}>
        <SearchInput
          placeholder="Filter tasks..."
          value={filters.search}
          onSearch={(val) => onChange({ ...filters, search: val })}
        />
      </div>

      <div style={{ width: '150px' }}>
        <Select
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        />
      </div>

      <div style={{ width: '150px' }}>
        <Select
          options={priorityOptions}
          value={filters.priority || ''}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        />
      </div>

      <div style={{ width: '160px' }}>
        <Select
          options={categoryOptions}
          value={filters.category || ''}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        />
      </div>
    </div>
  )
}
