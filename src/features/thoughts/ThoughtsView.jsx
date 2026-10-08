import { useState } from 'react'
import { isConsolidated } from '../../lib/model.js'
import { useStore } from '../../store/useStore.js'
import { EmptyState } from '../../ui/EmptyState.jsx'
import { AddThoughtButton } from './AddThoughtButton.jsx'
import { ConsolidateDialog } from './ConsolidateDialog.jsx'
import { NoteBox } from './NoteBox.jsx'
import { ThoughtBox } from './ThoughtBox.jsx'
import { ThoughtDialog } from './ThoughtDialog.jsx'

/** @typedef {import('../../lib/model.js').Thought} Thought */

export function ThoughtsView() {
  const { state } = useStore()
  const [consolidating, setConsolidating] = useState(/** @type {Thought | null} */ (null))
  const [editing, setEditing] = useState(/** @type {Thought | null} */ (null))

  const loose = state.thoughts.filter((t) => !isConsolidated(t)).sort((a, b) => b.createdAt - a.createdAt)
  const notes = state.thoughts.filter(isConsolidated).sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Thoughts</h1>
          <p className="page-intro">
            Jot thoughts down as they come. When one is ready, consolidate it into a note written in your own words.
          </p>
        </div>
        <AddThoughtButton />
      </header>

      <section className="group" aria-labelledby="loose-title">
        <div className="section-head">
          <h2 id="loose-title" className="section-title">
            Loose
            <span className="section-title__count">{loose.length}</span>
          </h2>
        </div>
        {loose.length ? (
          <div className="box-grid">
            {loose.map((t) => (
              <ThoughtBox key={t.id} thought={t} onOpen={setEditing} onConsolidate={setConsolidating} />
            ))}
          </div>
        ) : (
          <AddThoughtButton variant="tile" />
        )}
      </section>

      <section className="group" aria-labelledby="notes-title">
        <div className="section-head">
          <h2 id="notes-title" className="section-title">
            Consolidated
            <span className="section-title__count">{notes.length}</span>
          </h2>
        </div>
        {notes.length ? (
          <div className="box-grid">
            {notes.map((n) => (
              <NoteBox key={n.id} note={n} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nothing consolidated yet. Press Consolidate on a loose thought to turn it into a note." />
        )}
      </section>

      {consolidating && (
        <ConsolidateDialog key={consolidating.id} thought={consolidating} onClose={() => setConsolidating(null)} />
      )}
      {editing && <ThoughtDialog key={editing.id} thought={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
