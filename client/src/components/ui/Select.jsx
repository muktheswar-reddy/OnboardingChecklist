import React, { forwardRef } from 'react'

const Select = forwardRef(function Select({
  label,
  error,
  helper,
  options = [],
  placeholder = 'Select...',
  required = false,
  className = '',
  id,
  ...rest
}, ref) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`form-select ${error ? 'error' : ''} ${className}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => {
          const value = typeof opt === 'object' ? opt.value : opt
          const label = typeof opt === 'object' ? opt.label : opt
          return (
            <option key={value} value={value}>{label}</option>
          )
        })}
      </select>
      {error && <span className="form-error">{error}</span>}
      {!error && helper && <span className="form-helper">{helper}</span>}
    </div>
  )
})

export default Select
