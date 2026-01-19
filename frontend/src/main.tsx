import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ApiProvider } from './context/ApiContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <ToastProvider>
                <ApiProvider>
                    <App />
                </ApiProvider>
            </ToastProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
