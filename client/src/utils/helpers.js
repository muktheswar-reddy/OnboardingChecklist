import { differenceInDays, parseISO, isValid } from 'date-fns'

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

export function getStatusColor(status) {
  const map = {
    not_started: 'var(--color-text-muted)',
    in_progress: 'var(--color-info)',
    completed: 'var(--color-success)',
    blocked: 'var(--color-danger)',
    overdue: 'var(--color-warning)',
    pending: 'var(--color-text-muted)',
    delayed: 'var(--color-warning)',
    cancelled: 'var(--color-danger)',
  }
  return map[status] || 'var(--color-text-muted)'
}

export function getPriorityColor(priority) {
  const map = {
    low: 'var(--color-success)',
    medium: 'var(--color-info)',
    high: 'var(--color-warning)',
    critical: 'var(--color-danger)',
  }
  return map[priority] || 'var(--color-text-muted)'
}

export function calculateDaysUntilDue(dueDate) {
  if (!dueDate) return null
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : new Date(dueDate)
  if (!isValid(d)) return null
  return differenceInDays(d, new Date())
}

export function calculateDaysBlocked(blockedAt) {
  if (!blockedAt) return 0
  const d = typeof blockedAt === 'string' ? parseISO(blockedAt) : new Date(blockedAt)
  if (!isValid(d)) return 0
  return Math.abs(differenceInDays(new Date(), d))
}

export function getAvatarColor(name) {
  const colors = [
    '#4F6BF4', '#7C3AED', '#EC4899', '#EF4444',
    '#F59E0B', '#22C55E', '#14B8A6', '#3B82F6',
    '#8B5CF6', '#06B6D4',
  ]
  if (!name) return colors[0]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const val = typeof key === 'function' ? key(item) : item[key]
    return { ...groups, [val]: [...(groups[val] || []), item] }
  }, {})
}

export function sortBy(array, key, direction = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key]
    const bVal = typeof key === 'function' ? key(b) : b[key]
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function omit(obj, keys) {
  const result = { ...obj }
  keys.forEach(k => delete result[k])
  return result
}

export function pick(obj, keys) {
  return keys.reduce((acc, k) => {
    if (k in obj) acc[k] = obj[k]
    return acc
  }, {})
}

export function isOverdue(dueDate) {
  if (!dueDate) return false
  const days = calculateDaysUntilDue(dueDate)
  return days !== null && days < 0
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
