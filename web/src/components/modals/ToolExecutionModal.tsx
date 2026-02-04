import { useState } from 'react'
import { X, Play, Loader, AlertTriangle, CheckCircle, Terminal } from 'lucide-react'
import { api, isSuccessResponse } from '../../api/client'
import { ToolWithServer } from '../../pages/Tools'

interface ToolExecutionModalProps {
    isOpen: boolean
    onClose: () => void
    tool: ToolWithServer | null
}

export function ToolExecutionModal({ isOpen, onClose, tool }: ToolExecutionModalProps) {
    const [params, setParams] = useState('{}')
    const [isExecuting, setIsExecuting] = useState(false)
    const [result, setResult] = useState<any | null>(null)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen || !tool) return null

    const handleExecute = async () => {
        setIsExecuting(true)
        setResult(null)
        setError(null)

        try {
            let parsedParams = {}
            try {
                parsedParams = JSON.parse(params)
            } catch (e) {
                throw new Error('Invalid JSON parameters')
            }

            const response = await api.executeTool(tool.server, tool.name, parsedParams)

            if (isSuccessResponse(response)) {
                setResult(response.result || response.data)
            } else {
                setError(response.message || 'Execution failed')
                if (response.errors) {
                    setError(response.errors.join('\n'))
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown execution error')
        } finally {
            setIsExecuting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-800 rounded-xl text-purple-400">
                            <Terminal size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">{tool.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 font-mono border border-slate-700">
                                    {tool.server}
                                </span>
                                <span className="text-xs text-slate-500">JSON-RPC Tool Execution</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-300 transition-colors p-2 hover:bg-slate-800 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Parameters Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300 flex justify-between items-center">
                            <span>Input Parameters (JSON)</span>
                            <span className="text-xs text-slate-500 font-mono">schema provided below</span>
                        </label>
                        <div className="relative">
                            <textarea
                                value={params}
                                onChange={(e) => setParams(e.target.value)}
                                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none resize-none"
                                placeholder="{}"
                            />
                        </div>

                        {/* Validation Error */}
                        {(() => {
                            try { JSON.parse(params); return null; }
                            catch (e) {
                                return (
                                    <div className="text-xs text-red-400 flex items-center gap-1.5">
                                        <AlertTriangle size={12} />
                                        Invalid JSON format
                                    </div>
                                )
                            }
                        })()}
                    </div>

                    {/* Result Output */}
                    {(result || error) && (
                        <div className={`rounded-xl border p-4 space-y-2 animate-in slide-in-from-top-2 duration-300 ${error ? 'bg-red-950/20 border-red-900/30' : 'bg-green-950/20 border-green-900/30'}`}>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                {error ? (
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertTriangle size={16} /> Execution Failed
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-400">
                                        <CheckCircle size={16} /> Success
                                    </div>
                                )}
                            </div>
                            <pre className={`text-xs font-mono whitespace-pre-wrap overflow-x-auto p-2 rounded-lg bg-black/40 ${error ? 'text-red-300' : 'text-green-300'}`}>
                                {error || JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Schema Reference */}
                    <div className="space-y-2 pt-4 border-t border-slate-800">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parameters Schema</h4>
                        <pre className="text-[10px] text-slate-400 bg-slate-950/50 p-3 rounded-lg overflow-x-auto font-mono max-h-32">
                            {JSON.stringify(tool.parameters, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExecute}
                        disabled={isExecuting}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isExecuting ? (
                            <>
                                <Loader size={16} className="animate-spin" />
                                Executing...
                            </>
                        ) : (
                            <>
                                <Play size={16} />
                                Run Tool
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
