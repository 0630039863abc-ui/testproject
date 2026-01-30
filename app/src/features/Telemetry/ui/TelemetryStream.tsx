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

const VenueScene = React.lazy(() => import('../../../widgets/VenueScene').then(module => ({ default: module.VenueScene })));

// --- Sub-Components ---

const CornerBrackets = () => (
    <>
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500/40 z-10" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500/40 z-10" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500/40 z-10" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-500/40 z-10" />
    </>
);

// --- Main Component ---

export const NeuralLinkTelemetry: React.FC = () => {
    const { logs, isPlaying, toggleSimulation, stepSimulation, simulationSpeed, setSimulationSpeed } = useSimulation();
    const [filterCluster, setFilterCluster] = useState<string | null>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    // Derived States
    const filteredLogs = useMemo(() =>
        filterCluster ? logs.filter(l => l.cluster === filterCluster) : logs,
        [logs, filterCluster]);

    const recentLogs = filteredLogs.slice(0, 10);
    const selectedRow = logs.find(l => l.id === selectedRowId) || recentLogs[0];
    const topCluster = recentLogs[0]?.cluster || null;

    // Use centralized CLUSTER_COLORS from utils

    const entityStats = useMemo(() => {
        if (!selectedRow) return [];
        const name = selectedRow.userId;
        const hash = name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        return [
            { subject: 'INT', A: 40 + (hash % 55) }, { subject: 'STR', A: 30 + ((hash * 7) % 65) },
            { subject: 'AGI', A: 50 + ((hash * 3) % 45) }, { subject: 'SPI', A: 20 + ((hash * 11) % 75) },
            { subject: 'END', A: 40 + ((hash * 13) % 55) }, { subject: 'LUK', A: 10 + ((hash * 17) % 85) },
        ];
    }, [selectedRow]);

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
        <div className="grid grid-rows-[44px_minmax(200px,1fr)_minmax(200px,40vh)_28px] h-full w-full bg-[#030303] text-white font-['JetBrains_Mono',monospace] border border-blue-500/20 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            {/* 1. HEADER (Reduced to 44px) */}
            <div className="flex items-center justify-between px-6 border-b border-blue-500/20 bg-black/40 backdrop-blur-md z-20 overflow-hidden shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-blue-500 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Нейросетевая Телеметрия</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Acceleration Controls */}
                    <div className="flex items-center gap-1 mr-4 border-r border-white/10 pr-4">
                        {[1, 2, 4, 6].map(speed => (
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

            {/* 2. MAIN HUD BODY (Flexible 1fr) */}
            <div className="grid grid-cols-[180px_minmax(0,1fr)_320px] min-h-0 overflow-hidden border-b border-blue-500/20 z-10">
                {/* 2.1 LEFT STATS */}
                <div className="border-r border-blue-500/10 flex flex-col p-4 bg-black/20 gap-4 overflow-y-auto no-scrollbar min-h-0 shrink-0">
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-sm shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]">
                            <span className="text-[8px] font-bold text-blue-400 uppercase">Насыщение Входа</span>
                            <div className="h-1 w-full bg-blue-900/20 mt-1">
                                <motion.div className="h-full bg-blue-500" animate={{ width: `${(recentLogs.length / 10) * 100}%` }} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-[8px] font-bold">
                            <div className="p-2 bg-white/5 border border-white/5 uppercase">
                                <div className="text-white/40 mb-1 font-black">Синхр</div>
                                <div className="text-blue-400">99.8%</div>
                            </div>
                            <div className="p-2 bg-white/5 border border-white/5 uppercase">
                                <div className="text-white/40 mb-1 font-black">Потери</div>
                                <div>0.0%</div>
                            </div>
                        </div>

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

                                        return (
                                            <div key={c} className="group cursor-default">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] shrink-0" style={{ backgroundColor: color, color: color }} />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider transition-colors truncate" style={{ color: color }}>
                                                            {CLUSTER_TRANSLATIONS[c] || c}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] font-black text-white tabular-nums min-w-[25px] text-right ml-2">
                                                        {count}
                                                    </span>
                                                </div>
                                                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
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
                    </div>
                </div>

                {/* 2.2 CENTER TABLE */}
                <div className="relative overflow-hidden flex flex-col group min-h-0 min-w-0">
                    <CornerBrackets />
                    <div className="grid grid-cols-[70px_120px_80px_100px_90px_1fr] gap-2 px-4 h-8 items-center border-b border-white/10 bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/40 shrink-0">
                        <div>Время</div><div>Субъект</div><div>Кластер</div><div>Тема</div><div>Действие</div><div>Контекст</div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative min-h-0">
                        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,0,255,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-10"></div>
                        <div className="flex flex-col min-h-0">
                            {recentLogs.map((log, i) => {
                                const isSelected = selectedRowId === log.id;
                                const opacity = Math.max(1 - (i * 0.05), 0.3);
                                const blur = Math.min(i * 0.2, 2);
                                return (
                                    <div
                                        key={log.id}
                                        onClick={() => setSelectedRowId(log.id)}
                                        className={clsx(
                                            "grid grid-cols-[70px_120px_80px_100px_90px_1fr] gap-2 px-4 h-[30px] border-b border-white/[0.03] items-center cursor-pointer transition-all relative overflow-hidden shrink-0",
                                            isSelected ? "bg-blue-500/10" : "hover:bg-white/[0.02]"
                                        )}
                                        style={{ opacity: isSelected ? 1 : opacity, filter: `blur(${isSelected ? 0 : blur}px)` }}
                                    >
                                        <div className="text-[10px] tabular-nums text-white/40">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                                        <div className="font-bold text-blue-400 truncate text-[10px]">{log.userId.split(' ')[0]} <span className="text-[8px] opacity-30">#{log.id.slice(-4)}</span></div>
                                        <div><span className="px-1.5 py-0.5 text-[8px] font-black uppercase rounded-[1px] text-black" style={{ backgroundColor: CLUSTER_COLORS[log.cluster] }}>{CLUSTER_TRANSLATIONS[log.cluster] || log.cluster}</span></div>
                                        <div className="text-white/60 truncate uppercase text-[9px]">{log.topic}</div>
                                        <div className={clsx("text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-sm w-fit", (log.evidenceType === 'sensor' || log.evidenceType === 'location') ? "text-emerald-400 bg-emerald-500/10" : (log.evidenceType === 'platform') ? "text-blue-400 bg-blue-500/10" : (log.evidenceType === 'mobile') ? "text-amber-400 bg-amber-500/10" : "text-white/30")}>{log.action}</div>
                                        <div className="text-white/20 truncate text-[9px]">{log.zone}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2.3 RIGHT PROFILE */}
                <div className="border-l border-blue-500/10 bg-black/40 flex flex-col p-6 gap-6 relative overflow-y-auto no-scrollbar min-h-0 shrink-0">
                    <CornerBrackets />
                    {selectedRow && (
                        <div className="space-y-6">
                            <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                                <div className="flex justify-between items-start mb-4">
                                    <div><h4 className="text-[12px] font-black text-white">{selectedRow.userId}</h4><span className="text-[9px] text-white/30 uppercase tracking-widest">{CLUSTER_TRANSLATIONS[selectedRow.cluster] || selectedRow.cluster} ДОМЕН</span></div>
                                    <div className="text-right"><div className="text-[14px] font-black text-blue-400">{(selectedRow.cognitiveLoad || 0).toFixed(1)}</div><div className="text-[7px] text-white/40 uppercase">Индекс Нагр.</div></div>
                                </div>
                                <div className="h-[180px] w-full flex justify-center items-center overflow-hidden">
                                    <div className="w-[300px] h-[180px] shrink-0">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={entityStats} width={300} height={180}>
                                            <PolarGrid stroke="#ffffff10" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff30', fontSize: 8 }} />
                                            <RadarComponent name="Stats" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                        </RadarChart>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <pre className="text-[8px] text-emerald-400/60 leading-tight">
                                    {JSON.stringify({ id: selectedRow.id, method: selectedRow.method, evidence: selectedRow.evidenceLevel }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. 3D ENGINE (Increased to 480px) */}
            <div className="relative bg-black border-t border-blue-500/20 overflow-hidden min-h-0">
                <div className="absolute top-4 left-6 z-10 flex items-center gap-2 pointer-events-none">
                    <Box size={14} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Зависимый Голографический Движок</span>
                </div>
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <Suspense fallback={<Loading />}>
                        <VenueScene activeCluster={topCluster} />
                    </Suspense>
                </div>
            </div>

            {/* 4. FOOTER (Reduced to 28px) */}
            <div className="flex items-center justify-between px-6 border-t border-blue-500/20 bg-black/60 text-[8px] font-bold text-white/40 uppercase tracking-widest z-20 overflow-hidden shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span>Активная Система v5.1.0</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <OdometerCounter value={logs.length} className="text-blue-500" />
                    <span>Синхр. Событий</span>
                </div>
            </div>
        </div>
    );
};
