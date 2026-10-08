import { useMemo, useSyncExternalStore } from 'react'

/** @param {() => void} onChange */
function subscribe(onChange) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function getHash() {
  return window.location.hash
}

/**
 * Hash routes (#/focus/abc) work on any static host with no server
 * rewrites, which suits a local-first app.
 * @returns {{ view: string, param: string }}
 */
export function useHashRoute() {
  const hash = useSyncExternalStore(subscribe, getHash)
  return useMemo(() => {
    const [view = '', param = ''] = hash.replace(/^#\/?/, '').split('/')
    return { view, param: decodeURIComponent(param) }
  }, [hash])
}
