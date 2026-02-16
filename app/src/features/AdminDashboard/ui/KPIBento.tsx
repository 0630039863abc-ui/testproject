import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { Widget } from '../../../shared/ui/Widget';

const Sparkline = ({ data, color }: { data: any[], color: string }) => (
    <ResponsiveContainer width={60} height={20}>
        <AreaChart data={data}>
            <Area type="monotone" dataKey="val" stroke={color} strokeWidth={1} fill={color} fillOpacity={0.1} isAnimationActive={false} />
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

        return Object.entries(CLUSTER_COLORS).slice(0, 6).map(([name, color]) => ({
            name,
            color,
            score: Math.round(stats[name]?.score || 0),
            users: stats[name]?.users.size || 0,
            count: stats[name]?.count || 0,
            trend: Array.from({ length: 12 }).map(() => ({ val: 10 + Math.random() * 40 }))
        })).sort((a, b) => b.score - a.score);
    }, [logs.length]);

    const maxScore = Math.max(...ranking.map(r => r.score), 1);

    return (
        <Widget
            title="Рейтинг"
            icon={<Trophy size={14} />}
            className="h-full"
            contentClassName="overflow-y-auto"
        >
            <div className="flex flex-col justify-evenly h-full">
                {ranking.map((item, idx) => {
                    const barWidth = Math.max((item.score / maxScore) * 100, 3);
                    return (
                        <div
                            key={item.name}
                            className="relative flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors duration-150 group overflow-hidden"
                        >
                            <div
                                className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
                                style={{
                                    width: `${barWidth}%`,
                                    backgroundColor: item.color,
                                    opacity: 0.1,
                                }}
                            />
                            <span className="relative text-[11px] text-zinc-500 font-mono tabular-nums w-5 text-right shrink-0">
                                {idx + 1}
                            </span>
                            <div
                                className="relative w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <div className="relative flex-1 min-w-0">
                                <span className="text-[13px] text-zinc-200 truncate block">
                                    {CLUSTER_TRANSLATIONS[item.name] || item.name}
                                </span>
                            </div>
                            <div className="relative shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                <Sparkline data={item.trend} color={item.color} />
                            </div>
                            <span className="relative text-[15px] font-mono text-zinc-100 tabular-nums font-semibold w-12 text-right shrink-0">
                                {item.score}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Widget>
    );
};
