import React, { useMemo, useState } from 'react';
import { useSimulation } from '../entities/Simulation/model/simulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getClusterColor, CLUSTER_TRANSLATIONS } from '../shared/lib/tokens';
import { Radio, ChevronDown } from 'lucide-react';

export const AgentTelemetryStream: React.FC = () => {
    const { logs, selectableUsers } = useSimulation();
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Get logs for selected agent or all agents
    const streamLogs = useMemo(() => {
        const allLogs = logs
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 30);

        if (!selectedAgent) return allLogs;

        return allLogs.filter(log =>
            log.userId === selectedAgent ||
            selectableUsers.find(u => u.id === selectedAgent)?.name === log.userId
        );
    }, [logs, selectedAgent, selectableUsers]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Radio size={10} className="text-green-400 animate-pulse" />
                    <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400">
                        Телеметрия Агентов
                    </h3>
                </div>

                {/* Agent Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-mono text-gray-300 hover:bg-white/10 transition-colors"
                    >
                        {selectedAgent
                            ? selectableUsers.find(u => u.id === selectedAgent)?.name.split(' ')[0] || 'Все'
                            : 'Все агенты'
                        }
                        <ChevronDown size={10} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute right-0 top-full mt-1 bg-black/95 border border-white/10 rounded shadow-lg z-50 min-w-[120px]"
                            >
                                <button
                                    onClick={() => { setSelectedAgent(null); setIsDropdownOpen(false); }}
                                    className="w-full px-3 py-1.5 text-left text-[8px] font-mono text-gray-300 hover:bg-white/10 transition-colors"
                                >
                                    Все агенты
                                </button>
                                {selectableUsers.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => { setSelectedAgent(user.id); setIsDropdownOpen(false); }}
                                        className="w-full px-3 py-1.5 text-left text-[8px] font-mono text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2"
                                    >
                                        <div
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: getClusterColor(Object.entries(user.stats).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'Science') }}
                                        />
                                        {user.name.split(' ')[0]}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Telemetry Stream */}
            <div className="border border-white/5 bg-black/20 rounded-sm max-h-[200px] overflow-y-auto custom-scrollbar">
                <AnimatePresence initial={false}>
                    {streamLogs.map((log) => {
                        const color = getClusterColor(log.cluster);
                        const agentName = typeof log.userId === 'string' ? log.userId.split(' ')[0] : 'Unknown';

                        return (
                            <motion.div
                                key={`${log.timestamp}-${log.id}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 px-2 py-1 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors text-[8px] font-mono"
                            >
                                {/* Timestamp */}
                                <span className="text-gray-600 shrink-0 w-14">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                                </span>

                                {/* Agent */}
                                <span className="text-blue-400 shrink-0 w-12 truncate font-bold">
                                    {agentName}
                                </span>

                                {/* Action */}
                                <span className="text-white shrink-0">
                                    {log.action}
                                </span>

                                {/* Cluster/Topic */}
                                <span
                                    className="truncate flex-1"
                                    style={{ color, textShadow: `0 0 5px ${color}40` }}
                                >
                                    {CLUSTER_TRANSLATIONS[log.cluster] || log.cluster}
                                    {log.topic && ` / ${log.topic}`}
                                </span>

                                {/* Signal indicator */}
                                <div className="flex gap-[1px] opacity-50">
                                    <div className="w-0.5 h-1" style={{ backgroundColor: color }} />
                                    <div className="w-0.5 h-1.5" style={{ backgroundColor: color }} />
                                    <div className="w-0.5 h-1" style={{ backgroundColor: color }} />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {streamLogs.length === 0 && (
                    <div className="text-center py-4 text-[9px] font-mono text-gray-600 animate-pulse">
                        ОЖИДАНИЕ ТЕЛЕМЕТРИИ...
                    </div>
                )}
            </div>
        </div>
    );
};
