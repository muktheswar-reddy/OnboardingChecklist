import React from 'react'
import { format } from 'date-fns'

export default function OnboardingTimeline({ onboarding, tasks = [] }) {
  const joiningDate = onboarding?.startDate ? new Date(onboarding.startDate) : new Date()

  // Build standard timeline milestones
  const milestones = [
    {
      title: 'Joining Date & Welcome Formalities',
      desc: 'Offer accepted, HR record created, welcome kit sent.',
      date: format(joiningDate, 'MMM d, yyyy'),
      status: 'completed',
      category: 'HR'
    },
    {
      title: 'Day 1: Hardware & System Access',
      desc: 'Laptop provisioned, corporate email, VPN and credentials configured.',
      date: 'Day 1',
      status: tasks.some(t => t.category === 'IT' && t.status === 'completed') ? 'completed' : 'in_progress',
      category: 'IT'
    },
    {
      title: 'Week 1: Orientation & Workplace Integration',
      desc: 'Introduction to team, manager 1:1, office tour & culture overview.',
      date: 'Week 1',
      status: tasks.some(t => t.category === 'Workplace' && t.status === 'completed') ? 'completed' : 'in_progress',
      category: 'Workplace'
    },
    {
      title: 'Month 1: Training & Core Objectives',
      desc: 'Role-specific onboarding modules, compliance training, first sprint/project.',
      date: 'Month 1',
      status: tasks.some(t => t.category === 'Training' && t.status === 'completed') ? 'completed' : 'not_started',
      category: 'Training'
    },
    {
      title: 'Workforce Readiness Review',
      desc: 'Final check of all 40+ onboarding steps, manager sign-off, full operational status.',
      date: onboarding?.expectedCompletionDate ? format(new Date(onboarding.expectedCompletionDate), 'MMM d, yyyy') : 'Expected 30 Days',
      status: onboarding?.status === 'completed' ? 'completed' : 'not_started',
      category: 'Milestone'
    }
  ]

  return (
    <div style={{ padding: 'var(--space-4) 0' }}>
      <div style={{ position: 'relative', borderLeft: '2px solid var(--color-border)', marginLeft: '16px', paddingLeft: '24px' }}>
        {milestones.map((milestone, idx) => {
          let dotColor = 'var(--color-text-muted)'
          if (milestone.status === 'completed') dotColor = 'var(--color-success)'
          else if (milestone.status === 'in_progress') dotColor = 'var(--color-primary)'

          return (
            <div key={idx} style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
              {/* Dot */}
              <div style={{
                position: 'absolute',
                left: '-31px',
                top: '4px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: dotColor,
                border: '3px solid var(--color-surface)',
                boxShadow: '0 0 0 2px ' + dotColor
              }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                  {milestone.title}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', background: 'var(--color-surface-hover)', padding: '2px 8px', borderRadius: '4px' }}>
                  {milestone.date}
                </span>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {milestone.desc}
              </p>

              <div style={{ marginTop: '6px' }}>
                <span className={`status-badge status-${milestone.status}`}>
                  {milestone.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
