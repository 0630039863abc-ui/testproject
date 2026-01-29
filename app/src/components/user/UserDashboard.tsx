import React, { useState, useEffect } from 'react';
import { PersonalKnowledgeGraph } from './PersonalKnowledgeGraph';
import { SpiderChart } from './SpiderChart';
import { QuestLog } from './QuestLog';
import { XPBar } from './XPBar';
import { EventCard } from './EventCard';
import { AppHeader } from '../layout/AppHeader';
import { calculateArchetype } from '../../utils/archetypeLogic';
import { useSimulation } from '../../context/SimulationContext';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Star, Cpu, Brain, Grid } from 'lucide-react';

interface UserDashboardProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentView, onChangeView }) => {
    const { currentUser } = useSimulation();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showAchievement, setShowAchievement] = useState(false);

    // L5 Trigger Logic
    useEffect(() => {
        if (currentUser.stats.intel > 45 && !currentUser.skillsUnlocked.includes('Quantum Biophysics')) {
            setShowAchievement(prev => {
                if (!prev) return true;
                return prev;
            });
        }
    }, [currentUser.stats.intel, currentUser.skillsUnlocked]);

    // Handler for Graph Interaction
    const handleNodeClick = (node: any) => {
        if (node.group === 'topic' || node.group === 'event') {
            setSelectedEvent({
                id: node.id,
                title: node.title || node.name || node.id, // Use passed title, name, or fallback to ID
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

                {/* RIGHT PANE: Character Sheet (40%) */}
                <div className="w-[40%] h-full bg-[#030303] flex flex-col relative border-l border-blue-900/30 overflow-hidden bg-grain pt-[60px]">

                    {/* Global Atmospherics */}
                    <div className="absolute inset-0 z-0 bg-tech-grid opacity-20 pointer-events-none"></div>
                    <div className="absolute inset-0 z-0 scanlines opacity-30 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 p-2 z-0">
                        <div className="decor-text text-right">SYS.RDY // V.2.0.45</div>
                        <div className="decor-text text-right">ENC_LVL: MAX</div>
                    </div>

                    {/* 1. FIXED HEADER */}
                    <div className="flex-none p-6 bg-[#030303]/80 backdrop-blur-xl border-b border-blue-500/10 z-30 relative tech-border-container">
                        {/* Tech Corners */}
                        <div className="tech-corner-bl"></div>
                        <div className="tech-corner-br"></div>

                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-3 w-full">
                                <div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-1 mt-0.5 text-glow-blue">
                                        {currentUser.name}
                                    </h2>
                                    <div className="h-[1px] w-full bg-gradient-to-r from-blue-500/50 via-blue-500/10 to-transparent my-2 box-glow-blue"></div>
                                </div>

                                <div className="flex items-start gap-4">
                                    {/* Avatar Slot */}
                                    <div className="w-12 h-12 flex-none bg-black border border-blue-500/40 relative group overflow-hidden rounded-sm glitch-hover" style={{ width: '48px', height: '48px' }}>
                                        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-20" />

                                        <img
                                            src="/alex_novikov.png"
                                            alt="Profile"
                                            width="48"
                                            height="48"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                                        />

                                        {/* Sync Indicator */}
                                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#030303] rotate-45 border-l border-t border-blue-500 z-30"></div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        {/* Demographics */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-white/90 font-bold flex items-center gap-2 text-glow-blue">
                                                24 Y.O.
                                            </span>
                                            <span className="text-[10px] text-blue-500/50">|</span>
                                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">MOSCOW</span>
                                        </div>

                                        {/* Archetype Badge */}
                                        <div className="flex items-center gap-2">
                                            <div className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-[1px] box-glow-blue">
                                                <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-wider text-glow-blue">
                                                    {calculateArchetype(currentUser.stats).title}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. SCROLLABLE CONTENT (Stats & Quests) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                        {/* Layer 2: Spider Chart */}
                        <section className="mb-8 relative group">
                            <div className="absolute -inset-3 bg-blue-500/[0.02] -z-10 rounded-lg border border-blue-500/[0.05]"></div>
                            <h3 className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 text-glow-blue">
                                <span className="w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></span>
                                Cognitive Topology
                            </h3>
                            <div className="bg-[#050505]/40 border border-blue-500/10 p-2 rounded-sm backdrop-blur-sm relative overflow-hidden tech-border-container">
                                <div className="absolute top-0 right-0 p-2 opacity-50 z-20">
                                    <Grid size={10} className="text-blue-500/30" />
                                </div>
                                {/* Rotating container for 3D effect - DISABLED per user request */}
                                <div className="origin-center">
                                    <SpiderChart />
                                </div>
                            </div>
                        </section>

                        {/* Layer 3: RDRecommendations (Formerly Quest Log) */}
                        <section className="mb-6">
                            <div className="mb-3">
                                <h3 className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2 text-glow-orange mb-1">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></span>
                                    Discovery Vectors
                                </h3>
                                <p className="text-[8px] text-gray-500 font-mono pl-3 border-l border-orange-500/20 leading-tight max-w-[90%]">
                                    AI-driven R&D pathways based on your Cognitive Topology.
                                </p>
                            </div>
                            <QuestLog />
                        </section>
                    </div>

                    {/* 3. ANCHORED FOOTER (RPG Progression & Perks) */}
                    <div className="flex-none bg-[#050505]/90 backdrop-blur-xl border-t border-blue-500/10 p-6 pt-5 shadow-[0_-20px_50px_rgba(0,0,0,0.9)] relative z-20 tech-border-container">
                        {/* Tech Corners */}
                        <div className="tech-corner-tl"></div>
                        <div className="tech-corner-tr"></div>

                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-500/30 via-blue-500/10 to-transparent box-glow-blue"></div>

                        <div className="mb-5">
                            <XPBar
                                current={currentUser.stats.intel % 100}
                                max={100}
                                level={Math.floor(currentUser.stats.intel / 100)}
                            />
                        </div>

                        {/* Perks Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="aspect-[4/3] bg-blue-900/[0.05] border border-blue-500/30 flex flex-col items-center justify-center group hover:bg-blue-500/10 transition-colors cursor-pointer relative overflow-hidden box-glow-blue">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-[7px] text-blue-500/50 font-mono mb-1 absolute top-1 right-1">SL01</div>
                                <Brain size={14} className="text-blue-400 mb-1 group-hover:scale-110 transition-transform text-glow-blue" />
                                <div className="text-blue-300 text-[8px] font-bold tracking-tight text-center px-1 leading-none text-glow-blue">NEURO<br />LINK</div>
                            </div>

                            <div className="aspect-[4/3] bg-purple-900/[0.05] border border-purple-500/30 flex flex-col items-center justify-center group hover:bg-purple-500/10 transition-colors cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-[7px] text-purple-500/50 font-mono mb-1 absolute top-1 right-1">SL02</div>
                                <Cpu size={14} className="text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                                <div className="text-purple-300 text-[8px] font-bold tracking-tight text-center px-1 leading-none">DEV<br />PROT</div>
                            </div>

                            <div className="aspect-[4/3] bg-red-900/[0.05] border border-red-500/20 flex flex-col items-center justify-center relative opacity-60">
                                <div className="text-[7px] text-red-500/50 font-mono mb-1 absolute top-1 right-1">SL03</div>
                                <div className="text-red-500/70 text-[8px] font-mono tracking-tight text-center leading-none text-glow-red">LOCKED</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievement Modal Overlay */}
                <AnimatePresence>
                    {showAchievement && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto bg-grain"
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
            </div>
        </LayoutGroup>
    );
};
