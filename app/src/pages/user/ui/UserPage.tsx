import React, { useState, useEffect, Suspense } from 'react';
import { ClusterPulseCards } from '../../../widgets/ClusterPulseCards';
import { AgentTelemetryStream } from '../../../widgets/AgentTelemetryStream';
import { EventCard } from '../../../entities/Event/ui/EventCard';
import { AppHeader } from '../../../widgets/AppHeader';
import { calculateArchetype, getDominantCluster } from '../../../entities/User/lib/archetype';
import { CharacterSelector } from '../../../features/User/CharacterSelector/ui/CharacterSelector';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Star, Grid } from 'lucide-react';
import { CognitiveDrift } from '../../../entities/User/ui/CognitiveDrift';
import { getClusterColor } from '../../../shared/lib/tokens';
import { Loading } from '../../../shared/ui/Loading';

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

    // Handler for Graph Interaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNodeClick = (node: any) => {
        if (node.group === 'topic' || node.group === 'event') {
            setSelectedEvent({
                id: node.id,
                title: node.title || node.name || node.id,
                type: node.group === 'event' ? "Event" : "Topic",
                date: "2026-05-12",
                time: "14:00"
            });
        } else {
            setSelectedEvent(null);
        }
    };

    return (
        <LayoutGroup>
            <div className="w-full h-screen flex flex-col bg-[#020202] overflow-hidden font-sans text-slate-200 selection:bg-blue-500/30">

                {/* Global Header - Now in flex flow */}
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

                    {/* RIGHT PANE: Telemetry Dashboard (40%) */}
                    <div className="w-[40%] h-full bg-[#030303] flex flex-col relative border-l border-blue-900/30 overflow-hidden bg-grain">

                        {/* Global Atmospherics */}
                        <div className="absolute inset-0 z-0 bg-tech-grid opacity-20 pointer-events-none"></div>
                        <div className="absolute inset-0 z-0 scanlines opacity-30 pointer-events-none"></div>

                        {/* 1. COMPACT PROFILE HEADER */}
                        <div className="flex-none pt-2 px-4 pb-3 bg-[#030303]/95 backdrop-blur-2xl border-b border-white/5 z-30 relative">
                            {/* Profile Info Row */}
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-lg font-black text-white uppercase tracking-tight leading-none" style={{ textShadow: `0 0 10px ${themeColor}` }}>
                                        {currentUser.name}
                                    </h2>
                                    <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
                                        <span>24 года</span>
                                        <span className="text-white/20">•</span>
                                        <span>Москва</span>
                                    </div>
                                </div>
                                <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm">
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider" style={{ color: themeColor }}>
                                        {calculateArchetype(currentUser.stats).title}
                                    </span>
                                </div>
                            </div>

                            {/* Agent Selector */}
                            <CharacterSelector themeColor={themeColor} />
                        </div>

                        {/* 2. COGNITIVE TOPOLOGY (Fixed Visual Anchor) */}
                        <div className="flex-none relative p-3 border-b border-white/5 bg-[#050505]/40 backdrop-blur-sm">
                            <div className="absolute top-2 left-3 z-10">
                                <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: themeColor, textShadow: `0 0 5px ${themeColor}` }}>
                                    <Grid size={8} />
                                    Когнитивная Топология
                                </h3>
                            </div>

                            <div className="w-full h-[200px] relative tech-border-container rounded-sm border border-white/5 bg-black/20 mt-2">
                                <Suspense fallback={<Loading />}>
                                    <SpiderChart themeColor={themeColor} />
                                </Suspense>
                            </div>
                        </div>

                        {/* 3. SCROLLABLE FEED (Remaining Space) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 bg-[#030303]/50">
                            {/* Stream Section */}
                            <section className="p-4 border-b border-white/5">
                                <div className="mb-2 sticky top-0 bg-[#030303]/90 backdrop-blur-md py-1.5 z-20 border-b border-white/5 -mx-4 px-4 flex justify-between items-center">
                                    <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: themeColor }}>
                                        <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></span>
                                        Поведенческий Резонанс // ПУЛЬС
                                    </h3>
                                    <span className="text-[8px] font-mono text-gray-600 animate-pulse">LIVE</span>
                                </div>
                                <ClusterPulseCards />

                                {/* Agent Telemetry Stream */}
                                <div className="mt-4 pt-3 border-t border-white/5">
                                    <AgentTelemetryStream />
                                </div>
                            </section>

                            {/* Cognitive Drift Section */}
                            <section className="p-4 border-b border-white/5 bg-[#050505]/20">
                                <CognitiveDrift />
                            </section>

                            {/* Footer Spacer */}
                            <div className="h-12 flex items-center justify-center opacity-30">
                                <span className="text-[8px] font-mono text-gray-700">--- КОНЕЦ ТЕЛЕМЕТРИИ ---</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* ACHIEVEMENT MODAL - Root Level Z-Index Fix */}
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
