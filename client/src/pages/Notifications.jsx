import React, { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications } from '../context/NotificationContext'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead, loading } = useNotifications()
  const [filter, setFilter] = useState('all')

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead
    return true
  })

  const getIconForType = (type) => {
    switch (type) {
      case 'blocker_created': return '🚫'
      case 'blocker_resolved': return '✅'
      case 'task_assigned': return '📋'
      case 'task_overdue': return '⏰'
      case 'onboarding_completed': return '🎉'
      default: return '🔔'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Notification Inbox
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            System alerts, assignment triggers, and blocker notifications
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            ✓ Mark All as Read
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <EmptyState
            icon="🔕"
            title="Inbox Zero"
            description="You have no notifications in this view."
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filtered.map(item => (
            <div
              key={item._id}
              className="card"
              style={{
                padding: 'var(--space-4)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: item.isRead ? 'var(--color-surface)' : 'var(--color-surface-hover)',
                borderLeft: item.isRead ? undefined : '4px solid var(--color-primary)'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                flexShrink: 0
              }}>
                {getIconForType(item.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : ''}
                  </span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                  {item.message}
                </p>

                {!item.isRead && (
                  <button
                    onClick={() => markRead(item._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '6px'
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

