import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { ClusterPulseCards } from '../../../widgets/ClusterPulseCards';
import { AgentTelemetryStream } from '../../../widgets/AgentTelemetryStream';
import { EventCard } from '../../../entities/Event/ui/EventCard';
import { AppHeader } from '../../../widgets/AppHeader';
import { getDominantCluster } from '../../../entities/User/lib/archetype';
import { CharacterSelector } from '../../../features/User/CharacterSelector/ui/CharacterSelector';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Star, Grid, Radio } from 'lucide-react';
import { CLUSTER_TRANSLATIONS, getClusterColor } from '../../../shared/lib/tokens';
import { Loading } from '../../../shared/ui/Loading';
import { LayoutShell } from '../../../widgets/LayoutShell';

const PersonalKnowledgeGraph = React.lazy(() => import('../../../features/KnowledgeGraph/ui/PersonalKnowledgeGraph').then(module => ({ default: module.PersonalKnowledgeGraph })));
const SpiderChart = React.lazy(() => import('../../../entities/User/ui/SpiderChart').then(module => ({ default: module.SpiderChart })));

type PanelTab = 'topology' | 'stream';

const TAB_CONFIG: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
    { id: 'topology', label: 'Топология', icon: <Grid size={11} /> },
    { id: 'stream', label: 'Поток', icon: <Radio size={11} /> },
];

