import React, { useMemo } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { getClusterColor } from '../../utils/clusterColors';

export const CognitiveDrift: React.FC = () => {
    const { logs, currentUser } = useSimulation();

    // Calculate Drift (Velocity of Interest)
    const driftData = useMemo(() => {
        const userLogs = logs.filter(l => l.userId === currentUser.name).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
            const velocity = r - p; // Positive = Growing Interest, Negative = Waning
            return { cluster, velocity };
        })
            .sort((a, b) => b.velocity - a.velocity) // Sort by highest positive velocity
            .slice(0, 4); // Show top 4 movers
    }, [logs, currentUser]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
                <Zap size={10} className="text-yellow-500" />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                    Cognitive Drift
                </h3>
            </div>

            {/* Center-Out Visualization */}
            <div className="relative border border-white/5 bg-black/20 p-3 pt-4 rounded-sm">
                {/* Center Spine */}
                <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-white/10 z-0"></div>

                <div className="flex flex-col gap-3 relative z-10">
                    {driftData.map((item) => {
                        const maxVal = 5; // Assumed max velocity for scale
                        const width = Math.min((Math.abs(item.velocity) / maxVal) * 50, 50); // Max 50% width
                        const isPositive = item.velocity > 0;
                        const isZero = item.velocity === 0;

                        return (
                            <div key={item.cluster} className="flex items-center text-[9px] font-mono leading-none">
                                {/* Left Side (Label or Negative Bar) */}
                                <div className="flex-1 flex justify-end items-center gap-2 pr-2">
                                    {!isPositive && !isZero && (
                                        <div
                                            className="h-1 bg-red-500/50 rounded-l-sm"
                                            style={{ width: `${width}%` }}
                                        ></div>
                                    )}
                                    <span
                                        className={`uppercase ${isPositive ? 'text-gray-600' : 'text-white font-bold'}`}
                                        style={{ color: !isPositive ? getClusterColor(item.cluster) : undefined }}
                                    >
                                        {item.cluster}
                                    </span>
                                </div>

                                {/* Center Marker */}
                                <div className={`w-1 h-1 rounded-full ${isZero ? 'bg-gray-700' : 'bg-white/20'}`}></div>

                                {/* Right Side (Positive Bar or Label) */}
                                <div className="flex-1 flex justify-start items-center gap-2 pl-2">
                                    <span
                                        className={`uppercase ${!isPositive ? 'text-gray-600' : 'text-white font-bold'}`}
                                        style={{ color: isPositive ? getClusterColor(item.cluster) : undefined }}
                                    >
                                        {isPositive && '+'}{item.velocity}
                                    </span>
                                    {isPositive && (
                                        <div
                                            className="h-1 bg-green-500/50 rounded-r-sm"
                                            style={{ width: `${width}%` }}
                                        ></div>
                                    )}
                                    {!isPositive && !isZero && (
                                        <TrendingDown size={8} className="text-red-500 opacity-50" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {driftData.length === 0 && (
                    <div className="text-[9px] font-mono text-gray-600 text-center py-4">
                        INSUFFICIENT DATA FOR VELOCITY CALCULATION
                    </div>
                )}
            </div>
        </div>
    );
};
