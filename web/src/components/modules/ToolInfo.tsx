import { Terminal, Box, ChevronRight } from 'lucide-react'

export interface ToolInfoData {
    name: string
    description: string
    parameters: any // Using any for flexibility with JSON schema
}

export function ToolInfo({ data }: { data: ToolInfoData }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 group flex flex-col h-full">
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

            <div className="bg-slate-950/50 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <Terminal size={12} />
                    <span>Execute via JSON-RPC</span>
                </div>
                <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors">
                    Details <ChevronRight size={12} />
                </button>
            </div>
        </div>
    )
}
