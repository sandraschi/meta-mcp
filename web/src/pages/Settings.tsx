import { useState, useEffect } from 'react'
import { Save, Folder, RefreshCw, AlertCircle, CheckCircle, Brain } from 'lucide-react'
// import { api, isSuccessResponse } from '../api/client'
import { logger } from '../utils/logger'
import { llmService, LLMConfig, LLMModel } from '../services/llm'

export const DEFAULT_ROOT_PATH = 'D:/Dev/repos'

function LLMSettingsSection() {
    const [config, setConfig] = useState<LLMConfig>(llmService.getConfig())
    const [models, setModels] = useState<LLMModel[]>([])
    const [isLoadingModels, setIsLoadingModels] = useState(false)
    const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleChange = (field: keyof LLMConfig, value: string) => {
        const newConfig = { ...config, [field]: value }
        setConfig(newConfig)
        setTestStatus('idle')
    }

    const handleSave = () => {
        llmService.saveConfig(config)
        setTestStatus('success') // Just visual feedback for save
        setTimeout(() => setTestStatus('idle'), 2000)
    }

    const fetchModels = async () => {
        setIsLoadingModels(true)
        setTestStatus('idle')
        try {
            // Temporarily save config to service to test *this* config
            llmService.saveConfig(config)
            const list = await llmService.listModels()
            setModels(list)
            if (list.length > 0 && !config.model) {
                // Auto-select first if none selected
                handleChange('model', list[0].id)
            }
        } catch (err) {
            logger.error('Failed to fetch models', { error: err })
            alert('Failed to fetch models. Check URL and Provider.')
        } finally {
            setIsLoadingModels(false)
        }
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    <Brain className="text-purple-500" size={20} />
                    Local LLM Scaffold
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Provider</label>
                        <select
                            value={config.provider}
                            onChange={(e) => handleChange('provider', e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none"
                        >
                            <option value="ollama">Ollama</option>
                            <option value="lmstudio">LM Studio / OpenAI Compatible</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Base URL</label>
                        <input
                            type="text"
                            value={config.baseUrl}
                            onChange={(e) => handleChange('baseUrl', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none font-mono text-sm"
                            placeholder="http://localhost:11434"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Model</label>
                    <div className="flex gap-2">
                        {models.length > 0 ? (
                            <select
                                value={config.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none"
                            >
                                <option value="" disabled>Select a model</option>
                                {models.map(m => (
                                    <option key={m.id} value={m.id}>{m.id}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={config.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none font-mono text-sm"
                                placeholder="Enter model name (e.g. llama3)"
                            />
                        )}

                        <button
                            onClick={fetchModels}
                            disabled={isLoadingModels}
                            className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                            {isLoadingModels ? <RefreshCw className="animate-spin w-5 h-5" /> : 'Fetch Models'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30 flex items-end justify-end">
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${testStatus === 'success'
                            ? 'bg-green-600 hover:bg-green-500 text-white'
                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                >
                    {testStatus === 'success' ? <CheckCircle size={16} /> : <Save size={16} />}
                    {testStatus === 'success' ? 'Saved!' : 'Save Configuration'}
                </button>
            </div>
        </div>
    )
}

export function SettingsPage() {
    // Configuration State
    const [rootPath, setRootPath] = useState(DEFAULT_ROOT_PATH)
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedPath = localStorage.getItem('meta_mcp_root_path')
        if (savedPath) {
            setRootPath(savedPath)
        }
    }, [])

    const handleSave = () => {
        setIsLoading(true)
        setSuccessMessage(null)
        setErrorMessage(null)

        try {
            // Validate path (basic check)
            if (!rootPath.trim()) {
                throw new Error('Root Directory path cannot be empty')
            }

            // Save to localStorage
            localStorage.setItem('meta_mcp_root_path', rootPath)

            // Optionally, we could notify backend if backend state needed to be updated,
            // but currently the frontend drives the scan parameters.

            logger.info(`Settings updated: rootPath=${rootPath}`)
            setSuccessMessage('Settings saved successfully')

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000)

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to save settings'
            setErrorMessage(msg)
            logger.error('Failed to save settings', { error: err })
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        if (confirm('Are you sure you want to reset to default settings?')) {
            setRootPath(DEFAULT_ROOT_PATH)
            localStorage.setItem('meta_mcp_root_path', DEFAULT_ROOT_PATH)
            setSuccessMessage('Settings reset to default')
            setTimeout(() => setSuccessMessage(null), 3000)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-xl mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Settings</h2>
                    <p className="text-slate-400 text-sm">Configure MetaMCP behavior and preferences</p>
                </div>
            </div>

            {/* General Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                        <Folder className="text-blue-500" size={20} />
                        Discovery Configuration
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Root Directory for Server Scan</label>
                        <p className="text-xs text-slate-500 mb-2">The starting directory where MetaMCP will look for MCP servers.</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={rootPath}
                                onChange={(e) => setRootPath(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none font-mono text-sm"
                                placeholder="e.g. D:/Dev/repos"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between">
                    <button
                        onClick={handleReset}
                        className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                    >
                        Reset Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Local LLM Configuration */}
            <LLMSettingsSection />

            {/* Feedback Messages */}
            {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle size={20} />
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                    <AlertCircle size={20} />
                    {errorMessage}
                </div>
            )}
        </div>
    )
}
