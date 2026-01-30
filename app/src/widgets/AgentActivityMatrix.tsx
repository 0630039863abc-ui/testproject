import React, { useMemo } from 'react';
import { useSimulation } from '../entities/Simulation/model/simulationContext';
import { motion } from 'framer-motion';
import { getClusterColor, CLUSTER_TRANSLATIONS } from '../shared/lib/tokens';
import { Users } from 'lucide-react';

export const AgentActivityMatrix: React.FC = () => {
    const { logs, selectableUsers } = useSimulation();

    // Build matrix: agents × their last N actions
    const matrixData = useMemo(() => {
        const maxActions = 6; // Show last 6 actions per agent

        return selectableUsers.map(user => {
            const userLogs = logs
                .filter(log => log.userId === user.id || log.userId === user.name)
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, maxActions);

            return {
                agent: user,
                actions: userLogs.map(log => ({
                    cluster: log.cluster,
                    action: log.action,
                    color: getClusterColor(log.cluster),
                    timestamp: log.timestamp
                })),
                totalCount: logs.filter(log => log.userId === user.id || log.userId === user.name).length
            };
        });
    }, [logs, selectableUsers]);

    if (matrixData.length === 0) {
        return (
            <div className="text-center py-4 text-[9px] font-mono text-gray-600">
                НЕТ АКТИВНЫХ АГЕНТОВ
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
                <Users size={10} className="text-blue-400" />
                <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400">
                    Матрица Активности Агентов
                </h3>
            </div>

            <div className="border border-white/5 bg-black/20 rounded-sm overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-[100px_1fr_40px] gap-2 px-3 py-1.5 border-b border-white/5 bg-white/5 text-[7px] font-mono uppercase text-gray-500">
                    <div>Агент</div>
                    <div>Последние действия</div>
                    <div className="text-right">∑</div>
                </div>

                {/* Agent Rows */}
                {matrixData.map((row, index) => (
                    <motion.div
                        key={row.agent.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-[100px_1fr_40px] gap-2 px-3 py-2 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors group"
                    >
                        {/* Agent Name */}
                        <div className="flex items-center gap-2">
                            <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: getClusterColor(Object.entries(row.agent.stats).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'Science') }}
                            />
                            <span className="text-[9px] font-mono text-white truncate">
                                {row.agent.name.split(' ')[0]}
                            </span>
                        </div>

                        {/* Action Dots */}
                        <div className="flex items-center gap-1.5">
                            {row.actions.length === 0 ? (
                                <span className="text-[8px] text-gray-600 italic">нет данных</span>
                            ) : (
                                row.actions.map((action, i) => (
                                    <motion.div
                                        key={`${action.timestamp}-${i}`}
                                        className="relative group/dot"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full cursor-default"
                                            style={{
                                                backgroundColor: action.color,
                                                boxShadow: `0 0 6px ${action.color}60`
                                            }}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black/90 border border-white/10 rounded text-[7px] font-mono text-white whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none z-50">
                                            {CLUSTER_TRANSLATIONS[action.cluster] || action.cluster}
                                            <br />
                                            <span className="text-gray-400">{action.action}</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {/* Empty slots */}
                            {Array.from({ length: Math.max(0, 6 - row.actions.length) }).map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="w-3 h-3 rounded-full bg-white/5"
                                />
                            ))}
                        </div>

                        {/* Total Count */}
                        <div className="text-right text-[10px] font-mono text-gray-400 tabular-nums group-hover:text-white transition-colors">
                            {row.totalCount}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
