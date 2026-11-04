import React from 'react'
import { TASK_STATUS_LABELS } from '../../utils/constants'

const statusConfig = {
  not_started: { label: 'Not Started', cls: 'status-not_started' },
  in_progress:  { label: 'In Progress',  cls: 'status-in_progress' },
  completed:    { label: 'Completed',    cls: 'status-completed' },
  blocked:      { label: 'Blocked',      cls: 'status-blocked' },
  overdue:      { label: 'Overdue',      cls: 'status-overdue' },
  pending:      { label: 'Pending',      cls: 'status-not_started' },
  delayed:      { label: 'Delayed',      cls: 'status-overdue' },
  cancelled:    { label: 'Cancelled',    cls: 'status-blocked' },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, cls: 'status-not_started' }
  return <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
}

export default StatusBadge
