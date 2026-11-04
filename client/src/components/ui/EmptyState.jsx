import React from 'react'
import Button from './Button'

function EmptyState({ icon = '📭', title = 'No data found', description = '', action = null, actionLabel = 'Add New' }) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && (
        <Button variant="primary" onClick={action}>{actionLabel}</Button>
      )}
    </div>
  )
}

export default EmptyState
