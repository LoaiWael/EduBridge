import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register';
import './index.css'
import App from './App.tsx'

// Register the service worker
const { updateSW } = registerSW({
  onNeedRefresh() {
    // Prompt the user to update
    if (confirm("New content available. Reload to update?")) {
      updateSW(true); // This tells the service worker to activate the new version
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
