import { useRef, useState } from 'react'
import { downloadBackup, formatLastExport, getLastExport, readBackup } from '../../lib/backup.js'
import { useStore } from '../../store/useStore.js'
import { useConfirm } from '../../ui/confirm/useConfirm.js'
import { Dialog } from '../../ui/Dialog.jsx'

/** @param {number} n @param {string} word */
function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

export function BackupButton() {
  const { state, dispatch } = useStore()
  const confirm = useConfirm()
  const [open, setOpen] = useState(false)
  const [lastExport, setLastExport] = useState(getLastExport)
  const [error, setError] = useState('')
  const fileInput = useRef(/** @type {HTMLInputElement | null} */ (null))

  function close() {
    setOpen(false)
    setError('')
  }

  function handleExport() {
    downloadBackup(state)
    setLastExport(getLastExport())
  }

  /** @param {import('react').ChangeEvent<HTMLInputElement>} e */
  async function handleImport(e) {
    const file = e.target.files?.[0]
    // Reset so picking the same file again still fires a change.
    e.target.value = ''
    if (!file) return

    const imported = await readBackup(file)
    if (!imported) {
      setError('That file isn’t an Uphold backup.')
      return
    }

    // Close first so the confirm isn't stacked on top of this dialog.
    close()
    const ok = await confirm({
      title: 'Replace your data?',
      message: `This backup has ${plural(imported.commitments.length, 'commitment')} and ${plural(imported.thoughts.length, 'thought')}. It will replace everything currently in Uphold.`,
      confirmLabel: 'Replace',
      danger: true,
    })
    if (ok) dispatch({ type: 'replace', state: imported })
  }

  return (
    <>
      <button type="button" className="btn btn--sm backup-btn" onClick={() => setOpen(true)}>
        Backup
      </button>
      {open && (
        <Dialog title="Backup" onClose={close}>
          <div className="form">
            <p className="confirm__message">
              Your data only lives in this browser. Export a backup before clearing your cache, then import it to
              restore.
            </p>
            <p className="backup__last">{formatLastExport(lastExport)}</p>
            {error && (
              <p className="backup__error" role="alert">
                {error}
              </p>
            )}
            <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={handleImport} />
            <div className="form__actions">
              <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
                Import…
              </button>
              <button type="button" className="btn btn--primary" onClick={handleExport}>
                Export
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}
