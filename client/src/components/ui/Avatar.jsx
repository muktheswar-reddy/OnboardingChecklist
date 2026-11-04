import React from 'react'
import { getInitials, getAvatarColor } from '../../utils/helpers'

function Avatar({ name, src, size = 'md', className = '' }) {
  const initials = getInitials(name)
  const bgColor = getAvatarColor(name)

  if (src) {
    return (
      <div className={`avatar avatar-${size} ${className}`}>
        <img src={src} alt={name || 'Avatar'} onError={(e) => { e.currentTarget.style.display = 'none' }} />
      </div>
    )
  }

  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ background: bgColor, color: '#fff' }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  )
}

export default Avatar
