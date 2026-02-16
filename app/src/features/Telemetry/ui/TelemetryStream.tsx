import React, { useState, useMemo, Suspense } from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { motion } from 'framer-motion';
import { OdometerCounter } from '../../../shared/ui/OdometerCounter';
import clsx from 'clsx';
import {
    Play, Pause, Activity,
    Download, Box, RefreshCcw
} from 'lucide-react';
import {
    RadarChart,
    PolarGrid, PolarAngleAxis, Radar as RadarComponent
} from 'recharts';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { Loading } from '../../../shared/ui/Loading';

import { generateInsights } from '../../../entities/Simulation/lib/insightEngine';

import { VenueScene } from '../../../widgets/VenueScene';

// --- Sub-Components ---

export const CornerBrackets = () => (
    <>
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500/40 z-10" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500/40 z-10" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500/40 z-10" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-500/40 z-10" />
    </>
);

// --- Individual Telemetry Modules ---

export const UserProfileModule: React.FC<{ user: any, selectedRow: any, stats: any, insights: any[] }> = ({ user, selectedRow, stats, insights }) => {
    const [sessionHash, setSessionHash] = useState('0x' + Math.random().toString(16).substr(2, 8).toUpperCase());

    React.useEffect(() => {
        const interval = setInterval(() => {
            setSessionHash('0x' + Math.random().toString(16).substr(2, 8).toUpperCase());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!user) return null;
    return (
        <div className="space-y-6">
            <div className="glass-card-2 p-5 relative overflow-hidden group/card shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col gap-4">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-hex-pattern opacity-10 pointer-events-none" />
                <div className="absolute inset-0 bg-grain opacity-0 group-hover/card:opacity-10 transition-opacity pointer-events-none" />

                {/* L-shaped Corners */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500/50 z-20 opacity-60 group-hover/card:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-500/50 z-20 opacity-60 group-hover/card:opacity-100 transition-opacity" />

                {/* Header Section */}
                <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                            <span className="text-[9px] font-mono text-blue-500/60 uppercase tracking-widest">
                                {selectedRow ? "РУЧНОЙ ФОКУС" : "АВТО-СЛЕЖЕНИЕ"}
                            </span>
                        </div>
                        <h4 className="text-[16px] font-black text-white truncate drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
                            {user.name}
                        </h4>
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 uppercase tracking-widest font-black rounded w-fit">
                            {user.role} // {user.age} ЛЕТ
                        </span>
                    </div>

                    <div className="text-right shrink-0 bg-black/40 p-2 rounded border border-white/5">
                        <div className="text-[7px] font-mono text-white/30 uppercase mb-1 border-b border-white/5 pb-1">ХЭШ СЕССИИ</div>
                        <div className="text-[9px] font-mono text-blue-300/80">{sessionHash}</div>
                    </div>
                </div>

                {/* Data Visualization Area */}
                <div className="h-[140px] w-full flex justify-center items-center overflow-hidden relative z-10 -mx-2 mt-2 bg-blue-500/[0.02] rounded-lg border border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] opacity-50" />
                    <div className="w-[300px] h-[160px] shrink-0 relative z-20">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats} width={300} height={160}>
                            <PolarGrid stroke="#ffffff15" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 9, fontWeight: 700 }} />
                            <RadarComponent name="Stats" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                        </RadarChart>
                    </div>
                </div>
            </div>

            <div className="space-y-3 relative z-10 w-full overflow-hidden">
                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Activity size={10} className="text-blue-500 animate-pulse" />
                        АНАЛИЗ АКТИВНОСТИ
                    </div>
                    <div className="text-[8px] font-mono text-blue-400/60">
                        ТОЧНОСТЬ: {(80 + Math.random() * 19).toFixed(1)}%
                    </div>
                </div>

                {/* Oscilloscope Waveform */}
                <div className="h-[24px] w-full bg-black/40 border border-blue-500/20 mb-2 relative overflow-hidden">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                        <path
                            d="M0,12 Q20,24 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                            className="drop-shadow-[0_0_4px_#3b82f6] animate-[shiver_0.5s_infinite_linear]"
                        >
                            <animate
                                attributeName="d"
                                values="
                                    M0,12 Q20,24 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12;
                                    M0,12 Q20,0 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12;
                                    M0,12 Q20,24 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12
                                "
                                dur="2s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </svg>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.8))]" />
                </div>

                <div className="flex flex-col gap-3">
                    {insights.length > 0 ? (
                        insights.slice(0, 4).map((tag, idx) => (
                            <div
                                key={tag.id}
                                className="glass-card-2 relative p-4 overflow-hidden group hover:border-blue-400/30 transition-all duration-300 animate-laser-sweep"
                                style={{
                                    animationDelay: `${idx * 0.1}s`,
                                    borderLeft: `2px solid ${tag.color.replace('text-', '').replace('-400', '-500')}`
                                }} // Dynamic left border color based on type
                            >
                                {/* Background Hex Pattern */}
                                <div className="absolute inset-0 bg-hex-pattern opacity-5 pointer-events-none" />

                                {/* Background "Digital Noise" on Hover */}
                                <div className="absolute inset-0 bg-grain opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

                                {/* Header: Status & Priority */}
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.1em] group-hover:text-blue-400/80 transition-colors">
                                        [ АНАЛИЗ_ИНСАЙТА ]
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {/* Blinking Priority Marker */}
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${tag.id === 'instigator' ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' : 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]'}`} />
                                    </div>
                                </div>

                                {/* Central Thesis */}
                                <div className="relative z-10">
                                    <div className={`text-[13px] font-medium leading-tight text-white group-hover:text-glow-blue transition-all duration-300 font-inter`}>
                                        {tag.label}
                                    </div>
                                    <div className="text-[10px] text-white/50 mt-1 font-mono hover:text-white/70">
                                        {tag.description}
                                    </div>

                                    {/* Micro-Data-Viz (SVG Pulse) - Behind Text effect */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none w-16 h-8">
                                        <svg width="100%" height="100%" viewBox="0 0 60 20">
                                            <polyline
                                                points="0,10 10,10 15,2 20,18 25,10 35,10 40,5 45,15 50,10 60,10"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                className={tag.color}
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Link Nodes (Footer) */}
                                <div className="mt-3 flex items-center gap-3 relative z-10 border-t border-white/5 pt-2">
                                    <div className="flex items-center gap-1 text-[9px] text-white/30 font-mono">
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                        <span>ЭКОНОМИКА</span>
                                    </div>
                                    <div className="text-white/20 text-[8px]">&gt;</div>
                                    <div className="flex items-center gap-1 text-[9px] text-white/30 font-mono">
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                        <span>ТЕХНОЛОГИИ</span>
                                    </div>
                                </div>

                                {/* Neon Corner Brackets (L-shaped) */}
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500/50 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/50 opacity-50 group-hover:opacity-100 transition-opacity" />

                            </div>
                        ))
                    ) : (
                        <div className="glass-card-2 p-4 text-center border-dashed border-white/10">
                            <div className="text-[10px] text-white/20 italic uppercase font-mono animate-pulse">
                                Ожидание поступления данных...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ClusterStatsModule: React.FC<{ logs: any[] }> = ({ logs }) => {
    return (
        <div className="pt-6 border-t border-white/10">
            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Box size={10} className="text-blue-500" />
                Статистика Узлов
            </div>
            <div className="space-y-3">
                {Object.entries(CLUSTER_COLORS)
                    .filter(([c]) => ['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art'].includes(c))
                    .map(([c, color]) => {
                        const count = logs.filter(l => l.cluster === c).length;
                        const maxCount = Math.max(...Object.keys(CLUSTER_COLORS).map(k => logs.filter(l => l.cluster === k).length), 1);
                        const percentage = (count / maxCount) * 100;

                        // Mini-Momentum (Random volatility for visuals)
                        const momentum = Math.random() * 20 + 10;

                        return (
                            <div key={c} className="group cursor-default">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] shrink-0" style={{ backgroundColor: color, color: color }} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-wider transition-colors truncate leading-none" style={{ color: color }}>
                                                {CLUSTER_TRANSLATIONS[c] || c}
                                            </span>
                                            {/* Mini-Momentum Bar */}
                                            <div className="h-[2px] bg-white/10 w-full mt-0.5 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 bottom-0 bg-current opacity-50" style={{ width: `${momentum}%`, color: color }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-black text-white tabular-nums min-w-[30px] text-right ml-2 font-mono">
                                        {count.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden relative">
                                    {/* Threshold Line at 80% */}
                                    <div className="absolute top-0 bottom-0 left-[80%] w-[1px] bg-red-500/50 z-10"></div>
                                    <motion.div
                                        className="h-full opacity-60"
                                        style={{ backgroundColor: color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export const TelemetryTableModule: React.FC<{ recentLogs: any[], selectedRowId: string | null, onSelect: (id: string) => void }> = ({ recentLogs, selectedRowId, onSelect }) => {

    return (
        <div className="relative overflow-hidden flex flex-col group min-h-0 min-w-0 flex-1 border-r border-blue-500/10 h-full">
            <CornerBrackets />
            <div className="grid grid-cols-[80px_100px_100px_180px_1fr] gap-2 px-4 h-10 items-center border-b border-white/20 bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/60 shrink-0">
                <div>ВРЕМЯ</div>
                <div>СУБЪЕКТ</div>
                <div>КЛАСТЕР</div>
                <div>ДЕЙСТВИЕ</div>
                <div>КОНТЕКСТ</div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative min-h-0">
                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(0,0,255,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-10"></div>
                <div className="flex flex-col min-h-0">
                    {recentLogs.map((log, i) => {
                        const isSelected = selectedRowId === log.id;
                        const opacity = Math.max(1 - (i * 0.08), 0.4);
                        return (
                            <div
                                key={log.id}
                                onClick={() => onSelect(log.id)}
                                className={clsx(
                                    "grid grid-cols-[80px_100px_100px_180px_1fr] gap-2 px-4 h-10 border-b border-white/5 items-center cursor-pointer transition-all relative overflow-hidden shrink-0 group",
                                    isSelected ? "bg-blue-500/15" : "hover:bg-blue-500/5"
                                )}
                                style={{ opacity: isSelected ? 1 : opacity }}
                            >
                                <div className="text-[10px] tabular-nums text-blue-500/60 font-mono">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                                </div>
                                <div className="font-bold text-white group-hover:text-blue-400 transition-colors truncate text-[10px]">
                                    {log.userId.split(' ')[0]}
                                </div>
                                <div className="min-w-0">
                                    <span className="px-1.5 py-0.5 text-[8px] font-black uppercase rounded-[1px] text-black" style={{ backgroundColor: CLUSTER_COLORS[log.cluster] }}>
                                        {CLUSTER_TRANSLATIONS[log.cluster]?.slice(0, 10) || log.cluster}
                                    </span>
                                </div>
                                <div className="text-blue-200/90 font-black uppercase text-[9px] truncate">
                                    {log.action}
                                </div>
                                <div className="text-white/40 italic text-[9px] truncate group-hover:text-white/60 transition-colors">
                                    {log.zone}
                                </div>
                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Main Layout Component (DEPRECATED for PhysicalPage, but kept for compatibility if used elsewhere) ---

export const NeuralLinkTelemetry: React.FC = () => {
    const { logs, isPlaying, toggleSimulation, stepSimulation, simulationSpeed, setSimulationSpeed, selectableUsers, clusterMetrics, graphStats } = useSimulation();
    const [filterCluster, setFilterCluster] = useState<string | null>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const filteredLogs = useMemo(() =>
        filterCluster ? logs.filter(l => l.cluster === filterCluster) : logs,
        [logs, filterCluster]);

    const recentLogs = filteredLogs.slice(0, 10);
    const selectedRow = logs.find(l => l.id === selectedRowId);

    const observerRow = useMemo(() => {
        if (selectedRow) return selectedRow;
        return recentLogs[0] || logs[0];
    }, [selectedRow, recentLogs, logs]);

    const topCluster = observerRow?.cluster || null;

    const observedUser = useMemo(() =>
        selectableUsers.find(u => u.name === observerRow?.userId) || selectableUsers[0],
        [selectableUsers, observerRow]
    );

    const insights = useMemo(() =>
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

    const exportLogs = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "telemetry_dump.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="grid grid-rows-[44px_1fr_40vh_28px] h-full w-full bg-[#030303] text-white font-['JetBrains_Mono',monospace] border border-blue-500/20 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 border-b border-blue-500/20 bg-black/40 backdrop-blur-md z-20 overflow-hidden shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-blue-500 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Нейросетевая Телеметрия</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 mr-4 border-r border-white/10 pr-4">
                        {[0.5, 1, 2, 4, 6].map(speed => (
                            <button
                                key={speed}
                                onClick={() => setSimulationSpeed(speed)}
                                className={clsx(
                                    "w-8 h-5 flex items-center justify-center text-[9px] font-black transition-all border",
                                    simulationSpeed === speed
                                        ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                        : "border-white/5 text-white/20 hover:text-white/40 hover:border-white/10"
                                )}
                            >
                                {speed}X
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 mr-4 border-r border-white/10 pr-4">
                        <button
                            onClick={() => setFilterCluster(null)}
                            className={clsx(
                                "px-2 py-0.5 text-[8px] font-black uppercase transition-all border",
                                filterCluster === null ? "bg-white/20 border-white/40 text-white" : "border-white/10 text-white/40 hover:text-white"
                            )}
                        >
                            ВСЕ
                        </button>
                        {['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art'].map(c => (
                            <button
                                key={c}
                                onClick={() => setFilterCluster(filterCluster === c ? null : c)}
                                className={clsx(
                                    "px-2 py-0.5 text-[8px] font-black uppercase transition-all border",
                                    filterCluster === c ? "bg-blue-500 border-blue-400 text-white" : "border-white/10 text-white/40 hover:text-white"
                                )}
                            >
                                {c.slice(0, 3)}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={exportLogs} className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white" title="Export Raw">
                            <Download size={14} />
                        </button>
                        <button onClick={stepSimulation} className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white" title="Step">
                            <RefreshCcw size={14} />
                        </button>
                        <button onClick={toggleSimulation} className="p-1.5 hover:bg-white/5 rounded text-blue-500" title={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden border-b border-blue-500/20 z-10 relative">
                <div className="flex-1 flex flex-col">
                    <TelemetryTableModule recentLogs={recentLogs} selectedRowId={selectedRowId} onSelect={setSelectedRowId} />
                </div>
                <div className="w-[320px] bg-black/40 p-6 overflow-y-auto no-scrollbar border-l border-blue-500/10">
                    <UserProfileModule user={observedUser} selectedRow={selectedRow} stats={entityStats} insights={insights} />
                    <ClusterStatsModule logs={logs} />
                </div>
            </div>

            {/* 3D Engine Preview */}
            <div className="h-[40vh] bg-black relative">
                <Suspense fallback={<Loading />}>
                    <VenueScene activeCluster={topCluster} clusterMetrics={clusterMetrics} graphStats={graphStats} />
                </Suspense>
            </div>

            {/* Footer */}
            <div className="h-[28px] flex items-center justify-between px-6 bg-black/60 text-[8px] font-bold text-white/40 uppercase tracking-widest z-20">
                <div className="flex items-center gap-4">
                    <span>СИСТЕМА: АКТИВНА</span>
                    <span>ЛОКАЦИЯ: {topCluster || 'STANDBY'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>ПОТОК:</span>
                    <OdometerCounter value={logs.length} className="text-blue-500" />
                </div>
            </div>
        </div>
    );
};
