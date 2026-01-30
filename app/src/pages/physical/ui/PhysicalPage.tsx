import React from 'react';
import { NeuralLinkTelemetry } from '../../../features/Telemetry/ui/TelemetryStream';
import { AppHeader } from '../../../widgets/AppHeader';
import { HardwareStats } from '../../../entities/Physical/ui/HardwareStats';
import { AlertSidebar } from '../../../entities/Physical/ui/AlertSidebar';
import { motion } from 'framer-motion';

interface PhysicalLayerProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const PhysicalLayer: React.FC<PhysicalLayerProps> = ({ currentView, onChangeView }) => {
    return (
        <div className="w-full h-screen relative bg-[#020202] overflow-hidden crt-container font-sans selection:bg-blue-500/30 flex flex-col">
            {/* Global Atmospherics */}
            <div className="absolute inset-0 z-0 bg-tech-grid opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 scanlines opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 bg-grain pointer-events-none"></div>

            {/* Global Header */}
            <div className="h-[60px] shrink-0 relative z-50">
                <AppHeader currentView={currentView} onChangeView={onChangeView} />
            </div>

            {/* MAIN CONTENT AREA: 3-Column Layout */}
            <div className="flex-1 flex p-6 gap-6 z-10 overflow-hidden min-h-0">

                {/* 1. LEFT SIDEBAR: System Vitality */}
                <div className="flex-none flex flex-col gap-6 w-[200px] overflow-hidden shrink-0">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <HardwareStats />
                    </motion.div>

                    {/* Decorative Scanning Box */}
                    <div className="flex-1 border border-blue-500/10 bg-blue-500/[0.02] relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.05] to-transparent h-20 w-full animate-scan pointer-events-none"></div>
                        <div className="p-4">
                            <div className="text-[9px] font-bold text-blue-500/40 uppercase mb-2">Passive Scanner</div>
                            <div className="space-y-1">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-1 bg-blue-500/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-500/30"
                                            animate={{ width: ['20%', '80%', '40%'] }}
                                            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CENTER: Main Telemetry HUD */}
                <div className="flex-1 relative min-h-0 min-w-0 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 p-2"
                    >
                        <NeuralLinkTelemetry />
                    </motion.div>
                </div>

                {/* 3. RIGHT SIDEBAR: Alert Stream */}
                <div className="flex-none w-[240px] flex flex-col gap-6 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="h-full"
                    >
                        <AlertSidebar />
                    </motion.div>
                </div>

            </div>

            {/* Corner Bracket Decorations for Screen */}
            <div className="fixed top-20 left-4 w-4 h-4 border-t-2 border-l-2 border-blue-500/20 z-50 pointer-events-none"></div>
            <div className="fixed top-20 right-4 w-4 h-4 border-t-2 border-r-2 border-blue-500/20 z-50 pointer-events-none"></div>
            <div className="fixed bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-blue-500/20 z-50 pointer-events-none"></div>
            <div className="fixed bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blue-500/20 z-50 pointer-events-none"></div>

            {/* System Notification Overlay (Bottom) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/5 px-6 py-2 rounded-full z-50 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase">Physical Layer Status: NOMINAL</span>
                <span className="text-[10px] font-mono text-blue-500/50">|</span>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-white/20 uppercase">Latency:</span>
                    <span className="text-[9px] font-mono text-white/60">4ms</span>
                </div>
            </div>
        </div>
    );
};

