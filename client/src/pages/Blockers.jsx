import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import taskService from '../services/taskService'
import PriorityBadge from '../components/ui/PriorityBadge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function Blockers() {
  const [blockedTasks, setBlockedTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [resolvingId, setResolvingId] = useState(null)

  useEffect(() => {
    fetchBlockedTasks()
  }, [])

  const fetchBlockedTasks = async () => {
    setLoading(true)
    try {
      const res = await taskService.getTasks({ status: 'blocked', limit: 50 })
      setBlockedTasks(res.data?.tasks || res.data || [])
    } catch (err) {
      console.error('Failed to load blocked tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResolveBlocker = async (taskId) => {
    setResolvingId(taskId)
    try {
      await taskService.unblockTask(taskId)
      // update local state
      setBlockedTasks(prev => prev.filter(t => t._id !== taskId))
    } catch (err) {
      console.error('Failed to resolve blocker:', err)
      alert(err.response?.data?.message || 'Error resolving blocker')
    } finally {
      setResolvingId(null)
    }
  }

  // Recommended next action generator based on category and reason
  const getRecommendedAction = (task) => {
    const reason = (task.blockerReason || '').toLowerCase()
    const cat = task.category || ''
    if (reason.includes('credential') || reason.includes('access') || cat === 'IT') {
      return 'Escalate ticket to IT Security Lead to issue service credentials.'
    }
    if (reason.includes('document') || reason.includes('sign') || cat === 'HR') {
      return 'Send automated SMS / Email reminder to employee for e-signature.'
    }
    if (reason.includes('laptop') || reason.includes('hardware')) {
      return 'Check inventory logistics or expedite courier tracking.'
    }
    return 'Schedule immediate 15-minute sync between Manager and Assigned Owner.'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🚫</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-danger)', margin: 0 }}>
              Blocker Intelligence Center
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Active bottlenecks halting new hire readiness. Prioritized by criticality with AI-assisted recommended next steps.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-danger)' }}>
            {blockedTasks.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Active Impediments
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <Spinner size="lg" />
        </div>
      ) : blockedTasks.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <EmptyState
            icon="🎉"
            title="Zero Blockers Detected!"
            description="All onboarding pipelines are running at full velocity with no impeded tasks."
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {blockedTasks.map(task => {
            const timeBlocked = task.blockedAt
              ? formatDistanceToNow(new Date(task.blockedAt), { addSuffix: true })
              : 'Recently flagged'

            return (
              <div
                key={task._id}
                className="card"
                style={{
                  padding: 'var(--space-5)',
                  borderLeft: '5px solid var(--color-danger)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                      {task.title}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      For Employee: <strong>{task.employee?.name || 'New Hire'}</strong> ({task.employee?.jobTitle || 'Role'}) • 
                      Category: <strong>{task.category}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PriorityBadge priority={task.priority} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Blocked {timeBlocked}
                    </span>
                  </div>
                </div>

                {/* Blocker Reason Box */}
                <div style={{
                  background: 'var(--color-danger-light)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--color-danger-dark)'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>⚠️ Reason Given:</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '2px' }}>
                    {task.blockerReason || 'Reason not specified.'}
                  </div>
                </div>

                {/* Recommended Next Action */}
                <div style={{
                  background: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.8125rem'
                }}>
                  <span style={{ fontSize: '1.125rem' }}>💡</span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: 'var(--color-primary)' }}>Recommended Action:</strong>{' '}
                    <span style={{ color: 'var(--color-text)' }}>{getRecommendedAction(task)}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Responsible Owner: <strong>{task.assignedOwner?.name || 'Unassigned'}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Link to={`/employees/${task.employee?._id || task.employee}`} className="btn btn-secondary btn-sm">
                      Inspect Onboarding
                    </Link>
                    <Button
                      variant="success"
                      size="sm"
                      loading={resolvingId === task._id}
                      onClick={() => handleResolveBlocker(task._id)}
                    >
                      ✓ Mark Resolved & Unblock
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
