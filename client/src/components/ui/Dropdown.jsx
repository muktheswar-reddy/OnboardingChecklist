import React, { useState, useRef, useEffect } from 'react'

function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="dropdown" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div className={`dropdown-menu ${align === 'left' ? 'left' : ''}`} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ onClick, icon, children, className = '' }) {
  return (
    <button className={`dropdown-item ${className}`} onClick={onClick}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="dropdown-divider" />
}

export function DropdownLabel({ children }) {
  return <div className="dropdown-label">{children}</div>
}

export default Dropdown
