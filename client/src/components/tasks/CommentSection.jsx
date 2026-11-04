import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function CommentSection({ comments = [], onAddComment, loading = false }) {
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      await onAddComment(newComment.trim())
      setNewComment('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>
        Comments & Discussions ({comments.length})
      </h4>

      {comments.length === 0 ? (
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
          No comments yet. Start a discussion or add notes for this onboarding task.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                display: 'flex',
                gap: '10px',
                padding: 'var(--space-3)',
                background: 'var(--color-surface-hover)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Avatar name={comment.author?.name || 'User'} size="sm" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-text)' }}>
                    {comment.author?.name || 'Team Member'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text)', marginTop: '4px', margin: 0 }}>
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Add a comment or update..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button type="submit" variant="primary" size="sm" loading={submitting} disabled={!newComment.trim()}>
          Post
        </Button>
      </form>
    </div>
  )
}
