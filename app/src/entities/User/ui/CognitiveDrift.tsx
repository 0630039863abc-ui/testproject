import React, { useMemo } from 'react';
import { useSimulation } from '../../Simulation/model/simulationContext';
import { Zap } from 'lucide-react';
import { getClusterColor, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { motion } from 'framer-motion';

const CognitiveDriftComponent: React.FC = () => {
    const { logs, currentUser } = useSimulation();

    // Calculate Drift (Velocity of Interest) - MEMOIZED
    const driftData = useMemo(() => {
        const userLogs = logs
            .filter(l => l.userId === currentUser.name)
            .sort((a, b) => b.timestamp - a.timestamp);

        if (userLogs.length < 5) return [];

        const recent = userLogs.slice(0, 10);
        const previous = userLogs.slice(10, 20);

        const countLogs = (logSlice: typeof userLogs) => {
            const counts: Record<string, number> = {};
            logSlice.forEach(l => {
                counts[l.cluster] = (counts[l.cluster] || 0) + 1;
            });
            return counts;
        };

        const recentCounts = countLogs(recent);
        const previousCounts = countLogs(previous);

        // Get all unique clusters found
        const allClusters = Array.from(new Set([...Object.keys(recentCounts), ...Object.keys(previousCounts)]));

        return allClusters.map(cluster => {
            const r = recentCounts[cluster] || 0;
            const p = previousCounts[cluster] || 0;
            const velocity = r - p;
            const total = r + p;
            return { cluster, velocity, recent: r, previous: p, total };
        })
            .sort((a, b) => b.velocity - a.velocity)
            .slice(0, 6); // Show top 6 movers
    }, [logs, currentUser.name]);

    const maxTotal = Math.max(...driftData.map(d => d.total), 1);

    return (
        <div className="flex flex-col gap-2">
            <div className="items-center gap-2 flex">
                <Zap size={9} className="text-yellow-500" />
                <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400">
                    Когнитивный Дрифт
                </h3>
            </div>

            {/* Variant C: Vertical Progress Bars with Glow */}
            <div className="flex gap-1.5 items-end h-16 border border-white/5 bg-black/20 p-2 rounded-sm">
                {driftData.length === 0 ? (
                    <div className="w-full text-[9px] font-mono text-gray-600 text-center py-4">
                        НЕДОСТАТОЧНО ДАННЫХ ДЛЯ РАСЧЁТА СКОРОСТИ
                    </div>
                ) : (
                    driftData.map((item) => {
                        const height = Math.max((item.total / maxTotal) * 100, 15);
                        const color = getClusterColor(item.cluster);
                        const isPositive = item.velocity > 0;
                        const isNegative = item.velocity < 0;

                        return (
                            <div key={item.cluster} className="flex-1 flex flex-col items-center gap-1 group">
                                {/* Velocity Indicator */}
                                <span className={`text-[8px] font-mono font-bold ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-500'}`}>
                                    {isPositive && '+'}{item.velocity}
                                </span>

                                {/* Bar Container */}
                                <div className="w-full h-full flex items-end justify-center">
                                    <motion.div
                                        className="w-3 rounded-t-sm relative"
                                        style={{
                                            backgroundColor: color,
                                            boxShadow: `0 0 12px ${color}60, 0 0 24px ${color}30`,
                                        }}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                    >
                                        {/* Glow overlay */}
                                        <div
                                            className="absolute inset-0 rounded-t-sm opacity-50"
                                            style={{
                                                background: `linear-gradient(to top, ${color}00, ${color}80)`
                                            }}
                                        />
                                    </motion.div>
                                </div>

                                {/* Label */}
                                <span
                                    className="text-[7px] font-mono text-center uppercase truncate w-full opacity-60 group-hover:opacity-100 transition-opacity"
                                    style={{ color }}
                                    title={CLUSTER_TRANSLATIONS[item.cluster] || item.cluster}
                                >
                                    {(CLUSTER_TRANSLATIONS[item.cluster] || item.cluster).slice(0, 4)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export const CognitiveDrift = React.memo(CognitiveDriftComponent);
