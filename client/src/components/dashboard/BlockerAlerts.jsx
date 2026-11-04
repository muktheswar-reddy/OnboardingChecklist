import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../ui/StatusBadge'
import PriorityBadge from '../ui/PriorityBadge'

export default function BlockerAlerts({ blockers = [], loading = false }) {
  if (loading) {
    return <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading blockers...</div>
  }

  if (!blockers || blockers.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>🎉</div>
        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No Blockers Active</div>
        <div style={{ fontSize: '0.8125rem' }}>All onboarding workflows are moving forward smoothly.</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {blockers.map((item) => (
        <div
          key={item._id}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderLeft: '4px solid var(--color-danger)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>
              {item.title}
            </span>
            <PriorityBadge priority={item.priority} />
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--color-danger)', background: 'var(--color-danger-light)', padding: '4px 8px', borderRadius: '4px' }}>
            <strong>Blocker:</strong> {item.blockerReason || 'Reason unspecified'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            <span>👤 For: <strong>{item.employee?.name || 'Assigned Employee'}</strong></span>
            <span>Owner: <strong>{item.assignedOwner?.name || 'Unassigned'}</strong></span>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'right', marginTop: '4px' }}>
        <Link to="/blockers" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          View Blocker Intelligence Center →
        </Link>
      </div>
    </div>
  )
}
