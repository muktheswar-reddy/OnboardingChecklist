import React from 'react'

function ProgressBar({ value = 0, max = 100, variant = 'default', showLabel = true, label = null }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const getVariant = () => {
    if (variant !== 'default') return variant
    if (percentage >= 80) return 'success'
    if (percentage >= 50) return 'default'
    if (percentage >= 25) return 'warning'
    return 'danger'
  }

  return (
    <div className="progress-wrapper">
      {showLabel && (
        <div className="progress-label">
          <span>{label || ''}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div
          className={`progress-fill ${getVariant()}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

export default ProgressBar
