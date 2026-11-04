import React from 'react'
import Spinner from './Spinner'

function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${loading ? 'loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <Spinner size="sm" className={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'spinner-white' : ''} />
      ) : icon ? (
        <span className="btn-icon">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}

export default Button
