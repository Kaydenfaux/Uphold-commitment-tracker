import { useState } from 'react'
import { formatMoment } from '../../lib/dates.js'
import { createThought, isConsolidated } from '../../lib/model.js'
import { useStore } from '../../store/useStore.js'
import { EmptyState } from '../../ui/EmptyState.jsx'
import { useConfirm } from '../../ui/confirm/useConfirm.js'
import { ThoughtDialog } from './ThoughtDialog.jsx'

function backToThoughts() {
  window.location.hash = '#/thoughts'
}

/** @param {{ id: string }} props */
export function NoteDetailView({ id }) {
  const { state, dispatch } = useStore()
  const confirm = useConfirm()
  const [editing, setEditing] = useState(false)

  const note = state.thoughts.find((t) => t.id === id)
  if (!note || !isConsolidated(note)) {
    return (
      <EmptyState title="This note doesn’t exist any more.">
        <a href="#/thoughts">Back to thoughts</a>
      </EmptyState>
    )
  }

  const count = note.sources.length

  async function handleSplit() {
    if (!note) return
    const ok = await confirm({
      title: 'Split this note back up?',
      message: `Its ${count} original thought${count === 1 ? '' : 's'} go back to loose thoughts, and the note’s own text is lost.`,
      confirmLabel: 'Split back',
      danger: true,
    })
    if (!ok) return
    const thoughts = note.sources.map((s) => createThought({ text: s.text, createdAt: s.createdAt, updatedAt: s.createdAt }))
    dispatch({ type: 'split', id: note.id, thoughts })
    backToThoughts()
  }

  return (
    <>
      <a className="back-link" href="#/thoughts">Back to thoughts</a>

      <header className="detail-head detail-head--neutral">
        <div>
          <h1 className="page-title">{note.title || 'Untitled'}</h1>
          <p className="detail-head__meta">
            <span className="tag">Consolidated</span>
            <span>Updated {formatMoment(note.updatedAt).toLowerCase()}</span>
          </p>
        </div>
        <div className="detail-head__actions">
          <button type="button" className="btn" onClick={handleSplit}>
            Split back
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setEditing(true)}>
            Edit
          </button>
        </div>
      </header>

      <div className="detail">
        <section className="detail__main" aria-label="Note">
          <p className="detail__text">{note.text}</p>
        </section>

        <aside className="panel detail__aside" aria-labelledby="sources-title">
          <h2 id="sources-title" className="panel__title">
            Made from {count} thought{count === 1 ? '' : 's'}
          </h2>
          <ul className="sources">
            {note.sources.map((s, i) => (
              <li key={i}>
                <span className="sources__text">{s.text}</span>
                <span className="sources__when">{formatMoment(s.createdAt)}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {editing && (
        <ThoughtDialog
          thought={note}
          onClose={() => setEditing(false)}
          onDeleted={backToThoughts}
        />
      )}
    </>
  )
}
