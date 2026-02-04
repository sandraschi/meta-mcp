import { motion } from 'framer-motion'
import {
    Activity, Server, Home, Settings,
    ChevronLeft, ChevronRight, Terminal, BarChart3, Database, Hammer
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
    currentPage: string
    onNavigate: (page: string) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'servers', label: 'Server Repos', icon: Server },
        { id: 'clients', label: 'Clients', icon: Database },
        { id: 'builders', label: 'Builders', icon: Hammer },
        { id: 'tools', label: 'Tools', icon: Terminal },
        { id: 'analysis', label: 'Analysis', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 260 }}
            className="h-screen bg-slate-950 border-r border-slate-800 flex flex-col z-20 relative transition-all duration-300 ease-in-out"
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    <Activity className="w-6 h-6 text-blue-500 shrink-0" />
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                        >
                            MetaMCP
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Menu */}
            <div className="flex-1 py-6 flex flex-col gap-2 px-3">
                {menuItems.map((item) => {
                    const isActive = currentPage === item.id
                    const Icon = item.icon
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                }
                            `}
                        >
                            <Icon className={`w-6 h-6 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {!collapsed && (
                                <span className="font-medium whitespace-nowrap overflow-hidden">
                                    {item.label}
                                </span>
                            )}
                            {collapsed && isActive && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Collapse Trigger */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="h-12 border-t border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors w-full"
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
        </motion.div>
    )
}
