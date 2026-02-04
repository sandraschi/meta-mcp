import { useState, useEffect } from 'react'
import { api, isSuccessResponse } from './api/client'
import { Layout } from './components/layout/Layout'
import { LoggerModal } from './components/modals/LoggerModal'
import { HelpModal } from './components/modals/HelpModal'
import { DashboardPage } from './pages/Dashboard'
import { RepositoryPage } from './pages/Repository'
import { ClientsPage } from './pages/Clients'
import { ToolsPage } from './pages/Tools'
import { Loader, AlertTriangle } from 'lucide-react'

function App() {
    // Navigation State
    const [currentPage, setCurrentPage] = useState('dashboard')

    // Modal State
    const [showLogger, setShowLogger] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    // Data State
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [servers, setServers] = useState<Record<string, any>>({})
    const [tools, setTools] = useState<Record<string, any>>({})
    const [clients, setClients] = useState<Record<string, boolean>>({
        'Claude': false,
        'Cursor': false,
        'Windsurf': false,
        'Zed': false,
        'Antigravity': true // Self
    })

    // Logs State (Shared)
    const [logs, setLogs] = useState<string[]>([])

    useEffect(() => {
        loadDashboardData()

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault()
                setShowLogger(prev => !prev)
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                // Focus search (future)
            }
            if (e.key === '?') {
                // only if not inputting text
                if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                    setShowHelp(true)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const loadDashboardData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // Fetch Servers
            const serversResp = await api.executeTool('meta-mcp', 'list_running_servers', {})
            if (isSuccessResponse(serversResp)) {
                // Assuming result is list, map to object
                const serverList = serversResp.result || []
                const serverMap: Record<string, any> = {}
                // @ts-ignore
                serverList.forEach((s: any) => serverMap[s.id || s.name] = s)
                setServers(serverMap)
            }

            // Fetch Tools
            // We need to iterate known servers or use discovery.
            // For now, let's just get local meta-mcp tools as a baseline plus any others discovered
            const metaToolsResp = await api.executeTool('meta-mcp', 'mcp_list_server_tools', { server_id: 'meta-mcp' })
            if (isSuccessResponse(metaToolsResp)) {
                setTools(prev => ({ ...prev, 'meta-mcp': metaToolsResp.result }))
            }

        } catch (err) {
            console.error('Failed to load data', err)
            setError('Failed to connect to MetaMCP server. Is the backend running?')
            setLogs(prev => [...prev, `[ERROR] Connection failure: ${err}`])
        } finally {
            setIsLoading(false)
        }
    }

    const renderPage = () => {
        if (isLoading) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                    <Loader size={48} className="animate-spin text-blue-500" />
                    <p className="font-mono text-sm animate-pulse">Initializing System...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-red-400 gap-4">
                    <AlertTriangle size={48} />
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-200">Connection Error</h2>
                        <p className="mt-2">{error}</p>
                        <button
                            onClick={loadDashboardData}
                            className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            Retry Connection
                        </button>
                    </div>
                </div>
            )
        }

        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage servers={servers} />
            case 'analysis': // Repurposed Repository Analysis
                return <RepositoryPage />
            case 'clients':
                return <ClientsPage clients={clients} setClients={setClients} />
            case 'tools':
                return <ToolsPage tools={tools} />
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <p>Work in progress. Module <strong>{currentPage}</strong> coming soon.</p>
                    </div>
                )
        }
    }

    return (
        <>
            <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
                {renderPage()}
            </Layout>

            <LoggerModal
                isOpen={showLogger}
                onClose={() => setShowLogger(false)}
                logs={logs}
            />

            <HelpModal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
            />
        </>
    )
}

export default App