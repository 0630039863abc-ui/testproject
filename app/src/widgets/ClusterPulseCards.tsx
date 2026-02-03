import React, { useMemo } from 'react';
import { useSimulation } from '../entities/Simulation/model/simulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getClusterColor, CLUSTER_TRANSLATIONS } from '../shared/lib/tokens';

export const ClusterPulseCards: React.FC = () => {
    const { logs, currentUser } = useSimulation();

    // Aggregate user logs by cluster with live counts
    const clusterData = useMemo(() => {
        const userLogs = logs.filter(log => log.userId === currentUser.id || log.userId === currentUser.name);

        const counts: Record<string, { count: number; recentAction: string; lastTime: number }> = {};

        userLogs.forEach(log => {
            const cluster = log.cluster;
            if (!counts[cluster]) {
                counts[cluster] = { count: 0, recentAction: '', lastTime: 0 };
            }
            counts[cluster].count++;
            if (log.timestamp > counts[cluster].lastTime) {
                counts[cluster].recentAction = log.action;
                counts[cluster].lastTime = log.timestamp;
            }
        });

        return Object.entries(counts)
            .map(([cluster, data]) => ({
                cluster,
                count: data.count,
                recentAction: data.recentAction,
                lastTime: data.lastTime,
                color: getClusterColor(cluster),
                label: CLUSTER_TRANSLATIONS[cluster] || cluster
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top clusters including Healthcare
    }, [logs, currentUser]);

    if (clusterData.length === 0) {
        return (
            <div className="text-center py-6 text-[10px] text-gray-700 font-mono animate-pulse">
                ОЖИДАНИЕ ПОТОКА ТЕЛЕМЕТРИИ...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            <AnimatePresence>
                {clusterData.map((item, index) => (
                    <motion.div
                        key={item.cluster}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative p-3 rounded-sm border border-white/10 bg-black/30 group hover:border-white/20 transition-all overflow-hidden"
                        style={{
                            boxShadow: `inset 0 0 20px ${item.color}10, 0 0 8px ${item.color}15`
                        }}
                    >
                        {/* Glow effect */}
                        <div
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at 50% 100%, ${item.color}40, transparent 70%)`
                            }}
                        />

                        {/* Pulse indicator */}
                        <div className="absolute top-2 right-2">
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        </div>

                        {/* Cluster Label */}
                        <div
                            className="text-[9px] font-bold uppercase tracking-wider mb-1"
                            style={{ color: item.color }}
                        >
                            {item.label}
                        </div>

                        {/* Count with animation */}
                        <motion.div
                            className="text-xl font-black text-white tabular-nums"
                            key={item.count}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                        >
                            {item.count}
                        </motion.div>

                        {/* Recent action */}
                        <div className="text-[7px] font-mono text-gray-500 truncate mt-1 uppercase">
                            {item.recentAction}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
