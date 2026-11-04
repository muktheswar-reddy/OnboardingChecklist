import React from 'react'

function Skeleton({ width, height, className = '', variant = 'text' }) {
  const style = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return <div className={`skeleton skeleton-${variant} ${className}`} style={style} />
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <Skeleton variant="avatar" width={40} height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton variant="title" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === rows - 1 ? '70%' : '100%'} style={{ marginBottom: '8px' }} />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}><Skeleton variant="text" width={80} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}><Skeleton variant="text" width={c === 0 ? '80%' : '60%'} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SkeletonKPICard() {
  return (
    <div className="kpi-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="title" width="40%" height={32} />
        </div>
        <Skeleton variant="avatar" width={44} height={44} />
      </div>
      <Skeleton variant="text" width="50%" />
    </div>
  )
}

export default Skeleton
