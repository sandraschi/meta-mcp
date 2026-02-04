import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface LayoutProps {
    children: ReactNode
    currentPage: string
    onNavigate: (page: string) => void
    onShowLogger: () => void
    onShowHelp: () => void
}

export function Layout({ children, currentPage, onNavigate, onShowLogger, onShowHelp }: LayoutProps) {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Topbar title={currentPage} onShowLogger={onShowLogger} onShowHelp={onShowHelp} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
