import React from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';

export const LiveOccupancy: React.FC = () => {
    const { clusterMetrics } = useSimulation();

    const sortedMetrics = [...clusterMetrics]
        .filter(c => c.activeUnits > 0)
        .sort((a, b) => b.activeUnits - a.activeUnits)
        .slice(0, 8);

    const totalActive = clusterMetrics.reduce((sum, c) => sum + c.activeUnits, 0);
    const maxUnits = Math.max(...clusterMetrics.map(c => c.activeUnits), 1);

    return (
        <div className="h-full w-full bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col relative overflow-hidden font-['JetBrains_Mono',monospace]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-[10px] text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2 font-black">
                        <Activity size={12} className="animate-pulse" />
                        Матрица_Живой_Занятости
                    </h3>
                    <div className="mt-2 text-4xl font-black text-white tracking-tighter tabular-nums flex items-baseline gap-2">
                        {totalActive.toLocaleString()}
                        <span className="text-[10px] text-white/20 font-mono tracking-normal">ЮНИТОВ</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <Users size={18} className="text-white/20" />
                    <span className="text-[7px] text-white/40 font-black">СИНХР_99%</span>
                </div>
            </div>

            <div className="flex-1 flex items-stretch justify-between gap-3 pb-2">
                {sortedMetrics.map((c) => {
                    const color = CLUSTER_COLORS[c.name] || '#ffffff';
                    const percentage = (c.activeUnits / maxUnits) * 100;
                    const segments = 12;
                    const activeSegments = Math.round((percentage / 100) * segments);
                    const translatedName = CLUSTER_TRANSLATIONS[c.name] || c.name;

                    return (
                        <div key={c.name} className="flex-1 flex flex-col items-center gap-3 group">
                            <div className="flex-1 w-full flex flex-col-reverse gap-1 py-1">
                                {[...Array(segments)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scaleX: 0 }}
                                        animate={{
                                            opacity: i < activeSegments ? 1 : 0.05,
                                            scaleX: 1,
                                            backgroundColor: i < activeSegments ? color : 'rgba(255,255,255,0.1)'
                                        }}
                                        className="h-full rounded-[1px] shadow-sm"
                                        style={{
                                            boxShadow: i < activeSegments ? `0 0 10px ${color}33` : 'none'
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black text-white tabular-nums">{c.activeUnits}</span>
                                <span className="text-[6px] text-white/20 uppercase font-black tracking-widest px-1 py-0.5 border border-white/5 bg-white/[0.02] whitespace-nowrap">
                                    {translatedName.slice(0, 3)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Background Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-10">
                <div className="w-12 h-12 border-t border-r border-white/20" />
            </div>
        </div>
    );
};
