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
import { useMemo } from 'react';

const PersonalKnowledgeGraph = React.lazy(() => import('../../../features/KnowledgeGraph/ui/PersonalKnowledgeGraph').then(module => ({ default: module.PersonalKnowledgeGraph })));
const SpiderChart = React.lazy(() => import('../../../entities/User/ui/SpiderChart').then(module => ({ default: module.SpiderChart })));

interface UserDashboardProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentView, onChangeView }) => {
    const { currentUser } = useSimulation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showAchievement, setShowAchievement] = useState(false);

    // Dynamic Theme Color based on Dominant Cluster
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dominantCluster = getDominantCluster(currentUser.stats as any);
    const themeColor = getClusterColor(dominantCluster);

    // Personality Assessment Logic
    const personalityInsight = useMemo(() => {
        const stats = currentUser.stats;
        const sorted = Object.entries(stats).sort((a, b) => (b[1] as number) - (a[1] as number));
        const topCluster = sorted[0]?.[0] || 'Science';
        const translation = CLUSTER_TRANSLATIONS[topCluster] || topCluster;

        // Dative case mapping for "посвященных..."
        const getDativeCluster = (c: string) => {
            const map: Record<string, string> = {
                'Science': 'научному сектору',
                'Technology': 'технологическому кластеру',
                'Economics': 'экономическому блоку',
                'Society': 'общественной среде',
                'Politics': 'политическому корпусу',
                'Art': 'искусству',
                'Biology': 'биологическому отделу',
                'Psychology': 'психологическому профилю',
                'Philosophy': 'философскому базису',
                'Security': 'сектору безопасности',
                'Logistics': 'логистической сети',
                'Ecology': 'экологическому контролю',
                'Information': 'информационному полю',
                'Health': 'здравоохранению',
                'Exploration': 'исследовательскому модулю',
                'Education': 'образовательному центру',
                'Justice': 'правовому контуру',
                'Communication': 'коммуникационному узлу',
                'Infrastructure': 'инфраструктурному базису'
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
        const techSkill = (currentUser.stats['Science'] || 0) + (currentUser.stats['Technology'] || 0);
        if (techSkill > 800 && !currentUser.skillsUnlocked.includes('Quantum Biophysics')) {
            const timer = setTimeout(() => {
                setShowAchievement(true);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [currentUser.stats, currentUser.skillsUnlocked]);

    // Handler for Graph Interaction - MEMOIZED to prevent graph reset
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            <div className="w-full h-screen flex flex-col bg-[#020202] overflow-hidden font-sans text-slate-200 selection:bg-blue-500/30">

                {/* Global Header */}
                <AppHeader
                    currentView={currentView}
                    onChangeView={onChangeView}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT PANE: Obsidian Map (60%) */}
                    <div className="w-[60%] h-full relative border-r border-blue-900/20 z-10 bg-grain">
                        <Suspense fallback={<Loading />}>
                            <PersonalKnowledgeGraph onNodeClick={handleNodeClick} />
                        </Suspense>
                        {/* Event Card Overlay Layer */}
                        <AnimatePresence>
                            {selectedEvent && (
                                <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT PANE: Telemetry Dashboard (Glass HUD) */}
                    <div className="w-[40%] h-full relative overflow-hidden bg-[#030303]/40 flex flex-col">
                        {/* Deep Glass Background Layer */}
                        <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[40px] z-0" />
                        <div className="absolute inset-0 bg-hex-pattern opacity-5 pointer-events-none z-0" />

                        {/* Border Details */}
                        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-white/10 z-20" />
                        <div className="absolute top-10 bottom-10 left-[-1px] w-[3px] bg-blue-500/50 blur-[2px] z-20" />


                        <div className="flex-none pt-6 px-6 pb-2 border-b border-white/5 z-10 relative bg-white/[0.01]">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col gap-0.5">
                                    <h2 className="text-xl font-bold text-white uppercase tracking-wider leading-none filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                                        {currentUser.name}
                                    </h2>
                                    <div className="flex items-center gap-3 text-[9px] font-mono text-blue-300/40 uppercase tracking-widest mt-1">
                                        <span>ID: {currentUser.id.slice(0, 8)}</span>
                                        <span className="text-white/10">|</span>
                                        <span>УР: {Math.floor(currentUser.eventsAttended / 10) + 1}</span>
                                    </div>
                                    <div className="mt-2 text-[10px] font-medium text-white/40 italic border-l border-blue-500/20 pl-2">
                                        "{personalityInsight}"
                                    </div>
                                </div>
                            </div>
                            <CharacterSelector themeColor={themeColor} />
                        </div>

                        {/* 2. COGNITIVE TOPOLOGY */}
                        <div className="flex-none relative p-6 border-b border-white/5 z-10">
                            <div className="absolute top-0 left-0 w-20 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                                    <Grid size={10} className="text-blue-500" />
                                    Когнитивная Топология
                                </h3>
                                <div className="text-[8px] font-mono text-white/20">СИНХРОНИЗАЦИЯ</div>
                            </div>

                            <div className="w-full h-[200px] relative rounded-lg border border-white/5 bg-black/40 overflow-hidden group/chart">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)]" />
                                <Suspense fallback={<Loading />}>
                                    <SpiderChart themeColor={themeColor} />
                                </Suspense>
                                {/* Chart Decor */}
                                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
                                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
                            </div>
                        </div>

                        {/* 3. SCROLLABLE FEED */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                            <section className="p-6">
                                <div className="mb-4 sticky top-0 bg-[#030303]/0 backdrop-blur-none z-20 flex justify-between items-center">
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_#ef4444]" />
                                        Нейро-Стрим
                                    </h3>
                                </div>

                                <ClusterPulseCards />
                                <div className="mt-6 pt-6 border-t border-white/5 border-dashed">
                                    <AgentTelemetryStream />
                                </div>
                            </section>

                            <section className="p-6 pt-0 opacity-60 hover:opacity-100 transition-opacity duration-500">
                                <CognitiveDrift />
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAchievement && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto bg-grain"
                        onClick={() => setShowAchievement(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#121212] border border-yellow-500/30 p-8 rounded-2xl max-w-md w-full relative overflow-hidden shadow-[0_0_100px_rgba(234,179,8,0.2)] text-glow-orange"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20 animate-pulse">
                                    <Star size={40} className="text-yellow-400 fill-yellow-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 text-glow-orange">Новый Узел Подключен</h2>
                                <p className="text-gray-400 mb-6 text-sm">
                                    Внешний источник данных подтвержден. Топология графа обновлена.
                                </p>
                                <button
                                    onClick={() => setShowAchievement(false)}
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors text-sm uppercase tracking-wide box-glow-orange"
                                >
                                    Принять
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LayoutGroup >
    );
};
