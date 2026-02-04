import { useState } from 'react'
import { ToolInfo, ToolInfoData } from '../components/modules/ToolInfo'
import { Search } from 'lucide-react'
import { ToolExecutionModal } from '../components/modals/ToolExecutionModal'

// Define the extended type that includes 'server'
export interface ToolWithServer extends ToolInfoData {
    server: string
}

interface ToolsPageProps {
    tools: ToolWithServer[]
}

export function ToolsPage({ tools }: ToolsPageProps) {
    const [search, setSearch] = useState('')
    const [selectedTool, setSelectedTool] = useState<ToolWithServer | null>(null)

    const filteredTools = tools.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (t.server && t.server.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4 sticky top-20 z-30 backdrop-blur-xl bg-slate-900/80">
                <Search className="text-slate-500" />
                <input
                    type="text"
                    placeholder="Search tools by name, description, or server..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-200 w-full placeholder:text-slate-600 outline-none"
                />
                <div className="text-xs text-slate-500 font-mono">
                    {filteredTools.length} / {tools.length} found
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredTools.map((tool, idx) => (
                    <div key={`${tool.server}-${tool.name}-${idx}`} className="relative h-full">
                        {/* Server Badge */}
                        <div className="absolute top-4 right-4 z-10 px-2 py-0.5 bg-slate-950/90 backdrop-blur rounded text-[10px] text-slate-400 font-mono border border-slate-800 shadow-lg">
                            {tool.server}
                        </div>
                        <ToolInfo
                            data={tool}
                            onExecute={() => setSelectedTool(tool)}
                        />
                    </div>
                ))}
            </div>

            {filteredTools.length === 0 && (
                <div className="text-center py-20 text-slate-600">
                    <p>No tools found matching "{search}"</p>
                </div>
            )}

            <ToolExecutionModal
                isOpen={selectedTool !== null}
                onClose={() => setSelectedTool(null)}
                tool={selectedTool}
            />
        </div>
    )
}

