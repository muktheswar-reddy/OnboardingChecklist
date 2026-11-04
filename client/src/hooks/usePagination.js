import { useState, useCallback } from 'react'

function usePagination(defaultLimit = 10) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(defaultLimit)
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / limit)

  const goToPage = useCallback((p) => {
    setPage(Math.max(1, Math.min(p, totalPages || 1)))
  }, [totalPages])

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage])
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage])

  const reset = useCallback(() => setPage(1), [])

  return {
    page,
    limit,
    total,
    totalPages,
    setPage: goToPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    reset,
    offset: (page - 1) * limit,
  }
}

export default usePagination
