import { useState, useEffect } from 'react'
import { BarChart3, Terminal, Server, MessageSquare, Play, RefreshCw, AlertCircle, Trash2, Brain } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { api } from '../api/client'
import { logger } from '../utils/logger'
import { llmService } from '../services/llm'

type AnalysisSource = 'logs' | 'servers' | 'custom'


export function AnalysisPage() {
    const [source, setSource] = useState<AnalysisSource>('logs')
    const [contextData, setContextData] = useState<string>('')
    const [customPrompt, setCustomPrompt] = useState<string>('')
    const [result, setResult] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [isGatheringData, setIsGatheringData] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load context when source changes
    useEffect(() => {
        gatherContext(source)
    }, [source])

    const gatherContext = async (selectedSource: AnalysisSource) => {
        setIsGatheringData(true)
        setError(null)
        setContextData('')

        try {
            if (selectedSource === 'logs') {
                const logs = logger.getLogs().slice(-100) // Last 100 logs
                setContextData(JSON.stringify(logs, null, 2))
                setCustomPrompt("Analyze these system logs for any errors, warnings, or unusual patterns. Summarize system health.")
            } else if (selectedSource === 'servers') {
                // Fetch servers (using the scan logic if possible, or just list active)
                // We'll reuse the scan logic pattern roughly, or just list what's known
                // For this demo, let's try to get the full list if possible, or at least active ones
                const runningReq = await api.listRunningServers()
                // Also try to discover if we can, to get config info
                // But listRunningServers might be enough for "state analysis"
                const activeServers = runningReq.success ? runningReq.result : []

                // We might also want to read the config file if possible, but let's stick to API data
                setContextData(JSON.stringify({
                    active_servers_count: activeServers.length,
                    active_servers: activeServers,
                    timestamp: new Date().toISOString()
                }, null, 2))
                setCustomPrompt("Analyze the current server configuration and status. Identify any potential misconfigurations or offline critical services.")
            } else if (selectedSource === 'custom') {
                setContextData('') // User types it
                setCustomPrompt("Please analyze this data.")
            }
        } catch (err) {
            console.error(err)
            setError('Failed to gather context data.')
        } finally {
            setIsGatheringData(false)
        }
    }

    const handleAnalyze = async () => {
        if (!contextData && source !== 'custom') {
            setError('No data to analyze.')
            return
        }

        setIsLoading(true)
        setError(null)
        setResult('')

        try {
            const finalPrompt = `${customPrompt}\n\nData Context:\n\`\`\`json\n${contextData}\n\`\`\``
            const response = await llmService.completion(finalPrompt)
            setResult(response)
        } catch (err: any) {
            console.error('Analysis failed', err)
            setError(err.message || 'Analysis failed. Ensure local LLM is running.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 h-[calc(100vh-8rem)] flex flex-col">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
                        <BarChart3 className="text-blue-500" />
                        System Analysis
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        AI-powered diagnostics and insights for your MCP ecosystem.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Left Panel: Configuration */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 bg-slate-900/50 border border-slate-800 rounded-xl p-4 overflow-y-auto">

                    {/* Source Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Data Source</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setSource('logs')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${source === 'logs'
                                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                            >
                                <Terminal size={20} className="mb-2" />
                                <span className="text-xs font-medium">System Logs</span>
                            </button>
                            <button
                                onClick={() => setSource('servers')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${source === 'servers'
                                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-400'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                            >
                                <Server size={20} className="mb-2" />
                                <span className="text-xs font-medium">Servers</span>
                            </button>
                            <button
                                onClick={() => setSource('custom')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${source === 'custom'
                                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                            >
                                <MessageSquare size={20} className="mb-2" />
                                <span className="text-xs font-medium">Custom</span>
                            </button>
                        </div>
                    </div>

                    {/* Context Preview / Editor */}
                    <div className="flex-1 flex flex-col min-h-0 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-300">
                                {source === 'custom' ? 'Input Data' : 'Context Preview'}
                            </label>
                            {source !== 'custom' && (
                                <button
                                    onClick={() => gatherContext(source)}
                                    className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1"
                                >
                                    <RefreshCw size={12} className={isGatheringData ? "animate-spin" : ""} />
                                    Refresh
                                </button>
                            )}
                        </div>
                        <textarea
                            value={contextData}
                            onChange={(e) => setContextData(e.target.value)}
                            readOnly={source !== 'custom'}
                            className={`flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-400 focus:outline-none resize-none ${source === 'custom' ? 'focus:border-emerald-500/50' : 'cursor-default opacity-80'
                                }`}
                            placeholder={source === 'custom' ? "Paste any text or JSON here..." : "Loading data..."}
                        />
                    </div>

                    {/* Prompt Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Analysis Instructions</label>
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || isGatheringData}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="animate-spin" size={18} />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Play size={18} fill="currentColor" />
                                Run Analysis
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                </div>

                {/* Right Panel: Results */}
                <div className="col-span-12 lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-200">Analysis Result</h3>
                        {result && (
                            <button
                                onClick={() => setResult('')}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                                title="Clear Request"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {result ? (
                            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-slate-200 prose-p:text-slate-400 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                                <div className="p-4 bg-slate-950/50 rounded-full border border-slate-800/50">
                                    <Brain size={48} className="text-slate-700" />
                                </div>
                                <p>Select a data source and run analysis to see insights here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
