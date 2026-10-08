import { useState } from 'react'
import { createStep } from '../../lib/model.js'
import { useStore } from '../../store/useStore.js'

/** @param {{ commitment: import('../../lib/model.js').Commitment }} props */
export function StepList({ commitment }) {
  const { dispatch } = useStore()
  const [title, setTitle] = useState('')
  const { id, steps } = commitment

  const setSteps = (/** @type {import('../../lib/model.js').Step[]} */ next) =>
    dispatch({ type: 'update', collection: 'commitments', id, patch: { steps: next } })

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  function handleAdd(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setSteps([...steps, createStep({ title: trimmed })])
    setTitle('')
  }

  return (
    <div className="stack" data-priority={commitment.priority}>
      {steps.length > 0 && (
        <ul className="step-list">
          {steps.map((step) => (
            <li key={step.id} className="step" data-done={step.done}>
              <label className="step__label">
                <input
                  type="checkbox"
                  className="check"
                  checked={step.done}
                  onChange={() => dispatch({ type: 'toggleStep', commitmentId: id, stepId: step.id })}
                />
                <span className="step__title">{step.title}</span>
              </label>
              <button
                type="button"
                className="icon-btn"
                aria-label={`Remove step “${step.title}”`}
                onClick={() => setSteps(steps.filter((s) => s.id !== step.id))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <form className="inline-add" onSubmit={handleAdd}>
        <input
          className="inline-add__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a step…"
          aria-label="Add a step"
        />
        <button type="submit" className="btn btn--primary btn--sm" disabled={!title.trim()}>
          Add
        </button>
      </form>
    </div>
  )
}
