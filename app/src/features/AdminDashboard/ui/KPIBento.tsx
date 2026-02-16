import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { Holocard } from '../../../shared/ui/Holocard';

const Sparkline = ({ data, color }: { data: any[], color: string }) => (
    <ResponsiveContainer width="100%" height={24}>
        <AreaChart data={data}>
            <Area type="monotone" dataKey="val" stroke={color} strokeWidth={1} fill={color} fillOpacity={0.05} isAnimationActive={false} />
        </AreaChart>
    </ResponsiveContainer>
);

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
    }, [logs.length]);

    return (
        <div className="h-full w-full flex flex-col gap-6 overflow-hidden">
            <div className="flex justify-between items-end border-b border-prism/30 pb-3">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-orbitron font-black text-blue-400 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Trophy size={14} className="text-blue-500 shadow-[0_0_10px_#3b82f6]" />
                        РЕЙТИНГ_СТРАТ
                    </h3>
                    <p className="text-[7px] text-blue-300/30 font-mono-data uppercase tracking-[0.1em]">Матрица распределения компетенций</p>
                </div>
                <div className="text-[8px] text-white/20 font-mono-data opacity-40 uppercase tracking-[0.2em] border border-white/5 px-2 py-0.5 rounded-[1px] bg-white/[0.02]">ОКНО_ДАННЫХ: 24Ч</div>
            </div>

            <div className="grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar pr-2 pb-4">
                {ranking.map((item, idx) => (
                    <Holocard
                        key={item.name}
                        className="p-4 bg-void/40 hover:bg-white/[0.03] border-prism/20 transition-all duration-300 group ring-1 ring-white/5"
                        gloss={true}
                        corners={{ tl: true, tr: false, bl: false, br: true }}
                    >
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-blue-500/50" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-blue-500/50" />

                        <div className="absolute top-2 right-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="text-[28px] font-black italic font-orbitron">#{idx + 1}</span>
                        </div>

                        <div className="flex justify-between items-start relative z-10 mb-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-orbitron font-black uppercase tracking-widest transition-colors group-hover:text-white" style={{ color: item.color }}>
                                    {CLUSTER_TRANSLATIONS[item.name] || item.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
                                    <span className="text-[7px] text-white/30 font-mono-data uppercase tracking-tighter">{item.users} активных_узлов</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[14px] font-mono-data font-bold text-white tabular-nums tracking-tighter block leading-none">
                                    {item.score}
                                </span>
                                <span className="text-[6px] text-blue-400/40 font-orbitron font-black uppercase tracking-widest">очков</span>
                            </div>
                        </div>

                        <div className="h-8 relative group-hover:scale-y-110 transition-transform origin-bottom mt-auto">
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] pointer-events-none" />
                            <Sparkline data={item.trend} color={item.color} />
                        </div>
                    </Holocard>
                ))}
            </div>
        </div>
    );
};
