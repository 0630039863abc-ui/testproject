import React from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { Holocard } from '../../../shared/ui/Holocard';

export const LiveOccupancy: React.FC = () => {
    const { clusterMetrics } = useSimulation();

    const sortedMetrics = [...clusterMetrics]
        .filter(c => c.activeUnits > 0)
        .sort((a, b) => b.activeUnits - a.activeUnits)
        .slice(0, 8);

    const totalActive = clusterMetrics.reduce((sum, c) => sum + c.activeUnits, 0);
    const maxUnits = Math.max(...clusterMetrics.map(c => c.activeUnits), 1);

    return (
        <Holocard
            className="h-full w-full flex flex-col"
            header={
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-[10px] font-orbitron font-black text-blue-400/60 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Activity size={14} className="text-blue-500 animate-pulse" />
                        МАТРИЦА_АКТИВНОСТИ_LIVE
                    </h3>
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-white/20" />
                        <span className="text-[8px] text-white/20 font-orbitron font-black uppercase tracking-[0.2em]">СИНХР_99%</span>
                    </div>
                </div>
            }
        >
            <div className="p-4 flex flex-col gap-4">
                <div>
                    <div className="text-3xl font-orbitron font-black text-white tracking-tighter tabular-nums flex items-baseline gap-2">
                        {totalActive.toLocaleString()}
                        <span className="text-[8px] text-white/20 font-mono-data tracking-normal uppercase">всего_единиц</span>
                    </div>
                </div>

                <div className="flex items-stretch justify-between gap-2 pb-1">
                    {sortedMetrics.map((c) => {
                        const color = CLUSTER_COLORS[c.name] || '#ffffff';
                        const percentage = (c.activeUnits / maxUnits) * 100;
                        const segments = 12;
                        const activeSegments = Math.round((percentage / 100) * segments);
                        const translatedName = CLUSTER_TRANSLATIONS[c.name] || c.name;

                        return (
                            <div key={c.name} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="flex-1 w-full flex flex-col-reverse gap-1 py-1 min-h-[120px]">
                                    {[...Array(segments)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: i < activeSegments ? 1 : 0.05,
                                                backgroundColor: i < activeSegments ? color : 'rgba(255,255,255,0.05)'
                                            }}
                                            className="flex-1 w-full rounded-[1px]"
                                            style={{
                                                boxShadow: i < activeSegments ? `0 0 10px ${color}44` : 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-mono-data font-bold text-white tabular-nums">{c.activeUnits}</span>
                                    <span className="text-[6px] text-white/30 uppercase font-orbitron font-black tracking-widest px-1 py-0.5 border border-white/5 bg-white/[0.01] whitespace-nowrap">
                                        {translatedName.slice(0, 3)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Holocard>
    );
};
