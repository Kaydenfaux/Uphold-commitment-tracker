/** @param {{ done: number, total: number }} props */
export function Progress({ done, total }) {
  const percent = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="progress">
      <div
        className="progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Steps done"
      >
        <span className="progress__bar" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress__label">
        {total ? `${done} of ${total} step${total === 1 ? '' : 's'} done` : 'No steps yet'}
      </span>
    </div>
  )
}
