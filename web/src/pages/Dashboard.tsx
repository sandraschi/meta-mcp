import { Activity, Server, Zap, Cpu } from 'lucide-react'
import { ServerInfo, ServerInfoData } from '../components/modules/ServerInfo'
import { motion } from 'framer-motion'
import { ClientState } from './Clients'

interface DashboardProps {
    servers: Record<string, ServerInfoData>
    clients: Record<string, ClientState>
    tools: any[]
}

export function DashboardPage({ servers, clients, tools }: DashboardProps) {
    const serversList = Object.values(servers)
    const activeServers = serversList.filter(s => s.status === 'online').length
    const totalServers = serversList.length

    // Calculate client stats
    const totalClients = Object.keys(clients).length
    const activeClients = Object.values(clients).filter(c => c.connected).length

    // Tools stats
    const totalTools = tools.length

    // Mock system stats for now, mixed with real data
    const stats = [
        { label: 'Active Servers', value: `${activeServers}/${totalServers}`, icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Connected Clients', value: `${activeClients}/${totalClients}`, icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Available Tools', value: `${totalTools}`, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'System Health', value: activeServers > 0 ? 'Good' : 'Unknown', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ]

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4"
                    >
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Active Servers */}
            <div>
                <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
                    <Server className="text-blue-400" size={20} />
                    Connected Servers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {serversList.map((server) => (
                        <ServerInfo key={server.id} data={server} />
                    ))}
                    {serversList.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/30 text-slate-500">
                            No servers detected.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
