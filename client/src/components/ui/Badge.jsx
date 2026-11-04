import React from 'react'

function Badge({ variant = 'default', text, children }) {
  return (
    <span className={`badge badge-${variant}`}>
      {text || children}
    </span>
  )
}

export default Badge
