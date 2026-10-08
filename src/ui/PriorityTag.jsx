import { priorityLabel } from '../lib/priorities.js'

/** @param {{ priority: import('../lib/priorities.js').PriorityId }} props */
export function PriorityTag({ priority }) {
  return (
    <span className="tag" data-priority={priority}>
      <span className="tag__dot" aria-hidden="true" />
      {priorityLabel(priority)}
    </span>
  )
}
