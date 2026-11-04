import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function TaskStatusUpdater({ task, onUpdateStatus, onBlock, onUnblock }) {
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [blockerReason, setBlockerReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSelect = async (e) => {
    const newStatus = e.target.value
    if (newStatus === 'blocked') {
      setShowBlockModal(true)
    } else if (task.status === 'blocked' && newStatus !== 'blocked') {
      if (onUnblock) {
        await onUnblock(task._id)
      }
      onUpdateStatus(task._id, newStatus)
    } else {
      onUpdateStatus(task._id, newStatus)
    }
  }

  const handleBlockSubmit = async (e) => {
    e.preventDefault()
    if (!blockerReason.trim()) return
    setLoading(true)
    try {
      await onBlock(task._id, blockerReason)
      setShowBlockModal(false)
      setBlockerReason('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <select
        value={task.status}
        onChange={handleSelect}
        className={`form-select status-select status-${task.status}`}
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '4px 8px',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer'
        }}
      >
        <option value="not_started">Not Started</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="blocked">Blocked</option>
        <option value="overdue">Overdue</option>
      </select>

      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title="Flag Task as Blocked"
      >
        <form onSubmit={handleBlockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Blocking <strong>{task.title}</strong> alerts HR, managers, and owners immediately. A detailed blocker reason is mandatory.
          </p>

          <Input
            label="Blocker Reason / Impediment"
            required
            placeholder="e.g. Awaiting AWS IAM credentials from Security team..."
            value={blockerReason}
            onChange={(e) => setBlockerReason(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={() => setShowBlockModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={loading} disabled={!blockerReason.trim()}>
              Confirm & Flag Blocker
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

