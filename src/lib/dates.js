/** @param {number} n */
function pad(n) {
  return String(n).padStart(2, '0')
}

/** @param {Date} date */
function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * Parses YYYY-MM-DD as a local date; `new Date('2026-01-01')` would be UTC
 * and can land on the previous day west of Greenwich.
 * @param {string} iso
 */
function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** @param {number} [offsetDays] */
export function isoDateFromToday(offsetDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return toISODate(date)
}

/** @param {string} iso */
function daysFromToday(iso) {
  const today = fromISODate(isoDateFromToday())
  return Math.round((fromISODate(iso).getTime() - today.getTime()) / 86_400_000)
}

/**
 * @param {string} due
 * @returns {'overdue' | 'today' | 'soon' | 'later' | ''}
 */
export function dueStatus(due) {
  if (!due) return ''
  const days = daysFromToday(due)
  if (days < 0) return 'overdue'
  if (days === 0) return 'today'
  if (days <= 7) return 'soon'
  return 'later'
}

/** @param {string} due */
export function formatDue(due) {
  if (!due) return ''
  const days = daysFromToday(due)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  const date = fromISODate(due)
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString(undefined, {
    weekday: Math.abs(days) < 7 ? 'short' : undefined,
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  })
}

/**
 * When a thought was written: "Today, 14:02", "Yesterday, 09:10" or "3 Sep".
 * @param {number} timestamp
 */
export function formatMoment(timestamp) {
  const date = new Date(timestamp)
  const days = daysFromToday(toISODate(date))
  const clock = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  if (days === 0) return `Today, ${clock}`
  if (days === -1) return `Yesterday, ${clock}`
  return formatDue(toISODate(date))
}
