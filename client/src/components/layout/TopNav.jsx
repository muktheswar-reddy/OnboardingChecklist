import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../context/NotificationContext'
import SearchInput from '../ui/SearchInput'
import Dropdown, { DropdownItem, DropdownDivider } from '../ui/Dropdown'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

function TopNav({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  const handleSearch = (query) => {
    if (query.trim()) navigate(`/employees?search=${encodeURIComponent(query)}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topnav">
      {/* Mobile hamburger */}
      <button className="topnav-icon-btn" onClick={onMenuToggle} aria-label="Toggle sidebar" style={{ display: 'none' }}>
        ☰
      </button>

      {/* Search */}
      <div className="topnav-search">
        <SearchInput
          placeholder="Search employees, tasks..."
          onSearch={handleSearch}
        />
      </div>

      {/* Actions */}
      <div className="topnav-actions">
        {/* Quick create */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/employees')}
          style={{ gap: '4px' }}
        >
          + New
        </Button>

        {/* Theme toggle */}
        <button
          className="topnav-icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <button
          className="topnav-icon-btn"
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
          style={{ position: 'relative' }}
        >
          🔔
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>

        {/* User dropdown */}
        <Dropdown
          trigger={
            <button className="topnav-icon-btn" style={{ width: 'auto', padding: '4px' }}>
              <Avatar name={user?.name} size="sm" />
            </button>
          }
        >
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
          </div>
          <DropdownItem icon="👤" onClick={() => navigate('/settings')}>Profile</DropdownItem>
          <DropdownItem icon="⚙️" onClick={() => navigate('/settings')}>Settings</DropdownItem>
          <DropdownDivider />
          <DropdownItem icon="🚪" onClick={handleLogout} className="danger">Logout</DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}

export default TopNav
