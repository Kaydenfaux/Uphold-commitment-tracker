import { useState } from 'react'
import { isConsolidated } from '../../lib/model.js'
import { compareByOrder } from '../../lib/sort.js'
import { useStore } from '../../store/useStore.js'
import { EmptyState } from '../../ui/EmptyState.jsx'
import { AddCommitmentButton } from '../commitments/AddCommitmentButton.jsx'
import { CommitmentGrid } from '../commitments/CommitmentGrid.jsx'
import { HomeThoughtCard } from '../thoughts/HomeThoughtCard.jsx'
import { ThoughtCapture } from '../thoughts/ThoughtCapture.jsx'
import { ThoughtDialog } from '../thoughts/ThoughtDialog.jsx'

const RECENT_LIMIT = 6

/** @param {number} n @param {string} word */
function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

export function HomeView() {
  const { state } = useStore()
  const [editing, setEditing] = useState(/** @type {import('../../lib/model.js').Thought | null} */ (null))

  const active = state.commitments.filter((c) => !c.done).sort(compareByOrder)
  const loose = state.thoughts.filter((t) => !isConsolidated(t)).sort((a, b) => b.createdAt - a.createdAt)
  const now = new Date()

  return (
    <>
      <div className="home-top">
        <header className="today">
          <h1 className="today__date">
            <span className="today__weekday">{now.toLocaleDateString(undefined, { weekday: 'long' })}</span>
            <span>{now.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</span>
          </h1>
          <p className="today__summary">
            {plural(active.length, 'commitment')} to uphold, {plural(loose.length, 'loose thought')} to consolidate.
          </p>
        </header>
        <ThoughtCapture />
      </div>

      <section className="section" aria-labelledby="commitments-title">
        <div className="section-head">
          <h2 id="commitments-title" className="section-title">Commitments</h2>
          <div className="section-head__actions">
            <a className="section-head__link" href="#/commitments">All commitments</a>
            <AddCommitmentButton />
          </div>
        </div>
        <CommitmentGrid items={active} />
      </section>

      <section className="section" aria-labelledby="thoughts-title">
        <div className="section-head">
          <h2 id="thoughts-title" className="section-title">Loose thoughts</h2>
          <a className="section-head__link" href="#/thoughts">
            {loose.length ? 'Consolidate them' : 'All thoughts'}
          </a>
        </div>
        {loose.length ? (
          <ul className="thought-grid">
            {loose.slice(0, RECENT_LIMIT).map((t) => (
              <HomeThoughtCard key={t.id} thought={t} onOpen={setEditing} />
            ))}
          </ul>
        ) : (
          <EmptyState title="No loose thoughts. Everything’s been consolidated." />
        )}
      </section>

      {editing && <ThoughtDialog key={editing.id} thought={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
