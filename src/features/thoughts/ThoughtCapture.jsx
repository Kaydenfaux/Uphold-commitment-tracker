import { useState } from 'react'
import { TEXT_LIMIT, createThought } from '../../lib/model.js'
import { useStore } from '../../store/useStore.js'
import { CharCount } from '../../ui/CharCount.jsx'

export function ThoughtCapture() {
  const { dispatch } = useStore()
  const [text, setText] = useState('')

  function save() {
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({ type: 'add', collection: 'thoughts', item: createThought({ text: trimmed }) })
    setText('')
  }

  return (
    <form
      className="capture"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <textarea
        className="capture__input"
        rows={3}
        maxLength={TEXT_LIMIT}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            save()
          }
        }}
        placeholder="What’s on your mind? Get it down now, sort it out later."
        aria-label="New thought"
      />
      <div className="capture__foot">
        <span className="capture__hint">Ctrl + Enter to save · press T on any page for a new thought</span>
        <CharCount length={text.length} max={TEXT_LIMIT} />
        <button type="submit" className="btn btn--primary btn--sm" disabled={!text.trim()}>
          Save thought
        </button>
      </div>
    </form>
  )
}
