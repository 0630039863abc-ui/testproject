import React, { useMemo } from 'react';
import { useSimulation } from '../../Simulation/model/simulationContext';
import { Scan, TrendingUp, Zap, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StrategicProjectionsProps {
    themeColor: string;
}

interface Recommendation {
    id: string;
    type: 'EXPANSION' | 'OPTIMIZATION' | 'BRIDGE' | 'OPPORTUNITY';
    title: string;
    desc: string;
    impact: string;
    rationale: string;
    probability: string;
    icon: React.ReactNode;
}

export const StrategicProjections: React.FC<StrategicProjectionsProps> = ({ themeColor }) => {
    const { currentUser, logs } = useSimulation();

    // Force re-render on log update to ensure immediate reactivity
    const latestLog = logs.find(l => l.userId === currentUser.name);

    const recommendations = useMemo(() => {
        const stats = currentUser.stats;
        const recs: Recommendation[] = [];

        // 0. REACTIVE Opportunity (High Priority - based on latest action)
        if (latestLog) {
            recs.push({
                id: `REC_REACT_${latestLog.id.slice(-4)}`,
                type: 'OPPORTUNITY',
                title: `${latestLog.cluster} Convergence`,
                desc: `Immediate pathway detected following your recent ${latestLog.action} in ${latestLog.zone}.`,
                impact: '+5% IMMEDIATE GAIN',
                rationale: `System detects active neural plasticity in ${latestLog.cluster}. Capitalize on this momentum.`,
                probability: '98%',
                icon: <Activity size={14} />
            });
        }

        // 1. Identify Dominant Cluster
        const sortedStats = (Object.entries(stats) as [string, number][]).sort(([, a], [, b]) => b - a);
        const topCluster = sortedStats[0][0];
        const topValue = sortedStats[0][1];

        // 2. Optimization recommendation (Always for the top cluster)
        recs.push({
            id: 'REC_OPT_01',
            type: 'OPTIMIZATION',
            title: `${topCluster} Mastery`,
            desc: `Elevate your ${topCluster} competence to Tier-2 by completing high-evidence research sessions.`,
            impact: '+12% DOMAIN DEPTH',
            rationale: `Current ${topCluster} saturation is at ${Math.floor(topValue / 10)}%. Deepening this path yields maximum cognitive ROI.`,
            probability: '94%',
            icon: <TrendingUp size={14} />
        });

        // 3. Expansion recommendation (Focus on a low but active cluster or a related one)
        const lowCluster = sortedStats.find(([name]) => name !== topCluster && (stats as any)[name] < 200);
        if (lowCluster) {
            recs.push({
                id: 'REC_EXP_02',
                type: 'EXPANSION',
                title: `${lowCluster[0]} Induction`,
                desc: `Initialize engagement with ${lowCluster[0]} nodes to balance your cognitive topology.`,
                impact: '+18% NEURAL STABILITY',
                rationale: `Detected imbalance in ${lowCluster[0]} coverage. Multidisciplinary growth reduces systemic entropy.`,
                probability: '82%',
                icon: <Target size={14} />
            });
        }

        // 4. Synergistic Bridge
        if (sortedStats.length > 2) {
            const cluster2 = sortedStats[1][0];
            recs.push({
                id: 'REC_BRG_03',
                type: 'BRIDGE',
                title: `${topCluster}-${cluster2} Hybrid`,
                desc: `Seek intersections between ${topCluster} and ${cluster2} to unlock unique cross-domain skills.`,
                impact: '+25% INNOVATION DELTA',
                rationale: `Profound synergy potential detected between your two strongest domains.`,
                probability: '88%',
                icon: <Zap size={14} />
            });
        }

        return recs.slice(0, 2); // Show top 2
    }, [currentUser.stats]);

    return (
        <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
                {recommendations.map((rec) => (
                    <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full bg-[#050505]/40 backdrop-blur-md rounded-sm overflow-hidden group border border-white/5 hover:bg-[#080808]/60 transition-all duration-300"
                        style={{ boxShadow: `inset 0 0 20px ${themeColor}05` }}
                    >
                        {/* Dynamic Sweep Effect */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1.5s] ease-in-out"></div>
                        </div>

                        {/* Scanline Overlay */}
                        <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none"></div>

                        <div className="relative z-10 p-5 flex flex-col gap-4">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-sm bg-black/40 border border-white/10" style={{ color: themeColor }}>
                                        {rec.icon}
                                    </div>
                                    <span className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-60">
                                        {rec.type}
                                    </span>
                                </div>
                                <div className="text-[9px] font-bold tracking-tight uppercase" style={{ color: themeColor, textShadow: `0 0 8px ${themeColor}80` }}>
                                    {rec.impact}
                                </div>
                            </div>

                            {/* Info */}
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-2 group-hover:text-glow-white transition-all">
                                    {rec.title}
                                </h4>
                                <p className="text-[10px] text-gray-400 leading-relaxed font-light w-[95%]">
                                    {rec.desc}
                                </p>
                            </div>

                            {/* Rationale Block */}
                            <div className="bg-white/[0.02] border-l-2 p-2" style={{ borderColor: `${themeColor}4d` }}>
                                <div className="flex items-center gap-1 mb-1 opacity-50">
                                    <span className="text-[7px] font-mono uppercase tracking-widest" style={{ color: themeColor }}>CORE LOGIC</span>
                                </div>
                                <p className="text-[9px] text-gray-300 italic font-mono leading-tight">
                                    "{rec.rationale}"
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                                <div className="flex items-center gap-2 opacity-30">
                                    <span className="text-[7px] font-mono">EST. PROB: {rec.probability}</span>
                                    <span className="h-1 w-1 rounded-full bg-white/20"></span>
                                    <span className="text-[7px] font-mono">SYS_COORD_{rec.id}</span>
                                </div>

                                <button
                                    className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/10 hover:border-white/30 transition-all group/btn"
                                    style={{ '--theme': themeColor } as any}
                                >
                                    <Scan size={10} className="opacity-60 group-hover/btn:opacity-100" style={{ color: themeColor }} />
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/80">Project Trace</span>
                                </button>
                            </div>
                        </div>

                        {/* Tech Corner Decoration */}
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-white/30"></div>
                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-white/30"></div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
