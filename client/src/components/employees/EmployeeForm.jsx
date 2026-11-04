import React, { useState, useEffect } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { ROLES_LIST, DEPARTMENTS_LIST } from '../../utils/constants'

export default function EmployeeForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    department: 'Engineering',
    role: 'Software Engineer',
    joiningDate: new Date().toISOString().split('T')[0],
    phone: '',
    ...initialData
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        joiningDate: initialData.joiningDate ? initialData.joiningDate.split('T')[0] : prev.joiningDate,
        department: initialData.department?.name || initialData.department || 'Engineering'
      }))
    }
  }, [initialData])

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Full name is required'
    if (!formData.email.trim()) errs.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address format'
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Job title is required'
    if (!formData.joiningDate) errs.joiningDate = 'Joining date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
  }

  const roleOptions = [
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'HR Executive', label: 'HR Executive' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'Marketing Executive', label: 'Marketing Executive' },
    { value: 'Product Manager', label: 'Product Manager' },
    { value: 'Custom Role', label: 'Custom Role' }
  ]

  const deptOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Product', label: 'Product' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Design', label: 'Design' }
  ]

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Input
        label="Full Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        placeholder="e.g. Alex Morgan"
      />

      <Input
        label="Work Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        placeholder="alex.morgan@company.com"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <Select
          label="Department"
          options={deptOptions}
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />

        <Select
          label="Role Profile"
          options={roleOptions}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value, jobTitle: e.target.value })}
        />
      </div>

      <Input
        label="Job Title"
        required
        value={formData.jobTitle}
        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
        error={errors.jobTitle}
        placeholder="Senior Full-Stack Engineer"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <Input
          label="Joining Date"
          type="date"
          required
          value={formData.joiningDate}
          onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          error={errors.joiningDate}
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Employee' : 'Add Employee & Generate Onboarding'}
        </Button>
      </div>
    </form>
  )
}

