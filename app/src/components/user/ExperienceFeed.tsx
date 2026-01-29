import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to determine semantic color for content
const getSemanticColor = (content: string) => {
    if (!content) return '#9ca3af';
    const upper = content.toUpperCase();
    if (upper.includes('SOCIETY')) return '#10b981'; // Emerald
    if (upper.includes('TECHNOLOGY')) return '#3b82f6'; // Blue
    if (upper.includes('ECONOMICS')) return '#f59e0b'; // Amber
    if (upper.includes('POLITICS')) return '#ef4444'; // Red
    if (upper.includes('ART')) return '#d946ef'; // Fuchsia
    if (upper.includes('SCIENCE')) return '#06b6d4'; // Cyan
    return '#9ca3af'; // Gray default
};

export const ExperienceFeed: React.FC = () => {
    const { logs, currentUser } = useSimulation();

    // Filter and Reverse logs to show newest first
    const userLogs = logs
        .filter(log => log.userId === currentUser.id || log.userId === currentUser.name)
        .reverse();

    return (
        <div className="flex flex-col gap-1 relative min-h-[200px]">
            {/* Background Scanline Loop for the entire feed container */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
                <div className="w-full h-[20px] bg-blue-500/20 blur-md absolute animate-scan-fast top-0"></div>
            </div>

            <AnimatePresence initial={false}>
                {userLogs.map((log) => {
                    // Use cluster or detail for color source
                    const semanticColor = getSemanticColor(log.cluster || log.topic || '');
                    const logId = log.timestamp.toString().slice(-3); // Fake ID from timestamp

                    return (
                        <motion.div
                            key={`${log.timestamp}-${log.action}-${logId}`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="w-full flex items-baseline gap-2 text-[9px] font-mono border-b border-white/5 pb-1 relative group hover:bg-white/5 pl-1 transition-colors"
                        >
                            {/* Timestamp */}
                            <span className="text-gray-600 shrink-0">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                            </span>

                            {/* Packet Data */}
                            <div className="flex-1 truncate flex items-center gap-1">
                                <span className="text-gray-500 font-bold shrink-0">[LOG_{logId}]</span>
                                <span className="text-gray-400 shrink-0">&gt;</span>
                                <span className="text-white font-bold shrink-0">{log.action.toUpperCase()}</span>
                                <span className="text-gray-600 shrink-0">//</span>

                                <span style={{ color: semanticColor, textShadow: `0 0 5px ${semanticColor}40` }}>
                                    {log.topic || log.cluster}
                                </span>
                            </div>

                            {/* Signal Strength (Randomized visual) */}
                            <div className="flex gap-[1px] opacity-30 group-hover:opacity-100">
                                <div className="w-0.5 h-1.5 bg-current" style={{ backgroundColor: semanticColor }}></div>
                                <div className="w-0.5 h-2 bg-current" style={{ backgroundColor: semanticColor }}></div>
                                <div className="w-0.5 h-1 bg-current" style={{ backgroundColor: semanticColor }}></div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {userLogs.length === 0 && (
                <div className="text-center py-10 text-[10px] text-gray-700 font-mono animate-pulse">
                    AWAITING TELEMETRY STREAM...
                </div>
            )}
        </div>
    );
};
