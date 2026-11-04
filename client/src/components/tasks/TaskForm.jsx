import React, { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

export default function TaskForm({ initialData, onSubmit, onCancel, loading, employees = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'IT',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    employee: '',
    ...initialData
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!formData.title.trim()) errs.title = 'Title is required'
    if (!formData.dueDate) errs.dueDate = 'Due date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
  }

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ]

  const categoryOptions = [
    { value: 'IT', label: 'IT Setup' },
    { value: 'HR', label: 'HR Documentation' },
    { value: 'Training', label: 'Training & Ramp-up' },
    { value: 'Workplace', label: 'Workplace Integration' },
    { value: 'Other', label: 'Other' }
  ]

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Input
        label="Task Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        placeholder="e.g. Issue MacBook Pro M3 and Security Token"
      />

      <div className="form-group">
        <label className="form-label">Description / Instructions</label>
        <textarea
          className="form-textarea"
          rows={3}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed instructions or acceptance criteria for this onboarding task..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <Select
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        required
        value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        error={errors.dueDate}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}

