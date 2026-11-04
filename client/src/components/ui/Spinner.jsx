import React from 'react'

function Spinner({ size = 'md', className = '' }) {
  return <div className={`spinner spinner-${size} ${className}`} role="status" aria-label="Loading" />
}

export default Spinner
