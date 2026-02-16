import React, { useMemo } from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { motion } from 'framer-motion';
import { Target, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { Holocard } from '../../../shared/ui/Holocard';

const AGE_GROUPS = [
    { label: '7-12', min: 7, max: 12, stage: 'ДЕТИ' },
    { label: '13-17', min: 13, max: 17, stage: 'ПОДРОСТКИ' },
    { label: '18-35', min: 18, max: 35, stage: 'МОЛОДЕЖЬ' },
];

export const DemographicMatrix: React.FC = () => {
    const { logs, selectableUsers } = useSimulation();

    const { matrix, debugStats } = useMemo(() => {
        if (!selectableUsers || !logs) {
            return {
                matrix: AGE_GROUPS.map(g => ({ group: g.label, clusters: [] })),
                debugStats: { totalLogs: 0, matchedUsers: 0, matchedAge: 0, unmatchedIds: [] as string[] }
            };
        }

        const userMap = selectableUsers.reduce((acc, u) => {
            if (u) {
                // Map both ID and Name to user for robustness
                if (u.id) acc[u.id.toLowerCase().trim()] = u;
                if (u.name) acc[u.name.toLowerCase().trim()] = u;
            }
            return acc;
        }, {} as Record<string, typeof selectableUsers[0]>);

        const debug = {
            totalLogs: logs.length,
            matchedUsers: 0,
            matchedAge: 0,
            unmatchedIds: new Set<string>()
        };

        const clusters = [
            'Education', 'Science', 'Labor', 'Culture', 'Volunteering', 'Patriotism',
            'Sports', 'HealthyLifestyle', 'Media', 'Diplomacy', 'Ecology', 'Tourism'
        ];

        const matrix = AGE_GROUPS.map(group => {
            const groupLogs = logs.filter(l => {
                if (!l.userId) return false;
                const userId = l.userId.toLowerCase().trim();
                const user = userMap[userId];

                if (user) {
                    debug.matchedUsers++;
                    const age = user.age || 0;
                    if (age >= group.min && age <= group.max) {
                        debug.matchedAge++;
                        return true;
                    }
                } else {
                    if (debug.unmatchedIds.size < 5) debug.unmatchedIds.add(l.userId);
                }
                return false;
            });

            return {
                group: group.label,
                clusters: clusters.map(cluster => {
                    const clusterLogs = groupLogs.filter(l => l.cluster === cluster);
                    const interest = clusterLogs.length;
                    const highLoadLogs = clusterLogs.filter(l => (l.cognitiveLoad || 0) > 6);
                    const lowEvidenceLogs = clusterLogs.filter(l => l.evidenceLevel !== 'High');
                    const potential = highLoadLogs.length > 0 ? (highLoadLogs.length / Math.max(interest, 1)) * 100 : 0;
                    const deficit = (interest > 2 && (lowEvidenceLogs.length / interest) > 0.5);

                    return {
                        name: cluster,
                        interest,
                        potential: Math.round(potential),
                        deficit
                    };
                })
            };
        });

        return { matrix, debugStats: { ...debug, unmatchedIds: Array.from(debug.unmatchedIds) } };
    }, [logs, selectableUsers]);

    return (
        <Holocard
            className="flex flex-col h-full"
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-orbitron font-black text-blue-400/60 uppercase tracking-[0.4em] flex items-center gap-2">
                            <Target size={14} className="text-blue-500" />
                            ДЕМОГРАФИЧЕСКАЯ_МАТРИЦА
                        </h3>

                        {/* Compact Debug Panel */}
                        <div className="flex gap-3 text-[9px] font-mono text-red-300 bg-red-950/80 px-3 py-1.5 rounded border border-red-500/30 items-center shadow-lg shadow-red-900/20">
                            <span className="text-red-200">Users: <span className="text-white font-bold">{selectableUsers?.length}</span></span>
                            <span className="text-red-200">Logs: <span className="text-white font-bold">{logs?.length}</span></span>
                            <span className="text-emerald-300">Match: <span className="font-bold">{debugStats.matchedUsers}</span></span>
                            <span className="text-emerald-300">Age: <span className="font-bold">{debugStats.matchedAge}</span></span>
                            <span title={debugStats.unmatchedIds.join('\n')} className="cursor-help border-b border-dashed border-red-400/50 text-red-400 hover:text-red-300 transition-colors">
                                Unmatched: {debugStats.unmatchedIds.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 p-1.5 bg-white/[0.01] border border-white/5 rounded-sm">
                        <div className="flex items-center gap-1.5 px-2">
                            <Zap size={10} className="text-emerald-400" />
                            <span className="text-[8px] text-white/40 uppercase font-orbitron font-black">ПОТ</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 border-l border-white/5">
                            <AlertCircle size={10} className="text-red-400" />
                            <span className="text-[8px] text-white/40 uppercase font-orbitron font-black">ДЕФ</span>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="flex-1 flex flex-col p-4 min-h-0 overflow-hidden">
                <div className="flex flex-col gap-4 min-h-0">
                    {/* Header for X-Axis Cluster Labels (first 6) */}
                    <div className="grid grid-cols-[64px_1fr] gap-4">
                        <div />
                        <div className="grid grid-cols-6 gap-2">
                            {matrix[0].clusters.slice(0, 6).map((c: any) => (
                                <div key={c.name} className="text-[7px] font-orbitron font-black text-white/20 uppercase text-center truncate tracking-widest">
                                    {CLUSTER_TRANSLATIONS[c.name]?.slice(0, 3) || c.name.slice(0, 3)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Matrix Rows per Age Group */}
                    <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                        {matrix.map((row: any, rIdx: number) => (
                            <div key={row.group} className="grid grid-cols-[64px_1fr] gap-4">
                                {/* Label for Age Group */}
                                <div className="flex flex-col items-end justify-center py-2 border-r border-white/5 pr-4 h-full">
                                    <span className="text-[11px] font-orbitron font-black text-white tracking-tighter tabular-nums leading-none mb-1">{row.group}</span>
                                    <span className="text-[7px] font-bold text-cyan-400/60 uppercase tracking-[0.2em] font-orbitron text-right">{AGE_GROUPS[rIdx].stage}</span>
                                </div>

                                {/* Cluster Grid (6x2) */}
                                <div className="grid grid-cols-6 gap-2">
                                    {row.clusters.map((cell: any, cIdx: number) => {
                                        const intensity = Math.min(cell.interest / 20, 1);
                                        const hasPotential = cell.potential > 30;
                                        const hasDeficit = cell.deficit;

                                        return (
                                            <motion.div
                                                key={`${rIdx}-${cIdx}`}
                                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                                className="relative bg-white/[0.01] border border-white/[0.05] rounded-[2px] flex flex-col items-center justify-center gap-1 group/cell cursor-crosshair min-h-[48px]"
                                            >
                                                {/* Pulse Glow for High Activity */}
                                                {intensity > 0.5 && (
                                                    <div className="absolute inset-0 bg-blue-500/[0.03] animate-pulse" />
                                                )}

                                                {/* Dynamic Fill Level */}
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${intensity * 100}%` }}
                                                    className="absolute bottom-0 left-0 right-0 bg-blue-500/[0.05] border-t border-blue-500/10"
                                                />

                                                <div className="relative z-20 flex flex-col items-center gap-1">
                                                    <span className={`text-[10px] font-mono-data font-bold tabular-nums transition-colors ${intensity > 0.7 ? 'text-white' : 'text-white/40'}`}>
                                                        {cell.interest}
                                                    </span>

                                                    <div className="flex gap-1 h-3 items-center">
                                                        {hasPotential && (
                                                            <motion.div
                                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                            >
                                                                <Zap size={9} className="text-emerald-400 fill-emerald-400/20" />
                                                            </motion.div>
                                                        )}
                                                        {hasDeficit && (
                                                            <motion.div
                                                                animate={{ scale: [1, 1.2, 1] }}
                                                                transition={{ repeat: Infinity, duration: 2 }}
                                                            >
                                                                <AlertCircle size={9} className="text-red-500" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Hover Detail */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity bg-black/95 backdrop-blur-md z-30 flex-col gap-0.5 p-1 text-center">
                                                    <span className="text-[6px] font-orbitron font-black text-white/60 uppercase leading-tight">{CLUSTER_TRANSLATIONS[cell.name]}</span>
                                                    {hasPotential && <span className="text-[7px] text-emerald-400 font-bold shrink-0">+{cell.potential}%</span>}
                                                    {hasDeficit && <span className="text-[7px] text-red-400 font-bold shrink-0">CRIT</span>}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Debug Panel moved to Header */}

                {/* Insight Panel */}
                <div className="mt-4 p-2.5 bg-blue-500/[0.02] border border-blue-500/10 rounded flex items-center gap-3 shrink-0">
                    <div className="w-6 h-6 rounded-sm bg-blue-500/10 flex items-center justify-center shrink-0">
                        <TrendingUp size={12} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[7px] font-orbitron font-black text-blue-400/80 uppercase tracking-widest mb-0.5">АНАЛИЗ_СТРАТ</div>
                        <p className="text-[8px] text-white/30 leading-tight uppercase font-mono-data">
                            Critical yield detected in <span className="text-emerald-400/80 font-bold">26-35</span> cohort.
                            Recommended shift: <span className="text-white/60">+15% TECH_STRACK</span>.
                        </p>
                    </div>
                </div>
            </div>
        </Holocard>
    );
};
