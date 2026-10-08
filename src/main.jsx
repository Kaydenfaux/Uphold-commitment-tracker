import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { StoreProvider } from './store/StoreProvider.jsx'
import { ConfirmProvider } from './ui/confirm/ConfirmProvider.jsx'
// Order matters: tokens and base first, then shared UI, then features that build on it.
import './ui/base.css'
import './ui/layout.css'
import './ui/controls.css'
import './ui/box.css'
import './features/commitments/commitments.css'
import './features/thoughts/thoughts.css'
import './features/home/home.css'
import './features/archive/archive.css'
import './features/search/search.css'
import './features/backup/backup.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </StoreProvider>
  </StrictMode>,
)
