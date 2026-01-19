import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useProjectScaffolding } from '../hooks/useApi';

interface ScaffoldingWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const TEMPLATE_TYPES = [
    {
        id: 'mcp_server',
        name: 'MCP Server',
        description: 'Create a SOTA-compliant MCP server with enhanced response patterns',
        icon: '🚀'
    },
    {
        id: 'landing_page',
        name: 'Landing Page',
        description: 'Generate a beautiful startup landing page',
        icon: '🎨'
    },
    {
        id: 'fullstack',
        name: 'Fullstack App',
        description: 'Complete FastAPI + React application',
        icon: '⚡'
    },
    {
        id: 'webshop',
        name: 'Webshop',
        description: 'E-commerce application with payment integration',
        icon: '🛒'
    },
    {
        id: 'game',
        name: 'Browser Game',
        description: 'Interactive browser-based game',
        icon: '🎮'
    },
    {
        id: 'wisdom_tree',
        name: 'Wisdom Tree',
        description: 'Interactive knowledge visualization',
        icon: '🌳'
    }
];

export function ScaffoldingWizard({ isOpen, onClose }: ScaffoldingWizardProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [projectName, setProjectName] = useState('');
    const [outputPath, setOutputPath] = useState('./');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('MetaMCP');

    const scaffolding = useProjectScaffolding();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTemplate || !projectName) return;

        const features: Record<string, any> = {};

        if (selectedTemplate === 'mcp_server') {
            features.description = description;
            features.author = author;
            features.include_ci = true;
            features.include_tests = true;
            features.include_docs = true;
            features.include_frontend = false;
            features.include_mcpb = true;
        } else if (selectedTemplate === 'landing_page') {
            features.hero_title = projectName;
            features.hero_subtitle = description || `The best ${projectName} platform`;
            features.github_url = `https://github.com/yourusername/${projectName.toLowerCase()}`;
            features.author_name = author;
            features.author_bio = `Creator of ${projectName}`;
            features.show_locally = true;
        }

        await scaffolding.execute({
            template_type: selectedTemplate,
            project_name: projectName,
            output_path: outputPath,
            features
        });
    };

    const resetForm = () => {
        setSelectedTemplate('');
        setProjectName('');
        setOutputPath('./');
        setDescription('');
        setAuthor('MetaMCP');
        scaffolding.reset();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const selectedTemplateData = TEMPLATE_TYPES.find(t => t.id === selectedTemplate);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 md:mx-0"
                    onClick={(e) => e.stopPropagation()}
                >
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Scaffolding Wizard</h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/5 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-muted mt-2">
                                Generate projects with MetaMCP's enhanced tooling
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Template Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    Select Template Type
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {TEMPLATE_TYPES.map((template) => (
                                        <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => setSelectedTemplate(template.id)}
                                            className={`p-4 text-left rounded-lg border transition-all ${
                                                selectedTemplate === template.id
                                                    ? 'border-[#00f3ff] bg-[#00f3ff]/10'
                                                    : 'border-white/10 hover:border-white/20 bg-white/5'
                                            }`}
                                        >
                                            <div className="text-2xl mb-2">{template.icon}</div>
                                            <div className="font-medium">{template.name}</div>
                                            <div className="text-xs text-muted mt-1">{template.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Project Details */}
                            {selectedTemplate && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Project Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00f3ff]"
                                            placeholder="my-awesome-project"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Output Path
                                        </label>
                                        <input
                                            type="text"
                                            value={outputPath}
                                            onChange={(e) => setOutputPath(e.target.value)}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00f3ff]"
                                            placeholder="./"
                                        />
                                    </div>

                                    {selectedTemplate === 'mcp_server' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00f3ff] resize-none"
                                                    rows={3}
                                                    placeholder="Brief description of your MCP server"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Author
                                                </label>
                                                <input
                                                    type="text"
                                                    value={author}
                                                    onChange={(e) => setAuthor(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00f3ff]"
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {selectedTemplate === 'landing_page' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Hero Subtitle
                                                </label>
                                                <input
                                                    type="text"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00f3ff]"
                                                    placeholder="The best platform for..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Author Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={author}
                                                    onChange={(e) => setAuthor(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00f3ff]"
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* Status Messages */}
                            {scaffolding.error && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-400">{scaffolding.error}</span>
                                </div>
                            )}

                            {scaffolding.success && (
                                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-green-400">{scaffolding.data?.message}</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 text-muted hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={scaffolding.loading || !selectedTemplate || !projectName}
                                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {scaffolding.loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        `Create ${selectedTemplateData?.name || 'Project'}`
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}