import { useState, useEffect } from 'react'
import { X, Save, Loader, AlertTriangle, CheckCircle, FileJson } from 'lucide-react'

interface JsonEditorModalProps {
    isOpen: boolean
    onClose: () => void
    clientName: string | null
    initialData: any
    mode: 'view' | 'edit'
    onSave?: (clientName: string, updatedData: any) => Promise<void>
}

export function JsonEditorModal({ isOpen, onClose, clientName, initialData, mode, onSave }: JsonEditorModalProps) {
    const [jsonText, setJsonText] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (initialData) {
            setJsonText(JSON.stringify(initialData, null, 2))
        } else {
            setJsonText('')
        }
        setSuccess(false)
        setError(null)
    }, [initialData, isOpen])

    if (!isOpen || !clientName) return null

    const handleSave = async () => {
        if (!onSave) return

        setIsSaving(true)
        setError(null)
        setSuccess(false)

        try {
            let parsedData
            try {
                parsedData = JSON.parse(jsonText)
            } catch (e) {
                throw new Error('Invalid JSON format')
            }

            await onSave(clientName, parsedData)
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                onClose()
            }, 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save configuration')
        } finally {
            setIsSaving(false)
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
                        <div className="p-3 bg-slate-800 rounded-xl text-blue-400">
                            <FileJson size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">
                                {mode === 'edit' ? 'Configure' : 'View Configuration'}: {clientName}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                {mode === 'edit' ? 'Update client-specific MCP settings' : 'Current active configuration'}
                            </p>
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
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="relative group">
                        <textarea
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            readOnly={mode === 'view'}
                            className={`w-full h-96 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none transition-all ${mode === 'view' ? 'cursor-default' : ''}`}
                            placeholder="{}"
                        />
                        {mode === 'view' && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-slate-800/80 rounded text-[10px] text-slate-400 font-medium uppercase tracking-wider backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                Read Only
                            </div>
                        )}
                    </div>

                    {/* Status Feedback */}
                    {(error || success) && (
                        <div className={`rounded-xl border p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${error ? 'bg-red-950/20 border-red-900/30 text-red-400' : 'bg-green-950/20 border-green-900/30 text-green-400'}`}>
                            {error ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                            <span className="text-sm font-medium">{error || 'Configuration saved successfully!'}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
                    >
                        {mode === 'edit' ? 'Cancel' : 'Close'}
                    </button>
                    {mode === 'edit' && (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSaving ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
