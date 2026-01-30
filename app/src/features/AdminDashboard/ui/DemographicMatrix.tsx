import React, { useMemo } from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { motion } from 'framer-motion';
import { Target, AlertCircle, Zap, TrendingUp } from 'lucide-react';

const AGE_GROUPS = [
    { label: '18-25', min: 18, max: 25 },
    { label: '26-35', min: 26, max: 35 },
    { label: '36-45', min: 36, max: 45 },
    { label: '46+', min: 46, max: 100 },
];

export const DemographicMatrix: React.FC = () => {
    const { logs, selectableUsers } = useSimulation();

    const matrixData = useMemo(() => {
        const userMap = selectableUsers.reduce((acc, u) => {
            acc[u.name] = { age: (u as any).age || 25 };
            return acc;
        }, {} as Record<string, { age: number }>);

        const clusters = ['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art'];

        return AGE_GROUPS.map(group => {
            const groupLogs = logs.filter(l => {
                const age = userMap[l.userId]?.age || 0;
                return age >= group.min && age <= group.max;
            });

            return {
                group: group.label,
                clusters: clusters.map(cluster => {
                    const clusterLogs = groupLogs.filter(l => l.cluster === cluster);
                    const interest = clusterLogs.length;
                    const highLoadLogs = clusterLogs.filter(l => (l.cognitiveLoad || 0) > 7);
                    const lowEvidenceLogs = clusterLogs.filter(l => l.evidenceLevel !== 'High');
                    const potential = highLoadLogs.length > 0 ? (highLoadLogs.length / Math.max(interest, 1)) * 100 : 0;
                    const deficit = (interest > 5 && (lowEvidenceLogs.length / interest) > 0.6);

                    return {
                        name: cluster,
                        interest,
                        potential: Math.round(potential),
                        deficit
                    };
                })
            };
        });
    }, [logs, selectableUsers]);

    return (
        <div className="flex flex-col h-full bg-[#050505]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="flex justify-between items-center mb-6 z-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
                        <Target size={14} className="text-cyan-400" />
                        СТРАТЕГИЧЕСКАЯ_МАТРИЦА_v2
                    </h3>
                    <span className="text-[7px] text-white/20 uppercase font-mono tracking-widest">Анализ возрастных когорт и потенциала</span>
                </div>

                <div className="flex gap-4 p-1.5 bg-white/[0.02] border border-white/5 rounded-lg">
                    <div className="flex items-center gap-1.5 px-2">
                        <Zap size={10} className="text-emerald-400" />
                        <span className="text-[8px] text-white/40 uppercase font-black">PTN</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 border-l border-white/5">
                        <AlertCircle size={10} className="text-red-400" />
                        <span className="text-[8px] text-white/40 uppercase font-black">DFT</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 min-h-0 z-10">
                {/* Y-Axis Age Labels */}
                <div className="flex flex-col justify-between py-8">
                    {AGE_GROUPS.map(g => (
                        <div key={g.label} className="text-[10px] font-black text-white/20 text-right uppercase tracking-tighter">
                            {g.label}<br /><span className="text-[7px] font-normal text-white/10">ЛЕТ</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    {/* X-Axis Cluster Labels */}
                    <div className="grid grid-cols-6 gap-2">
                        {matrixData[0].clusters.map(c => (
                            <div key={c.name} className="text-[8px] font-black text-white/30 uppercase text-center truncate tracking-widest">
                                {CLUSTER_TRANSLATIONS[c.name]?.slice(0, 3) || c.name.slice(0, 3)}
                            </div>
                        ))}
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex-1 grid grid-rows-4 gap-2">
                        {matrixData.map((row, rIdx) => (
                            <div key={row.group} className="grid grid-cols-6 gap-2">
                                {row.clusters.map((cell, cIdx) => {
                                    const intensity = Math.min(cell.interest / 20, 1);
                                    const hasPotential = cell.potential > 30;
                                    const hasDeficit = cell.deficit;

                                    return (
                                        <motion.div
                                            key={`${rIdx}-${cIdx}`}
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                            className="relative bg-white/[0.03] border border-white/[0.05] rounded-lg p-2 flex flex-col items-center justify-center gap-1.5 group/cell overflow-hidden cursor-crosshair"
                                        >
                                            {/* Pulse Glow for High Activity */}
                                            {intensity > 0.5 && (
                                                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                                            )}

                                            {/* Dynamic Fill Level */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${intensity * 100}%` }}
                                                className="absolute bottom-0 left-0 right-0 bg-white/[0.02] border-t border-white/5"
                                            />

                                            {/* Scanning Line Effect */}
                                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10 animate-scan pointer-events-none opacity-0 group-hover/cell:opacity-100" />

                                            <div className="relative z-20 flex flex-col items-center gap-1">
                                                <span className={`text-[12px] font-black tabular-nums transition-colors ${intensity > 0.7 ? 'text-white' : 'text-white/40'}`}>
                                                    {cell.interest}
                                                </span>

                                                <div className="flex gap-1.5 h-3 items-center">
                                                    {hasPotential && (
                                                        <motion.div
                                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        >
                                                            <Zap size={10} className="text-emerald-400 fill-emerald-400/20" />
                                                        </motion.div>
                                                    )}
                                                    {hasDeficit && (
                                                        <motion.div
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                        >
                                                            <AlertCircle size={10} className="text-red-500" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Hover Detail */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm z-30 flex-col gap-1">
                                                <span className="text-[7px] font-black text-white/40 uppercase">{CLUSTER_TRANSLATIONS[cell.name]}</span>
                                                {hasPotential && <span className="text-[8px] text-emerald-400 font-bold">+{cell.potential}% PTN</span>}
                                                {hasDeficit && <span className="text-[8px] text-red-400 font-bold">CRIT DFT</span>}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-5 p-3 bg-cyan-500/[0.03] border border-cyan-500/10 rounded-xl flex items-center gap-4 z-10 transition-colors hover:bg-cyan-500/[0.05]">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <TrendingUp size={16} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                    <div className="text-[8px] font-black text-cyan-400/80 uppercase tracking-widest mb-0.5">Инсайт Потока</div>
                    <p className="text-[9px] text-white/40 leading-tight uppercase font-medium">
                        Критический потенциал роста обнаружен в группе <span className="text-emerald-400/80 font-black">26-35</span>.
                        Рекомендуемая нагрузка: <span className="text-white/60">+15% ТЕХ_СТЕК</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};
