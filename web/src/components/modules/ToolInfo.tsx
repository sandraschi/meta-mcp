import { Terminal, Box, ChevronRight, ChevronDown, Play } from 'lucide-react'
import { useState } from 'react'

export interface ToolInfoData {
    name: string
    description: string
    parameters: any // Using any for flexibility with JSON schema
}

interface ToolInfoProps {
    data: ToolInfoData
    onExecute?: (tool: ToolInfoData) => void
}

export function ToolInfo({ data, onExecute }: ToolInfoProps) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div
            className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 group flex flex-col h-full ${expanded ? 'ring-1 ring-blue-500/30' : ''}`}
        >
            <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <Box size={18} />
                        </div>
                        <h4 className="font-semibold text-slate-200 font-mono text-sm tracking-tight group-hover:text-purple-400 transition-colors">
                            {data.name}
                        </h4>
                    </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {data.description || "No description provided."}
                </p>
            </div>

            <div className="bg-slate-950/50 px-5 py-3 border-t border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <Terminal size={12} />
                        <span>Execute via JSON-RPC</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onExecute && onExecute(data)}
                            className="flex items-center gap-1 text-slate-400 hover:text-green-400 transition-colors focus:outline-none"
                            title="Run Tool"
                        >
                            <Play size={12} /> Run
                        </button>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors focus:outline-none"
                        >
                            {expanded ? 'Hide' : 'Details'} {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </button>
                    </div>
                </div>

                {/* Expanded Details */}
                {expanded && (
                    <div className="pt-2 border-t border-slate-800/50">
                        <p className="text-xs font-semibold text-slate-400 mb-2">Parameters Schema:</p>
                        <pre className="text-[10px] text-slate-300 bg-black/30 p-2 rounded overflow-x-auto font-mono">
                            {JSON.stringify(data.parameters, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
