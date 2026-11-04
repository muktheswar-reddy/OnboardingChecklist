import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import onboardingService from '../services/onboardingService'
import ProgressBar from '../components/ui/ProgressBar'
import SearchInput from '../components/ui/SearchInput'
import Select from '../components/ui/Select'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function Onboarding() {
  const [onboardings, setOnboardings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchOnboardings()
  }, [])

  const fetchOnboardings = async () => {
    setLoading(true)
    try {
      const res = await onboardingService.getOnboardings({ limit: 50 })
      const payload = res?.data !== undefined ? res.data : res
      const list = Array.isArray(payload) ? payload : (payload?.onboardings || payload?.data || [])
      setOnboardings(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to fetch onboarding records:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = onboardings.filter(item => {
    const empName = item.employee?.name || ''
    const job = item.employee?.jobTitle || ''
    if (search && !empName.toLowerCase().includes(search.toLowerCase()) && !job.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (statusFilter && item.status !== statusFilter) {
      return false
    }
    return true
  })

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'delayed', label: 'Delayed' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
          Onboarding Pipelines & Cohorts
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Centralized tracking of all active employee onboarding workflows and readiness milestones
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px' }}>
          <SearchInput
            placeholder="Search by employee name or job title..."
            value={search}
            onSearch={setSearch}
          />
        </div>
        <div style={{ width: '180px' }}>
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <EmptyState
            icon="🎯"
            title="No Onboarding Pipelines Found"
            description="No active onboarding workflows match your current search criteria."
          />
        </div>
      ) : (
        <div className="table-container card">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role / Department</th>
                <th>Template</th>
                <th>Start Date</th>
                <th>Target Completion</th>
                <th>Readiness Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const readiness = item.readinessScore !== undefined ? item.readinessScore : 0
                return (
                  <tr key={item._id}>
                    <td>
                      <Link to={`/employees/${item.employee?._id || item.employee}`} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {item.employee?.name || 'New Employee'}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {item.employee?.email}
                      </div>
                    </td>
                    <td>
                      <div>{item.employee?.jobTitle || 'Role'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {item.employee?.department?.name || item.employee?.department || 'General'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-default" style={{ fontSize: '0.75rem' }}>
                        {item.template?.name || 'Standard 30-Day'}
                      </span>
                    </td>
                    <td>{item.startDate ? format(new Date(item.startDate), 'MMM d, yyyy') : 'N/A'}</td>
                    <td>{item.expectedCompletionDate ? format(new Date(item.expectedCompletionDate), 'MMM d, yyyy') : 'N/A'}</td>
                    <td style={{ minWidth: '130px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{readiness}%</span>
                        <div style={{ flex: 1 }}>
                          <ProgressBar value={readiness} variant={readiness >= 80 ? 'success' : readiness >= 40 ? 'primary' : 'warning'} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${item.status}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <Link to={`/employees/${item.employee?._id || item.employee}`} className="btn btn-secondary btn-sm">
                        View Checklist
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
