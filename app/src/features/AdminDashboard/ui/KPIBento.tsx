import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Trophy, Activity, TrendingUp, Cpu } from 'lucide-react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_COLORS } from '../../../shared/lib/tokens';
import { motion } from 'framer-motion';

const Sparkline = ({ data, color }: { data: any[], color: string }) => (
    <ResponsiveContainer width="100%" height={24}>
        <AreaChart data={data}>
            <Area type="monotone" dataKey="val" stroke={color} strokeWidth={1} fill={color} fillOpacity={0.05} isAnimationActive={false} />
        </AreaChart>
    </ResponsiveContainer>
);

const VelocityChart = ({ value }: { value: number }) => {
    const [points, setPoints] = useState<number[]>(Array(40).fill(0));

    useEffect(() => {
        setPoints(prev => [...prev.slice(1), value]);
    }, [value]);

    const max = Math.max(...points, 1);
    const path = useMemo(() => {
        const width = 400;
        const height = 80;
        const step = width / (points.length - 1);
        return points.map((p, i) => `${i * step},${height - (p / max) * height}`).join(' L ');
    }, [points, max]);

    return (
        <div className="w-full h-20 relative overflow-hidden">
            <svg viewBox="0 0 400 80" className="w-full h-full preserve-3d">
                <defs>
                    <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.path
                    d={`M 0,80 L ${path} L 400,80 Z`}
                    fill="url(#velGrad)"
                    initial={false}
                    animate={{ d: `M 0,80 L ${path} L 400,80 Z` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                />
                <motion.path
                    d={`M 0,${80 - (points[0] / max) * 80} L ${path}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    initial={false}
                    animate={{ d: `M 0,${80 - (points[0] / max) * 80} L ${path}` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                />
            </svg>
        </div>
    );
};

export const KPIBento: React.FC = () => {
    const { logs } = useSimulation();

    const ranking = useMemo(() => {
        const stats = logs.reduce((acc, log) => {
            if (!acc[log.cluster]) {
                acc[log.cluster] = { score: 0, count: 0, users: new Set<string>() };
            }
            let weight = 1;
            if (log.evidenceLevel === 'High') weight += 2;
            if (log.action === 'Тест пройден') weight += 5;
            if (log.cognitiveLoad) weight += log.cognitiveLoad * 0.5;

            acc[log.cluster].score += weight;
            acc[log.cluster].count += 1;
            acc[log.cluster].users.add(log.userId);
            return acc;
        }, {} as Record<string, { score: number, count: number, users: Set<string> }>);

        return Object.entries(CLUSTER_COLORS).map(([name, color]) => ({
            name,
            color,
            score: Math.round(stats[name]?.score || 0),
            users: stats[name]?.users.size || 0,
            count: stats[name]?.count || 0,
            trend: Array.from({ length: 12 }).map(() => ({ val: 10 + Math.random() * 40 }))
        })).sort((a, b) => b.score - a.score);
    }, [logs.length]); // Refresh logic

    const velocity = logs.length * 1.4 + Math.random() * 5;

    return (
        <div className="h-full w-full bg-black/40 border border-white/10 rounded-xl p-6 flex gap-6 overflow-hidden font-['JetBrains_Mono',monospace]">
            {/* Left: High Density Ranking */}
            <div className="flex-[1.5] flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Trophy size={14} className="text-blue-500" />
                        Стратиграфия_Вовлечения
                    </h3>
                    <div className="text-[8px] text-white/20 font-mono uppercase tracking-[0.2em]">Окно Данных: 24Ч</div>
                </div>

                <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar pr-2">
                    {ranking.map((item, idx) => (
                        <div key={item.name} className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex flex-col gap-2 group hover:bg-white/[0.05] transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 opacity-10">
                                <span className="text-[20px] font-black italic">#{idx + 1}</span>
                            </div>
                            <div className="flex justify-between items-center relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: item.color }}>{item.name}</span>
                                <span className="text-[11px] font-black text-white tabular-nums">{item.score}</span>
                            </div>
                            <div className="h-6">
                                <Sparkline data={item.trend} color={item.color} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: System Velocity Chart */}
            <div className="flex-1 flex flex-col gap-4 border-l border-white/5 pl-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-blue-400 font-black flex items-center gap-2">
                            <Activity size={14} /> Скорость_Системы
                        </span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    </div>
                    <div className="text-4xl font-black text-white tracking-tighter tabular-nums mt-2">
                        {Math.round(velocity)} <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">TPS</span>
                    </div>
                </div>

                <div className="flex-1 min-h-0 bg-white/[0.02] border border-white/5 rounded-lg p-2 relative overflow-hidden">
                    <VelocityChart value={velocity} />
                    <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-end pointer-events-none">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[6px] text-white/20 uppercase">Состояние Буфера</span>
                            <span className="text-[8px] text-emerald-500 font-black">СТАБИЛЬНО</span>
                        </div>
                        <Cpu size={12} className="text-white/10" />
                    </div>
                </div>

                <div className="h-[60px] bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 flex items-center gap-4 group hover:bg-blue-500/10 transition-colors">
                    <div className="w-10 h-10 rounded-full border border-blue-500/30 flex items-center justify-center text-blue-400 bg-blue-500/10">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <div className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Вектор_Роста</div>
                        <div className="text-lg font-black text-white tabular-nums">1.84x</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
