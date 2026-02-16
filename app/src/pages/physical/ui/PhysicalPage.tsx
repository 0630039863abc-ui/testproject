import React, { useState, useMemo, Suspense } from 'react';
import {
    UserProfileModule,
    ClusterStatsModule,
    TelemetryTableModule,
    CornerBrackets
} from '../../../features/Telemetry/ui/TelemetryStream';
import { AppHeader } from '../../../widgets/AppHeader';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { generateInsights } from '../../../entities/Simulation/lib/insightEngine';
import {
    Play, Pause, RefreshCcw, Activity, Box
} from 'lucide-react';
import clsx from 'clsx';

import { VenueScene } from '../../../widgets/VenueScene';

interface PhysicalLayerProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const PhysicalLayer: React.FC<PhysicalLayerProps> = ({ currentView, onChangeView }) => {
    const {
        logs, isPlaying, toggleSimulation, stepSimulation,
        simulationSpeed, setSimulationSpeed, selectableUsers,
        clusterMetrics, qualitativeInsights, graphStats
    } = useSimulation();

    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    // Derived Data for Sub-components
    const recentLogs = useMemo(() => logs.slice(0, 15), [logs]);
    const selectedRow = useMemo(() => logs.find(l => l.id === selectedRowId), [logs, selectedRowId]);

    const observerRow = useMemo(() => selectedRow || recentLogs[0] || logs[0], [selectedRow, recentLogs, logs]);

    const observedUser = useMemo(() =>
        selectableUsers.find(u => u.name === observerRow?.userId) || selectableUsers[0],
        [selectableUsers, observerRow]
    );

    const userInsights = useMemo(() =>
        observedUser ? generateInsights(observedUser, logs, clusterMetrics) : [],
        [observedUser, logs, clusterMetrics]
    );

    const entityStats = useMemo(() => {
        if (!observedUser) return [];
        return [
            { subject: 'INT', A: observedUser.stats['Education'] / 10 + 20 },
            { subject: 'STR', A: observedUser.stats['HealthyLifestyle'] / 10 + 20 },
            { subject: 'AGI', A: observedUser.stats['Labor'] / 10 + 20 },
            { subject: 'SPI', A: observedUser.stats['Culture'] / 10 + 20 },
            { subject: 'END', A: observedUser.stats['Volunteering'] / 10 + 20 },
            { subject: 'LUK', A: observedUser.stats['Patriotism'] / 10 + 20 },
        ];
    }, [observedUser]);

    return (
        <div className="w-full h-screen relative bg-[#020202] overflow-hidden crt-container font-sans selection:bg-blue-500/30 flex flex-col">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-tech-grid opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 scanlines opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 bg-grain pointer-events-none"></div>

            {/* Header */}
            <div className="h-[60px] shrink-0 relative z-50">
                <AppHeader currentView={currentView} onChangeView={onChangeView} />
            </div>

            {/* Dashboard Layout - CSS Grid for Rigidity */}
            <div className="flex-1 grid grid-cols-[300px_1fr_280px] grid-rows-[1fr_220px] gap-4 p-4 z-10 overflow-hidden min-h-0">

                {/* 1. LEFT SIDEBAR: Subject Profile (Spans both rows) */}
                <div className="row-span-2 flex flex-col gap-4 overflow-hidden border-r border-blue-500/10 pr-4">
                    <div className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.2em] mb-1 px-1 flex items-center gap-2 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        ОБЪЕКТ НАБЛЮДЕНИЯ
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar relative">
                        <UserProfileModule
                            user={observedUser}
                            selectedRow={selectedRow}
                            stats={entityStats}
                            insights={userInsights}
                        />
                    </div>
                </div>

                {/* 2. CENTER TOP: 3D Projection (Hero) */}
                <div className="relative bg-black/40 border border-blue-500/20 rounded-sm overflow-hidden group">
                    <CornerBrackets />

                    {/* Simulation HUD Overlay */}
                    <div className="absolute top-4 left-6 z-20 flex items-center gap-6 pointer-events-none">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">ПРОЕКЦИЯ АРХИПЕЛАГА</span>
                        </div>
                    </div>

