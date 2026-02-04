import { useState } from 'react'
import { ToolInfo, ToolInfoData } from '../components/modules/ToolInfo'
import { Search } from 'lucide-react'

interface ToolsPageProps {
    tools: Record<string, any> // Server -> Tools Map
}

export function ToolsPage({ tools }: ToolsPageProps) {
    const [search, setSearch] = useState('')

    // Flatten tools for display
    const allTools: (ToolInfoData & { server: string })[] = []
    Object.entries(tools).forEach(([server, serverTools]) => {
        if (Array.isArray(serverTools)) {
            serverTools.forEach(t => allTools.push({ ...t, server }))
        } else if (typeof serverTools === 'object') {
            // Handle if tools are object map
            Object.values(serverTools).forEach((t: any) => allTools.push({ ...t, server }))
        }
    })

    const filteredTools = allTools.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
                <Search className="text-slate-500" />
                <input
                    type="text"
                    placeholder="Search tools..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-200 w-full placeholder:text-slate-600"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTools.map((tool, idx) => (
                    <div key={idx} className="relative group">
                        {/* Server Badge */}
                        <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-slate-950/80 backdrop-blur rounded text-xs text-slate-500 font-mono border border-slate-800">
                            {tool.server}
                        </div>
                        <ToolInfo data={tool} />
                    </div>
                ))}
            </div>
        </div>
    )
}
