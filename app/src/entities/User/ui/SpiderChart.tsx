import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useSimulation } from '../../Simulation/model/simulationContext';
import { CLUSTER_TRANSLATIONS, getClusterColor } from '../../../shared/lib/tokens';

interface SpiderChartProps {
    themeColor?: string; // Fallback only
}

export const SpiderChart: React.FC<SpiderChartProps> = ({ themeColor: fallbackColor = '#3b82f6' }) => {
    const { logs, currentUser } = useSimulation();
    const activeClusters = ['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art'];

    // Compute values dynamically from telemetry logs
    const { data, dominantCluster } = useMemo(() => {
        // Filter logs for current user
        const userLogs = logs.filter(log =>
            log.userId === currentUser.id || log.userId === currentUser.name
        );

        // Count events per cluster
        const clusterCounts: Record<string, number> = {};
        userLogs.forEach(log => {
            clusterCounts[log.cluster] = (clusterCounts[log.cluster] || 0) + 1;
        });

        // Find dominant cluster (most activities)
        const dominant = Object.entries(clusterCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Science';

        // Find max for normalization
        const maxCount = Math.max(...Object.values(clusterCounts), 1);

        const chartData = activeClusters.map(name => ({
            subject: CLUSTER_TRANSLATIONS[name] || name,
            A: (clusterCounts[name] || 0) / maxCount * 100, // Normalize to 0-100
            rawCount: clusterCounts[name] || 0,
            fullMark: 100,
        }));

        return { data: chartData, dominantCluster: dominant };
    }, [logs, currentUser, activeClusters]);

    // Use dominant cluster color dynamically
    const themeColor = getClusterColor(dominantCluster) || fallbackColor;

    return (
        <div className="w-full h-full relative group">
            {/* Pulsating background indicators for active nodes */}
            <div className="absolute inset-0 pointer-events-none">
                {activeClusters.map((cluster, i) => (
                    <div
                        key={cluster}
                        className="absolute w-1 h-1 rounded-full animate-pulse transition-all duration-700"
                        style={{
                            top: '50%',
                            left: '50%',
                            backgroundColor: themeColor,
                            transform: `rotate(${i * 60 - 90}deg) translate(80px) rotate(-${i * 60 - 90}deg)`,
                            opacity: data.find(d => d.subject === (CLUSTER_TRANSLATIONS[cluster] || cluster))?.A || 0 > 30 ? 0.8 : 0.2,
                            scale: data.find(d => d.subject === (CLUSTER_TRANSLATIONS[cluster] || cluster))?.A ? 1 + (data.find(d => d.subject === (CLUSTER_TRANSLATIONS[cluster] || cluster))?.A || 0) / 200 : 1
                        }}
                    ></div>
                ))}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <defs>
                        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={themeColor} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={themeColor} stopOpacity={0.1} />
                        </linearGradient>
                        <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <PolarGrid
                        gridType="polygon"
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="3 3"
                    />

                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#9ca3af', fontSize: 8, fontFamily: 'monospace', fontWeight: 'bold' }}
                    />

                    <Radar
                        name="Компетенция"
                        dataKey="A"
                        stroke={themeColor}
                        strokeWidth={2}
                        fill="url(#radarFill)"
                        fillOpacity={1}
                        filter="url(#glow)"
                        isAnimationActive={true}
                        animationDuration={500}
                        animationEasing="ease-out"
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Dynamic counter overlay */}
            <div className="absolute bottom-1 left-1 text-[7px] font-mono text-gray-600">
                Σ {logs.filter(l => l.userId === currentUser.id || l.userId === currentUser.name).length}
            </div>
        </div>
    );
};
