import { useState } from 'react'
import { Database, RefreshCw, CheckCircle, XCircle, Loader } from 'lucide-react'
import { api, isSuccessResponse } from '../api/client'

interface ClientsProps {
    clients: any
    setClients: (clients: any) => void
}

export function ClientsPage({ clients, setClients }: ClientsProps) {
    const [checking, setChecking] = useState<Record<string, boolean>>({})

    const handleCheckClients = async () => {
        const newStatus = { ...clients }

        for (const client of Object.keys(clients)) {
            setChecking(prev => ({ ...prev, [client]: true }))
            try {
                // In a real scenario, we might call check_client_integration here
                // For now, we simulate a check or just assume if we have config it's "configured"
                // Let's use read_client_config to verify we can access it.

                const response = await api.executeTool('meta-mcp', 'read_client_config', {
                    client_name: client
                })

                newStatus[client] = isSuccessResponse(response)
            } catch (e) {
                newStatus[client] = false
            }
            setChecking(prev => ({ ...prev, [client]: false }))
        }
        setClients(newStatus)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Client Ecosystem</h2>
                    <p className="text-slate-400">Manage MCP integrations across your development tools.</p>
                </div>
                <button
                    onClick={handleCheckClients}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-medium"
                >
                    <RefreshCw size={16} />
                    Refresh Status
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(clients).map(([name, connected]) => (
                    <div key={name} className="bg-slate-900 border border-slate-800 rounded-xl p-6 group hover:border-blue-500/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                                    <Database size={20} />
                                </div>
                                <h3 className="font-semibold text-lg text-slate-200 capitalize">{name}</h3>
                            </div>
                            {checking[name] ? (
                                <Loader size={20} className="animate-spin text-blue-500" />
                            ) : connected ? (
                                <CheckCircle size={20} className="text-green-500" />
                            ) : (
                                <XCircle size={20} className="text-slate-600" />
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Integration</span>
                                <span className={connected ? "text-green-400" : "text-slate-600"}>
                                    {connected ? 'Active' : 'Not Detected'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Config Path</span>
                                <span className="text-slate-400 font-mono text-xs truncate max-w-[150px]" title="Default Path">
                                    ~/.config/{name.toLowerCase()}...
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
                            <button className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm rounded-lg transition-colors">
                                Configure
                            </button>
                            <button className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm rounded-lg transition-colors">
                                View JSON
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
