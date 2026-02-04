import { useState, useEffect } from 'react'
import { api, isSuccessResponse } from './api/client'
import { logger, LogEntry } from './utils/logger'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoggerModal } from './components/modals/LoggerModal'
import { HelpModal } from './components/modals/HelpModal'
import { DashboardPage } from './pages/Dashboard'
import { ServersPage } from './pages/Servers'
import { ClientsPage } from './pages/Clients'
import { BuildersPage } from './pages/Builders'
import { ToolsPage } from './pages/Tools'
import { AnalysisPage } from './pages/Analysis'
import { SettingsPage } from './pages/Settings'
// import { Loader, AlertTriangle } from 'lucide-react'

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
    const [clients, setClients] = useState<Record<string, { connected: boolean, path?: string, error?: string }>>({
        "claude": { connected: false },
        "cursor": { connected: false },
        "windsurf": { connected: false },
        "zed": { connected: false },
        "antigravity": { connected: false }
    })
    const [tools, setTools] = useState<any[]>([])

    // Logs State (Shared)
    const [logs, setLogs] = useState<string[]>([])

    useEffect(() => {
        loadDashboardData()

        // Subscribe to logger
        const handleLog = (entry: LogEntry) => {
            const timestamp = new Date(entry.timestamp).toLocaleTimeString()
            const contextStr = entry.context ? JSON.stringify(entry.context) : ''
            const logLine = `[${timestamp}] [${entry.level}] ${entry.message} ${contextStr}`
            setLogs(prev => [...prev, logLine])
        }

        logger.on('log', handleLog)

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

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            logger.off('log', handleLog)
        }
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
            const toolsResp = await api.listTools()
            if (isSuccessResponse(toolsResp)) {
                const toolsMap = toolsResp.result || toolsResp.data || {}
                const normalizedTools: any[] = []

                Object.entries(toolsMap).forEach(([server, serverTools]) => {
                    if (Array.isArray(serverTools)) {
                        serverTools.forEach((t: any) => normalizedTools.push({ ...t, server }))
                    } else if (typeof serverTools === 'object') {
                        // The key is the tool name, the value is the tool info (which might lack name)
                        Object.entries(serverTools as object).forEach(([toolName, toolData]: [string, any]) => {
                            normalizedTools.push({
                                name: toolName, // Ensure name is set from key
                                ...toolData,
                                server
                            })
                        })
                    }
                })
                setTools(normalizedTools)
            }

            // Fetch Tools is handled by ToolsPage now, so we can skip or keep for Dashboard summary
            // Keeping mostly empty for now unless Dashboard needs it.
            // But verify if DashboardPage needs tools?
        } catch (err) {
            console.error('Failed to load data', err)
            logger.error(`Connection failure: ${err}`)
            setError('Failed to connect to MetaMCP server. Is the backend running?')
        } finally {
            setIsLoading(false)
        }
    }

    const renderPage = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="animate-spin mr-2 h-5 w-5 border-b-2 border-current rounded-full" />
                    Loading system status...
                </div>
            )
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-red-400">
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => loadDashboardData()}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            )
        }

        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage servers={servers} clients={clients} tools={tools} />
            case 'servers': // Changed from 'analysis' or 'repository'
                return <ServersPage />
            case 'clients':
                return <ClientsPage clients={clients} setClients={setClients} />
            case 'builders':
                return <BuildersPage />


            case 'tools':
                return <ToolsPage tools={tools} />
            case 'analysis':
                return <AnalysisPage />
            case 'settings':
                return <SettingsPage />
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <p>Work in progress. Module <strong>{currentPage}</strong> coming soon.</p>
                    </div>
                )
        }
    }


    return (
        <ErrorBoundary>
            <Layout
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onShowLogger={() => setShowLogger(true)}
                onShowHelp={() => setShowHelp(true)}
            >
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
        </ErrorBoundary>
    )
}

export default App