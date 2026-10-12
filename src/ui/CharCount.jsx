/** Stays out of the way until you're close to the limit. */
const SHOW_WITHIN = 20

/** @param {{ length: number, max: number }} props */
export function CharCount({ length, max }) {
  if (length < max - SHOW_WITHIN) return null
  return (
    <span className="char-count" data-full={length >= max} aria-live="polite">
      {length}/{max}
    </span>
  )
}
