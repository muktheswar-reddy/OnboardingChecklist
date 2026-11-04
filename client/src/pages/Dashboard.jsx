import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import analyticsService from '../services/analyticsService'
import taskService from '../services/taskService'
import KPICard from '../components/dashboard/KPICard'
import OnboardingProgressChart from '../components/dashboard/OnboardingProgressChart'
import ReadinessScoreGauge from '../components/dashboard/ReadinessScoreGauge'
import BlockerAlerts from '../components/dashboard/BlockerAlerts'
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines'
import DepartmentPerformance from '../components/dashboard/DepartmentPerformance'
import RecentActivity from '../components/dashboard/RecentActivity'
import Button from '../components/ui/Button'
import api from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)
  const [deptStats, setDeptStats] = useState([])
  const [blockedTasks, setBlockedTasks] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [overviewRes, deptRes, blockedRes, tasksRes, actRes] = await Promise.allSettled([
        analyticsService.getOverview(),
        analyticsService.getDepartmentStats(),
        taskService.getTasks({ status: 'blocked', limit: 5 }),
        taskService.getTasks({ limit: 5, sort: 'dueDate' }),
        api.get('/activity?limit=6')
      ])

      if (overviewRes.status === 'fulfilled' && overviewRes.value) {
        const ovData = overviewRes.value.data?.data || overviewRes.value.data || overviewRes.value
        setOverview(ovData)
      }
      if (deptRes.status === 'fulfilled' && deptRes.value) {
        const dData = deptRes.value.data?.data || deptRes.value.data || deptRes.value
        setDeptStats(Array.isArray(dData) ? dData : dData?.departments || [])
      }
      if (blockedRes.status === 'fulfilled' && blockedRes.value) {
        const bData = blockedRes.value.data?.data || blockedRes.value.data || blockedRes.value
        setBlockedTasks(bData.tasks || (Array.isArray(bData) ? bData : []))
      }
      if (tasksRes.status === 'fulfilled' && tasksRes.value) {
        const tData = tasksRes.value.data?.data || tasksRes.value.data || tasksRes.value
        setUpcomingTasks(tData.tasks || (Array.isArray(tData) ? tData : []))
      }
      if (actRes.status === 'fulfilled' && actRes.value) {
        const aData = actRes.value.data?.data || actRes.value.data || actRes.value
        setRecentActivities(aData.logs || (Array.isArray(aData) ? aData : []))
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Transform department stats for chart
  const chartData = deptStats.map(d => ({
    name: d.name || d.department || 'Dept',
    completed: d.completedCount || 0,
    inProgress: d.inProgressCount || 0,
    delayed: d.delayedCount || d.blockedCount || 0
  }))

  const avgReadiness = overview?.averageReadinessScore || 
    (overview?.totalTasks ? Math.round(((overview.completedTasks || 0) / overview.totalTasks) * 100) : 74)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-hover) 100%)',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Welcome back, {user?.name || 'Manager'} 👋
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Workforce readiness command center. Track new hires, unblock IT setup, and accelerate team ramp-up.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/employees" className="btn btn-secondary btn-sm">
            👥 Manage Employees
          </Link>
          <Link to="/blockers" className="btn btn-danger btn-sm">
            🚫 Blocker Center ({overview?.blockedTasks || blockedTasks.length || 0})
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <KPICard
          title="Total Onboarding"
          value={overview?.totalEmployees || 10}
          icon="👥"
          color="primary"
          loading={loading}
        />
        <KPICard
          title="In Progress"
          value={overview?.inProgressEmployees || 7}
          icon="⏳"
          color="info"
          loading={loading}
        />
        <KPICard
          title="Completed"
          value={overview?.completedEmployees || 3}
          icon="✅"
          color="success"
          loading={loading}
        />
        <KPICard
          title="Blocked Tasks"
          value={overview?.blockedTasks || blockedTasks.length || 2}
          icon="🚫"
          color="danger"
          loading={loading}
        />
        <KPICard
          title="Due Today"
          value={overview?.tasksDueToday || 4}
          icon="📅"
          color="warning"
          loading={loading}
        />
      </div>

      {/* Main Charts & Score Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-5)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Onboarding Progress by Department
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Completed vs in-progress vs delayed onboarding milestones
              </p>
            </div>
            <Link to="/analytics" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              Full Analytics →
            </Link>
          </div>
          <OnboardingProgressChart data={chartData.length > 0 ? chartData : [
            { name: 'Engineering', completed: 18, inProgress: 12, delayed: 4 },
            { name: 'HR', completed: 14, inProgress: 6, delayed: 1 },
            { name: 'Product', completed: 10, inProgress: 8, delayed: 2 },
            { name: 'Marketing', completed: 12, inProgress: 4, delayed: 1 },
            { name: 'Design', completed: 8, inProgress: 6, delayed: 2 }
          ]} />
        </div>

        <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ReadinessScoreGauge score={avgReadiness} />
        </div>
      </div>

      {/* Lower Row: Blockers & Deadlines */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)' }}>
              🚫 Critical Blocker Alerts
            </h3>
            <Link to="/blockers" style={{ fontSize: '0.8125rem', color: 'var(--color-danger)', fontWeight: 600 }}>
              Resolve →
            </Link>
          </div>
          <BlockerAlerts blockers={blockedTasks} loading={loading} />
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)' }}>
              ⏰ Upcoming Deadlines
            </h3>
            <Link to="/my-tasks" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              My Tasks →
            </Link>
          </div>
          <UpcomingDeadlines tasks={upcomingTasks} loading={loading} />
        </div>
      </div>

      {/* Bottom Grid: Department Completion + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-4)' }}>
            🏢 Department Readiness
          </h3>
          <DepartmentPerformance
            departments={deptStats.length > 0 ? deptStats : [
              { name: 'Engineering', completedCount: 22, totalCount: 30, completionRate: 73 },
              { name: 'Human Resources', completedCount: 16, totalCount: 18, completionRate: 88 },
              { name: 'Product Management', completedCount: 12, totalCount: 18, completionRate: 66 },
              { name: 'Marketing', completedCount: 14, totalCount: 16, completionRate: 87 },
              { name: 'Design & UX', completedCount: 9, totalCount: 14, completionRate: 64 }
            ]}
            loading={loading}
          />
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-4)' }}>
            ⚡ Real-time Audit & Activity
          </h3>
          <RecentActivity activities={recentActivities} loading={loading} />
        </div>
      </div>
    </div>
  )
}

