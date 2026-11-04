import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import Avatar from '../ui/Avatar'
import ProgressBar from '../ui/ProgressBar'

export default function EmployeeCard({ employee, onEdit, onDelete }) {
  const joiningDateFormatted = employee.joiningDate
    ? format(new Date(employee.joiningDate), 'MMM d, yyyy')
    : 'Not set'

  const progress = employee.onboarding?.progressPercentage || 
    (employee.onboarding?.readinessScore !== undefined ? employee.onboarding.readinessScore : 0)

  return (
    <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={employee.name} size="md" />
          <div>
            <Link
              to={`/employees/${employee._id}`}
              style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)', hover: { textDecoration: 'underline' } }}
            >
              {employee.name}
            </Link>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {employee.jobTitle || 'Role Not Assigned'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-primary)', fontWeight: 500, marginTop: '2px' }}>
              {employee.employeeId || 'EMP-ID'}
            </div>
          </div>
        </div>

        <span className={`status-badge status-${employee.status || 'active'}`}>
          {employee.status || 'Active'}
        </span>
      </div>

      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>🏢 <strong>Dept:</strong> {employee.department?.name || employee.department || 'General'}</div>
        <div>📅 <strong>Joined:</strong> {joiningDateFormatted}</div>
        {employee.manager && (
          <div>👤 <strong>Manager:</strong> {employee.manager?.name || 'Assigned'}</div>
        )}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Onboarding Readiness</span>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} variant={progress >= 80 ? 'success' : progress >= 40 ? 'primary' : 'warning'} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
        <Link to={`/employees/${employee._id}`} className="btn btn-secondary btn-sm">
          View Profile
        </Link>
        {onEdit && (
          <button onClick={() => onEdit(employee)} className="btn btn-ghost btn-sm">
            ✏️
          </button>
        )}
      </div>
    </div>
  )
}
