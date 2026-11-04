import React, { useState, useEffect } from 'react'
import templateService from '../services/templateService'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    department: 'Engineering',
    jobRole: 'Software Engineer',
    estimatedDuration: 30,
    taskDefinitions: [
      { title: 'Provision Laptop & Security Token', category: 'IT', priority: 'high', dueOffsetDays: 1, assignTo: 'it_team' },
      { title: 'Sign NDAs and Tax Withholding Documents', category: 'HR', priority: 'critical', dueOffsetDays: 2, assignTo: 'hr_manager' },
      { title: 'Team Introduction & Mentor Assignment', category: 'Workplace', priority: 'medium', dueOffsetDays: 3, assignTo: 'dept_manager' },
      { title: 'Architecture Deep-Dive & Codebase Walkthrough', category: 'Training', priority: 'high', dueOffsetDays: 7, assignTo: 'dept_manager' }
    ]
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await templateService.getTemplates()
      setTemplates(res.data?.templates || res.data || [])
    } catch (err) {
      console.error('Failed to load templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async (e) => {
    e.preventDefault()
    try {
      await templateService.createTemplate(newTemplate)
      setIsModalOpen(false)
      fetchTemplates()
    } catch (err) {
      console.error('Failed to create template:', err)
      alert(err.response?.data?.message || 'Error creating template')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Onboarding Checklist Templates
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Preconfigured, role-specific checklists automatically assigned to new employees upon creation
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Create New Template
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--space-5)' }}>
          {templates.map(tmpl => (
            <div key={tmpl._id} className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {tmpl.name}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Role: <strong>{tmpl.jobRole || 'General'}</strong> • Dept: <strong>{tmpl.department?.name || tmpl.department || 'All'}</strong>
                  </div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>
                  {tmpl.estimatedDuration || 30} Days
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Preconfigured Tasks ({tmpl.taskDefinitions?.length || 0}):
                </span>
                <ul style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(tmpl.taskDefinitions || []).slice(0, 4).map((td, i) => (
                    <li key={i} style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.6875rem', padding: '1px 5px', borderRadius: '4px', background: 'var(--color-surface-hover)' }}>
                        {td.category}
                      </span>
                      <span style={{ color: 'var(--color-text)' }}>{td.title}</span>
                    </li>
                  ))}
                  {tmpl.taskDefinitions?.length > 4 && (
                    <li style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      + {tmpl.taskDefinitions.length - 4} more milestone tasks
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating Template */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Onboarding Template"
      >
        <form onSubmit={handleCreateTemplate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Template Name"
            required
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            placeholder="e.g. Senior Backend Engineer Onboarding"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Job Role"
              value={newTemplate.jobRole}
              onChange={(e) => setNewTemplate({ ...newTemplate, jobRole: e.target.value })}
              placeholder="Backend Developer"
            />
            <Input
              label="Est. Duration (Days)"
              type="number"
              value={newTemplate.estimatedDuration}
              onChange={(e) => setNewTemplate({ ...newTemplate, estimatedDuration: Number(e.target.value) })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Template
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
