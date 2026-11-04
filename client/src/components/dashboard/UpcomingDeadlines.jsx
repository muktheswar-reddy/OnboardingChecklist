import React from 'react'
import { Link } from 'react-router-dom'
import { format, isPast, isToday } from 'date-fns'
import PriorityBadge from '../ui/PriorityBadge'

export default function UpcomingDeadlines({ tasks = [], loading = false }) {
  if (loading) {
    return <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading deadlines...</div>
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>📅</div>
        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No Upcoming Deadlines</div>
        <div style={{ fontSize: '0.8125rem' }}>No critical milestones scheduled for the near future.</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {tasks.map((task) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null
        const isTaskOverdue = dueDate && isPast(dueDate) && !isToday(dueDate)
        const isTaskToday = dueDate && isToday(dueDate)

        return (
          <div
            key={task._id}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.title}
                </span>
                <PriorityBadge priority={task.priority} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Assigned to: {task.employee?.name || 'Employee'} • Dept: {task.department?.name || task.category || 'General'}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isTaskOverdue ? 'var(--color-danger)' : isTaskToday ? 'var(--color-warning)' : 'var(--color-text-muted)'
              }}>
                {isTaskToday ? 'Due Today' : isTaskOverdue ? 'Overdue' : dueDate ? format(dueDate, 'MMM d') : 'No Date'}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

