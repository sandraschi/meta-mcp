import { useState, useEffect, Suspense, lazy } from 'react'
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
    CheckCircle,
    XCircle,
    Loader2,
    Menu
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApiContext, useServiceHealth } from './context/ApiContext'
import { useEmojiBuster, useRuntAnalyzer, useServerDiscovery } from './hooks/useApi'
import { SkeletonGrid } from './components/Skeleton'

// Lazy load components that aren't immediately needed
const ScaffoldingWizard = lazy(() => import('./components/ScaffoldingWizard').then(module => ({ default: module.ScaffoldingWizard })))
const SettingsComponent = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })))
const CommandPalette = lazy(() => import('./components/CommandPalette').then(module => ({ default: module.CommandPalette })))

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768) // Default to open on desktop
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isScaffoldingWizardOpen, setIsScaffoldingWizardOpen] = useState(false)
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

    // Handle responsive sidebar behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault()
                setIsCommandPaletteOpen(true)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Handle command palette actions
    useEffect(() => {
        const handleNavigateToSettings = () => setActiveTab('settings')
        const handleRunEmojiBuster = () => handleEmojiBusterScan()
        const handleRunServerDiscovery = () => handleServerDiscovery()
        const handleRunRuntAnalyzer = () => handleRuntAnalyzer()

        window.addEventListener('navigate-to-settings', handleNavigateToSettings)
        window.addEventListener('run-emoji-buster', handleRunEmojiBuster)
        window.addEventListener('run-server-discovery', handleRunServerDiscovery)
        window.addEventListener('run-runt-analyzer', handleRunRuntAnalyzer)

        return () => {
            window.removeEventListener('navigate-to-settings', handleNavigateToSettings)
            window.removeEventListener('run-emoji-buster', handleRunEmojiBuster)
            window.removeEventListener('run-server-discovery', handleRunServerDiscovery)
            window.removeEventListener('run-runt-analyzer', handleRunRuntAnalyzer)
        }
    }, [])

    // API hooks
    const { isConnected, isLoading: healthLoading, refreshHealth } = useApiContext()
    const diagnosticsHealth = useServiceHealth('diagnostics')

    // Tool hooks
    const emojiBuster = useEmojiBuster()
    const runtAnalyzer = useRuntAnalyzer()
    const serverDiscovery = useServerDiscovery()

    // Handle tool execution
    const handleEmojiBusterScan = async () => {
        await emojiBuster.execute({
            operation: 'scan',
            repo_path: '*',
            scan_mode: 'comprehensive'
        })
    }

    const handleRuntAnalyzer = async () => {
        await runtAnalyzer.execute({
            operation: 'analyze',
            repo_path: '.',
            scan_mode: 'comprehensive'
        })
    }

    const handleServerDiscovery = async () => {
        await serverDiscovery.execute({
            operation: 'scan'
        })
    }

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
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSidebarOpen(!isSidebarOpen)
                    }
                }}
                className="md:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#00f3ff] focus:ring-offset-2 focus:ring-offset-[#050505]"
                aria-label="Toggle navigation menu"
                aria-expanded={isSidebarOpen}
            >
                <Menu size={20} />
            </button>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? 260 : 80,
                    x: isSidebarOpen ? 0 : (window.innerWidth >= 768 ? 0 : -320)
                }}
                className="glass-panel m-4 mr-0 flex flex-col overflow-hidden relative z-50 md:relative md:translate-x-0"
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl font-bold bg-gradient-to-r from-[#00f3ff] via-[#bd00ff] to-[#ff0055] bg-clip-text text-transparent drop-shadow-lg"
                        >
                            METAMCP
                        </motion.h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setSidebarOpen(!isSidebarOpen)
                            }
                        }}
                        className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00f3ff] focus:ring-offset-2 focus:ring-offset-[#050505]"
                        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        aria-expanded={isSidebarOpen}
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2" role="navigation" aria-label="Main navigation">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setActiveTab(item.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    setActiveTab(item.id)
                                }
                            }}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''} cursor-pointer group`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Navigate to ${item.label}`}
                            aria-current={activeTab === item.id ? 'page' : undefined}
                        >
                            <motion.div
                                animate={{
                                    rotate: activeTab === item.id ? 360 : 0,
                                    scale: activeTab === item.id ? 1.1 : 1
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <item.icon
                                    size={22}
                                    className={`transition-colors duration-200 ${
                                        activeTab === item.id
                                            ? 'text-[#00f3ff]'
                                            : 'group-hover:text-white'
                                    }`}
                                />
                            </motion.div>
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </motion.div>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <motion.div
                        className="glass-panel p-3 bg-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => refreshHealth()}
                    >
                        <motion.div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isConnected ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                            }`}
                            animate={{
                                scale: healthLoading ? [1, 1.1, 1] : 1,
                                rotate: healthLoading ? 360 : 0
                            }}
                            transition={{
                                scale: { repeat: healthLoading ? Infinity : 0, duration: 1 },
                                rotate: { duration: 2, repeat: healthLoading ? Infinity : 0, ease: "linear" }
                            }}
                        >
                            {healthLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isConnected ? (
                                <CheckCircle size={16} />
                            ) : (
                                <XCircle size={16} />
                            )}
                        </motion.div>
                        {isSidebarOpen && (
                            <motion.div
                                className="text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <p className="font-medium">
                                    {healthLoading ? 'Checking...' : isConnected ? 'Server Online' : 'Server Offline'}
                                </p>
                                <p className="text-xs text-muted">v1.3.0</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-4 space-y-4 ml-0 md:ml-0">
                {/* Topbar */}
                <header className="glass-panel px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="text-sm text-muted truncate">
                            <span className="hidden md:inline">MetaMCP / </span>
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} aria-hidden="true" />
                            <input
                                type="text"
                                placeholder="Command palette (Ctrl + K)"
                                className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f3ff] min-w-[200px] md:min-w-[280px] cursor-pointer"
                                onClick={() => setIsCommandPaletteOpen(true)}
                                readOnly
                                aria-label="Command palette search"
                                role="searchbox"
                            />
                        </div>
                        <button
                            className="p-2 glass-panel hover:bg-white/10 hidden sm:flex focus:outline-none focus:ring-2 focus:ring-[#00f3ff] focus:ring-offset-2 focus:ring-offset-[#050505]"
                            aria-label="Open terminal"
                        >
                            <Terminal size={20} />
                        </button>
                    </div>
                </header>

                {/* Viewport */}
                <motion.section
                    className="flex-1 glass-panel p-4 md:p-8 overflow-y-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={activeTab} // Re-animate when tab changes
                    role="main"
                    aria-labelledby="main-heading"
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="mb-6 md:mb-8"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 id="main-heading" className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white via-white to-[#00f3ff] bg-clip-text text-transparent">
                                Welcome back, Sandra.
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <motion.div
                                className="flex items-center gap-2"
                                animate={healthLoading ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
                                transition={{ duration: 1.5, repeat: healthLoading ? Infinity : 0 }}
                            >
                                {healthLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Loader2 className="w-4 h-4 text-yellow-500" />
                                    </motion.div>
                                ) : isConnected ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <XCircle className="w-4 h-4 text-red-500" />
                                    </motion.div>
                                )}
                                <span className="text-sm text-muted">
                                    {healthLoading ? 'Checking...' : isConnected ? 'Server Online' : 'Server Offline'}
                                </span>
                            </motion.div>
                                <div className="flex items-center gap-2">
                                    {diagnosticsHealth.healthy ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className="text-sm text-muted">Diagnostics Service</span>
                                </div>
                            </div>
                        </div>

                        {activeTab === 'dashboard' ? (
                            healthLoading ? (
                                <SkeletonGrid count={4} />
                            ) : (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                            <motion.div
                                className="glass-panel p-4 md:p-6 bg-gradient-to-br from-[#00f3ff]/10 to-transparent hover:bg-gradient-to-br hover:from-[#00f3ff]/15 hover:to-transparent transition-all duration-300"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <h3 className="text-base md:text-lg font-semibold mb-2 bg-gradient-to-r from-[#00f3ff] to-[#00f3ff]/80 bg-clip-text text-transparent">EmojiBuster</h3>
                                <p id="emoji-buster-description" className="text-xs md:text-sm text-muted mb-4 line-clamp-3">
                                    {emojiBuster.success
                                        ? emojiBuster.data?.message || 'Scan completed successfully'
                                        : emojiBuster.error
                                            ? emojiBuster.error
                                            : 'Scan your repositories for Unicode crash risks.'
                                    }
                                </p>
                                <button
                                    onClick={handleEmojiBusterScan}
                                    disabled={emojiBuster.loading || !isConnected}
                                    className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center focus:outline-none focus:ring-2 focus:ring-[#00f3ff] focus:ring-offset-2 focus:ring-offset-[#050505]"
                                    aria-label={emojiBuster.loading ? 'Scanning repository for emoji issues' : 'Run emoji buster scan'}
                                    aria-describedby="emoji-buster-description"
                                >
                                    {emojiBuster.loading ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : null}
                                    {emojiBuster.loading ? 'Scanning...' : 'Run Scan'}
                                </button>
                            </motion.div>
                            <motion.div
                                className="glass-panel p-4 md:p-6 bg-gradient-to-br from-[#bd00ff]/10 to-transparent hover:bg-gradient-to-br hover:from-[#bd00ff]/15 hover:to-transparent transition-all duration-300"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <h3 className="text-base md:text-lg font-semibold mb-2 bg-gradient-to-r from-[#bd00ff] to-[#bd00ff]/80 bg-clip-text text-transparent">Server Discovery</h3>
                                <p id="server-discovery-description" className="text-xs md:text-sm text-muted mb-4 line-clamp-3">
                                    {serverDiscovery.success
                                        ? `${serverDiscovery.data?.data?.servers?.length || 0} servers found`
                                        : serverDiscovery.error
                                            ? serverDiscovery.error
                                            : 'Discover MCP servers across your system.'
                                    }
                                </p>
                                <button
                                    onClick={handleServerDiscovery}
                                    disabled={serverDiscovery.loading || !isConnected}
                                    className="btn-primary text-xs bg-[#bd00ff] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center focus:outline-none focus:ring-2 focus:ring-[#bd00ff] focus:ring-offset-2 focus:ring-offset-[#050505]"
                                    aria-label={serverDiscovery.loading ? 'Discovering MCP servers' : 'Discover MCP servers'}
                                    aria-describedby="server-discovery-description"
                                >
                                    {serverDiscovery.loading ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : null}
                                    {serverDiscovery.loading ? 'Discovering...' : 'Discover Servers'}
                                </button>
                            </motion.div>
                            <motion.div
                                className="glass-panel p-4 md:p-6 bg-gradient-to-br from-[#ff0055]/10 to-transparent hover:bg-gradient-to-br hover:from-[#ff0055]/15 hover:to-transparent transition-all duration-300"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <h3 className="text-base md:text-lg font-semibold mb-2 bg-gradient-to-r from-[#ff0055] to-[#ff0055]/80 bg-clip-text text-transparent">Runt Analyzer</h3>
                                <p id="runt-analyzer-description" className="text-xs md:text-sm text-muted mb-4 line-clamp-3">
                                    {runtAnalyzer.success
                                        ? runtAnalyzer.data?.message || 'Analysis completed'
                                        : runtAnalyzer.error
                                            ? runtAnalyzer.error
                                            : 'Validate your project\'s SOTA compliance.'
                                    }
                                </p>
                                <button
                                    onClick={handleRuntAnalyzer}
                                    disabled={runtAnalyzer.loading || !isConnected}
                                    className="btn-primary text-xs bg-[#ff0055] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center focus:outline-none focus:ring-2 focus:ring-[#ff0055] focus:ring-offset-2 focus:ring-offset-[#050505]"
                                    aria-label={runtAnalyzer.loading ? 'Analyzing project compliance' : 'Run runt analyzer audit'}
                                    aria-describedby="runt-analyzer-description"
                                >
                                    {runtAnalyzer.loading ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : null}
                                    {runtAnalyzer.loading ? 'Analyzing...' : 'Audit Project'}
                                </button>
                            </motion.div>
                            <motion.div
                                className="glass-panel p-4 md:p-6 bg-gradient-to-br from-[#bd00ff]/10 to-transparent hover:bg-gradient-to-br hover:from-[#bd00ff]/15 hover:to-transparent transition-all duration-300"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <h3 className="text-base md:text-lg font-semibold mb-2 bg-gradient-to-r from-[#bd00ff] to-[#bd00ff]/80 bg-clip-text text-transparent">Scaffolding</h3>
                                <p id="scaffolding-description" className="text-xs md:text-sm text-muted mb-4 line-clamp-3">Generate SOTA FastMCP servers or landing pages.</p>
                                <button
                                    onClick={() => setIsScaffoldingWizardOpen(true)}
                                    disabled={!isConnected}
                                    className="btn-primary text-xs bg-[#bd00ff] text-white disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center focus:outline-none focus:ring-2 focus:ring-[#bd00ff] focus:ring-offset-2 focus:ring-offset-[#050505]"
                                    aria-label="Open scaffolding wizard to create new projects"
                                    aria-describedby="scaffolding-description"
                                >
                                    Open Wizard
                                </button>
                            </motion.div>
                                </motion.div>
                            )
                        ) : activeTab === 'settings' ? (
                            <Suspense fallback={<div className="glass-panel p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /><p>Loading settings...</p></div>}>
                                <SettingsComponent />
                            </Suspense>
                        ) : (
                            <motion.div
                                className="glass-panel p-8 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-6xl mb-4">🚧</div>
                                <h3 className="text-xl font-semibold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page</h3>
                                <p className="text-muted">This page is coming soon. Check back later!</p>
                            </motion.div>
                        )}
                    </div>
                </motion.section>
            </main>

            {/* Logger Button (Floating) */}
            <motion.button
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-2xl z-30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open terminal logger"
            >
                <Terminal size={20} className="md:w-6 md:h-6" />
            </motion.button>

            {/* Scaffolding Wizard Modal */}
            <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                <ScaffoldingWizard
                    isOpen={isScaffoldingWizardOpen}
                    onClose={() => setIsScaffoldingWizardOpen(false)}
                />
            </Suspense>

            {/* Command Palette */}
            <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                <CommandPalette
                    isOpen={isCommandPaletteOpen}
                    onClose={() => setIsCommandPaletteOpen(false)}
                />
            </Suspense>
        </div>
    )
}

export default React.memo(App)
