/** @param {{ title: string, children?: import('react').ReactNode }} props */
export function EmptyState({ title, children }) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      {children}
    </div>
  )
}
