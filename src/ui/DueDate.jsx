import { dueStatus, formatDue } from '../lib/dates.js'

/** @param {{ due: string, done?: boolean }} props */
export function DueDate({ due, done = false }) {
  if (!due) return null
  const status = done ? '' : dueStatus(due)
  return (
    <span className={`due due--${status || 'none'}`}>
      {status === 'overdue' ? `Overdue, ${formatDue(due).toLowerCase()}` : formatDue(due)}
    </span>
  )
}
