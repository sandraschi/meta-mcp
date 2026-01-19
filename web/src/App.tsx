import { useState, useEffect } from 'react'
import {
    Activity, Zap, Server, ShieldCheck, BarChart3, Settings, Menu,
    CheckCircle, Database, Cpu, Search, Bell, ChevronDown, Home, Code,
    TrendingUp, RefreshCw, Plus, ChevronLeft, ChevronRight, AlertTriangle,
    FileText, Eye, RotateCcw, Download, Terminal, Play, Loader, Folder,
    XCircle
} from 'lucide-react'
import { api, isSuccessResponse, getErrorMessage } from './api/client'

interface ServerInfo {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'error';
    type: string;
    version: string;
    uptime?: string;
    last_seen: string;
}

interface ToolInfo {
    [suite: string]: {
        [tool: string]: {
            description: string;
            operations: string[];
            parameters: string[];
        };
    };
}

interface HealthStatus {
    diagnostics: { healthy: boolean; status: string };
    analysis: { healthy: boolean; status: string };
    discovery: { healthy: boolean; status: string };
    scaffolding: { healthy: boolean; status: string };
}

// Repository Analysis Page Component
function RepositoryAnalysisPage() {
    const [repoPath, setRepoPath] = useState('')
    const [deepAnalysis, setDeepAnalysis] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        const trimmedPath = repoPath.trim()
        if (!trimmedPath) {
            setError('Please enter a repository path')
            return
        }

        // Prevent scanning dangerous paths that could hang the system
        const dangerousPaths = ['/', '\\', 'C:', 'C:\\', 'D:', 'D:\\', '/root', '/home']
        if (dangerousPaths.some(path => trimmedPath.startsWith(path) && trimmedPath.length <= path.length + 5)) {
            setError('Cannot scan root directories or drives. Please specify a specific project folder.')
            return
        }

        setAnalyzing(true)
        setError(null)
        setAnalysisResult(null)

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Analysis timed out after 30 seconds')), 30000)
        })

        try {
            const analysisPromise = api.scanRepository({
                repo_path: trimmedPath,
                deep_analysis: deepAnalysis
            })

            const response = await Promise.race([analysisPromise, timeoutPromise]) as any

            if (isSuccessResponse(response)) {
                setAnalysisResult(response.data)
            } else {
                setError(getErrorMessage(response))
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Analysis failed'
            setError(errorMessage)
        } finally {
            setAnalyzing(false)
        }
    }

    const getHealthColor = (score: number) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-yellow-400'
        return 'text-red-400'
    }

    const getHealthBg = (score: number) => {
        if (score >= 80) return 'bg-green-500/20 border-green-500/30'
        if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30'
        return 'bg-red-500/20 border-red-500/30'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Repository Analysis</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center"
                    >
                        {analyzing ? (
                            <>
                                <Loader size={16} className="animate-spin mr-2" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Search size={16} className="mr-2" />
                                Analyze Repository
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Input Section */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Analysis Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Repository Path
                        </label>
                        <div className="relative">
                            <Folder size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={repoPath}
                                onChange={(e) => setRepoPath(e.target.value)}
                                placeholder="e.g., /path/to/project or C:\path\to\project"
                                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={deepAnalysis}
                                onChange={(e) => setDeepAnalysis(e.target.checked)}
                                className="mr-3 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-300">
                                Deep Code Analysis
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-4 text-sm text-slate-400">
                    <p><strong>Deep Analysis</strong> includes detailed code quality metrics, complexity analysis, and advanced linting. Enable for comprehensive repository health assessment.</p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center">
                        <XCircle size={20} className="text-red-400 mr-3" />
                        <div>
                            <h3 className="text-red-400 font-medium">Analysis Error</h3>
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {analysisResult && (
                <div className="space-y-6">
                    {/* Overview Card */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Analysis Overview</h2>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getHealthBg(analysisResult.health_score)} ${getHealthColor(analysisResult.health_score)}`}>
                                Health Score: {analysisResult.health_score}/100
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{analysisResult.repo_name}</div>
                                <div className="text-sm text-slate-400">Repository</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">
                                    {analysisResult.analysis?.structure?.total_files || 0}
                                </div>
                                <div className="text-sm text-slate-400">Files</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400">
                                    {analysisResult.analysis?.testing?.coverage || 'N/A'}
                                </div>
                                <div className="text-sm text-slate-400">Test Coverage</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${getHealthColor(analysisResult.health_score)}`}>
                                    {analysisResult.health_score}%
                                </div>
                                <div className="text-sm text-slate-400">Health</div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Structure Analysis */}
                        {analysisResult.analysis?.structure && (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Folder size={20} className="mr-2 text-blue-400" />
                                    Repository Structure
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Total Files</span>
                                        <span className="text-white font-medium">{analysisResult.analysis.structure.total_files}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Directories</span>
                                        <span className="text-white font-medium">{analysisResult.analysis.structure.directories}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Languages</span>
                                        <span className="text-white font-medium">{Object.keys(analysisResult.analysis.structure.languages || {}).length}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MCP Compliance */}
                        {analysisResult.analysis?.mcp_compliance && (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <CheckCircle size={20} className="mr-2 text-green-400" />
                                    MCP Compliance
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">FastMCP Version</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            analysisResult.analysis.mcp_compliance.fastmcp_version ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {analysisResult.analysis.mcp_compliance.fastmcp_version || 'Not Found'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Server Config</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            analysisResult.analysis.mcp_compliance.server_config ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {analysisResult.analysis.mcp_compliance.server_config ? 'Valid' : 'Missing'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dependencies */}
                        {analysisResult.analysis?.dependencies && (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Database size={20} className="mr-2 text-purple-400" />
                                    Dependencies
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Python Packages</span>
                                        <span className="text-white font-medium">{analysisResult.analysis.dependencies.python?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Node Packages</span>
                                        <span className="text-white font-medium">{analysisResult.analysis.dependencies.node?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Total Dependencies</span>
                                        <span className="text-white font-medium">
                                            {(analysisResult.analysis.dependencies.python?.length || 0) +
                                             (analysisResult.analysis.dependencies.node?.length || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Testing */}
                        {analysisResult.analysis?.testing && (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Activity size={20} className="mr-2 text-orange-400" />
                                    Testing & Quality
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Test Files</span>
                                        <span className="text-white font-medium">{analysisResult.analysis.testing.test_files}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Coverage</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            (analysisResult.analysis.testing.coverage || 0) > 80 ? 'bg-green-500/20 text-green-400' :
                                            (analysisResult.analysis.testing.coverage || 0) > 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                            {analysisResult.analysis.testing.coverage || 'N/A'}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recommendations */}
                    {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <AlertTriangle size={20} className="mr-2 text-yellow-400" />
                                Recommendations
                            </h3>
                            <div className="space-y-3">
                                {analysisResult.recommendations.map((rec: string, index: number) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-slate-300">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Clients Page Component
function ClientsPage({ clients, setClients }: { clients: any, setClients: (clients: any) => void }) {
    const [checkingClients, setCheckingClients] = useState(false)
    const [clientError, setClientError] = useState<string | null>(null)

    const handleCheckClients = async () => {
        setCheckingClients(true)
        setClientError(null)

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Client discovery timed out after 15 seconds')), 15000)
        })

        try {
            const discoveryPromise = api.checkClientIntegration({ operation: 'check' })
            const result = await Promise.race([discoveryPromise, timeoutPromise]) as any

            if (isSuccessResponse(result)) {
                setClients(result.data || {})
                setClientError(null)
            } else {
                setClientError('Client discovery failed: ' + getErrorMessage(result))
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Client discovery failed'
            setClientError(errorMessage)
        } finally {
            setCheckingClients(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">MCP Client Discovery</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={handleCheckClients}
                        disabled={checkingClients}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center"
                    >
                        {checkingClients ? (
                            <>
                                <Loader size={16} className="animate-spin mr-2" />
                                Checking...
                            </>
                        ) : (
                            <>
                                <Search size={16} className="mr-2" />
                                Check Clients
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {clientError && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center">
                        <XCircle size={20} className="text-red-400 mr-3" />
                        <div>
                            <h3 className="text-red-400 font-medium">Client Discovery Error</h3>
                            <p className="text-red-300 text-sm">{clientError}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {checkingClients ? (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Checking MCP client integrations...</p>
                </div>
            ) : clients && Object.keys(clients).length > 0 ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(clients).map(([clientName, clientData]: [string, any]) => (
                            <div key={clientName} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                            clientData?.status === 'configured' ? 'bg-green-500' :
                                            clientData?.installed ? 'bg-blue-500' :
                                            clientData?.error ? 'bg-red-500' : 'bg-gray-500'
                                        }`}></div>
                                        <h3 className="text-lg font-semibold text-white">{clientData?.name || clientName}</h3>
                                    </div>
                                    <Eye className="w-5 h-5 text-slate-400" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Status:</span>
                                        <span className={`text-sm px-2 py-1 rounded ${
                                            clientData?.status === 'configured' ? 'bg-green-500/20 text-green-400' :
                                            clientData?.installed ? 'bg-blue-500/20 text-blue-400' :
                                            clientData?.error ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {clientData?.status || 'unknown'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Installed:</span>
                                        <span className={`text-sm px-2 py-1 rounded ${
                                            clientData?.installed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {clientData?.installed ? 'Yes' : 'No'}
                                        </span>
                                    </div>

                                    {clientData?.executable_path && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Executable:</span>
                                            <span className="text-slate-300 text-sm truncate max-w-48" title={clientData.executable_path}>
                                                {clientData.executable_path.split(/[/\\]/).pop()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">MCP Config:</span>
                                        <span className={`text-sm px-2 py-1 rounded ${
                                            clientData?.mcp_configured ? 'bg-green-500/20 text-green-400' :
                                            clientData?.config_exists ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {clientData?.mcp_configured ? 'Configured' :
                                             clientData?.config_exists ? 'Exists' : 'None'}
                                        </span>
                                    </div>

                                    {clientData?.version && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Version:</span>
                                            <span className="text-white text-sm">{clientData.version}</span>
                                        </div>
                                    )}

                                    {clientData?.mcp_servers && clientData.mcp_servers.length > 0 && (
                                        <div className="mt-4">
                                            <div className="text-slate-400 text-sm mb-2">Configured MCP Servers:</div>
                                            <div className="space-y-2">
                                                {clientData.mcp_servers.slice(0, 5).map((server: any, idx: number) => (
                                                    <div key={idx} className="bg-slate-700/50 rounded px-3 py-2">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-slate-300 text-sm font-medium">{server.name}</span>
                                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                        </div>
                                                        {server.command && (
                                                            <div className="text-slate-400 text-xs truncate max-w-48" title={server.command}>
                                                                {server.command.split(/[/\\]/).pop()}
                                                            </div>
                                                        )}
                                                        {server.args && server.args.length > 0 && (
                                                            <div className="text-slate-500 text-xs mt-1">
                                                                Args: {server.args.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {clientData.mcp_servers.length > 5 && (
                                                    <div className="text-slate-500 text-xs text-center">
                                                        +{clientData.mcp_servers.length - 5} more servers
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {clientData?.error && (
                                        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
                                            <div className="flex items-center mb-1">
                                                <AlertTriangle size={14} className="text-red-400 mr-1" />
                                                <span className="text-red-400 text-xs font-medium">Error</span>
                                            </div>
                                            <p className="text-red-300 text-xs">{clientData.error}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
                    <Eye size={48} className="mx-auto mb-4 text-slate-600" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Client Data Available</h3>
                    <p className="text-slate-400 mb-6">
                        Click "Check Clients" to discover installed MCP client applications and check their MCP configurations.
                        This will scan for Cursor, Windsurf, Zed, Antigravity, Claude Desktop, and VS Code installations.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-slate-500">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mb-1">
                                <span className="text-xs">🟢</span>
                            </div>
                            Claude
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mb-1">
                                <span className="text-xs">🟢</span>
                            </div>
                            Cursor
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mb-1">
                                <span className="text-xs">🟢</span>
                            </div>
                            Windsurf
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mb-1">
                                <span className="text-xs">🟢</span>
                            </div>
                            Zed
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mb-1">
                                <span className="text-xs">🟢</span>
                            </div>
                            Antigravity
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activePage, setActivePage] = useState('dashboard')
    const [currentUser] = useState({
        name: 'Sandra Schipal',
        email: 'sandra@metamcp.dev',
        avatar: 'SS',
        role: 'Administrator'
    })

    // Real data state
    const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
    const [servers, setServers] = useState<ServerInfo[]>([])
    const [clients, setClients] = useState<any>(null)
    const [tools, setTools] = useState<ToolInfo | null>(null)
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load initial data
    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Load health status - this is fast
            const healthResponse = await api.getDetailedHealth()
            if (isSuccessResponse(healthResponse)) {
                setHealthStatus(healthResponse.data)
            }

            // Load tools - this is fast
            const toolsResponse = await api.listTools()
            if (isSuccessResponse(toolsResponse)) {
                setTools(toolsResponse.data)
            }

            // Skip expensive discovery operations on startup
            // These will be loaded when users navigate to specific pages
            setServers([])
            setClients({})

            // Create some notifications from health status
            const newNotifications: any[] = []
            if (healthResponse.data) {
                Object.entries(healthResponse.data).forEach(([service, status]: [string, any]) => {
                    if (!status.healthy) {
                        newNotifications.push({
                            id: `health-${service}`,
                            title: `${service.charAt(0).toUpperCase() + service.slice(1)} Issue`,
                            message: status.status,
                            time: 'Just now',
                            unread: true,
                            type: 'error'
                        })
                    }
                })
            }

            setNotifications(newNotifications)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    // Calculate real stats from API data
    const systemStats = {
        servers: {
            online: servers.filter(s => s.status === 'online').length,
            total: servers.length,
            uptime: healthStatus ? '99.9%' : 'N/A'
        },
        tools: {
            active: tools ? Object.keys(tools).reduce((acc, suite) =>
                acc + Object.keys(tools[suite]).length, 0) : 0,
            total: tools ? Object.keys(tools).reduce((acc, suite) =>
                acc + Object.keys(tools[suite]).length, 0) : 0,
            failed: 0
        },
        clients: {
            configured: clients ? Object.values(clients).filter((c: any) => c?.mcp_configured).length : 0,
            connected: clients ? Object.values(clients).filter((c: any) => c?.status === 'configured').length : 0,
            total: clients ? Object.keys(clients).length : 5, // Total discovered clients
            total_servers: clients ? Object.values(clients).reduce((total: number, c: any) =>
                total + (c?.mcp_servers?.length || 0), 0) : 0
        },
        security: {
            score: healthStatus ? (Object.values(healthStatus).every(s => s.healthy) ? 98 : 75) : 0,
            threats: 0,
            alerts: notifications.filter(n => n.type === 'error').length
        },
        performance: { cpu: 23, memory: 67, disk: 45, network: 12 }
    }

    const navigationGroups = [
        {
            title: 'Overview',
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: null },
                { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: loading ? '...' : null }
            ]
        },
        {
            title: 'Management',
            items: [
                { id: 'servers', label: 'Servers', icon: Server, badge: systemStats.servers.online.toString() },
                { id: 'clients', label: 'Clients', icon: Eye, badge: systemStats.clients.configured.toString() },
                { id: 'tools', label: 'Tools', icon: Zap, badge: systemStats.tools.active.toString() },
                { id: 'server-management', label: 'Server Mgmt', icon: Settings, badge: null },
                { id: 'tool-execution', label: 'Tool Exec', icon: Play, badge: null },
                { id: 'repo-analysis', label: 'Repo Analysis', icon: FileText, badge: null },
                { id: 'token-analysis', label: 'Token Analysis', icon: TrendingUp, badge: null },
                { id: 'repo-packing', label: 'Repo Packing', icon: Download, badge: null },
                { id: 'databases', label: 'Databases', icon: Database, badge: '0' }
            ]
        },
        {
            title: 'Security',
            items: [
                { id: 'security', label: 'Security', icon: ShieldCheck, badge: null },
                { id: 'monitoring', label: 'Monitoring', icon: Activity, badge: null },
                { id: 'logs', label: 'Logs', icon: Code, badge: notifications.length.toString() }
            ]
        }
    ]

    // Show loading screen while initial data loads
    if (loading && !healthStatus) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                    <h1 className="text-2xl font-bold text-white mb-2">Loading MetaMCP</h1>
                    <p className="text-slate-400">Connecting to MCP services...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden">
            {/* Debug Indicator */}
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold z-50 shadow-2xl border-2 border-green-400 animate-pulse">
                🚀 MetaMCP Enterprise Webapp
            </div>

            {/* Error Banner */}
            {error && (
                <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium z-50 shadow-2xl border-2 border-red-400">
                    ⚠️ {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-red-200 hover:text-white"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full bg-slate-800 border-r border-slate-700 transition-all duration-300 z-40 ${
                sidebarOpen ? 'w-80' : 'w-20'
            }`}>
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        {sidebarOpen ? (
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Zap className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        MetaMCP
                                    </h1>
                                    <p className="text-xs text-slate-400">Enterprise Edition</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200"
                        >
                            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>
                    </div>
                </div>

                {/* Navigation Groups */}
                <nav className="flex-1 overflow-y-auto py-6">
                    {navigationGroups.map((group) => (
                        <div key={group.title} className="mb-8">
                            {sidebarOpen && (
                                <h3 className="px-6 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    {group.title}
                                </h3>
                            )}
                            <div className="space-y-1 px-3">
                                {group.items.map((item) => {
                                    const Icon = item.icon
                                    const isActive = activePage === item.id

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActivePage(item.id)}
                                            className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                            }`}
                                        >
                                            <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-blue-400'} transition-colors`} />
                                            {sidebarOpen && (
                                                <>
                                                    <span className="ml-4 font-medium">{item.label}</span>
                                                    {item.badge && (
                                                        <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                                                            item.badge === 'New'
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : 'bg-slate-600 text-slate-300'
                                                        }`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            {isActive && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* System Status */}
                <div className="p-6 border-t border-slate-700">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-green-400">System Online</span>
                            </div>
                            <RefreshCw size={14} className="text-slate-400" />
                        </div>
                        {sidebarOpen && (
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-slate-400">Uptime:</span>
                                    <span className="text-white ml-1">99.9%</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Load:</span>
                                    <span className="text-white ml-1">23%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-80 ml-0' : 'lg:ml-20 ml-0'}`}>
                {/* Topbar */}
                <header className="bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-30">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Left Section */}
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
                                >
                                    <Menu size={20} />
                                </button>

                                {/* Breadcrumbs */}
                                <nav className="flex items-center space-x-2 text-sm">
                                    <button className="text-slate-400 hover:text-white transition-colors">
                                        <Home size={16} />
                                    </button>
                                    <ChevronRight size={14} className="text-slate-600" />
                                    <span className="text-slate-300 capitalize">{activePage.replace('-', ' ')}</span>
                                </nav>
                            </div>

                                   {/* Right Section */}
                                   <div className="flex items-center space-x-4">
                                       {/* Search */}
                                       <div className="relative">
                                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                           <input
                                               type="text"
                                               placeholder="Search everything... (Ctrl+K)"
                                               className="w-80 pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                           />
                                       </div>

                                       {/* Refresh Button */}
                                       <button
                                           onClick={loadDashboardData}
                                           disabled={loading}
                                           className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                           title="Refresh dashboard data"
                                       >
                                           <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                                       </button>

                                       {/* Notifications */}
                                       <div className="relative">
                                           <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white relative">
                                               <Bell size={20} />
                                               {notifications.filter(n => n.unread).length > 0 && (
                                                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                       {notifications.filter(n => n.unread).length}
                                                   </span>
                                               )}
                                           </button>
                                       </div>

                                {/* User Menu */}
                                <div className="flex items-center space-x-3">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-white">{currentUser.name}</p>
                                        <p className="text-xs text-slate-400">{currentUser.role}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm">{currentUser.avatar}</span>
                                    </div>
                                    <ChevronDown size={16} className="text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 min-h-[calc(100vh-80px)]">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Dashboard Page */}
                        {activePage === 'dashboard' && (
                            <>
                                {/* Page Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                                        <p className="text-slate-400">Monitor your MCP ecosystem performance and health</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                                            <RefreshCw size={16} className="inline mr-2" />
                                            Refresh
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                            <Plus size={16} className="inline mr-2" />
                                            Add Widget
                                        </button>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/40 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <Server className="w-8 h-8 text-blue-400" />
                                            <TrendingUp className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-white">{systemStats.servers.online}</p>
                                            <p className="text-slate-400 text-sm mb-2">Active Servers</p>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(systemStats.servers.online/systemStats.servers.total)*100}%`}}></div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">Uptime: {systemStats.servers.uptime}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/40 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <Zap className="w-8 h-8 text-purple-400" />
                                            <Activity className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-white">{systemStats.tools.active}</p>
                                            <p className="text-slate-400 text-sm mb-2">Tools Running</p>
                                            <div className="flex space-x-2">
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                                                <span className="px-2 py-1 bg-slate-600 text-slate-400 text-xs rounded-full">Total: {systemStats.tools.total}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 hover:border-green-400/40 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <ShieldCheck className="w-8 h-8 text-green-400" />
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-white">{systemStats.security.score}%</p>
                                            <p className="text-slate-400 text-sm mb-2">Security Score</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-green-400">Excellent</span>
                                                <span className="text-xs text-slate-500">•</span>
                                                <span className="text-xs text-slate-400">{systemStats.security.threats} threats blocked</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6 hover:border-orange-400/40 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <Cpu className="w-8 h-8 text-orange-400" />
                                            <BarChart3 className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-white">{systemStats.performance.cpu}%</p>
                                            <p className="text-slate-400 text-sm mb-2">CPU Usage</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-400">Memory</span>
                                                    <span className="text-white">{systemStats.performance.memory}%</span>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-1">
                                                    <div className="bg-orange-500 h-1 rounded-full" style={{width: `${systemStats.performance.memory}%`}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Activity Feed */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                                                <button className="text-slate-400 hover:text-white text-sm">View All</button>
                                            </div>
                                            <div className="space-y-4">
                                                {notifications.map((notification) => (
                                                    <div key={notification.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                                                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-slate-600'}`} />
                                                        <div className="flex-1">
                                                            <p className="text-white font-medium">{notification.title}</p>
                                                            <p className="text-slate-400 text-sm">{notification.message}</p>
                                                        </div>
                                                        <span className="text-slate-500 text-xs">{notification.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                                {/* Quick Actions */}
                                                <div className="space-y-6">
                                                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                                                        <div className="space-y-3">
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const result = await api.runEmojiBuster({ operation: 'scan' })
                                                                        if (isSuccessResponse(result)) {
                                                                            alert('EmojiBuster scan completed successfully!')
                                                                            loadDashboardData()
                                                                        } else {
                                                                            alert('EmojiBuster failed: ' + getErrorMessage(result))
                                                                        }
                                                                    } catch (err) {
                                                                        alert('Failed to run EmojiBuster: ' + (err instanceof Error ? err.message : 'Unknown error'))
                                                                    }
                                                                }}
                                                                className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                                            >
                                                                <ShieldCheck size={16} />
                                                                <span>Run EmojiBuster</span>
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const result = await api.runRuntAnalyzer({ operation: 'analyze' })
                                                                        if (isSuccessResponse(result)) {
                                                                            alert('Repository analysis completed!')
                                                                            loadDashboardData()
                                                                        } else {
                                                                            alert('Analysis failed: ' + getErrorMessage(result))
                                                                        }
                                                                    } catch (err) {
                                                                        alert('Failed to run analysis: ' + (err instanceof Error ? err.message : 'Unknown error'))
                                                                    }
                                                                }}
                                                                className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                                                            >
                                                                <BarChart3 size={16} />
                                                                <span>Analyze Repository</span>
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const result = await api.discoverServers({ operation: 'scan' })
                                                                        if (isSuccessResponse(result)) {
                                                                            setServers(result.data || [])
                                                                            alert(`Server discovery completed! Found ${result.data?.length || 0} servers.`)
                                                                        } else {
                                                                            alert('Server discovery failed: ' + getErrorMessage(result))
                                                                        }
                                                                    } catch (err) {
                                                                        alert('Failed to discover servers: ' + (err instanceof Error ? err.message : 'Unknown error'))
                                                                    }
                                                                }}
                                                                className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                                                            >
                                                                <Search size={16} />
                                                                <span>Discover Servers</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                        {/* System Health */}
                                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-slate-400">Network</span>
                                                        <span className="text-white">{systemStats.performance.network} Mbps</span>
                                                    </div>
                                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-slate-400">Storage</span>
                                                        <span className="text-white">{systemStats.performance.disk}% used</span>
                                                    </div>
                                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${systemStats.performance.disk}%`}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                               {/* Servers Page */}
                               {activePage === 'servers' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">MCP Server Discovery</h1>
                                           <div className="flex space-x-3">
                                               <button
                                                   onClick={async () => {
                                                       const result = await api.discoverServers({ operation: 'scan' })
                                                       if (isSuccessResponse(result)) {
                                                           setServers(result.data || [])
                                                       }
                                                   }}
                                                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                               >
                                                   <Search size={16} className="inline mr-2" />
                                                   Scan Servers
                                               </button>
                                           </div>
                                       </div>

                                       {loading ? (
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                                               <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                               <p className="text-slate-400">Scanning for MCP servers...</p>
                                           </div>
                                       ) : (
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                                               <div className="p-6 border-b border-slate-700">
                                                   <h2 className="text-xl font-semibold text-white">
                                                       Discovered Servers ({servers.length})
                                                   </h2>
                                                   <p className="text-slate-400 text-sm mt-1">
                                                       MCP servers found across your system
                                                   </p>
                                               </div>
                                               <div className="p-6">
                                                   {servers.length === 0 ? (
                                                       <div className="text-center py-12">
                                                           <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                                           <p className="text-slate-400">No MCP servers discovered</p>
                                                           <p className="text-slate-500 text-sm">Click "Scan Servers" to search for available servers</p>
                                                       </div>
                                                   ) : (
                                                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                           {servers.map((server) => (
                                                               <div key={server.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                                                   <div className="flex items-center justify-between mb-3">
                                                                       <h3 className="text-white font-medium">{server.name}</h3>
                                                                       <div className="flex items-center space-x-2">
                                                                           <div className={`w-2 h-2 rounded-full ${
                                                                               server.status === 'online' ? 'bg-green-500' :
                                                                               server.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                                                                           }`} />
                                                                           <span className={`text-xs ${
                                                                               server.status === 'online' ? 'text-green-400' :
                                                                               server.status === 'offline' ? 'text-red-400' : 'text-yellow-400'
                                                                           }`}>
                                                                               {server.status}
                                                                           </span>
                                                                       </div>
                                                                   </div>
                                                                   <div className="space-y-2 text-sm">
                                                                       <div className="flex justify-between">
                                                                           <span className="text-slate-400">Type:</span>
                                                                           <span className="text-white">{server.type}</span>
                                                                       </div>
                                                                       <div className="flex justify-between">
                                                                           <span className="text-slate-400">Version:</span>
                                                                           <span className="text-white">{server.version}</span>
                                                                       </div>
                                                                       {server.uptime && (
                                                                           <div className="flex justify-between">
                                                                               <span className="text-slate-400">Uptime:</span>
                                                                               <span className="text-white">{server.uptime}</span>
                                                                           </div>
                                                                       )}
                                                                       <div className="flex justify-between">
                                                                           <span className="text-slate-400">Last Seen:</span>
                                                                           <span className="text-white text-xs">{server.last_seen}</span>
                                                                       </div>
                                                                   </div>
                                                               </div>
                                                           ))}
                                                       </div>
                                                   )}
                                               </div>
                                           </div>
                                       )}
                                   </div>
                               )}

                               {/* Clients Page */}
                               {activePage === 'clients' && (
                                   <ClientsPage clients={clients} setClients={setClients} />
                               )}
                                       ) : clients ? (
                                           <div className="space-y-6">
                                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                   {Object.entries(clients).map(([clientName, clientData]: [string, any]) => (
                                                       <div key={clientName} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                                           <div className="flex items-center justify-between mb-4">
                                                               <div className="flex items-center space-x-3">
                                                                   <div className={`w-3 h-3 rounded-full ${
                                                                       clientData?.status === 'connected' ? 'bg-green-500' :
                                                                       clientData?.status === 'configured' ? 'bg-blue-500' :
                                                                       clientData?.error ? 'bg-red-500' : 'bg-gray-500'
                                                                   }`}></div>
                                                                   <h3 className="text-lg font-semibold text-white capitalize">{clientName}</h3>
                                                               </div>
                                                               <Eye className="w-5 h-5 text-slate-400" />
                                                           </div>

                                                           <div className="space-y-3">
                                                               <div className="flex justify-between items-center">
                                                                   <span className="text-slate-400">Status:</span>
                                                                   <span className={`text-sm px-2 py-1 rounded ${
                                                                       clientData?.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                                                                       clientData?.status === 'configured' ? 'bg-blue-500/20 text-blue-400' :
                                                                       clientData?.error ? 'bg-red-500/20 text-red-400' : 'bg-slate-600 text-slate-300'
                                                                   }`}>
                                                                       {clientData?.status || 'Unknown'}
                                                                   </span>
                                                               </div>

                                                               {clientData?.config_file && (
                                                                   <div className="text-xs text-slate-500">
                                                                       Config: {clientData.config_file.split(/[/\\]/).pop()}
                                                                   </div>
                                                               )}

                                                               {clientData?.servers && (
                                                                   <div className="text-xs text-slate-500">
                                                                       Servers: {clientData.servers.length}
                                                                   </div>
                                                               )}

                                                               {clientData?.error && (
                                                                   <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded">
                                                                       {clientData.error}
                                                                   </div>
                                                               )}

                                                               {!clientData?.error && !clientData?.status && (
                                                                   <div className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                                                                       Client not configured
                                                                   </div>
                                                               )}
                                                           </div>
                                                       </div>
                                                   ))}
                                               </div>

                                               {/* Client Integration Summary */}
                                               <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                                   <h3 className="text-lg font-semibold text-white mb-4">Client Integration Summary</h3>
                                                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                       <div className="text-center">
                                                           <div className="text-2xl font-bold text-white">{Object.keys(clients).length}</div>
                                                           <div className="text-sm text-slate-400">Configured</div>
                                                       </div>
                                                       <div className="text-center">
                                                           <div className="text-2xl font-bold text-green-400">
                                                               {Object.values(clients).filter((c: any) => c?.status === 'connected').length}
                                                           </div>
                                                           <div className="text-sm text-slate-400">Connected</div>
                                                       </div>
                                                       <div className="text-center">
                                                           <div className="text-2xl font-bold text-blue-400">
                                                               {Object.values(clients).filter((c: any) => c?.status === 'configured').length}
                                                           </div>
                                                           <div className="text-sm text-slate-400">Available</div>
                                                       </div>
                                                       <div className="text-center">
                                                           <div className="text-2xl font-bold text-red-400">
                                                               {Object.values(clients).filter((c: any) => c?.error).length}
                                                           </div>
                                                           <div className="text-sm text-slate-400">Errors</div>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       ) : (
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                                               <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                               <p className="text-slate-400">No client integration data available</p>
                                               <p className="text-slate-500 text-sm">Click "Check Clients" to scan for MCP client configurations</p>
                                           </div>
                                       )}
                                   </div>
                               )}

                               {/* Server Management Page */}
                               {activePage === 'server-management' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">MCP Server Management</h1>
                                           <div className="flex space-x-3">
                                               <button
                                                   onClick={async () => {
                                                       // This would need a proper API endpoint for listing servers
                                                       alert('Server listing not yet implemented in API')
                                                   }}
                                                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                               >
                                                   <RefreshCw size={16} className="inline mr-2" />
                                                   Refresh Status
                                               </button>
                                           </div>
                                       </div>

                                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Start New Server</h3>
                                               <div className="space-y-4">
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Server Path</label>
                                                       <input
                                                           type="text"
                                                           placeholder="/path/to/mcp_server.py"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Server Type</label>
                                                       <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                           <option value="python">Python</option>
                                                           <option value="node">Node.js</option>
                                                       </select>
                                                   </div>
                                                   <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                                                       <Play size={16} className="inline mr-2" />
                                                       Start Server
                                                   </button>
                                               </div>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Running Servers</h3>
                                               <div className="space-y-3">
                                                   <div className="text-center py-8">
                                                       <Server className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                                       <p className="text-slate-400">No servers currently running</p>
                                                       <p className="text-slate-500 text-sm">Start a server to see it here</p>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Tool Execution Page */}
                               {activePage === 'tool-execution' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">Tool Execution</h1>
                                           <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                                               <Play size={16} className="inline mr-2" />
                                               Execute Tool
                                           </button>
                                       </div>

                                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Tool Parameters</h3>
                                               <div className="space-y-4">
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Server ID</label>
                                                       <input
                                                           type="text"
                                                           placeholder="python:/path/to/server.py"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Tool Name</label>
                                                       <input
                                                           type="text"
                                                           placeholder="example_tool"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Parameters (JSON)</label>
                                                       <textarea
                                                           placeholder='{"text": "hello", "count": 3}'
                                                           rows={4}
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                                       />
                                                   </div>
                                               </div>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Execution Results</h3>
                                               <div className="space-y-3">
                                                   <div className="text-center py-8">
                                                       <Terminal className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                                       <p className="text-slate-400">No executions yet</p>
                                                       <p className="text-slate-500 text-sm">Execute a tool to see results here</p>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Repository Analysis Page */}
                               {activePage === 'repo-analysis' && (
                                   <RepositoryAnalysisPage />
                               )}

                                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Repository Health</h3>
                                               <div className="space-y-4">
                                                   <div className="flex items-center justify-between">
                                                       <span className="text-slate-400">Overall Score</span>
                                                       <span className="text-white font-bold">--/100</span>
                                                   </div>
                                                   <div className="w-full bg-slate-700 rounded-full h-2">
                                                       <div className="bg-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
                                                   </div>
                                               </div>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Structure Analysis</h3>
                                               <div className="space-y-3">
                                                   <div className="flex items-center space-x-2">
                                                       <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                                       <span className="text-slate-400">No analysis yet</span>
                                                   </div>
                                               </div>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                                               <div className="space-y-3">
                                                   <div className="text-center py-4">
                                                       <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                                       <p className="text-slate-400 text-sm">Analyze a repository to see recommendations</p>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Token Analysis Page */}
                               {activePage === 'token-analysis' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">Token Analysis</h1>
                                           <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                                               <BarChart3 size={16} className="inline mr-2" />
                                               Analyze Tokens
                                           </button>
                                       </div>

                                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">File Token Analysis</h3>
                                               <div className="space-y-4">
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">File Path</label>
                                                       <input
                                                           type="text"
                                                           placeholder="/path/to/file.py"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                                                       Analyze File
                                                   </button>
                                               </div>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Directory Token Analysis</h3>
                                               <div className="space-y-4">
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Directory Path</label>
                                                       <input
                                                           type="text"
                                                           placeholder="/path/to/directory"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">File Extensions</label>
                                                       <input
                                                           type="text"
                                                           placeholder=".py,.js,.ts,.java"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                                                       Analyze Directory
                                                   </button>
                                               </div>
                                           </div>
                                       </div>

                                       <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                           <h3 className="text-lg font-semibold text-white mb-4">LLM Context Limit Analysis</h3>
                                           <div className="space-y-4">
                                               <div>
                                                   <label className="block text-sm font-medium text-slate-400 mb-1">Token Count</label>
                                                   <input
                                                       type="number"
                                                       placeholder="50000"
                                                       className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                   />
                                               </div>
                                               <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium">
                                                   Check Context Limits
                                               </button>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Repository Packing Page */}
                               {activePage === 'repo-packing' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">Repository Packing</h1>
                                           <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                                               <Download size={16} className="inline mr-2" />
                                               Pack Repository
                                           </button>
                                       </div>

                                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Pack Repository</h3>
                                               <div className="space-y-4">
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Repository Path</label>
                                                       <input
                                                           type="text"
                                                           placeholder="/path/to/repository"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Output Format</label>
                                                       <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                           <option value="xml">XML (Repomix style)</option>
                                                           <option value="markdown">Markdown</option>
                                                           <option value="json">JSON</option>
                                                           <option value="plain">Plain Text</option>
                                                       </select>
                                                   </div>
                                                   <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                                                       Pack Repository
                                                   </button>
                                               </div>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">AI-Optimized Packing</h3>
                                               <div className="space-y-4">
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Repository Path</label>
                                                       <input
                                                           type="text"
                                                           placeholder="/path/to/repository"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <div>
                                                       <label className="block text-sm font-medium text-slate-400 mb-1">Max Tokens</label>
                                                       <input
                                                           type="number"
                                                           placeholder="100000"
                                                           defaultValue="100000"
                                                           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       />
                                                   </div>
                                                   <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                                                       Pack for AI
                                                   </button>
                                               </div>
                                           </div>
                                       </div>

                                       <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                           <h3 className="text-lg font-semibold text-white mb-4">Packing Results</h3>
                                           <div className="text-center py-8">
                                               <Download className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                               <p className="text-slate-400">Packed repository will appear here</p>
                                               <p className="text-slate-500 text-sm">Use the pack buttons above to create AI-friendly repository bundles</p>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Tools Page */}
                               {activePage === 'tools' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">MCP Tools</h1>
                                           <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium">
                                               <RefreshCw size={16} className="inline mr-2" />
                                               Refresh
                                           </button>
                                       </div>

                                       {loading ? (
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                                               <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                               <p className="text-slate-400">Loading available tools...</p>
                                           </div>
                                       ) : tools ? (
                                           <div className="space-y-6">
                                               {Object.entries(tools).map(([suite, suiteTools]) => (
                                                   <div key={suite} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                                                       <div className="p-6 border-b border-slate-700">
                                                           <h2 className="text-xl font-semibold text-white capitalize">
                                                               {suite} Suite ({Object.keys(suiteTools).length} tools)
                                                           </h2>
                                                       </div>
                                                       <div className="p-6">
                                                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                               {Object.entries(suiteTools).map(([toolName, tool]) => (
                                                                   <div key={toolName} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                                                       <div className="flex items-start justify-between mb-3">
                                                                           <h3 className="text-white font-medium capitalize">
                                                                               {toolName.replace('_', ' ')}
                                                                           </h3>
                                                                           <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 ml-2" />
                                                                       </div>
                                                                       <p className="text-slate-400 text-sm mb-3">{tool.description}</p>
                                                                       <div className="space-y-2">
                                                                           <div>
                                                                               <span className="text-slate-400 text-xs">Operations:</span>
                                                                               <div className="flex flex-wrap gap-1 mt-1">
                                                                                   {tool.operations.map((op) => (
                                                                                       <span key={op} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                                                                                           {op}
                                                                                       </span>
                                                                                   ))}
                                                                               </div>
                                                                           </div>
                                                                           <div>
                                                                               <span className="text-slate-400 text-xs">Parameters:</span>
                                                                               <div className="flex flex-wrap gap-1 mt-1">
                                                                                   {tool.parameters.map((param) => (
                                                                                       <span key={param} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                                                                                           {param}
                                                                                       </span>
                                                                                   ))}
                                                                               </div>
                                                                           </div>
                                                                       </div>
                                                                   </div>
                                                               ))}
                                                           </div>
                                                       </div>
                                                   </div>
                                               ))}
                                           </div>
                                       ) : (
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                                               <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                               <p className="text-slate-400">Failed to load tools</p>
                                               <p className="text-slate-500 text-sm">Check server connection and try again</p>
                                           </div>
                                       )}
                                   </div>
                               )}

                               {/* Analytics Page */}
                               {activePage === 'analytics' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">Repository Analytics</h1>
                                           <button
                                               onClick={async () => {
                                                   const result = await api.getRepoStatus({ operation: 'status' })
                                                   if (isSuccessResponse(result)) {
                                                       alert('Repository status retrieved successfully!')
                                                   }
                                               }}
                                               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                           >
                                               <BarChart3 size={16} className="inline mr-2" />
                                               Analyze Repository
                                           </button>
                                       </div>

                                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Health Metrics</h3>
                                               <div className="space-y-4">
                                                   {healthStatus && Object.entries(healthStatus).map(([service, status]) => (
                                                       <div key={service} className="flex items-center justify-between">
                                                           <span className="text-slate-400 capitalize">{service}</span>
                                                           <div className="flex items-center space-x-2">
                                                               <span className={`text-sm ${status.healthy ? 'text-green-400' : 'text-red-400'}`}>
                                                                   {status.healthy ? 'Healthy' : 'Issues'}
                                                               </span>
                                                               <div className={`w-2 h-2 rounded-full ${status.healthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                           </div>
                                                       </div>
                                                   ))}
                                               </div>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Tool Usage</h3>
                                               <div className="space-y-4">
                                                   {tools && Object.entries(tools).map(([suite, suiteTools]) => (
                                                       <div key={suite} className="flex items-center justify-between">
                                                           <span className="text-slate-400 capitalize">{suite}</span>
                                                           <span className="text-white">{Object.keys(suiteTools).length} tools</span>
                                                       </div>
                                                   ))}
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Security Page */}
                               {activePage === 'security' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">Security Center</h1>
                                           <div className="flex space-x-3">
                                               <button
                                                onClick={async () => {
                                                   const result = await api.runEmojiBuster({ operation: 'scan' })
                                                   if (isSuccessResponse(result)) {
                                                           alert('Security scan completed!')
                                                       }
                                                   }}
                                                   className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                                               >
                                                   <ShieldCheck size={16} className="inline mr-2" />
                                                   Run Security Scan
                                               </button>
                                               <button
                                                   onClick={async () => {
                                                       const result = await api.checkClientIntegration({ operation: 'check' })
                                                       if (isSuccessResponse(result)) {
                                                           alert('Client integration check completed!')
                                                       }
                                                   }}
                                                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                               >
                                                   <Eye size={16} className="inline mr-2" />
                                                   Check Integrations
                                               </button>
                                           </div>
                                       </div>

                                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <div className="flex items-center space-x-3 mb-4">
                                                   <ShieldCheck className="w-8 h-8 text-green-400" />
                                                   <div>
                                                       <h3 className="text-lg font-semibold text-white">Security Score</h3>
                                                       <p className="text-slate-400 text-sm">Overall system security</p>
                                                   </div>
                                               </div>
                                               <div className="text-3xl font-bold text-white mb-2">
                                                   {systemStats.security.score}%
                                               </div>
                                               <div className="w-full bg-slate-700 rounded-full h-2">
                                                   <div
                                                       className="bg-green-500 h-2 rounded-full"
                                                       style={{width: `${systemStats.security.score}%`}}
                                                   ></div>
                                               </div>
                                               <p className="text-xs text-slate-500 mt-2">Excellent security posture</p>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <div className="flex items-center space-x-3 mb-4">
                                                   <AlertTriangle className="w-8 h-8 text-yellow-400" />
                                                   <div>
                                                       <h3 className="text-lg font-semibold text-white">Active Threats</h3>
                                                       <p className="text-slate-400 text-sm">Current security issues</p>
                                                   </div>
                                               </div>
                                               <div className="text-3xl font-bold text-white mb-2">
                                                   {systemStats.security.threats}
                                               </div>
                                               <p className="text-xs text-green-400 mt-2">No active threats detected</p>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <div className="flex items-center space-x-3 mb-4">
                                                   <Activity className="w-8 h-8 text-blue-400" />
                                                   <div>
                                                       <h3 className="text-lg font-semibold text-white">Security Alerts</h3>
                                                       <p className="text-slate-400 text-sm">Recent security events</p>
                                                   </div>
                                               </div>
                                               <div className="text-3xl font-bold text-white mb-2">
                                                   {systemStats.security.alerts}
                                               </div>
                                               <p className="text-xs text-slate-400 mt-2">Alerts this week</p>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Monitoring Page */}
                               {activePage === 'monitoring' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">System Monitoring</h1>
                                           <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium">
                                               <Activity size={16} className="inline mr-2" />
                                               View Logs
                                           </button>
                                       </div>

                                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">Service Health</h3>
                                               <div className="space-y-4">
                                                   {healthStatus && Object.entries(healthStatus).map(([service, status]) => (
                                                       <div key={service} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                                                           <div className="flex items-center space-x-3">
                                                               <div className={`w-3 h-3 rounded-full ${status.healthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                               <span className="text-white capitalize">{service}</span>
                                                           </div>
                                                           <span className={`text-sm ${status.healthy ? 'text-green-400' : 'text-red-400'}`}>
                                                               {status.healthy ? 'Online' : 'Issues'}
                                                           </span>
                                                       </div>
                                                   ))}
                                               </div>
                                           </div>

                                           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                               <h3 className="text-lg font-semibold text-white mb-4">System Resources</h3>
                                               <div className="space-y-4">
                                                   <div>
                                                       <div className="flex justify-between text-sm mb-1">
                                                           <span className="text-slate-400">CPU Usage</span>
                                                           <span className="text-white">{systemStats.performance.cpu}%</span>
                                                       </div>
                                                       <div className="w-full bg-slate-700 rounded-full h-2">
                                                           <div className="bg-blue-500 h-2 rounded-full" style={{width: `${systemStats.performance.cpu}%`}}></div>
                                                       </div>
                                                   </div>
                                                   <div>
                                                       <div className="flex justify-between text-sm mb-1">
                                                           <span className="text-slate-400">Memory Usage</span>
                                                           <span className="text-white">{systemStats.performance.memory}%</span>
                                                       </div>
                                                       <div className="w-full bg-slate-700 rounded-full h-2">
                                                           <div className="bg-green-500 h-2 rounded-full" style={{width: `${systemStats.performance.memory}%`}}></div>
                                                       </div>
                                                   </div>
                                                   <div>
                                                       <div className="flex justify-between text-sm mb-1">
                                                           <span className="text-slate-400">Disk Usage</span>
                                                           <span className="text-white">{systemStats.performance.disk}%</span>
                                                       </div>
                                                       <div className="w-full bg-slate-700 rounded-full h-2">
                                                           <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${systemStats.performance.disk}%`}}></div>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Logs Page */}
                               {activePage === 'logs' && (
                                   <div className="space-y-6">
                                       <div className="flex items-center justify-between">
                                           <h1 className="text-3xl font-bold text-white">System Logs</h1>
                                           <div className="flex space-x-3">
                                               <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium">
                                                   <Download size={16} className="inline mr-2" />
                                                   Export Logs
                                               </button>
                                               <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium">
                                                   <RotateCcw size={16} className="inline mr-2" />
                                                   Clear Logs
                                               </button>
                                           </div>
                                       </div>

                                       <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                           <div className="flex items-center justify-between mb-4">
                                               <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                                               <div className="flex space-x-2">
                                                   <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded">All</button>
                                                   <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Errors</button>
                                                   <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded">Info</button>
                                               </div>
                                           </div>
                                           <div className="space-y-2 max-h-96 overflow-y-auto">
                                               {notifications.map((notification, index) => (
                                                   <div key={index} className="flex items-start space-x-4 p-3 bg-slate-700/30 rounded-lg">
                                                       <div className={`w-2 h-2 rounded-full mt-2 ${
                                                           notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                                       }`}></div>
                                                       <div className="flex-1">
                                                           <p className="text-white font-medium">{notification.title}</p>
                                                           <p className="text-slate-400 text-sm">{notification.message}</p>
                                                       </div>
                                                       <span className="text-slate-500 text-xs">{notification.time}</span>
                                                   </div>
                                               ))}
                                               {notifications.length === 0 && (
                                                   <div className="text-center py-8">
                                                       <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                                       <p className="text-slate-400">No recent activity</p>
                                                   </div>
                                               )}
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Default Page */}
                               {!['dashboard', 'servers', 'clients', 'tools', 'server-management', 'tool-execution', 'repo-analysis', 'token-analysis', 'repo-packing', 'analytics', 'security', 'monitoring', 'logs'].includes(activePage) && (
                                   <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                                       <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                           <Settings className="w-12 h-12 text-slate-400" />
                                       </div>
                                       <h2 className="text-2xl font-bold text-white mb-4 capitalize">{activePage.replace('-', ' ')}</h2>
                                       <p className="text-slate-400 mb-6">This feature is under development.</p>
                                       <div className="flex justify-center space-x-4">
                                           <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                                               Request Feature
                                           </button>
                                           <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                               View Documentation
                                           </button>
                                       </div>
                                   </div>
                               )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App