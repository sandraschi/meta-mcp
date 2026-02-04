import { Server, Activity, Clock, Tag } from 'lucide-react'

export interface ServerInfoData {
    id: string
    name: string
    status: 'online' | 'offline' | 'error'
    type: string
    version: string
    uptime?: string
    last_seen: string
}

export function ServerInfo({ data }: { data: ServerInfoData }) {
    const isOnline = data.status === 'online'

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-300 group shadow-lg shadow-black/20">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isOnline ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        <Server size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-slate-100 group-hover:text-blue-400 transition-colors">
                            {data.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isOnline
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                {data.status.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">v{data.version}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Tag size={12} />
                        <span className="text-xs uppercase tracking-wider">Type</span>
                    </div>
                    <span className="text-slate-300 font-medium">{data.type}</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Clock size={12} />
                        <span className="text-xs uppercase tracking-wider">Last Seen</span>
                    </div>
                    <span className="text-slate-300 font-medium">{data.last_seen}</span>
                </div>
            </div>

            {data.uptime && (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-950/30 p-2 rounded-lg justify-center">
                    <Activity size={12} className="text-blue-500" />
                    <span>Uptime: <span className="text-slate-300 font-mono">{data.uptime}</span></span>
                </div>
            )}
        </div>
    )
}
