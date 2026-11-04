import React from 'react'

export default function ReadinessScoreGauge({ score = 0, title = 'Workforce Readiness Score' }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)))
  
  let color = 'var(--color-danger)'
  let label = 'Needs Attention'
  if (normalizedScore >= 80) {
    color = 'var(--color-success)'
    label = 'Ready & On Track'
  } else if (normalizedScore >= 50) {
    color = 'var(--color-warning)'
    label = 'In Progress'
  }

  // Circular SVG gauge calculation
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="var(--color-surface-hover)"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
            {normalizedScore}%
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color, marginTop: '4px' }}>
            {label}
          </span>
        </div>
      </div>
      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{title}</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '200px', marginTop: '2px' }}>
          Real-time composite score based on completed milestones, blockers & overdue risks
        </p>
      </div>
    </div>
  )
}
