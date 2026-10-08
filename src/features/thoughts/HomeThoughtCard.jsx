import { formatMoment } from '../../lib/dates.js'

/** @typedef {import('../../lib/model.js').Thought} Thought */

/** @param {{ thought: Thought, onOpen: (t: Thought) => void }} props */
export function HomeThoughtCard({ thought, onOpen }) {
  return (
    <li className="thought">
      <button type="button" className="thought__body" onClick={() => onOpen(thought)}>
        <span className="thought__text">{thought.text}</span>
        <span className="thought__when">{formatMoment(thought.createdAt)}</span>
      </button>
    </li>
  )
}