                    {/* Control Bar Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/80 backdrop-blur-md px-6 py-2 border border-blue-500/30 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 border-r border-white/10 pr-4">
                            {[0.5, 1, 2, 4, 6].map(speed => (
                                <button
                                    key={speed}
                                    onClick={() => setSimulationSpeed(speed)}
                                    className={clsx(
                                        "w-8 h-5 flex items-center justify-center text-[9px] font-black transition-all",
                                        simulationSpeed === speed ? "text-blue-400" : "text-white/20 hover:text-white/40"
                                    )}
                                >
                                    {speed}X
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={stepSimulation} className="text-white/40 hover:text-white"><RefreshCcw size={14} /></button>
                            <button onClick={toggleSimulation} className="text-blue-500">
                                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                            </button>
                        </div>
                    </div>

                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-blue-500/50 text-xs shadow-white drop-shadow-md">ИНИЦИАЛИЗАЦИЯ СЕНСОРОВ...</div>}>
                        <VenueScene activeCluster={null} clusterMetrics={clusterMetrics} graphStats={graphStats} />
                    </Suspense>

                    {/* --- 1. OVERLAY LAYER (Analytical Wrapper) --- */}
                    <div className="absolute inset-0 pointer-events-none z-10 p-4">
                        {/* Focus Brackets (SVG) */}
                        <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)]" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="ruler-x" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                                    <line x1="0" y1="0" x2="0" y2="5" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                                </pattern>
                                <pattern id="ruler-y" x="0" y="0" width="10" height="20" patternUnits="userSpaceOnUse">
                                    <line x1="0" y1="0" x2="5" y2="0" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                                </pattern>
                            </defs>

                            {/* Top Left */}
                            <path d="M 20 0 L 0 0 L 0 20" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                            {/* Top Right */}
                            <path d="M calc(100% - 20px) 0 L 100% 0 L 100% 20" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                            {/* Bottom Left */}
                            <path d="M 0 calc(100% - 20px) L 0 100% L 20 100%" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                            {/* Bottom Right */}
                            <path d="M calc(100% - 20px) 100% L 100% 100% L 100% calc(100% - 20px)" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />

                            {/* Dynamic Rulers (Visual Only) */}
                            <rect x="20" y="0" width="calc(100% - 40px)" height="10" fill="url(#ruler-x)" opacity="0.5" />
                            <rect x="0" y="20" width="10" height="calc(100% - 40px)" fill="url(#ruler-y)" opacity="0.5" />
                        </svg>

                        {/* Technical Micro-text */}
                        <div className="absolute top-6 right-6 text-[8px] font-mono text-blue-500/40 text-right flex flex-col gap-0.5">
                            <span>COORD_SYS: CARTESIAN</span>
                            <span>RENDER_TYPE: POINT_CLOUD</span>
                            <span>FOV: 45.00</span>
                        </div>
                        <div className="absolute bottom-6 left-6 text-[8px] font-mono text-blue-500/40 flex flex-col gap-0.5">
                            <span>GRID_SIZE: 40x40</span>
                            <span>SCALE_FACTOR: 1.0</span>
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT SIDEBAR: Analytical Data (Spans both rows) */}
                <div className="row-span-2 flex flex-col gap-6 overflow-hidden border-l border-blue-500/10 pl-4">
                    <div className="space-y-4 shrink-0">
                        <div className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.2em] px-1">ГЛОБАЛЬНЫЕ МЕТРИКИ</div>
                        <ClusterStatsModule logs={logs} />
                    </div>

                    <div className="flex-1 flex flex-col gap-4 overflow-hidden mt-4">
                        <div className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.2em] px-1 shrink-0">ЦЕНТРЫ АКТИВНОСТИ</div>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                            <AnimatePresence mode="popLayout">
                                {qualitativeInsights.filter(i => i.type === 'hub').map((insight, idx) => (
                                    <motion.div
                                        key={`hub-${idx}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative group glass-card-2 p-3 overflow-hidden flex flex-col gap-2 hover:border-blue-500/50 transition-all duration-300"
                                        style={{ borderLeft: '2px solid rgba(59, 130, 246, 0.8)' }}
                                    >
                                        <div className="absolute inset-0 bg-grain opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity" />

                                        {/* Header Row */}
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                                    {/* Dynamic Icon based on content */}
                                                    {insight.text.includes('ЛЕКТОРИЙ') || insight.text.includes('ОБЪЕКТ') ? <Box size={12} /> :
                                                        insight.text.includes('ХАБ') ? <Activity size={12} /> :
                                                            <RefreshCcw size={12} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-mono text-blue-500/60 uppercase tracking-widest">CAM_{10 + idx}REC</span>
                                                    <span className="text-[7px] text-white/30 uppercase">LIVE FEED</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[pulse_1s_ease-in-out_infinite]" />
                                                <span className="text-[6px] font-black text-red-400 tracking-widest uppercase">REC</span>
                                            </div>
                                        </div>

                                        {/* Main Text Content */}
                                        <div className="relative z-10 mt-1">
                                            <span className="text-[11px] font-medium text-white leading-tight block group-hover:text-glow-blue transition-all">
                                                {insight.text}
                                            </span>
                                        </div>

                                        {/* Footer / Decor */}
                                        <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1 relative z-10">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4].map(bar => (
                                                    <div key={bar} className="w-0.5 h-2 bg-blue-500/20" style={{ height: Math.random() * 8 + 4 }} />
                                                ))}
                                            </div>
                                            <span className="text-[7px] font-mono text-white/20">ZONE_ID: {100 + idx}</span>
                                        </div>

                                        {/* L-shaped Corners */}
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500/30 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/30 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* 4. CENTER BOTTOM: Telemetry Log */}
                <div className="bg-black/20 shrink-0 border-t border-blue-500/10 pt-4">
                    <TelemetryTableModule
                        recentLogs={recentLogs}
                        selectedRowId={selectedRowId}
                        onSelect={setSelectedRowId}
                    />
                </div>
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="fixed top-20 left-4 w-4 h-4 border-t-2 border-l-2 border-blue-500/20 z-50 pointer-events-none"></div>
            <div className="fixed top-20 right-4 w-4 h-4 border-t-2 border-r-2 border-blue-500/20 z-50 pointer-events-none"></div>
            <div className="fixed bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-blue-500/20 z-50 pointer-events-none"></div>
            <div className="fixed bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blue-500/20 z-50 pointer-events-none"></div>

            {/* Bottom Status Ticker */}
            <div className="h-[30px] bg-black/80 border-t border-blue-500/20 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <Activity size={12} className="text-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">
                        System Integrity: 99.9% // Monitoring Stream Active
                    </span>
                </div>
                <div className="text-[9px] font-mono text-blue-500/50">
                    GATEWAY_PHYSICAL_ACCESS_V5
                </div>
            </div>
        </div>
    );
};
