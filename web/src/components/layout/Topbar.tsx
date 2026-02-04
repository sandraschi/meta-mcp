import { Search, Bell, AlertTriangle } from 'lucide-react'

interface TopbarProps {
    title: string
}

export function Topbar({ title }: TopbarProps) {
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

                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>

                {/* Emergency Stop (Visual Only for now) */}
                <button className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="hidden lg:inline">Emergency Stop</span>
                </button>
            </div>
        </div>
    )
}
