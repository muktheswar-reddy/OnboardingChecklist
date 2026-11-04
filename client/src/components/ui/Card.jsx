import React from 'react'

function Card({ title, subtitle, children, action, className = '', bodyClassName = '', noPadding = false }) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : `card-body ${bodyClassName}`}>
        {children}
      </div>
    </div>
  )
}

export default Card
