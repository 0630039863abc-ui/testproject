import React, { useMemo } from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { motion } from 'framer-motion';
import { Target, AlertCircle, Zap } from 'lucide-react';

const AGE_GROUPS = [
    { label: '18-25', min: 18, max: 25 },
    { label: '26-35', min: 26, max: 35 },
    { label: '36-45', min: 36, max: 45 },
    { label: '46+', min: 46, max: 100 },
];

export const DemographicMatrix: React.FC = () => {
    const { logs, selectableUsers } = useSimulation();

    const matrixData = useMemo(() => {
        // Pre-calculate user demographics
        const userMap = selectableUsers.reduce((acc, u) => {
            acc[u.name] = { age: (u as any).age || 25, gender: (u as any).gender || 'Unknown' };
            return acc;
        }, {} as Record<string, { age: number, gender: string }>);

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

                    // Potential logic: High cognitive load but low evidence (Medium/Low)
                    const highLoadLogs = clusterLogs.filter(l => (l.cognitiveLoad || 0) > 7);
                    const lowEvidenceLogs = clusterLogs.filter(l => l.evidenceLevel !== 'High');

                    const potential = highLoadLogs.length > 0 ? (highLoadLogs.length / Math.max(interest, 1)) * 100 : 0;
                    const deficit = (interest > 10 && lowEvidenceLogs.length / interest > 0.7);

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
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Target size={14} className="text-emerald-500" />
                    Матрица_Потенциалов
                </h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                        <span className="text-[7px] text-white/30 uppercase">Потенциал</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                        <span className="text-[7px] text-white/30 uppercase">Дефицит</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-[80px_1fr] gap-2 min-h-0">
                {/* Y-Axis: Age Groups */}
                <div className="flex flex-col justify-between py-2 border-r border-white/5 pr-2">
                    {AGE_GROUPS.map(g => (
                        <div key={g.label} className="text-[9px] font-mono text-white/20 text-right uppercase">
                            {g.label} лет
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-6 gap-2">
                    {matrixData[0].clusters.map(c => (
                        <div key={c.name} className="text-[7px] font-black text-white/20 uppercase text-center truncate px-1">
                            {CLUSTER_TRANSLATIONS[c.name] || c.name}
                        </div>
                    ))}

                    {matrixData.map((row, rIdx) => (
                        <React.Fragment key={row.group}>
                            {row.clusters.map((cell, cIdx) => {
                                const hasPotential = cell.potential > 30;
                                const hasDeficit = cell.deficit;

                                return (
                                    <motion.div
                                        key={`${rIdx}-${cIdx}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (rIdx * 6 + cIdx) * 0.02 }}
                                        className="relative bg-white/[0.02] border border-white/5 rounded-sm p-2 flex flex-col items-center justify-center gap-1 overflow-hidden group hover:bg-white/[0.05] transition-colors"
                                    >
                                        {/* Background Value Indicator */}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-white/[0.03]"
                                            style={{ height: `${Math.min(cell.interest * 5, 100)}%` }}
                                        />

                                        {/* State Icons */}
                                        <div className="flex gap-1 absolute top-1 right-1">
                                            {hasPotential && <Zap size={8} className="text-emerald-400 animate-pulse" />}
                                            {hasDeficit && <AlertCircle size={8} className="text-red-400" />}
                                        </div>

                                        <span className="text-[10px] font-mono font-bold text-white relative z-10">
                                            {cell.interest}
                                        </span>

                                        {hasPotential && (
                                            <div className="text-[6px] font-black text-emerald-500/60 uppercase tracking-tighter relative z-10">
                                                +{cell.potential}% PTN
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex items-start gap-3">
                <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[8px] text-blue-300/60 leading-relaxed uppercase tracking-wide">
                    Прогноз на основе когнитивной нагрузки и уровней валидации.
                    Высокий потенциал в группе <span className="text-emerald-400 font-bold">26-35</span> в секторе <span className="text-emerald-400 font-bold">Технологии</span>.
                </p>
            </div>
        </div>
    );
};
