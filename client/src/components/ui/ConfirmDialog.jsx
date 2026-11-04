import React from 'react'
import Modal from './Modal'
import Button from './Button'

function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', loading = false }) {
  const icons = { danger: '⚠️', warning: '⚠️', success: '✅', info: 'ℹ️' }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="confirm-dialog">
        <div className="confirm-dialog-icon">{icons[variant] || '⚠️'}</div>
        <div className="confirm-dialog-title">{title}</div>
        {message && <p className="confirm-dialog-desc">{message}</p>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
