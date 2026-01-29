import React, { useState, useEffect } from 'react';
import { PersonalKnowledgeGraph } from './PersonalKnowledgeGraph';
import { SpiderChart } from './SpiderChart';
import { ExperienceFeed } from './ExperienceFeed';
import { EventCard } from './EventCard';
import { AppHeader } from '../layout/AppHeader';
import { calculateArchetype, getDominantCluster } from '../../utils/archetypeLogic';
import { CharacterSelector } from './CharacterSelector';
import { useSimulation } from '../../context/SimulationContext';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Star, Grid, Scan } from 'lucide-react';
import { ArchetypeDNA } from './ArchetypeDNA';
import { EngagementBadges } from './EngagementBadges';
import { ChronobiologicalRhythm } from './ChronobiologicalRhythm';
import { CognitiveDrift } from './CognitiveDrift';
import { getClusterColor } from '../../utils/clusterColors';

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
            <div className="w-full h-screen flex bg-[#020202] overflow-hidden font-sans text-slate-200 selection:bg-blue-500/30">

                {/* Global Header */}
                <AppHeader
                    currentView={currentView}
                    onChangeView={onChangeView}
                />

                {/* LEFT PANE: Obsidian Map (60%) */}
                <div className="w-[60%] h-full relative border-r border-blue-900/20 z-10 bg-grain pt-[60px]">
                    <PersonalKnowledgeGraph onNodeClick={handleNodeClick} />
                    {/* Event Card Overlay Layer */}
                    <AnimatePresence>
                        {selectedEvent && (
                            <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                        )}
                    </AnimatePresence>
                </div>

                {/* RIGHT PANE: Telemetry Dashboard (40%) */}
                <div className="w-[40%] h-full bg-[#030303] flex flex-col relative border-l border-blue-900/30 overflow-hidden bg-grain pt-[60px]">

                    {/* Global Atmospherics */}
                    <div className="absolute inset-0 z-0 bg-tech-grid opacity-20 pointer-events-none"></div>
                    <div className="absolute inset-0 z-0 scanlines opacity-30 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 p-2 z-0">
                        <div className="decor-text text-right">SYS.RDY // V.2.3.0</div>
                        <div className="decor-text text-right">TELEMETRY_MODE: ACTIVE</div>
                    </div>

                    {/* 1. COMPACT TELEMETRY HEADER (Fixed) */}
                    {/* 1. COMPACT TELEMETRY HEADER (Fixed) */}
                    <div className="flex-none p-3 pb-2 bg-[#030303]/95 backdrop-blur-2xl border-b border-white/5 z-30 relative group">
                        {/* Scanning Overlay Animation */}
                        <div className="absolute inset-0 z-0 opacity-10 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-scan-fast pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col gap-2">
                            {/* Top Row: Name, Badge, Stats */}
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-0.5">
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none flex items-center gap-2" style={{ textShadow: `0 0 10px ${themeColor}` }}>
                                        {currentUser.name}
                                        <div className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-[1px] mt-0.5">
                                            <span className="text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: themeColor }}>
                                                {calculateArchetype(currentUser.stats).title}
                                            </span>
                                        </div>
                                    </h2>
                                    <div className="flex items-center gap-2 text-[9px] font-mono text-gray-400">
                                        <span className="flex items-center gap-1 text-white/80">
                                            <Scan size={8} className="text-blue-500" /> ID: {currentUser.id.slice(0, 8)}
                                        </span>
                                        <span>|</span>
                                        <span>AGE: 24</span>
                                        <span>|</span>
                                        <span>LOC: MOSCOW</span>
                                    </div>
                                </div>
                                <div className="scale-90 origin-top-right">
                                    <EngagementBadges logs={useSimulation().logs} themeColor={themeColor} />
                                </div>
                            </div>

                            {/* DNA Strip - Horizontal Bar */}
                            <div className="w-full opacity-80 hover:opacity-100 transition-opacity">
                                <ArchetypeDNA stats={currentUser.stats as any} />
                            </div>

                            {/* Character Selector - Integrated Compactly */}
                            <div className="pt-1.5 border-t border-white/5">
                                <CharacterSelector themeColor={themeColor} />
                            </div>
                        </div>
                    </div>

                    {/* 2. COGNITIVE TOPOLOGY (Fixed Visual Anchor) */}
                    <div className="flex-none relative p-3 border-b border-white/5 bg-[#050505]/40 backdrop-blur-sm">
                        <div className="absolute top-2 left-3 z-10">
                            <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: themeColor, textShadow: `0 0 5px ${themeColor}` }}>
                                <Grid size={8} />
                                Cognitive Topology
                            </h3>
                        </div>

                        <div className="w-full h-[180px] relative tech-border-container rounded-sm border border-white/5 bg-black/20 mt-2">
                            <SpiderChart themeColor={themeColor} />
                        </div>
                    </div>

                    {/* 3. SCROLLABLE FEED (Remaining Space) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 bg-[#030303]/50">
                        {/* Stream Section */}
                        <section className="p-4 pt-2 pb-6 border-b border-white/5">
                            <div className="mb-2 sticky top-0 bg-[#030303]/90 backdrop-blur-md py-1.5 z-20 border-b border-white/5 -mx-4 px-4 flex justify-between items-center">
                                <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: themeColor }}>
                                    <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></span>
                                    Behavioral Resonance // STREAM
                                </h3>
                                <span className="text-[8px] font-mono text-gray-600 animate-pulse">LIVE</span>
                            </div>
                            <ExperienceFeed />
                        </section>

                        {/* Cognitive Drift Section */}
                        <section className="p-4 py-6 border-b border-white/5 bg-[#050505]/20">
                            <CognitiveDrift />
                        </section>

                        {/* Chronobiological Rhythm Section */}
                        <section className="p-4 py-6">
                            <ChronobiologicalRhythm />
                        </section>

                        {/* Footer Spacer */}
                        <div className="h-12 flex items-center justify-center opacity-30">
                            <span className="text-[8px] font-mono text-gray-700">--- END OF TELEMETRY ---</span>
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
                                <h2 className="text-2xl font-bold text-white mb-2 text-glow-orange">New Node Connected</h2>
                                <p className="text-gray-400 mb-6 text-sm">
                                    External data source verified. Graph topology updated.
                                </p>
                                <button
                                    onClick={() => setShowAchievement(false)}
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors text-sm uppercase tracking-wide box-glow-orange"
                                >
                                    Acknowledge
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LayoutGroup >
    );
};
