import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'hr_manager',
    department: 'Human Resources'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'dept_manager', label: 'Department Manager' },
    { value: 'it_team', label: 'IT Support Engineer' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 'var(--space-4)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
        padding: 'var(--space-8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Create Account
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Set up an enterprise administrator or manager profile
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--color-danger-light)',
            color: 'var(--color-danger-dark)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: 'var(--space-4)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sarah Jenkins"
          />

          <Input
            label="Corporate Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="sarah@company.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="At least 6 characters"
          />

          <Select
            label="System Role"
            options={roleOptions}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />

          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
            Register & Access Dashboard
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

