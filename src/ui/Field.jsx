/**
 * `aside` sits at the end of the label row, e.g. a character count.
 * @param {{ label: string, aside?: import('react').ReactNode, children: import('react').ReactNode }} props
 */
export function Field({ label, aside, children }) {
  return (
    <label className="field">
      {aside ? (
        <span className="field__head">
          <span className="field__label">{label}</span>
          {aside}
        </span>
      ) : (
        <span className="field__label">{label}</span>
      )}
      {children}
    </label>
  )
}
