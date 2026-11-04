import React from 'react'

const priorityConfig = {
  low:      { label: 'Low',      cls: 'priority-low',      icon: '▽' },
  medium:   { label: 'Medium',   cls: 'priority-medium',   icon: '◈' },
  high:     { label: 'High',     cls: 'priority-high',     icon: '△' },
  critical: { label: 'Critical', cls: 'priority-critical', icon: '⬆' },
}

function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || { label: priority, cls: 'priority-medium', icon: '◈' }
  return (
    <span className={`priority-badge ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

export default PriorityBadge
