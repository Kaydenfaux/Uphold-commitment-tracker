import { useState } from 'react'
import { formatMoment } from '../../lib/dates.js'
import { priorityLabel } from '../../lib/priorities.js'
import { search } from '../../lib/search.js'
import { useStore } from '../../store/useStore.js'
import { Dialog } from '../../ui/Dialog.jsx'

/** @typedef {import('../../lib/model.js').Thought} Thought */

/** @param {{ onClose: () => void, onOpenThought: (t: Thought) => void }} props */
export function SearchDialog({ onClose, onOpenThought }) {
  const { state } = useStore()
  const [query, setQuery] = useState('')

  const results = search(state, query)
  const total = results.commitments.length + results.notes.length + results.thoughts.length
  const categoryName = new Map(state.categories.map((s) => [s.id, s.name]))

  return (
    <Dialog title="Search" onClose={onClose}>
      <input
        className="input search__input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search commitments and thoughts"
        aria-label="Search commitments and thoughts"
      />

      {query.trim() && !total && <p className="search__empty">Nothing matches “{query.trim()}”.</p>}

      {total > 0 && (
        <div className="search__results">
          {results.commitments.length > 0 && (
            <section className="search__group" aria-label="Commitments">
              <h3 className="search__heading">Commitments</h3>
              <ul className="search__list">
                {results.commitments.map((c) => {
                  const category = c.done ? c.keptCategory : categoryName.get(c.categoryId)
                  return (
                    <li key={c.id}>
                      {/* Navigating doesn't close a modal on its own. */}
                      <a className="search__result" data-priority={c.priority} href={`#/commitments/${c.id}`} onClick={onClose}>
                        <span className="search__title">{c.title}</span>
                        <span className="search__meta">
                          {[c.done ? 'Completed' : priorityLabel(c.priority), category].filter(Boolean).join(' · ')}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {results.notes.length > 0 && (
            <section className="search__group" aria-label="Notes">
              <h3 className="search__heading">Notes</h3>
              <ul className="search__list">
                {results.notes.map((n) => (
                  <li key={n.id}>
                    <a className="search__result search__result--neutral" href={`#/thoughts/${n.id}`} onClick={onClose}>
                      <span className="search__title">{n.title || 'Untitled'}</span>
                      <span className="search__meta search__snippet">{n.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.thoughts.length > 0 && (
            <section className="search__group" aria-label="Loose thoughts">
              <h3 className="search__heading">Loose thoughts</h3>
              <ul className="search__list">
                {results.thoughts.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      className="search__result search__result--neutral"
                      onClick={() => onOpenThought(t)}
                    >
                      <span className="search__snippet">{t.text}</span>
                      <span className="search__meta">{formatMoment(t.createdAt)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Dialog>
  )
}
