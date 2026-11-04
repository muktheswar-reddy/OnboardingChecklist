import React, { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  helper,
  prefix,
  suffix,
  required = false,
  className = '',
  id,
  ...rest
}, ref) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`form-input ${prefix ? 'has-prefix' : ''} ${suffix ? 'has-suffix' : ''} ${error ? 'error' : ''} ${className}`}
          {...rest}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="form-error">{error}</span>}
      {!error && helper && <span className="form-helper">{helper}</span>}
    </div>
  )
})

export default Input
