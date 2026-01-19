import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Monitor, Moon, Sun, Save, RefreshCw } from 'lucide-react';
import { useApiContext } from '../context/ApiContext';
import { useToast } from '../context/ToastContext';

interface SettingsProps {
    onClose?: () => void;
}

export function Settings({ onClose }: SettingsProps) {
    const { refreshHealth } = useApiContext();
    const { success, error } = useToast();
    const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark');
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleSaveSettings = () => {
        try {
            // Save to localStorage
            localStorage.setItem('meta-mcp-settings', JSON.stringify({
                theme,
                animationsEnabled,
                autoRefresh,
                refreshInterval,
                notificationsEnabled
            }));

            success('Settings Saved', 'Your preferences have been updated successfully.');
        } catch (err) {
            error('Save Failed', 'Unable to save settings. Please try again.');
        }
    };

    const handleResetDefaults = () => {
        setTheme('dark');
        setAnimationsEnabled(true);
        setAutoRefresh(true);
        setRefreshInterval(30);
        setNotificationsEnabled(true);
    };

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00f3ff] to-[#bd00ff] rounded-lg flex items-center justify-center">
                    <SettingsIcon size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#00f3ff] bg-clip-text text-transparent">
                        Settings
                    </h2>
                    <p className="text-muted">Customize your MetaMCP experience</p>
                </div>
            </div>

            {/* Theme Settings */}
            <motion.div
                className="glass-panel p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <Palette size={20} className="text-[#00f3ff]" />
                    <h3 className="text-lg font-semibold">Appearance</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-3">Theme</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'dark', label: 'Dark', icon: Moon },
                                { id: 'light', label: 'Light', icon: Sun },
                                { id: 'auto', label: 'Auto', icon: Monitor }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setTheme(option.id as any)}
                                    className={`p-3 rounded-lg border transition-all ${
                                        theme === option.id
                                            ? 'border-[#00f3ff] bg-[#00f3ff]/10'
                                            : 'border-white/10 hover:border-white/20 bg-white/5'
                                    }`}
                                >
                                    <option.icon size={16} className="mb-2 mx-auto" />
                                    <div className="text-sm font-medium">{option.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Enable Animations</label>
                            <p className="text-xs text-muted">Toggle smooth transitions and micro-interactions</p>
                        </div>
                        <button
                            onClick={() => setAnimationsEnabled(!animationsEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                animationsEnabled ? 'bg-[#00f3ff]' : 'bg-white/20'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* System Settings */}
            <motion.div
                className="glass-panel p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <Monitor size={20} className="text-[#bd00ff]" />
                    <h3 className="text-lg font-semibold">System</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Auto Refresh</label>
                            <p className="text-xs text-muted">Automatically refresh health status</p>
                        </div>
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                autoRefresh ? 'bg-[#bd00ff]' : 'bg-white/20'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    autoRefresh ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {autoRefresh && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-sm font-medium mb-2">Refresh Interval (seconds)</label>
                            <select
                                value={refreshInterval}
                                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bd00ff]"
                            >
                                <option value={15}>15 seconds</option>
                                <option value={30}>30 seconds</option>
                                <option value={60}>1 minute</option>
                                <option value={300}>5 minutes</option>
                            </select>
                        </motion.div>
                    )}

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Notifications</label>
                            <p className="text-xs text-muted">Show desktop notifications for status changes</p>
                        </div>
                        <button
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                notificationsEnabled ? 'bg-[#ff0055]' : 'bg-white/20'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                className="flex gap-3 pt-4 border-t border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <button
                    onClick={handleResetDefaults}
                    className="flex-1 px-4 py-2 text-muted hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCw size={16} />
                    Reset to Defaults
                </button>
                <button
                    onClick={handleSaveSettings}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                    <Save size={16} />
                    Save Settings
                </button>
            </motion.div>

            {/* System Info */}
            <motion.div
                className="glass-panel p-4 bg-white/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="text-sm text-muted">
                    <div className="flex justify-between mb-1">
                        <span>Version:</span>
                        <span>v1.3.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>2025-01-19</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}