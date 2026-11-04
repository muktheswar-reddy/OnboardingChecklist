import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useDebounce from '../../hooks/useDebounce'

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('updates value after specified delay', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'first' }
    })

    rerender({ val: 'second' })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('second')
  })
})
