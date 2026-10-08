import { useState } from 'react'
import { useStore } from '../../store/useStore.js'
import { DueDate } from '../../ui/DueDate.jsx'
import { EmptyState } from '../../ui/EmptyState.jsx'
import { PriorityTag } from '../../ui/PriorityTag.jsx'
import { Progress } from '../../ui/Progress.jsx'
import { CommitmentDialog } from './CommitmentDialog.jsx'
import { StepList } from './StepList.jsx'
import { useCompleteCommitment } from './useCompleteCommitment.js'

/** @param {{ id: string }} props */
export function CommitmentDetailView({ id }) {
  const { state, dispatch } = useStore()
  const completeCommitment = useCompleteCommitment()
  const [editing, setEditing] = useState(false)

  const commitment = state.commitments.find((c) => c.id === id)
  if (!commitment) {
    return (
      <EmptyState title="This commitment doesn’t exist any more.">
        <a href="#/commitments">Back to commitments</a>
      </EmptyState>
    )
  }

  const { steps } = commitment
  const done = steps.filter((s) => s.done).length

  async function handleToggleDone() {
    if (!commitment) return
    // Either way you're done with this page, so go back to where it came from.
    if (commitment.done) {
      dispatch({ type: 'setCommitmentDone', id: commitment.id, done: false })
      window.location.hash = '#/archive'
      return
    }
    // A completed commitment is finished with, so go back to the ones still open.
    if (await completeCommitment(commitment)) window.location.hash = '#/commitments'
  }

  return (
    <>
      {commitment.done ? (
        <a className="back-link" href="#/archive">Back to archive</a>
      ) : (
        <a className="back-link" href="#/commitments">Back to commitments</a>
      )}

      <header className="detail-head" data-priority={commitment.priority}>
        <div>
          <h1 className="page-title">{commitment.title}</h1>
          <p className="detail-head__meta">
            {commitment.done ? <span className="tag">Completed</span> : <PriorityTag priority={commitment.priority} />}
            {commitment.due && (
              <span>
                Target <DueDate due={commitment.due} done={commitment.done} />
              </span>
            )}
          </p>
        </div>
        <div className="detail-head__actions">
          <button type="button" className="btn" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button type="button" className={commitment.done ? 'btn' : 'btn btn--primary'} onClick={handleToggleDone}>
            {commitment.done ? 'Reopen' : 'Mark as completed'}
          </button>
        </div>
      </header>

      <div className="detail">
        <section className="detail__main" aria-labelledby="steps-title">
          <h2 id="steps-title" className="section-title">Steps</h2>
          <StepList commitment={commitment} />
        </section>

        <aside className="panel detail__aside" aria-label="Summary">
          {steps.length > 0 && <Progress done={done} total={steps.length} />}
          {commitment.note ? (
            <p className="detail__note">{commitment.note}</p>
          ) : (
            <button type="button" className="btn btn--quiet btn--sm detail__add-note" onClick={() => setEditing(true)}>
              Add why it matters
            </button>
          )}
        </aside>
      </div>

      {editing && (
        <CommitmentDialog
          commitment={commitment}
          onClose={() => setEditing(false)}
          onDeleted={() => {
            window.location.hash = '#/commitments'
          }}
        />
      )}
    </>
  )
}
