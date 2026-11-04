import React from 'react'
import { formatDistanceToNow } from 'date-fns'

export default function RecentActivity({ activities = [], loading = false }) {
  if (loading) {
    return <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading activity feed...</div>
  }

  if (!activities || activities.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📝</div>
        <div style={{ fontSize: '0.8125rem' }}>No recent audit activity logged.</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {activities.map((act) => {
        let icon = '⚡'
        if (act.action?.includes('create')) icon = '➕'
        if (act.action?.includes('update') || act.action?.includes('status')) icon = '🔄'
        if (act.action?.includes('block')) icon = '🚫'
        if (act.action?.includes('complete')) icon = '✅'

        return (
          <div
            key={act._id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.8125rem'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--color-surface-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              flexShrink: 0
            }}>
              {icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--color-text)' }}>
                <strong>{act.actor?.name || 'System User'}</strong> {act.description || act.action}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {act.createdAt ? formatDistanceToNow(new Date(act.createdAt), { addSuffix: true }) : 'just now'}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
