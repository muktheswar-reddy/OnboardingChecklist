import { useState, useCallback } from 'react'

/**
 * Generic async data-fetching hook.
 * Returns { data, loading, error, execute }
 */
function useApi(apiFn, initialData = null) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFn(...args)
      setData(result)
      return result
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFn])

  const reset = useCallback(() => {
    setData(initialData)
    setError(null)
    setLoading(false)
  }, [initialData])

  return { data, loading, error, execute, setData, reset }
}

export default useApi
