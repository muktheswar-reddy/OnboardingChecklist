import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import Avatar from '../ui/Avatar'

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Overview' },
  { to: '/employees', icon: '👥', label: 'Employees' },
  { to: '/onboarding', icon: '🎯', label: 'Onboarding' },
  { to: '/my-tasks', icon: '✅', label: 'My Tasks' },
  { to: '/templates', icon: '📋', label: 'Templates' },
  { to: '/blockers', icon: '🚫', label: 'Blockers' },
  { to: '/analytics', icon: '📈', label: 'Analytics' },
]

function Sidebar({ mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'var(--color-overlay)', zIndex: 'calc(var(--z-sticky) - 1)' }}
          onClick={onMobileClose}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🚀</div>
          <div>
            <div className="sidebar-logo-text">OnboardIQ</div>
            <div className="sidebar-logo-sub">Enterprise Platform</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={onMobileClose}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-text">{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: 'var(--space-4)' }}>Other</div>

          <NavLink
            to="/notifications"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            onClick={onMobileClose}
          >
            <span className="sidebar-link-icon">🔔</span>
            <span className="sidebar-link-text">Notifications</span>
            {unreadCount > 0 && (
              <span className="sidebar-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            onClick={onMobileClose}
          >
            <span className="sidebar-link-icon">⚙️</span>
            <span className="sidebar-link-text">Settings</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => navigate('/settings')}>
            <Avatar name={user?.name} size="sm" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div className="sidebar-user-role">{user?.role?.toUpperCase()}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleLogout() }}
              style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-text-muted)', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
