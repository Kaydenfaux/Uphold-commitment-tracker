import { formatMoment } from '../../lib/dates.js'
import { useDeleteThought } from './useDeleteThought.js'

/** @param {{ note: import('../../lib/model.js').Thought }} props */
export function NoteBox({ note }) {
  const deleteThought = useDeleteThought()
  const count = note.sources.length
  return (
    <div className="box-item">
      <a className="box box--note" href={`#/thoughts/${note.id}`}>
        <span className="box__title">{note.title || 'Untitled'}</span>
        <span className="box__note box__note--long">{note.text}</span>
        <span className="box__foot">
          <span className="tag">From {count} thought{count === 1 ? '' : 's'}</span>
          <span className="box__count">{formatMoment(note.updatedAt)}</span>
        </span>
      </a>
      <button
        type="button"
        className="icon-btn box__delete"
        aria-label={`Delete “${note.title || 'Untitled'}”`}
        title="Delete"
        onClick={() => deleteThought(note)}
      >
        ×
      </button>
    </div>
  )
}