interface UserDashboardProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentView, onChangeView }) => {
    const { currentUser } = useSimulation();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showAchievement, setShowAchievement] = useState(false);
    const [activeTab, setActiveTab] = useState<PanelTab>('topology');

    // Dynamic Theme Color based on Dominant Cluster
    const dominantCluster = getDominantCluster(currentUser.stats as any);
    const themeColor = getClusterColor(dominantCluster);

    // Personality Assessment Logic
    const personalityInsight = useMemo(() => {
        const stats = currentUser.stats;
        const sorted = Object.entries(stats).sort((a, b) => (b[1] as number) - (a[1] as number));
        const topCluster = sorted[0]?.[0] || 'Education';
        const translation = CLUSTER_TRANSLATIONS[topCluster] || topCluster;

        const getDativeCluster = (c: string) => {
            const map: Record<string, string> = {
                'Education': 'образовательному сектору',
                'HealthyLifestyle': 'здоровому образу жизни',
                'Labor': 'трудовой сфере',
                'Culture': 'культуре и искусству',
                'Volunteering': 'волонтерскому движению',
                'Patriotism': 'патриотическому воспитанию',
                'Science': 'науке и технологиям',
                'Sports': 'спорту',
                'Media': 'медиа-пространству',
                'Diplomacy': 'международным отношениям',
                'Ecology': 'экологии',
                'Tourism': 'туризму'
            };
            return map[c] || c.toLowerCase();
        };

        const seed = currentUser.id.length + currentUser.eventsAttended;
        const patterns = [
            `Вы в последнее время больше интересуетесь разделом "${translation}"`,
            `За последнее время вы посетили ${currentUser.eventsAttended} мероприятий, посвященных ${getDativeCluster(topCluster)}`,
            `Ваша активность в кластере "${translation}" значительно возросла`
        ];

        return patterns[seed % patterns.length];
    }, [currentUser.stats, currentUser.eventsAttended, currentUser.id]);

    // L5 Trigger Logic
    useEffect(() => {
        const knowledgeScore = (currentUser.stats['Education'] || 0) + (currentUser.stats['HealthyLifestyle'] || 0);
        if (knowledgeScore > 800 && !currentUser.skillsUnlocked.includes('Quantum Biophysics')) {
            const timer = setTimeout(() => {
                setShowAchievement(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentUser.stats, currentUser.skillsUnlocked]);

    const handleNodeClick = useCallback((node: any) => {
        if (node.group === 'topic' || node.group === 'event') {
            setSelectedEvent({
                id: node.id,
                title: node.title || node.name || node.id,
                type: node.group === 'event' ? "Событие" : "Тема",
                date: "2026-05-12",
                time: "14:00"
            });
        }
    }, []);

    return (
        <LayoutGroup>
            <LayoutShell className="font-sans text-slate-200">
                {/* Global Header */}
                <AppHeader
                    currentView={currentView}
                    onChangeView={onChangeView}
                />

                {/* Main Content: Graph fills viewport, panel floats */}
                <div className="flex-1 relative overflow-hidden z-10" style={{ isolation: 'isolate' }}>
                    {/* BACKGROUND: Knowledge Graph (full viewport) */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                        <Suspense fallback={<Loading />}>
                            <PersonalKnowledgeGraph onNodeClick={handleNodeClick} />
                        </Suspense>

                        {/* Event Card Overlay */}
                        <AnimatePresence>
                            {selectedEvent && (
                                <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Map HUD Label (outside graph container to avoid canvas stacking issues) */}
                    <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10 pointer-events-none">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" style={{ backgroundColor: themeColor }} />
                            <h3 className="text-[10px] font-orbitron font-black text-white uppercase tracking-[0.4em]">
                                ПЕРСОНАЛЬНЫЙ_НЕКСУС_V2
                            </h3>
                        </div>
                        <span className="text-[7px] text-blue-400/40 mt-1.5 font-mono uppercase tracking-[0.2em]">Фокус карты: Когнитивная Связность</span>
                    </div>

                    {/* FLOATING PANEL (right side) — inline style for reliable positioning */}
                    <div
                        className="absolute z-30 flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] right-2 top-2 bottom-2 w-[280px] md:right-3 md:top-3 md:bottom-3 md:w-[320px] lg:right-5 lg:top-5 lg:bottom-5 lg:w-[400px]"
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            backdropFilter: 'blur(40px)',
                            WebkitBackdropFilter: 'blur(40px)',
                            boxShadow: '0 8px 60px rgba(0,0,0,0.6)',
                        }}
                    >
                        {/* Subtle top accent line */}
                        <div
                            className="h-[2px] w-full opacity-60"
                            style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }}
                        />

                        {/* 1. PROFILE HEADER (compact) */}
                        <div className="flex-none px-4 lg:px-6 pt-4 lg:pt-5 pb-3 lg:pb-4">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h2 className="text-base lg:text-xl font-black text-white uppercase tracking-wider leading-none font-orbitron">
                                        {currentUser.name}
                                    </h2>
                                    <div className="flex items-center gap-3 text-[9px] font-mono text-white/30 uppercase tracking-widest mt-2">
                                        <span>ID: {currentUser.id.slice(0, 8)}</span>
                                        <span className="text-white/10">|</span>
                                        <span>LVL {Math.floor(currentUser.eventsAttended / 10) + 1}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/35 italic leading-relaxed mt-3 border-l-2 pl-3" style={{ borderColor: `${themeColor}40` }}>
                                "{personalityInsight}"
                            </p>

                            {/* Character Selector */}
                            <div className="mt-4">
                                <CharacterSelector themeColor={themeColor} />
                            </div>
                        </div>

                        {/* 2. TAB BAR */}
                        <div className="flex-none px-4 lg:px-6 pb-1">
                            <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                {TAB_CONFIG.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-300
                                                ${isActive
                                                    ? 'text-white shadow-lg'
                                                    : 'text-white/30 hover:text-white/50'
                                                }
                                            `}
                                            style={isActive ? {
                                                backgroundColor: `${themeColor}20`,
                                                boxShadow: `0 0 20px ${themeColor}15`,
                                                color: themeColor,
                                            } : undefined}
                                        >
                                            {tab.icon}
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. TAB CONTENT */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === 'topology' && (
                                    <motion.div
                                        key="topology"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className="p-4 lg:p-6"
                                    >
                                        <div className="w-full h-[220px] lg:h-[280px] relative rounded-xl border border-white/[0.06] bg-black/40 overflow-hidden">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_70%)]" />
                                            <Suspense fallback={<Loading />}>
                                                <SpiderChart themeColor={themeColor} />
                                            </Suspense>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'stream' && (
                                    <motion.div
                                        key="stream"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className="p-4 lg:p-6 space-y-4 lg:space-y-6"
                                    >
                                        <ClusterPulseCards />
                                        <div className="border-t border-white/[0.05] pt-6">
                                            <AgentTelemetryStream />
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </LayoutShell>

            {/* Achievement Modal (unchanged) */}
            <AnimatePresence>
                {showAchievement && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl pointer-events-auto"
                        onClick={() => setShowAchievement(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-void border border-yellow-500/30 p-10 rounded-sm max-w-md w-full relative overflow-hidden shadow-[0_0_100px_rgba(234,179,8,0.2)] text-glow-orange"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-full border border-yellow-500/10 m-1" />
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-24 h-24 bg-yellow-500/5 rounded-full flex items-center justify-center mb-8 border border-yellow-500/20 animate-pulse">
                                    <Star size={44} className="text-yellow-400 fill-yellow-400" />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-wider font-orbitron">Новый Узел Подключен</h2>
                                <p className="text-gray-400 mb-8 text-[11px] font-mono leading-relaxed uppercase tracking-wider">
                                    Внешний источник данных подтвержден. <br /> Топология графа обновлена в реальном времени.
                                </p>
                                <button
                                    onClick={() => setShowAchievement(false)}
                                    className="w-full py-4 bg-yellow-600/90 hover:bg-yellow-500 text-black font-black rounded-sm transition-all text-[11px] uppercase tracking-[0.2em] transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Принять Интеграцию
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LayoutGroup>
    );
};
