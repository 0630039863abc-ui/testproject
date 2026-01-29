import React, { useState } from 'react';
import { StrategicVoronoiMap } from './StrategicVoronoiMap';
import { KPIBento } from './KPIBento';
import { AnomalyEngine } from './AnomalyEngine';
import { LiveOccupancy } from './LiveOccupancy';
import { AppHeader } from '../layout/AppHeader';
import { useSimulation } from '../../context/SimulationContext';
import type { ClusterType } from '../../types';
import { LayoutGroup, motion } from 'framer-motion';

interface StrategicCommandProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const StrategicCommand: React.FC<StrategicCommandProps> = ({ currentView, onChangeView }) => {
    const { clusterMetrics } = useSimulation();
    const [selectedCluster] = useState<ClusterType>('Science');
    const [showAnomalies, setShowAnomalies] = useState(false);

    // Derived or specific metrics for anomaly engine
    const currentMetrics = clusterMetrics.find(c => c.name === selectedCluster);

    return (
        <LayoutGroup>
            <div className="w-full h-screen relative bg-[#050505] overflow-hidden font-['JetBrains_Mono',monospace]">
                {/* Global Scanline Overlay - Opacity 0.03 */}
                <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,0,255,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

                {/* Global Header */}
                <div className="relative z-[70]">
                    <AppHeader currentView={currentView} onChangeView={onChangeView} />
                </div>

                <div style={{ height: 'calc(100vh - 60px)' }} className={`w-full p-6 grid grid-cols-[1fr_1fr_400px] grid-rows-3 gap-6 ${showAnomalies ? 'border-[4px] border-red-900/50' : ''} transition-all duration-500 relative z-10`}>

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
                                <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Analytical Stream v9.42</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[7px] text-white/30 uppercase">Uptime</span>
                                        <span className="text-[10px] text-emerald-500 font-bold">100% SECURE</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[7px] text-white/30 uppercase">Nodes</span>
                                        <span className="text-[10px] text-blue-400 font-bold">ACTIVE: 12</span>
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
            </div>
        </LayoutGroup>
    );
};
