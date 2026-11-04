import React from 'react'

export default function KPICard({ title, value, change, icon, color = 'primary', loading }) {
  if (loading) {
    return (
      <div className="card kpi-card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ height: '14px', width: '60%', background: 'var(--color-surface-hover)', borderRadius: '4px', marginBottom: '8px' }}></div>
        <div style={{ height: '32px', width: '40%', background: 'var(--color-surface-hover)', borderRadius: '4px' }}></div>
      </div>
    )
  }

  return (
    <div className={`card kpi-card kpi-${color}`} style={{ padding: 'var(--space-5)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '4px', lineHeight: 1.2 }}>
            {value}
          </div>
          {change !== undefined && (
            <div style={{ fontSize: '0.75rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: change >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                {change >= 0 ? `+${change}%` : `${change}%`}
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            background: `var(--color-${color}-light, rgba(79, 107, 244, 0.1))`,
            color: `var(--color-${color}, #4F6BF4)`
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

