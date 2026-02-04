import { Search, Bell, AlertTriangle, Loader2, ScrollText, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { api } from '../../api/client'
import { logger } from '../../utils/logger'

interface TopbarProps {
    title: string
    onShowLogger: () => void
    onShowHelp: () => void
}

export function Topbar({ title, onShowLogger, onShowHelp }: TopbarProps) {
    const [isStopping, setIsStopping] = useState(false)

    const handleEmergencyStop = async () => {
        if (!confirm('EMERGENCY STOP: This will attempt to stop ALL running MCP servers. Are you sure?')) {
            return
        }

        setIsStopping(true)
        logger.warn('Initiating EMERGENCY STOP of all servers...')

        try {
            // 1. List running servers
            const listRes = await api.listRunningServers()
            if (!listRes.success || !listRes.result) {
                logger.error('Failed to list running servers during emergency stop')
                return
            }

            const servers = listRes.result
            if (servers.length === 0) {
                logger.info('No running servers found to stop.')
                alert('No running servers found.')
                return
            }

            // 2. Stop each server
            let stoppedCount = 0
            for (const server of servers) {
                logger.info(`Stopping server: ${server.id || server.name}...`)
                try {
                    await api.stopMcpServer(server.id)
                    stoppedCount++
                } catch (err) {
                    logger.error(`Failed to stop server ${server.id}`, { error: err })
                }
            }

            logger.info(`Emergency Stop Complete. Stopped ${stoppedCount} servers.`)
            alert(`Emergency Stop Complete. ${stoppedCount} servers stopped.`)

        } catch (error) {
            logger.error('Critical error during Emergency Stop', { error })
            alert('Emergency Stop Failed! check logs.')
        } finally {
            setIsStopping(false)
        }
    }

    return (
        <div className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-slate-200 tracking-tight capitalize">
                    {title}
                </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="bg-slate-900/50 border border-slate-800 text-slate-300 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                </div>

                {/* Logger Toggle */}
                <button
                    onClick={onShowLogger}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="System Logs"
                >
                    <ScrollText className="w-5 h-5" />
                </button>

                {/* Help Toggle */}
                <button
                    onClick={onShowHelp}
                    className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Help & Shortcuts"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>

                {/* Emergency Stop */}
                <button
                    onClick={handleEmergencyStop}
                    disabled={isStopping}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isStopping ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                    <span className="hidden lg:inline">{isStopping ? 'Stopping...' : 'Emergency Stop'}</span>
                </button>
            </div>
        </div>
    )
}
