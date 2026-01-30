import React, { useState, Suspense } from 'react';
import { AppHeader } from '../../../widgets/AppHeader';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import type { ClusterType, ClusterMetrics } from '../../../types';
import { LayoutGroup, motion } from 'framer-motion';
import { Loading } from '../../../shared/ui/Loading';

const StrategicVoronoiMap = React.lazy(() => import('../../../features/AdminDashboard/ui/StrategicVoronoiMap').then(module => ({ default: module.StrategicVoronoiMap })));
const KPIBento = React.lazy(() => import('../../../features/AdminDashboard/ui/KPIBento').then(module => ({ default: module.KPIBento })));
const AnomalyEngine = React.lazy(() => import('../../../features/AdminDashboard/ui/AnomalyEngine').then(module => ({ default: module.AnomalyEngine })));
const LiveOccupancy = React.lazy(() => import('../../../features/AdminDashboard/ui/LiveOccupancy').then(module => ({ default: module.LiveOccupancy })));

interface StrategicCommandProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const StrategicCommand: React.FC<StrategicCommandProps> = ({ currentView, onChangeView }) => {
    const { clusterMetrics } = useSimulation();
    const [selectedCluster] = useState<ClusterType>('Science');
    const [showAnomalies, setShowAnomalies] = useState(false);

    // Derived or specific metrics for anomaly engine
    const currentMetrics = clusterMetrics.find((c: ClusterMetrics) => c.name === selectedCluster);

    return (
        <LayoutGroup>
            <div className="w-full h-screen flex flex-col relative bg-[#050505] overflow-hidden font-['JetBrains_Mono',monospace]">
                {/* Global Scanline Overlay - Opacity 0.03 */}
                <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,0,255,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

                {/* Global Header */}
                <AppHeader currentView={currentView} onChangeView={onChangeView} />

                <Suspense fallback={<Loading />}>
                    <div className={`flex-1 w-full p-6 grid grid-cols-[1fr_1fr_400px] grid-rows-3 gap-6 ${showAnomalies ? 'border-[4px] border-red-900/50' : ''} transition-all duration-500 relative z-10 overflow-hidden`}>

                        {/* Block 1: Main Strategic Voronoi Map (Top/Center Left - 2x2) */}
                        <motion.div
                            layout
                            className="col-span-2 row-span-2 relative"
                        >
                            <StrategicVoronoiMap />
                        </motion.div>

                        {/* Right Analytical Panel (Column 3) - Backdrop Blur MD */}
                        <div className="col-span-1 row-span-3 flex flex-col gap-6 backdrop-blur-md bg-white/[0.02] p-6 rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative">
                            {/* Decorative Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[120px] pointer-events-none" />

                            {/* Block 2: Live Occupancy */}
                            <motion.div layout className="h-[280px]">
                                <LiveOccupancy />
                            </motion.div>

                            {/* Block 2.5: Threat Engine */}
                            <motion.div layout className="h-[220px]">
                                <AnomalyEngine metrics={currentMetrics} showAnomalies={showAnomalies} onToggle={() => setShowAnomalies(!showAnomalies)} />
                            </motion.div>

                            {/* Technical Footer Readout */}
                            <div className="flex-1 min-h-0 flex flex-col justify-end">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-2">
                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Аналитический Поток v9.42</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] text-white/30 uppercase">Аптайм</span>
                                            <span className="text-[10px] text-emerald-500 font-bold">100% ЗАЩИЩЕНО</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] text-white/30 uppercase">Узлы</span>
                                            <span className="text-[10px] text-blue-400 font-bold">АКТИВНО: 12</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block 3: Bottom Panel (Spans 2 columns) */}
                        <motion.div
                            layout
                            className="col-span-2 row-span-1"
                        >
                            <KPIBento />
                        </motion.div>
                    </div>
                </Suspense>
            </div>
        </LayoutGroup>
    );
};
