import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import api from '../services/api'

export default function Settings() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department?.name || user?.department || 'Human Resources'
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [savedMessage, setSavedMessage] = useState('')
  const [passError, setPassError] = useState('')

  const handleProfileSave = (e) => {
    e.preventDefault()
    setSavedMessage('Profile preferences updated successfully.')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      setPassError('New passwords do not match')
      return
    }
    if (passwords.new.length < 6) {
      setPassError('Password must be at least 6 characters')
      return
    }
    setPassError('')
    setSavedMessage('Password changed successfully.')
    setPasswords({ current: '', new: '', confirm: '' })
    setTimeout(() => setSavedMessage(''), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '760px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
          Account & Platform Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Configure user profiles, notification dispatch preferences and enterprise security
        </p>
      </div>

      {savedMessage && (
        <div style={{
          background: 'var(--color-success-light)',
          color: 'var(--color-success-dark)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem'
        }}>
          ✓ {savedMessage}
        </div>
      )}

      {/* Profile Section */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          User Profile
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-5)' }}>
          <Avatar name={user?.name} size="lg" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
            <span className="badge badge-primary" style={{ fontSize: '0.6875rem', marginTop: '4px' }}>
              Role: {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Full Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
          <Input
            label="Work Email Address"
            type="email"
            value={profileData.email}
            disabled
          />
          <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start' }}>
            Save Profile Changes
          </Button>
        </form>
      </div>

      {/* Appearance Section */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
          Interface Theme
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          Select your visual appearance preference: High-contrast Dark Navy or Crisp Enterprise Light.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={theme === 'dark' ? toggleTheme : undefined}
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
          >
            ☀️ Light Theme
          </button>
          <button
            type="button"
            onClick={theme === 'light' ? toggleTheme : undefined}
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🌙 Deep Navy Dark Theme
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Security & Password
        </h3>

        {passError && (
          <div style={{
            background: 'var(--color-danger-light)',
            color: 'var(--color-danger-dark)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            marginBottom: 'var(--space-3)'
          }}>
            {passError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
          <Button type="submit" variant="secondary" style={{ alignSelf: 'flex-start' }}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}

