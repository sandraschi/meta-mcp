import { useState } from 'react'
import {
    LayoutDashboard,
    Settings,
    Search,
    Terminal,
    ShieldCheck,
    Compass,
    Hammer,
    ChevronLeft,
    ChevronRight,
    Activity,
    Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const [activeTab, setActiveTab] = useState('dashboard')

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'diagnostics', label: 'Diagnostics', icon: ShieldCheck },
        { id: 'discovery', label: 'Discovery', icon: Compass },
        { id: 'scaffolding', label: 'Scaffolding', icon: Hammer },
        { id: 'analysis', label: 'Analysis', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-[#050505] text-white">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="glass-panel m-4 mr-0 flex flex-col overflow-hidden relative"
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl font-bold bg-gradient-to-r from-[#00f3ff] to-[#bd00ff] bg-clip-text text-transparent"
                        >
                            METAMCP
                        </motion.h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        >
                            <item.icon size={22} className={activeTab === item.id ? 'text-[#00f3ff]' : ''} />
                            {isSidebarOpen && <span>{item.label}</span>}
                        </div>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="glass-panel p-3 bg-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00f3ff]/20 flex items-center justify-center text-[#00f3ff]">
                            <Zap size={16} />
                        </div>
                        {isSidebarOpen && (
                            <div className="text-sm">
                                <p className="font-medium">Server Online</p>
                                <p className="text-xs text-muted">v1.3.0</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-4 space-y-4">
                {/* Topbar */}
                <header className="glass-panel px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted">MetaMCP / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Command palette (Ctrl + K)"
                                className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f3ff] min-w-[280px]"
                            />
                        </div>
                        <button className="p-2 glass-panel hover:bg-white/10">
                            <Terminal size={20} />
                        </button>
                    </div>
                </header>

                {/* Viewport */}
                <section className="flex-1 glass-panel p-8 overflow-y-auto">
                    <div className="max-w-4xl">
                        <h2 className="text-3xl font-bold mb-2">Welcome back, Sandra.</h2>
                        <p className="text-muted mb-8">System integrity is at 98%. 2 minor Unicode risks detected.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="glass-panel p-6 bg-gradient-to-br from-[#00f3ff]/10 to-transparent">
                                <h3 className="text-lg font-semibold mb-2">EmojiBuster</h3>
                                <p className="text-sm text-muted mb-4">Scan your repositories for Unicode crash risks.</p>
                                <button className="btn-primary text-xs">Run Scan</button>
                            </div>
                            <div className="glass-panel p-6 bg-gradient-to-br from-[#bd00ff]/10 to-transparent">
                                <h3 className="text-lg font-semibold mb-2">Scaffolding</h3>
                                <p className="text-sm text-muted mb-4">Generate SOTA FastMCP servers or landing pages.</p>
                                <button className="btn-primary text-xs bg-[#bd00ff] text-white">Open Wizard</button>
                            </div>
                            <div className="glass-panel p-6 bg-gradient-to-br from-[#ff0055]/10 to-transparent">
                                <h3 className="text-lg font-semibold mb-2">Runt Analyzer</h3>
                                <p className="text-sm text-muted mb-4">Validate your project's SOTA compliance.</p>
                                <button className="btn-primary text-xs bg-[#ff0055] text-white">Audit Project</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Logger Button (Floating) */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-2xl">
                <Terminal size={24} />
            </button>
        </div>
    )
}

export default App
