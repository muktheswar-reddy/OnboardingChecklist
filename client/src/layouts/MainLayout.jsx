import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/layout/Sidebar'
import TopNav from '../components/layout/TopNav'
import Spinner from '../components/ui/Spinner'

function MainLayout() {
  const { isAuthenticated, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg)' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="main-layout">
      {/* Mobile toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setMobileOpen(o => !o)}
        aria-label="Toggle menu"
        style={{ display: 'none' }}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      <div className="main-layout-sidebar">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      </div>

      <div className="main-layout-content">
        <TopNav onMenuToggle={() => setMobileOpen(o => !o)} />
        <main className="main-layout-body">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
