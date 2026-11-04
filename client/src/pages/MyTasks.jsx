import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import taskService from '../services/taskService'
import TaskCard from '../components/tasks/TaskCard'
import TaskFilters from '../components/tasks/TaskFilters'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function MyTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '' })

  useEffect(() => {
    fetchMyTasks()
  }, [])

  const fetchMyTasks = async () => {
    setLoading(true)
    try {
      // Get all tasks (can filter by owner on server or client)
      const res = await taskService.getTasks({ limit: 100 })
      const payload = res?.data !== undefined ? res.data : res
      const allTasks = Array.isArray(payload) ? payload : (payload?.tasks || payload?.data || [])
      setTasks(Array.isArray(allTasks) ? allTasks : [])
    } catch (err) {
      console.error('Failed to load my tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus)
      fetchMyTasks()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleBlockTask = async (taskId, blockerReason) => {
    try {
      await taskService.blockTask(taskId, blockerReason)
      fetchMyTasks()
    } catch (err) {
      console.error('Error blocking task:', err)
    }
  }

  const handleUnblockTask = async (taskId) => {
    try {
      await taskService.unblockTask(taskId)
      fetchMyTasks()
    } catch (err) {
      console.error('Error unblocking task:', err)
    }
  }

  // Filter tasks locally
  const filtered = tasks.filter(t => {
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.status && t.status !== filters.status) return false
    if (filters.priority && t.priority !== filters.priority) return false
    if (filters.category && t.category !== filters.category) return false
    return true
  })

  const pendingTasks = filtered.filter(t => t.status === 'in_progress' || t.status === 'not_started')
  const blockedTasks = filtered.filter(t => t.status === 'blocked')
  const completedTasks = filtered.filter(t => t.status === 'completed')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
          My Assigned Onboarding Tasks
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Action items assigned to you across all employee onboarding checklists
        </p>
      </div>

      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <TaskFilters filters={filters} onChange={setFilters} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <EmptyState
            icon="✅"
            title="All Clear!"
            description="You have no pending onboarding assignments matching this filter."
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {blockedTasks.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-danger)', marginBottom: 'var(--space-3)' }}>
                🚫 Blocked Tasks Requiring Action ({blockedTasks.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
                {blockedTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdateStatus={handleUpdateStatus}
                    onBlock={handleBlockTask}
                    onUnblock={handleUnblockTask}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
              ⏳ Pending Action Items ({pendingTasks.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
              {pendingTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdateStatus={handleUpdateStatus}
                  onBlock={handleBlockTask}
                  onUnblock={handleUnblockTask}
                />
              ))}
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-success)', marginBottom: 'var(--space-3)' }}>
                ✅ Recently Completed ({completedTasks.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
                {completedTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdateStatus={handleUpdateStatus}
                    onBlock={handleBlockTask}
                    onUnblock={handleUnblockTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

