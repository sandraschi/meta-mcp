import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Layout, ShoppingBag, Gamepad2, Brain, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { api, isSuccessResponse, getErrorMessage } from '../api/client'
import { logger } from '../utils/logger'

interface BuilderCardProps {
    title: string
    description: string
    icon: any
    color: string
    onClick: () => void
}

function BuilderCard({ title, description, icon: Icon, color, onClick }: BuilderCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 cursor-pointer hover:border-slate-700 hover:bg-slate-900 transition-all group relative overflow-hidden"
            onClick={onClick}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-${color}-500/20`} />

            <div className={`w-12 h-12 rounded-lg bg-${color}-500/10 flex items-center justify-center mb-4 text-${color}-400 group-hover:text-${color}-300 transition-colors`}>
                <Icon size={24} />
            </div>

            <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-white">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </motion.div>
    )
}

interface BuildModalProps {
    isOpen: boolean
    onClose: () => void
    builderType: string
    builderName: string
}

function BuildModal({ isOpen, onClose, builderType, builderName }: BuildModalProps) {
    const [projectName, setProjectName] = useState('')
    const [outputPath, setOutputPath] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!projectName || !outputPath) return

        setIsSubmitting(true)
        setStatus('idle')
        setMessage('')

        try {
            const response = await api.createProject({
                template_type: builderType,
                project_name: projectName,
                output_path: outputPath
            })

            if (isSuccessResponse(response)) {
                setStatus('success')
                setMessage(`Successfully created ${builderName} project!`)
                logger.info(`Created project: ${projectName} (${builderType}) at ${outputPath}`)
                setTimeout(() => {
                    onClose()
                    setStatus('idle')
                    setProjectName('')
                    setOutputPath('')
                    setMessage('')
                }, 2000)
            } else {
                setStatus('error')
                setMessage(getErrorMessage(response))
                logger.error(`Failed to create project: ${getErrorMessage(response)}`)
            }
        } catch (err) {
            setStatus('error')
            setMessage('An unexpected error occurred.')
            logger.error(`Error creating project: ${err}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-slate-800">
                        <h3 className="text-xl font-semibold text-slate-200">Build {builderName}</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Project Name</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="my-awesome-project"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Output Path</label>
                            <input
                                type="text"
                                value={outputPath}
                                onChange={(e) => setOutputPath(e.target.value)}
                                placeholder="D:/Dev/repos"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                required
                            />
                            <p className="text-xs text-slate-500">The project folder will be created inside this directory.</p>
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {message}
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2">
                                <CheckCircle size={16} />
                                {message}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || status === 'success'}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Building...
                                    </>
                                ) : status === 'success' ? (
                                    'Built!'
                                ) : (
                                    'Create Project'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export function BuildersPage() {
    const [selectedBuilder, setSelectedBuilder] = useState<{ type: string, name: string } | null>(null)

    const builders = [
        {
            type: 'mcp_server',
            name: 'MCP Server',
            description: 'Scaffold a new robust MCP server with FastMCP support, logging, and error handling.',
            icon: Server,
            color: 'blue'
        },
        {
            type: 'landing_page',
            name: 'Landing Page',
            description: 'Create a high-converting, responsive landing page with modern styling and SEO optimization.',
            icon: Layout,
            color: 'purple'
        },
        {
            type: 'fullstack',
            name: 'Fullstack App',
            description: 'Generate a complete fullstack application with React frontend and FastAPI backend.',
            icon: Layout,
            color: 'indigo'
        },
        {
            type: 'webshop',
            name: 'Webshop',
            description: 'Launch a modern e-commerce storefront with product catalog and cart functionality.',
            icon: ShoppingBag,
            color: 'emerald'
        },
        {
            type: 'game',
            name: 'Browser Game',
            description: 'Build an interactive browser-based game using Canvas API or WebGL.',
            icon: Gamepad2,
            color: 'rose'
        },
        {
            type: 'wisdom_tree',
            name: 'Wisdom Tree',
            description: 'Create an interactive knowledge graph visualization for exploring complex topics.',
            icon: Brain,
            color: 'amber'
        }
    ]

    return (
        <div className="h-full flex flex-col p-8 overflow-y-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                    Project Builders
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Rapidly scaffold new projects using our specialized templates. Select a builder below to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {builders.map((builder) => (
                    <BuilderCard
                        key={builder.type}
                        title={builder.name}
                        description={builder.description}
                        icon={builder.icon}
                        color={builder.color}
                        onClick={() => setSelectedBuilder({ type: builder.type, name: builder.name })}
                    />
                ))}
            </div>

            {selectedBuilder && (
                <BuildModal
                    isOpen={!!selectedBuilder}
                    onClose={() => setSelectedBuilder(null)}
                    builderType={selectedBuilder.type}
                    builderName={selectedBuilder.name}
                />
            )}
        </div>
    )
}
