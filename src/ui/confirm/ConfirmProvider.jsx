import { useCallback, useRef, useState } from 'react'
import { Dialog } from '../Dialog.jsx'
import { ConfirmContext } from './ConfirmContext.js'

/** @typedef {import('./ConfirmContext.js').ConfirmOptions} ConfirmOptions */

/** @param {{ children: import('react').ReactNode }} props */
export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(/** @type {ConfirmOptions | null} */ (null))
  const resolver = useRef(/** @type {((ok: boolean) => void) | null} */ (null))

  const confirm = useCallback(
    (/** @type {ConfirmOptions} */ next) =>
      new Promise((resolve) => {
        // A second request answers the first as cancelled rather than leaving it hanging.
        resolver.current?.(false)
        resolver.current = resolve
        setOptions(next)
      }),
    [],
  )

  /** @param {boolean} ok */
  function finish(ok) {
    resolver.current?.(ok)
    resolver.current = null
    setOptions(null)
  }

  return (
    <ConfirmContext value={confirm}>
      {children}
      {options && (
        <Dialog title={options.title} onClose={() => finish(false)}>
          <div className="form">
            {options.message && <p className="confirm__message">{options.message}</p>}
            <div className="form__actions">
              <button type="button" className="btn" onClick={() => finish(false)}>
                Cancel
              </button>
              <button
                type="button"
                className={options.danger ? 'btn btn--solid-danger' : 'btn btn--primary'}
                onClick={() => finish(true)}
                autoFocus
              >
                {options.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </ConfirmContext>
  )
}
