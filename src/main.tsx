import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui'
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlinkProvider projectId={import.meta.env.VITE_BLINK_PROJECT_ID}>
      <BlinkAuthProvider>
        <QueryClientProvider client={queryClient}>
          <BlinkUIProvider theme="linear" darkMode="system">
            <Toaster position="top-right" />
            <App />
          </BlinkUIProvider>
        </QueryClientProvider>
      </BlinkAuthProvider>
    </BlinkProvider>
  </React.StrictMode>,
)
