import { useEffect, useId, useRef } from 'react'

/**
 * Native <dialog> gives focus trapping, Escape to close and inert
 * background for free.
 * @param {{ title: string, onClose: () => void, children: import('react').ReactNode }} props
 */
export function Dialog({ title, onClose, children }) {
  const ref = useRef(/** @type {HTMLDialogElement | null} */ (null))
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dialog__inner">
        <h2 id={titleId} className="dialog__title">{title}</h2>
        {children}
      </div>
    </dialog>
  )
}
