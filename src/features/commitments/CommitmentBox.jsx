import { useStore } from '../../store/useStore.js'
import { DueDate } from '../../ui/DueDate.jsx'
import { PriorityTag } from '../../ui/PriorityTag.jsx'
import { useCommitmentDrag } from './drag/useCommitmentDrag.js'
import { useCompleteCommitment } from './useCompleteCommitment.js'
import { useDeleteCommitment } from './useDeleteCommitment.js'

/** @param {{ commitment: import('../../lib/model.js').Commitment, sortable?: boolean }} props */
export function CommitmentBox({ commitment, sortable = false }) {
  const { dispatch } = useStore()
  const deleteCommitment = useDeleteCommitment()
  const completeCommitment = useCompleteCommitment()
  const dnd = useCommitmentDrag()
  const { steps } = commitment
  const doneCount = steps.filter((s) => s.done).length
  const next = steps.find((s) => !s.done)
  const percent = steps.length ? Math.round((doneCount / steps.length) * 100) : 0
  const lifted = dnd?.drag?.id === commitment.id ? dnd.drag : null

  return (
    <div
      className="box-item"
      data-commitment-id={commitment.id}
      data-lifted={lifted !== null}
      style={
        lifted
          ? {
              width: lifted.width,
              height: lifted.height,
              transform: `translate(${lifted.x - lifted.offsetX}px, ${lifted.y - lifted.offsetY}px)`,
            }
          : undefined
      }
    >
      {/* The footer sits outside the link so it can hold the Complete / Reopen button. */}
      <div className="box box--commitment" data-priority={commitment.priority} data-done={commitment.done}>
        <a
          className="box__link"
          href={`#/commitments/${commitment.id}`}
          // The browser's own link dragging would fight the pointer-based drag.
          draggable={false}
          onPointerDown={sortable && dnd ? (e) => dnd.startDrag(e, commitment.id) : undefined}
        >
          <span className="box__title">{commitment.title}</span>
          {commitment.note && <span className="box__note">{commitment.note}</span>}
          {next && (
            <span className="box__next">
              <span className="box__next-label">Next</span>
              <span className="box__next-title">{next.title}</span>
            </span>
          )}
        </a>
        <span className="box__foot">
          <span className="box__stats">
            {commitment.done ? <span className="tag">Completed</span> : <PriorityTag priority={commitment.priority} />}
            {steps.length > 0 && (
              <span className="box__meter" aria-hidden="true">
                <span style={{ width: `${percent}%` }} />
              </span>
            )}
            {steps.length > 0 && (
              <span className="box__count">
                {doneCount}/{steps.length} steps
              </span>
            )}
          </span>
          <span className="box__actions">
            <DueDate due={commitment.due} done={commitment.done} />
            {commitment.done ? (
              <button
                type="button"
                className="btn btn--sm box__action"
                onClick={() => dispatch({ type: 'setCommitmentDone', id: commitment.id, done: false })}
              >
                Reopen
              </button>
            ) : (
              <button type="button" className="btn btn--sm box__action" onClick={() => completeCommitment(commitment)}>
                Complete
              </button>
            )}
          </span>
        </span>
      </div>
      <button
        type="button"
        className="icon-btn box__delete"
        aria-label={`Delete “${commitment.title}”`}
        title="Delete"
        onClick={() => deleteCommitment(commitment)}
      >
        ×
      </button>
    </div>
  )
}
