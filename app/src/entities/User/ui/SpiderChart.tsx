import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useSimulation } from '../../Simulation/model/simulationContext';
import { CLUSTER_TRANSLATIONS, getClusterColor } from '../../../shared/lib/tokens';

interface SpiderChartProps {
    themeColor?: string; // Fallback only
}

const SpiderChartComponent: React.FC<SpiderChartProps> = ({ themeColor: fallbackColor = '#3b82f6' }) => {
    const { logs, currentUser } = useSimulation();
    const activeClusters = [
        'Education', 'Science', 'Labor', 'Culture', 'Volunteering', 'Patriotism',
        'Sports', 'HealthyLifestyle', 'Media', 'Diplomacy', 'Ecology', 'Tourism'
    ];

    // Compute values dynamically from telemetry logs
    const { data, personalDominant, globalMax } = useMemo(() => {
        // 1. Personal Stats
        const userLogs = logs.filter(log =>
            log.userId === currentUser.id || log.userId === currentUser.name
        );
        const personCounts: Record<string, number> = {};
        userLogs.forEach(log => {
            personCounts[log.cluster] = (personCounts[log.cluster] || 0) + 1;
        });

        // 2. Global Stats (Aggregate)
        const globalCounts: Record<string, number> = {};
        logs.forEach(log => {
            globalCounts[log.cluster] = (globalCounts[log.cluster] || 0) + 1;
        });

        // 3. Normalization Factors & Distribution Logic
        // Calculate the raw max value for normalization reference
        const globalMaxVal = Math.max(...Object.values(globalCounts), 5);

        // --- ENTROPY NOISE LOGIC ---

        // Simple seeded random function (linear congruential generator)
        // seed is based on user ID length + sum of char codes to be deterministic per user
        let seed = currentUser.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const seededRandom = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        // 1. Determine Topology Archtype
        const randType = seededRandom();
        let numDominants = 1;
        if (randType > 0.85) numDominants = 3;      // 15% Polymath
        else if (randType > 0.60) numDominants = 2; // 25% Balanced

        // 2. Identify Primary Dominant (from real stats)
        const sortedClusters = Object.entries(personCounts)
            .sort((a, b) => b[1] - a[1]);

        const primaryDominant = sortedClusters[0]?.[0] || 'Science';

        // 3. Pick Additional Dominants (if any) deterministically
        const dominantSet = new Set<string>([primaryDominant]);
        while (dominantSet.size < numDominants) {
            const randIndex = Math.floor(seededRandom() * activeClusters.length);
            const candidate = activeClusters[randIndex];
            if (candidate) dominantSet.add(candidate);
        }

        const chartData = activeClusters.map(name => {
            const isDominant = dominantSet.has(name);

            let normalizedValue;
            if (isDominant) {
                // Dominants are always 100% (or close to it for variety, e.g. 95-100)
                // Using 90 + random to ensure it hits the edge but feels organic
                normalizedValue = 90 + (seededRandom() * 10);
            } else {
                // Entropy Noise: 20% to 60% deterministic chaos
                // Some agents might have higher average noise > 40%, others lower.
                // We use the seeded random to generate a unique "noise level" for this cluster for this user
                const noiseBase = 15;
                const noiseRange = 45;
                normalizedValue = noiseBase + (seededRandom() * noiseRange);
            }

            return {
                subject: CLUSTER_TRANSLATIONS[name] || name,
                personal: normalizedValue,
                global: (globalCounts[name] || 0) / globalMaxVal * 100, // Keep global real
                fullMark: 100,
            };
        });

        return { data: chartData, personalDominant: primaryDominant, globalMax: globalMaxVal };
    }, [logs, currentUser]);

    const themeColor = getClusterColor(personalDominant) || fallbackColor;

    return (
        <div className="w-full h-full relative group">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                    <defs>
                        <linearGradient id="personalGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={themeColor} stopOpacity={0.6} />
                            <stop offset="95%" stopColor={themeColor} stopOpacity={0.1} />
                        </linearGradient>

                        <filter id="personalGlow" height="300%" width="300%" x="-75%" y="-75%">
                            <feGaussianBlur stdDeviation="3" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="globalGlow" height="200%" width="200%" x="-50%" y="-50%">
                            <feGaussianBlur stdDeviation="1.5" result="glow" />
                        </filter>
                    </defs>

                    <PolarGrid
                        gridType="polygon"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={1}
                    />

                    <PolarAngleAxis
                        dataKey="subject"
                        tick={(props: any) => {
                            const { x, y, payload } = props;
                            return (
                                <text
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    fill="#6b7280"
                                    fontSize={7}
                                    fontFamily="JetBrains Mono"
                                    fontWeight="bold"
                                    className="uppercase tracking-tighter"
                                >
                                    {payload.value}
                                </text>
                            );
                        }}
                    />

                    {/* GLOBAL AVERAGE LAYER (Background) */}
                    <Radar
                        name="Global"
                        dataKey="global"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth={1}
                        fill="rgba(59, 130, 246, 0.05)"
                        fillOpacity={1}
                        isAnimationActive={true}
                        animationDuration={1000}
                    />

                    {/* PERSONAL TELEMETRY LAYER (Foreground) */}
                    <Radar
                        name="Personal"
                        dataKey="personal"
                        stroke={themeColor}
                        strokeWidth={2}
                        fill="url(#personalGradient)"
                        fillOpacity={1}
                        filter="url(#personalGlow)"
                        isAnimationActive={true}
                        animationDuration={600}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* HUD Overlay Stats */}
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                    <span className="text-[6px] font-mono text-white/60">YOU</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="text-[6px] font-mono text-white/40">COLLECTIVE</span>
                </div>
            </div>

            <div className="absolute bottom-2 left-2 text-[7px] font-mono text-blue-400/20 uppercase tracking-widest">
                Topology Density: {globalMax} units
            </div>
        </div>
    );
};

export const SpiderChart = React.memo(SpiderChartComponent);
