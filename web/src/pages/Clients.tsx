import { useState, useEffect } from 'react'
import { Database, RefreshCw, CheckCircle, XCircle, Loader } from 'lucide-react'
import { api, isSuccessResponse } from '../api/client'
import { JsonEditorModal } from '../components/modals/JsonEditorModal'

export interface ClientState {
    connected: boolean
    path?: string
    error?: string
}

interface ClientsProps {
    clients: Record<string, ClientState>
    setClients: (clients: Record<string, ClientState>) => void
}

export function ClientsPage({ clients, setClients }: ClientsProps) {
    const [checking, setChecking] = useState<Record<string, boolean>>({})

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')
    const [selectedClient, setSelectedClient] = useState<string | null>(null)
    const [configData, setConfigData] = useState<any>(null)

    useEffect(() => {
        handleCheckClients()
    }, [])

    const handleCheckClients = async () => {
        // Set all to checking
        setChecking(Object.keys(clients).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

        try {
            // Use 'check' operation to get all clients in one go
            const response = await api.checkClientIntegration({
                operation: 'check'
            })

            const newStatus = { ...clients }

            if (isSuccessResponse(response) && response.data) {
                const results = response.data

                Object.keys(clients).forEach(client => {
                    const clientData = results[client]
                    if (clientData) {
                        newStatus[client] = {
                            connected: clientData.installed,
                            path: clientData.config_path,
                            error: !clientData.installed ? 'Not installed' : undefined
                        }
                    } else {
                        newStatus[client] = {
                            connected: false,
                            error: 'Not detected'
                        }
                    }
                })
            } else {
                Object.keys(clients).forEach(client => {
                    newStatus[client] = {
                        connected: false,
                        error: response.message || 'Check failed'
                    }
                })
            }
            setClients(newStatus)
        } catch (e) {
            console.error('Failed to check clients:', e)
            const newStatus = { ...clients }
            Object.keys(clients).forEach(client => {
                newStatus[client] = {
                    connected: false,
                    error: e instanceof Error ? e.message : 'Unknown error'
                }
            })
            setClients(newStatus)
        } finally {
            setChecking({})
        }
    }

    const handleViewJson = async (clientName: string) => {
        setSelectedClient(clientName)
        setModalMode('view')
        try {
            const response = await api.getClientConfig(clientName)
            if (isSuccessResponse(response)) {
                setConfigData(response.data.config)
                setIsModalOpen(true)
            }
        } catch (error) {
            console.error('Failed to load client config:', error)
        }
    }

    const handleConfigure = async (clientName: string) => {
        setSelectedClient(clientName)
        setModalMode('edit')
        try {
            const response = await api.getClientConfig(clientName)
            if (isSuccessResponse(response)) {
                setConfigData(response.data.config)
                setIsModalOpen(true)
            }
        } catch (error) {
            console.error('Failed to load client config:', error)
        }
    }

    const handleSaveConfig = async (clientName: string, updatedData: any) => {
        const response = await api.updateClientConfig(clientName, updatedData)
        if (!isSuccessResponse(response)) {
            throw new Error(response.message || 'Failed to update configuration')
        }
        handleCheckClients()
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
                {Object.entries(clients).map(([name, value]) => (
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
                            ) : value.connected ? (
                                <CheckCircle size={20} className="text-green-500" />
                            ) : (
                                <XCircle size={20} className="text-slate-600" />
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Integration</span>
                                <span className={value.connected ? "text-green-400" : "text-slate-600"}>
                                    {value.connected ? 'Active' : 'Not Detected'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Config Path</span>
                                <span className="text-slate-400 font-mono text-xs truncate max-w-[150px]" title={value.path || 'Unknown'}>
                                    {value.path || 'Not detected'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
                            <button
                                onClick={() => handleConfigure(name)}
                                className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm rounded-lg transition-colors"
                            >
                                Configure
                            </button>
                            <button
                                onClick={() => handleViewJson(name)}
                                className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm rounded-lg transition-colors"
                            >
                                View JSON
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <JsonEditorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                clientName={selectedClient}
                initialData={configData}
                mode={modalMode}
                onSave={handleSaveConfig}
            />
        </div>
    )
}
