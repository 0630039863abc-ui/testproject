import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { ClusterPulseCards } from '../../../widgets/ClusterPulseCards';
import { AgentTelemetryStream } from '../../../widgets/AgentTelemetryStream';
import { EventCard } from '../../../entities/Event/ui/EventCard';
import { AppHeader } from '../../../widgets/AppHeader';
import { getDominantCluster } from '../../../entities/User/lib/archetype';
import { CharacterSelector } from '../../../features/User/CharacterSelector/ui/CharacterSelector';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Star, Grid } from 'lucide-react';
import { CognitiveDrift } from '../../../entities/User/ui/CognitiveDrift';
import { CLUSTER_TRANSLATIONS, getClusterColor } from '../../../shared/lib/tokens';
import { Loading } from '../../../shared/ui/Loading';
import { LayoutShell } from '../../../widgets/LayoutShell';
import { useMemo } from 'react';

const PersonalKnowledgeGraph = React.lazy(() => import('../../../features/KnowledgeGraph/ui/PersonalKnowledgeGraph').then(module => ({ default: module.PersonalKnowledgeGraph })));
const SpiderChart = React.lazy(() => import('../../../entities/User/ui/SpiderChart').then(module => ({ default: module.SpiderChart })));

interface UserDashboardProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentView, onChangeView }) => {
    const { currentUser } = useSimulation();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showAchievement, setShowAchievement] = useState(false);

    // Dynamic Theme Color based on Dominant Cluster
    const dominantCluster = getDominantCluster(currentUser.stats as any);
    const themeColor = getClusterColor(dominantCluster);

    // Personality Assessment Logic
    const personalityInsight = useMemo(() => {
        const stats = currentUser.stats;
        const sorted = Object.entries(stats).sort((a, b) => (b[1] as number) - (a[1] as number));
        const topCluster = sorted[0]?.[0] || 'Education';
        const translation = CLUSTER_TRANSLATIONS[topCluster] || topCluster;

        // Dative case mapping for "посвященных..."
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

    // L5 Trigger Logic (Science & Tech based)
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

                <div className="flex-1 flex overflow-hidden relative z-10">
                    {/* LEFT PANE: Obsidian Map (60%) */}
                    <div className="w-[60%] h-full relative border-r border-white/5 bg-black/20 overflow-hidden">
                        <Suspense fallback={<Loading />}>
                            <PersonalKnowledgeGraph onNodeClick={handleNodeClick} />
                        </Suspense>

                        {/* Event Card Overlay Layer */}
                        <AnimatePresence>
                            {selectedEvent && (
                                <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                            )}
                        </AnimatePresence>

                        {/* Map HUD Decoration */}
                        <div className="absolute top-6 left-6 pointer-events-none">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
                                <h3 className="text-[10px] font-orbitron font-black text-white uppercase tracking-[0.4em]">
                                    ПЕРСОНАЛЬНЫЙ_НЕКСУС_V2
                                </h3>
                            </div>
                            <span className="text-[7px] text-blue-400/40 mt-1.5 font-mono uppercase tracking-[0.2em]">Фокус карты: Когнитивная Связность</span>
                        </div>
                    </div>

                    {/* RIGHT PANE: Telemetry Dashboard (Glass HUD) */}
                    <div className="w-[40%] h-full relative overflow-hidden bg-black/40 flex flex-col border-l border-white/5">
                        {/* 1. PROFILE SECTION */}
                        <div className="flex-none pt-8 px-8 pb-4 border-b border-white/5 relative bg-white/[0.01]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col gap-1.5">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-wider leading-none filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] font-orbitron">
                                        {currentUser.name}
                                    </h2>
                                    <div className="flex items-center gap-3 text-[9px] font-mono text-blue-300/40 uppercase tracking-widest mt-1">
                                        <span>ID: {currentUser.id.slice(0, 8)}</span>
                                        <span className="text-white/10">|</span>
                                        <span>LEVEL: {Math.floor(currentUser.eventsAttended / 10) + 1}</span>
                                    </div>
                                    <div className="mt-3 text-[10px] font-medium text-white/40 italic border-l-2 border-blue-500/30 pl-3 leading-relaxed">
                                        "{personalityInsight}"
                                    </div>
                                </div>
                            </div>
                            <CharacterSelector themeColor={themeColor} />
                        </div>

                        {/* 2. COGNITIVE TOPOLOGY */}
                        <div className="flex-none relative p-8 border-b border-white/5 overflow-hidden">
                            <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                                    <Grid size={12} className="text-blue-500" />
                                    Когнитивная Топология
                                </h3>
                                <div className="text-[8px] font-mono text-blue-400/30 uppercase tracking-widest">СИНХРОНИЗАЦИЯ: АКТИВНА</div>
                            </div>

                            <div className="w-full h-[220px] relative rounded-sm border border-white/5 bg-black/60 overflow-hidden group/chart">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)] opacity-50" />
                                <Suspense fallback={<Loading />}>
                                    <SpiderChart themeColor={themeColor} />
                                </Suspense>
                                {/* Chart Decor */}
                                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20" />
                                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20" />
                            </div>
                        </div>

                        {/* 3. SCROLLABLE FEED (Neuro-Stream) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                            <section className="p-8">
                                <div className="mb-6 sticky top-0 bg-transparent z-20 flex justify-between items-center">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
                                        НЕЙРО_ПОТОК_LIVE
                                    </h3>
                                </div>

                                <ClusterPulseCards />
                                <div className="mt-8 pt-8 border-t border-white/5 border-dashed relative">
                                    <div className="absolute top-[-1px] left-0 w-12 h-[1px] bg-red-500/30" />
                                    <AgentTelemetryStream />
                                </div>
                            </section>

                            <section className="p-8 pt-0 opacity-40 hover:opacity-100 transition-opacity duration-700">
                                <CognitiveDrift />
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer HUD */}
                <div className="absolute bottom-6 left-6 z-[60] flex items-center gap-6 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded-sm backdrop-blur-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-orbitron font-black text-white/40 uppercase tracking-widest">СТАТУС_ОПЕРАТОРА: НОМИНАЛЬНЫЙ</span>
                    </div>
                </div>
            </LayoutShell>

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
                            {/* Decorative Frame */}
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
        </LayoutGroup >
    );
};
