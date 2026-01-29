import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useSimulation } from '../../context/SimulationContext';

export const SpiderChart: React.FC = () => {
    const { clusterMetrics } = useSimulation();

    // Transform cluster metrics for Radar Chart
    // Normalize data: Science (max ~1000) -> 100% scale for visualization
    const data = clusterMetrics.map(c => ({
        subject: c.name,
        A: c.activeUnits, // Raw value
        fullMark: 1000,   // Max expected value for normalization visually
    }));

    return (
        <div className="w-full h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                    <defs>
                        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                        <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#e5e7eb', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold' }}
                    />
                    <Radar
                        name="Competence"
                        dataKey="A"
                        stroke="#60a5fa"
                        strokeWidth={3}
                        fill="url(#radarFill)"
                        fillOpacity={0.6}
                        filter="url(#glow)"
                        isAnimationActive={true}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
