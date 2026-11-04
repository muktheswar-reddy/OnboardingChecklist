import React, { useState, useEffect } from 'react'
import useDebounce from '../../hooks/useDebounce'

function SearchInput({ placeholder = 'Search...', onSearch, value: controlledValue, className = '' }) {
  const [value, setValue] = useState(controlledValue || '')
  const debouncedValue = useDebounce(value, 400)

  useEffect(() => {
    if (onSearch) onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue)
  }, [controlledValue])

  const handleClear = () => {
    setValue('')
    if (onSearch) onSearch('')
  }

  return (
    <div className={`search-input-wrapper ${className}`}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="form-input search-input"
      />
      {value && (
        <button className="search-clear" onClick={handleClear} aria-label="Clear search">×</button>
      )}
    </div>
  )
}

export default SearchInput
