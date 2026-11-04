import React from 'react'
import { format, isPast, isToday } from 'date-fns'
import PriorityBadge from '../ui/PriorityBadge'
import TaskStatusUpdater from './TaskStatusUpdater'
import Avatar from '../ui/Avatar'

export default function TaskCard({ task, onUpdateStatus, onBlock, onUnblock, onSelect }) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed'

  return (
    <div
      className="card"
      style={{
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        borderLeft: task.status === 'blocked' ? '4px solid var(--color-danger)' : undefined
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          onClick={() => onSelect && onSelect(task)}
          style={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: 'var(--color-text)',
            cursor: onSelect ? 'pointer' : 'default',
            flex: 1,
            marginRight: '8px'
          }}
        >
          {task.title}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.4, margin: 0 }}>
          {task.description}
        </p>
      )}

      {task.status === 'blocked' && task.blockerReason && (
        <div style={{
          background: 'var(--color-danger-light)',
          color: 'var(--color-danger-dark)',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 500
        }}>
          ⚠️ <strong>Blocker:</strong> {task.blockerReason}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Avatar name={task.assignedOwner?.name || 'Owner'} size="sm" />
          <span>{task.assignedOwner?.name || 'Unassigned'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {dueDate && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: isOverdue ? 'var(--color-danger)' : 'var(--color-text-muted)'
            }}>
              {format(dueDate, 'MMM d')}
            </span>
          )}
          <TaskStatusUpdater
            task={task}
            onUpdateStatus={onUpdateStatus}
            onBlock={onBlock}
            onUnblock={onUnblock}
          />
        </div>
      </div>
    </div>
  )
}
