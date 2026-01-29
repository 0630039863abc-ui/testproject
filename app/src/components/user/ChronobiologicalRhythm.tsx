import React, { useMemo } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Clock } from 'lucide-react';
import { getClusterColor } from '../../utils/clusterColors';

export const ChronobiologicalRhythm: React.FC = () => {
    const { logs, currentUser } = useSimulation();

    // Calculate 24h activity distribution from user logs
    const activityData = useMemo(() => {
        const userLogs = logs.filter(l => l.userId === currentUser.name);
        if (userLogs.length === 0) return Array(24).fill(0);

        const hours = Array(24).fill(0);
        userLogs.forEach(log => {
            const date = new Date(log.timestamp);
            const hour = date.getHours();
            hours[hour]++;
        });

        // Normalize to 0-1 range for opacity/height
        const max = Math.max(...hours, 1); // Prevent division by zero
        return hours.map(count => count / max);
    }, [logs, currentUser]);

    // Generate current hour indicator
    const currentHour = new Date().getHours();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
                <Clock size={10} className="text-blue-500" />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                    Chronobiological Rhythm
                </h3>
            </div>

            <div className="relative h-16 w-full bg-[#050505]/50 border border-white/5 rounded-sm p-0 overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-tech-grid opacity-20"></div>
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-blue-500/10"></div>

                {/* 1. Bar Grpah (Activity Heatmap) - Subtle Background */}
                <div className="absolute inset-0 flex items-end justify-between px-1 gap-[1px] opacity-30">
                    {activityData.map((intensity, hour) => (
                        <div
                            key={hour}
                            className="bg-blue-500 hover:opacity-100 transition-opacity"
                            style={{
                                height: `${Math.max(intensity * 100, 5)}%`,
                                flex: 1,
                                opacity: intensity > 0 ? 0.4 : 0.1
                            }}
                        ></div>
                    ))}
                </div>

                {/* 2. Sine Wave (Cognitive Load) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Render Wave Path */}
                    <path
                        d={`M 0 32 ` + activityData.map((intensity, i) => {
                            const x = (i / 23) * 100;
                            // Amplitude based on activity, modulated by a sine wave for "rhythm"
                            // y = baseline - (amplitude * sin(frequency))
                            // We smooth it out: varying amplitude based on intensity data
                            const amplitude = 10 + (intensity * 20);
                            const y = 32 - (amplitude * Math.sin((i / 24) * Math.PI * 4));
                            return `L ${x}% ${y}`;
                        }).join(' ') + ` L 100% 32`}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                        className="drop-shadow-[0_0_5px_rgba(59,130,246,0.6)]"
                    />

                    {/* Area under curve */}
                    <path
                        d={`M 0 64 L 0 32 ` + activityData.map((intensity, i) => {
                            const x = (i / 23) * 100;
                            const amplitude = 10 + (intensity * 20);
                            const y = 32 - (amplitude * Math.sin((i / 24) * Math.PI * 4));
                            return `L ${x}% ${y}`;
                        }).join(' ') + ` L 100% 32 L 100% 64 Z`}
                        fill="url(#waveGradient)"
                        opacity="0.3"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Current Time Indicator */}
                    <line
                        x1={`${(currentHour / 24) * 100}%`}
                        y1="0"
                        x2={`${(currentHour / 24) * 100}%`}
                        y2="100%"
                        stroke="#fbbf24"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                    />
                </svg>

                {/* Time Labels */}
                <div className="absolute inset-x-0 bottom-0 text-[7px] text-gray-600 font-mono flex justify-between px-2">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:59</span>
                </div>
            </div>

            <div className="flex justify-between text-[8px] font-mono text-gray-600 px-1">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:59</span>
            </div>
        </div>
    );
};
