import React from 'react'
import EmptyState from './EmptyState'
import Skeleton, { SkeletonTable } from './Skeleton'

function Table({ columns = [], data = [], loading = false, emptyTitle = 'No data', emptyDesc = '', keyField = '_id' }) {
  if (loading) return <SkeletonTable rows={5} cols={columns.length} />

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDesc} />
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row[keyField] || row.id || i}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
