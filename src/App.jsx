import { useEffect } from 'react'
import { ArchiveView } from './features/archive/ArchiveView.jsx'
import { BackupButton } from './features/backup/BackupButton.jsx'
import { CommitmentDetailView } from './features/commitments/CommitmentDetailView.jsx'
import { CommitmentsView } from './features/commitments/CommitmentsView.jsx'
import { HomeView } from './features/home/HomeView.jsx'
import { SearchButton } from './features/search/SearchButton.jsx'
import { NoteDetailView } from './features/thoughts/NoteDetailView.jsx'
import { QuickCapture } from './features/thoughts/QuickCapture.jsx'
import { ThoughtsView } from './features/thoughts/ThoughtsView.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'
import { Header } from './ui/Header.jsx'

/** @param {{ view: string, param: string }} route */
function renderView({ view, param }) {
  switch (view) {
    case 'commitments':
      return param ? <CommitmentDetailView key={param} id={param} /> : <CommitmentsView />
    case 'thoughts':
      return param ? <NoteDetailView key={param} id={param} /> : <ThoughtsView />
    case 'archive':
      return <ArchiveView />
    default:
      return <HomeView />
  }
}

export function App() {
  const route = useHashRoute()

  // Hash changes don't reset scroll like real page loads do.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.view, route.param])

  return (
    <>
      <Header current={route.view}>
        <SearchButton />
        <BackupButton />
      </Header>
      <main className="container main">{renderView(route)}</main>
      <QuickCapture />
    </>
  )
}
