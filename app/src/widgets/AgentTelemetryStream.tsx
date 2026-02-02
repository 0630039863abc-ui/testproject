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

            {/* Telemetry Stream (Synaptic Feed) */}
            <div className="relative border-l-2 border-white/5 ml-3 pl-4 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar pt-2 pb-10">
                {/* Central Spine Gradient */}
                <div className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />

                <AnimatePresence initial={false}>
                    {streamLogs.map((log, idx) => {
                        const color = getClusterColor(log.cluster);
                        const agentName = typeof log.userId === 'string' ? log.userId.split(' ')[0] : 'Unknown';
                        // Stagger delay for entrance
                        const delay = idx * 0.05;

                        return (
                            <motion.div
                                key={`${log.timestamp}-${log.id}`}
                                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.3, delay }}
                                className="relative group/log"
                            >
                                {/* Node on Spine */}
                                <div
                                    className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#030303] shadow-[0_0_10px_currentColor] z-10 transition-transform group-hover/log:scale-125"
                                    style={{ backgroundColor: color, color: color }}
                                />

                                {/* Connection Branch */}
                                <div className="absolute left-[-16px] top-2.5 w-4 h-[1px] bg-white/10 group-hover/log:bg-white/30 transition-colors" />

                                {/* Content Card */}
                                <div className="bg-white/[0.03] border border-white/5 rounded-r-lg rounded-bl-lg p-2 hover:bg-white/[0.06] transition-all hover:border-white/10 hover:translate-x-1 cursor-default">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[9px] font-bold text-white/90 uppercase tracking-wide">
                                            {log.action}
                                        </span>
                                        <span className="text-[8px] font-mono text-white/30 shrink-0">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[8px] font-mono">
                                        <span className="text-blue-400 font-bold">@{agentName}</span>
                                        <span className="text-white/20">::</span>
                                        <span style={{ color }} className="uppercase font-bold tracking-tight truncate max-w-[120px]">
                                            {CLUSTER_TRANSLATIONS[log.cluster] || log.cluster}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {streamLogs.length === 0 && (
                    <div className="text-left pl-2 text-[9px] font-mono text-gray-600 animate-pulse italic">
                        // ОЖИДАНИЕ СИНАПТИЧЕСКОГО ОТКЛИКА...
                    </div>
                )}
            </div>
        </div>
    );
};
