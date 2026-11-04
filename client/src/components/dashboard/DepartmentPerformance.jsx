import React from 'react'
import ProgressBar from '../ui/ProgressBar'

export default function DepartmentPerformance({ departments = [], loading = false }) {
  if (loading) {
    return <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading departments...</div>
  }

  if (!departments || departments.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
        No department data found.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {departments.map((dept, index) => {
        const rate = dept.completionRate || Math.round((dept.completedCount / (dept.totalCount || 1)) * 100) || 0
        return (
          <div key={dept._id || index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{dept.name || dept.department}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>
                {dept.completedCount || 0} / {dept.totalCount || 0} tasks ({rate}%)
              </span>
            </div>
            <ProgressBar value={rate} variant={rate > 75 ? 'success' : rate > 40 ? 'primary' : 'warning'} />
          </div>
        )
      })}
    </div>
  )
}
