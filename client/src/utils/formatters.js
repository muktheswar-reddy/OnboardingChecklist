import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

export function formatDate(date, fmt = 'MMM d, yyyy') {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (!isValid(d)) return '—'
  return format(d, fmt)
}

export function formatDateTime(date) {
  return formatDate(date, 'MMM d, yyyy h:mm a')
}

export function formatRelativeTime(date) {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (!isValid(d)) return '—'
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatPercent(value, decimals = 0) {
  if (value === null || value === undefined) return '—'
  return `${Number(value).toFixed(decimals)}%`
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

export function truncateText(text, maxLength = 60) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(1)} ${units[i]}`
}
