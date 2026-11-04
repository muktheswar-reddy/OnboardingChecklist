import React from 'react'
import SearchInput from '../ui/SearchInput'
import Select from '../ui/Select'

export default function EmployeeFilters({ filters, onChange }) {
  const deptOptions = [
    { value: '', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Product', label: 'Product' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Design', label: 'Design' }
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'completed', label: 'Completed' },
    { value: 'inactive', label: 'Inactive' }
  ]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
      <div style={{ flex: '1 1 240px' }}>
        <SearchInput
          placeholder="Search employees by name, email, ID..."
          value={filters.search}
          onSearch={(val) => onChange({ ...filters, search: val })}
        />
      </div>

      <div style={{ width: '180px' }}>
        <Select
          options={deptOptions}
          value={filters.department || ''}
          onChange={(e) => onChange({ ...filters, department: e.target.value })}
        />
      </div>

      <div style={{ width: '160px' }}>
        <Select
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        />
      </div>
    </div>
  )
}

