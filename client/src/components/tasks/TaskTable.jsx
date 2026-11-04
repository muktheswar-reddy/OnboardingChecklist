import React from 'react'
import { format, isPast, isToday } from 'date-fns'
import PriorityBadge from '../ui/PriorityBadge'
import TaskStatusUpdater from './TaskStatusUpdater'
import Avatar from '../ui/Avatar'

export default function TaskTable({ tasks = [], onUpdateStatus, onBlock, onUnblock, onSelectTask }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        No tasks found matching criteria.
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Task Details</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null
            const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed'

            return (
              <tr key={task._id} style={{ borderLeft: task.status === 'blocked' ? '3px solid var(--color-danger)' : undefined }}>
                <td>
                  <div
                    onClick={() => onSelectTask && onSelectTask(task)}
                    style={{ fontWeight: 600, color: 'var(--color-text)', cursor: onSelectTask ? 'pointer' : 'default' }}
                  >
                    {task.title}
                  </div>
                  {task.status === 'blocked' && task.blockerReason && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '2px' }}>
                      ⚠️ <strong>Blocker:</strong> {task.blockerReason}
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-default" style={{ fontSize: '0.6875rem' }}>
                    {task.category || 'General'}
                  </span>
                </td>
                <td>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Avatar name={task.assignedOwner?.name || task.employee?.name || 'Owner'} size="sm" />
                    <span style={{ fontSize: '0.8125rem' }}>
                      {task.assignedOwner?.name || task.employee?.name || 'Unassigned'}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: isOverdue ? 600 : 400,
                    color: isOverdue ? 'var(--color-danger)' : 'var(--color-text)'
                  }}>
                    {dueDate ? format(dueDate, 'MMM d, yyyy') : 'No Date'}
                  </span>
                </td>
                <td>
                  <TaskStatusUpdater
                    task={task}
                    onUpdateStatus={onUpdateStatus}
                    onBlock={onBlock}
                    onUnblock={onUnblock}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

