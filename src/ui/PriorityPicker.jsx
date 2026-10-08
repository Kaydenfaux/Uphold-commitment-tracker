import { useId } from 'react'
import { PRIORITIES } from '../lib/priorities.js'

/**
 * @param {{
 *   value: import('../lib/priorities.js').PriorityId,
 *   onChange: (value: import('../lib/priorities.js').PriorityId) => void,
 *   compact?: boolean
 * }} props
 */
export function PriorityPicker({ value, onChange, compact = false }) {
  const name = useId()
  return (
    <fieldset className={compact ? 'picker picker--compact' : 'picker'}>
      <legend className={compact ? 'sr-only' : 'field__label'}>Priority</legend>
      <div className="picker__options">
        {PRIORITIES.map((p) => (
          <label key={p.id} className="picker__opt" data-priority={p.id} title={compact ? `${p.label}: ${p.hint}` : p.hint}>
            <input
              type="radio"
              name={name}
              value={p.id}
              checked={value === p.id}
              onChange={() => onChange(p.id)}
            />
            <span className="picker__dot" aria-hidden="true" />
            <span className={compact ? 'sr-only' : undefined}>{p.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
