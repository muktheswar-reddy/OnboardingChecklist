import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('admin@onboardingchecklist.com')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (roleEmail, rolePass = 'Admin@123') => {
    setEmail(roleEmail)
    setPassword(rolePass)
  }

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
        maxWidth: '440px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
        padding: 'var(--space-8)'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '1.5rem',
            marginBottom: 'var(--space-3)'
          }}>
            📋
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            OnboardingChecklist
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Workforce Readiness Command Center
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--color-danger-light)',
            color: 'var(--color-danger-dark)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: 'var(--space-4)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Corporate Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@onboardingchecklist.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
            Sign In to Command Center
          </Button>
        </form>

        {/* Demo Quick Select */}
        <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Quick Demo Accounts:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => fillCredentials('admin@onboardingchecklist.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.6875rem' }}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('sarah.jenkins@onboardingchecklist.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.6875rem' }}
            >
              💼 HR Manager
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('marcus.vance@onboardingchecklist.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.6875rem' }}
            >
              💻 IT Team
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('david.kim@onboardingchecklist.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.6875rem' }}
            >
              👔 Dept Manager
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Register new admin
          </Link>
        </div>
      </div>
    </div>
  )
}
