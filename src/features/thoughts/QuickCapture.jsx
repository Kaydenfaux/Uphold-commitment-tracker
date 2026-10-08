import { useEffect, useState } from 'react'
import { createThought } from '../../lib/model.js'
import { ThoughtDialog } from './ThoughtDialog.jsx'

/** @param {EventTarget | null} target */
function isTyping(target) {
  return target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select') !== null)
}

/** Pressing T on any page opens "Add a thought", unless you're already typing or in a dialog. */
export function QuickCapture() {
  const [creating, setCreating] = useState(/** @type {import('../../lib/model.js').Thought | null} */ (null))

  useEffect(() => {
    /** @param {KeyboardEvent} e */
    function handleKeyDown(e) {
      if (e.key.toLowerCase() !== 't' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (isTyping(e.target) || document.querySelector('dialog[open]')) return
      // Otherwise the "t" could land in the dialog's text box.
      e.preventDefault()
      setCreating(createThought())
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return creating && <ThoughtDialog key={creating.id} thought={creating} onClose={() => setCreating(null)} />
}
