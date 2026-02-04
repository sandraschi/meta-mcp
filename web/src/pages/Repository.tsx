import { useState } from 'react'
import { Folder, Search, Loader, BarChart3, AlertTriangle, CheckCircle, Bug } from 'lucide-react'
import { api, isSuccessResponse, getErrorMessage } from '../api/client'
// import { ServerInfo } from '../components/modules/ServerInfo';
// import { HealthStatus } from '../components/modules/HealthStatus';

export function RepositoryPage() {
    const [repoPath, setRepoPath] = useState('D:\\Dev\\repos\\')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        setIsAnalyzing(true)
        setError(null)
        setAnalysisResult(null)
        try {
            const response = await api.executeTool('meta-mcp', 'scan_repository_deep', {
                repo_path: repoPath,
                deep_analysis: true
            })

            console.log('Analysis response:', response) // Debug log

            if (isSuccessResponse(response)) {
                // Handle mixed response types (string or object)
                let resultData = response.result
                if (typeof resultData === 'string') {
                    try {
                        // Some tools return JSON string inside result
                        resultData = JSON.parse(resultData)
                    } catch (e) {
                        // If not JSON, it might be just text, check Content logic if needed
                        // But scan_repository_deep usually returns a dict.
                        // Let's assume the client handles basic parsing, but if double encoded:
                    }
                }

                // If the tool returns { content: [...] }, extract it.
                // But the python tool returns a dict directly usually.
                // We'll trust the response structure for now or adjust based on testing.

                setAnalysisResult(resultData)
            } else {
                setError(getErrorMessage(response))
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getHealthColor = (score: number) => {
        if (score >= 90) return 'text-green-500'
        if (score >= 70) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getHealthBg = (score: number) => {
        if (score >= 90) return 'bg-green-500'
        if (score >= 70) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-400 mb-2">
                            <BarChart3 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-100">Repository Intelligence</h2>
                        <p className="text-slate-400">Deep scan your codebase for SOTA compliance, security risks, and architectural health.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Folder className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                value={repoPath}
                                onChange={(e) => setRepoPath(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                                placeholder="D:\Dev\repos\project-name"
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isAnalyzing ? <Loader className="animate-spin" /> : <Search />}
                            <span>Scan</span>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                            <AlertTriangle size={20} />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {analysisResult && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Score Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                            <div className={`absolute inset-0 opacity-10 ${getHealthBg(analysisResult.health_score)} blur-3xl transition-opacity group-hover:opacity-20`} />
                            <h3 className="text-slate-400 font-medium mb-2">Health Score</h3>
                            <div className={`text-6xl font-bold ${getHealthColor(analysisResult.health_score)}`}>
                                {analysisResult.health_score}
                            </div>
                            <div className="mt-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">SOTA Compliance</div>
                        </div>

                        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                <Bug className="text-purple-400" size={20} />
                                Issues Detected
                            </h3>
                            <div className="space-y-3">
                                {analysisResult.compliance?.issues?.length === 0 ? (
                                    <div className="flex items-center gap-2 text-green-400 bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                                        <CheckCircle size={16} />
                                        All checks passed!
                                    </div>
                                ) : ( // @ts-ignore
                                    analysisResult.compliance?.issues?.map((issue: any, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                            <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
                                            <div>
                                                <div className="text-slate-200 text-sm font-medium">{issue.check}</div>
                                                <div className="text-slate-400 text-xs mt-0.5">{issue.details || issue.message}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Stats could go here - keeping it simple for now */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4">Raw Analysis Data</h3>
                        <pre className="bg-black/50 p-4 rounded-lg overflow-auto text-xs font-mono text-slate-400 max-h-96">
                            {JSON.stringify(analysisResult, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    )
}
