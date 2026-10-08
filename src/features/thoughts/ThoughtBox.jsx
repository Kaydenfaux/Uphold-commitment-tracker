import { formatMoment } from '../../lib/dates.js'
import { useDeleteThought } from './useDeleteThought.js'

/** @typedef {import('../../lib/model.js').Thought} Thought */

/**
 * A loose thought on the Thoughts page, shaped like a commitment box.
 * @param {{ thought: Thought, onOpen: (t: Thought) => void, onConsolidate: (t: Thought) => void }} props
 */
export function ThoughtBox({ thought, onOpen, onConsolidate }) {
  const deleteThought = useDeleteThought()
  return (
    <div className="box-item">
      <div className="box box--thought">
        <button type="button" className="box__hit" onClick={() => onOpen(thought)}>
          <span className="box__thought">{thought.text}</span>
        </button>
        <span className="box__foot">
          <span>{formatMoment(thought.createdAt)}</span>
          <button type="button" className="btn btn--sm box__consolidate" onClick={() => onConsolidate(thought)}>
            Consolidate
          </button>
        </span>
      </div>
      <button
        type="button"
        className="icon-btn box__delete"
        aria-label="Delete this thought"
        title="Delete"
        onClick={() => deleteThought(thought)}
      >
        ×
      </button>
    </div>
  )
}
