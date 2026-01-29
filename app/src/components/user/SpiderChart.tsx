import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useSimulation } from '../../context/SimulationContext';

interface SpiderChartProps {
    themeColor?: string;
}

export const SpiderChart: React.FC<SpiderChartProps> = ({ themeColor = '#3b82f6' }) => {
    const { currentUser } = useSimulation();
    const activeClusters = ['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art'];

    // Transform personal stats for Radar Chart
    // Normalize data: Stats typically range 0-100+ -> 100% scale for visualization
    const data = activeClusters.map(name => ({
        subject: name,
        A: (currentUser.stats as any)[name] || 0, // Explicit cast to fix indexing
        fullMark: 1000,
    }));

    return (
        <div className="w-full h-full relative group">
            {/* Pulsating background indicators for active nodes */}
            <div className="absolute inset-0 pointer-events-none">
                {activeClusters.map((cluster, i) => (
                    <div
                        key={cluster}
                        className="absolute w-1 h-1 rounded-full animate-pulse transition-opacity duration-500"
                        style={{
                            top: '50%',
                            left: '50%',
                            backgroundColor: themeColor,
                            transform: `rotate(${i * 60 - 90}deg) translate(80px) rotate(-${i * 60 - 90}deg)`, // Approximate positioning
                            opacity: (currentUser.stats as any)[cluster] > 600 ? 0.8 : 0.2
                        }}
                    ></div>
                ))}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <defs>
                        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={themeColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={themeColor} stopOpacity={0.05} />
                        </linearGradient>
                        <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <PolarGrid
                        gridType="polygon"
                        stroke="rgba(255,255,255,0.05)"
                        strokeDasharray="4 4"
                    />

                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#9ca3af', fontSize: 8, fontFamily: 'monospace', fontWeight: 'bold' }}
                    />

                    <Radar
                        name="Competence"
                        dataKey="A"
                        stroke={themeColor}
                        strokeWidth={2}
                        fill="url(#radarFill)"
                        fillOpacity={1}
                        filter="url(#glow)"
                        isAnimationActive={true}
                        animationDuration={1500}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Measurement Labels overlay - simulated axis */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[35%] h-[35%] border border-white/5 rounded-full absolute"></div>
                <div className="w-[70%] h-[70%] border border-white/5 rounded-full absolute"></div>
                <span className="absolute text-[6px] text-gray-700 font-mono top-[50%] left-[50%] -translate-x-1/2 -translate-y-[35px]">0.5</span>
                <span className="absolute text-[6px] text-gray-700 font-mono top-[50%] left-[50%] -translate-x-1/2 -translate-y-[70px]">1.0</span>
            </div>
        </div>
    );
};
