import { isConsolidated } from '../lib/model.js'
import { PRIORITIES } from '../lib/priorities.js'
import { useStore } from '../store/useStore.js'

/**
 * `children` sit at the far end of the bar (e.g. search), so this stays free of feature code.
 * @param {{ current: string, children?: import('react').ReactNode }} props
 */
export function Header({ current, children }) {
  const { state } = useStore()

  const nav = [
    { view: '', label: 'Home', count: null },
    { view: 'commitments', label: 'Commitments', count: state.commitments.filter((c) => !c.done).length },
    { view: 'thoughts', label: 'Thoughts', count: state.thoughts.filter((t) => !isConsolidated(t)).length },
    { view: 'archive', label: 'Archive', count: state.commitments.filter((c) => c.done).length },
  ]

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <a className="brand" href="#/">
          <span className="brand__mark" aria-hidden="true">
            {PRIORITIES.map((p) => (
              <span key={p.id} data-priority={p.id} />
            ))}
          </span>
          uphold
        </a>

        <nav className="nav" aria-label="Main">
          {nav.map((item) => (
            <a key={item.view} href={`#/${item.view}`} aria-current={current === item.view ? 'page' : undefined}>
              {item.label}
              {item.count !== null && <span className="nav__count">{item.count}</span>}
            </a>
          ))}
        </nav>

        {children && <div className="topbar__actions">{children}</div>}
      </div>
    </header>
  )
}
