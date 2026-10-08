/** @param {{ label: string, children: import('react').ReactNode }} props */
export function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
    </label>
  )
}
