import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import employeeService from '../services/employeeService'
import taskService from '../services/taskService'
import api from '../services/api'
import Avatar from '../components/ui/Avatar'
import ProgressBar from '../components/ui/ProgressBar'
import ReadinessScoreGauge from '../components/dashboard/ReadinessScoreGauge'
import TaskCard from '../components/tasks/TaskCard'
import TaskTable from '../components/tasks/TaskTable'
import TaskForm from '../components/tasks/TaskForm'
import TaskFilters from '../components/tasks/TaskFilters'
import OnboardingTimeline from '../components/employees/OnboardingTimeline'
import RecentActivity from '../components/dashboard/RecentActivity'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function EmployeeDetail() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [taskFilters, setTaskFilters] = useState({ search: '', status: '', priority: '', category: '' })
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskSubmitting, setTaskSubmitting] = useState(false)

  useEffect(() => {
    fetchEmployeeDetails()
  }, [id])

  const fetchEmployeeDetails = async () => {
    setLoading(true)
    try {
      const empRes = await employeeService.getEmployee(id)
      const empData = empRes.data?.employee || empRes.data
      setEmployee(empData)

      // Fetch tasks for this employee
      const taskRes = await taskService.getTasks({ employee: id, limit: 100 })
      setTasks(taskRes.data?.tasks || taskRes.data || [])

      // Fetch audit logs for this employee
      const actRes = await api.get(`/activity?entityId=${id}`)
      setActivities(actRes.data?.data?.logs || actRes.data?.logs || [])
    } catch (err) {
      console.error('Failed to load employee details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus)
      fetchEmployeeDetails()
    } catch (err) {
      console.error('Failed to update task status:', err)
      alert(err.response?.data?.message || 'Error updating status')
    }
  }

  const handleBlockTask = async (taskId, blockerReason) => {
    try {
      await taskService.blockTask(taskId, blockerReason)
      fetchEmployeeDetails()
    } catch (err) {
      console.error('Failed to block task:', err)
      alert(err.response?.data?.message || 'Error flagging blocker')
    }
  }

  const handleUnblockTask = async (taskId) => {
    try {
      await taskService.unblockTask(taskId)
      fetchEmployeeDetails()
    } catch (err) {
      console.error('Failed to unblock task:', err)
    }
  }

  const handleCreateTask = async (taskData) => {
    setTaskSubmitting(true)
    try {
      await taskService.createTask({
        ...taskData,
        employee: id,
        onboarding: employee?.onboarding?._id || employee?.onboarding
      })
      setIsTaskModalOpen(false)
      fetchEmployeeDetails()
    } catch (err) {
      console.error('Failed to create task:', err)
      alert(err.response?.data?.message || 'Error creating task')
    } finally {
      setTaskSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <h2>Employee Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>The requested employee record does not exist.</p>
        <Link to="/employees" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>
          Back to Directory
        </Link>
      </div>
    )
  }

  // Filter tasks locally
  const filteredTasks = tasks.filter(t => {
    if (taskFilters.search && !t.title.toLowerCase().includes(taskFilters.search.toLowerCase())) return false
    if (taskFilters.status && t.status !== taskFilters.status) return false
    if (taskFilters.priority && t.priority !== taskFilters.priority) return false
    if (taskFilters.category && t.category !== taskFilters.category) return false
    return true
  })

  const completedCount = tasks.filter(t => t.status === 'completed').length
  const blockedCount = tasks.filter(t => t.status === 'blocked').length
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0
  const readiness = employee.onboarding?.readinessScore !== undefined ? employee.onboarding.readinessScore : progress

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Profile Card */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <Avatar name={employee.name} size="lg" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  {employee.name}
                </h1>
                <span className={`status-badge status-${employee.status || 'active'}`}>
                  {employee.status}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {employee.jobTitle} • <code>{employee.employeeId}</code>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                🏢 {employee.department?.name || employee.department || 'General'} • 
                📅 Joined: {employee.joiningDate ? format(new Date(employee.joiningDate), 'MMM d, yyyy') : 'N/A'} • 
                ✉️ {employee.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="secondary" size="sm" onClick={() => setIsTaskModalOpen(true)}>
              + Assign Task
            </Button>
            <Link to="/employees" className="btn btn-secondary btn-sm">
              ← Directory
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', marginTop: 'var(--space-6)' }}>
          {['overview', 'tasks', 'timeline', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeTab === tab ? 600 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab} {tab === 'tasks' && `(${tasks.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
              <div className="card" style={{ padding: 'var(--space-4)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Completed Tasks</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '4px' }}>
                  {completedCount} / {tasks.length}
                </div>
              </div>
              <div className="card" style={{ padding: 'var(--space-4)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Active Blockers</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)', marginTop: '4px' }}>
                  {blockedCount}
                </div>
              </div>
              <div className="card" style={{ padding: 'var(--space-4)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Overall Progress</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                  {progress}%
                </div>
              </div>
            </div>

            {/* Incomplete Tasks Highlight */}
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  Action Items Remaining ({tasks.length - completedCount})
                </h3>
                <button onClick={() => setActiveTab('tasks')} className="btn btn-ghost btn-sm">
                  View All Tasks →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {tasks.filter(t => t.status !== 'completed').slice(0, 5).map(task => (
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
          </div>

          {/* Right Column: Readiness Score */}
          <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ReadinessScoreGauge score={readiness} />
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <TaskFilters filters={taskFilters} onChange={setTaskFilters} />
          <TaskTable
            tasks={filteredTasks}
            onUpdateStatus={handleUpdateStatus}
            onBlock={handleBlockTask}
            onUnblock={handleUnblockTask}
          />
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Visual Onboarding Timeline & Milestones
          </h3>
          <OnboardingTimeline onboarding={employee.onboarding} tasks={tasks} />
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Audit & Change History
          </h3>
          <RecentActivity activities={activities} />
        </div>
      )}

      {/* Task Creation Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={`Assign Onboarding Task to ${employee.name}`}
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsTaskModalOpen(false)}
          loading={taskSubmitting}
        />
      </Modal>
    </div>
  )
}
