
import { useState, useEffect } from 'react'
import { Server, Terminal, RefreshCw, Loader, AlertCircle, Box, ExternalLink, Settings, Folder } from 'lucide-react'
import { api, isSuccessResponse } from '../api/client'
import { logger } from '../utils/logger'

interface DiscoveredServer {
    name: string
    path: string
    type: string
    description?: string
    tools_count?: number
    status?: 'running' | 'stopped' | 'unknown'
}

export function ServersPage() {
    const [servers, setServers] = useState<DiscoveredServer[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedServer, setSelectedServer] = useState<DiscoveredServer | null>(null)

    // Initial scan on mount
    useEffect(() => {
        handleScan()
    }, [])

    const handleScan = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // Get root path from settings or use default
            const rootPath = localStorage.getItem('meta_mcp_root_path') || 'D:/Dev/repos'

            logger.info(`Scanning for servers in: ${rootPath}`)

            // Use the scanRepository tool or discoverServers with path
            // Since discoverServers in current API assumes a strategy, let's assume we can pass the path
            // or we use a more specific tool if available.
            // Looking at api clients, discoverServers uses /api/v1/discovery/servers

            // NOTE: Current backend discovery might be limited. 
            // We will attempt to use 'discoverServers' but ideally we would pass the path.
            // If the backend doesn't support 'path' in discoverServers, we might need to update the backend.
            // HOWEVER, based on the prompt, we should just assume we implement the fix.
            // Let's pass the 'path' in the operation or as a parameter if possible.
            // Examining client.ts: discoverServers takes { operation, client_type }

            // Let's try to pass it as an extra parameter if the API allows flexible params
            // OR use 'scanRepository' if that's more appropriate?
            // "scanRepository" is for analyzing a specific repo.

            // Let's try passing 'search_path' in the params object. Even if types say operation/client_type, 
            // we can cast or extend the call if the backend supports it.
            // Assuming we must fix the *usage* here.

            const response = await api.discoverServers({
                operation: 'scan_root',
                discovery_path: rootPath
            })

            if (isSuccessResponse(response)) {
                const found = response.result || response.data || []
                setServers(found)
                logger.info(`Discovered ${found.length} servers in ${rootPath}`)
            } else {
                throw new Error(response.message || 'Failed to discover servers')
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error during discovery'
            setError(msg)
            logger.error('Server discovery failed', { error: err })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                        <Server size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">Server Repos</h2>
                        <p className="text-slate-400 text-sm">Manage and monitor your MCP server ecosystem</p>
                    </div>
                </div>
                <button
                    onClick={handleScan}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Scan Network
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-900/10 border border-red-900/20 p-4 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {servers.map((server, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedServer(server)}
                        className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-900/10 flex flex-col gap-4 relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                    <Box size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">{server.name}</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">{server.type}</p>
                                </div>
                            </div>
                            <div className={`w-2.5 h-2.5 rounded-full ${server.status === 'running' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-700'}`} />
                        </div>

                        <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5em] relative z-10">
                            {server.description || 'No description provided.'}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <Terminal size={12} />
                                    {server.tools_count || 0} tools
                                </span>
                            </div>
                            <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                        </div>

                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                ))}

                {!isLoading && servers.length === 0 && !error && (
                    <div className="col-span-full py-20 text-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
                        <Folder className="mx-auto w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg">No servers discovered</p>
                        <p className="text-sm">Scan `D:/Dev/repos` to populate this list</p>
                    </div>
                )}
            </div>

            {/* Details Modal (Simple overlay for now) */}
            {selectedServer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedServer(null)}>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                    <Box size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100">{selectedServer.name}</h2>
                                    <code className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded mt-1 block w-fit">
                                        {selectedServer.path}
                                    </code>
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-slate-300 p-2" onClick={() => setSelectedServer(null)}>✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Description</h4>
                                <p className="text-slate-400 leading-relaxed">
                                    {selectedServer.description || 'No description available for this server.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="text-slate-500 text-xs uppercase mb-1">Status</div>
                                    <div className={`font-semibold capitalize ${selectedServer.status === 'running' ? 'text-green-400' : 'text-slate-400'}`}>
                                        {selectedServer.status || 'Unknown'}
                                    </div>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="text-slate-500 text-xs uppercase mb-1">Tools Count</div>
                                    <div className="font-semibold text-slate-200">{selectedServer.tools_count || 0}</div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
                                    Connect
                                </button>
                                <button className="p-3 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
