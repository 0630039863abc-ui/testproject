import React, { useMemo } from 'react';
import { useSimulation } from '../../Simulation/model/simulationContext';
import { Hash, Briefcase, Activity } from 'lucide-react';

interface ProfileLedgerProps {
    activeContext: string; // The current zoomed node/cluster context
}

export const ProfileLedger: React.FC<ProfileLedgerProps> = ({ activeContext }) => {
    const { currentUser } = useSimulation();

    // Dynamic tags generator based on active context
    const derivedInterests = useMemo(() => {
        const baseInterests = ['Quantum Mechanics', 'Neural Interfaces'];
        if (activeContext === 'Science') return ['Theoretical Physics', 'Lab Work', ...baseInterests];
        if (activeContext === 'Creative') return ['Generative Art', 'UX Design', ...baseInterests];
        if (activeContext === 'Bio') return ['Genetics', 'CRISPR', ...baseInterests];
        return baseInterests;
    }, [activeContext]);

    return (
        <div className="h-full w-full glass-panel border-l border-white/10 flex flex-col p-6 bg-[#080808]/50 overflow-y-auto">
            {/* Identity Block */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white/20 shadow-lg flex items-center justify-center text-white font-bold text-xl relative overflow-hidden">
                    <span className="relative z-10">42</span>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{currentUser.name}</h2>
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mt-1">
                        <Briefcase size={12} />
                        <span>{currentUser.role}</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-emerald-400">Level 5 Clearance</span>
                    </div>
                </div>
            </div>

            {/* Demographics */}
            <div className="mb-6 space-y-3">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Demographics</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded border border-white/5">
                        <span className="block text-[10px] text-gray-500 uppercase">Location</span>
                        <span className="text-sm text-gray-300 font-mono">Sector 7G</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded border border-white/5">
                        <span className="block text-[10px] text-gray-500 uppercase">Age</span>
                        <span className="text-sm text-gray-300 font-mono">28 Cycles</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded border border-white/5 col-span-2">
                        <span className="block text-[10px] text-gray-500 uppercase">Hash ID</span>
                        <span className="text-sm text-gray-300 font-mono flex items-center gap-2">
                            <Hash size={10} /> 8f3a-2b1c-9d4e
                        </span>
                    </div>
                </div>
            </div>

            {/* LIVE BIO-STATS */}
            <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-3 flex items-center gap-2">
                    <Activity size={12} className="animate-pulse" /> Live Biometrics
                </h3>
                <div className="space-y-3 bg-[#0A0A0A] p-4 rounded-xl border border-white/10">
                    {Object.entries(currentUser.stats).map(([stat, value]) => (
                        <div key={stat} className="flex items-center justify-between group">
                            <span className="text-[10px] uppercase font-mono text-gray-400 w-16">{stat}</span>
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full mx-3 overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out group-hover:bg-blue-400"
                                    style={{ width: `${Math.min(value, 100)}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-bold text-white font-mono w-6 text-right">{Math.floor(value)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dynamic Interests (Reacts to Graph) */}
            <div className="mb-8">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3 flex items-center justify-between">
                    <span>Derived Interests</span>
                    {activeContext !== 'Root' && <span className="text-blue-500 text-[10px] border border-blue-500/30 px-1 rounded animate-pulse">CONTEXT: {activeContext.toUpperCase()}</span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {derivedInterests.map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
                            #{tag.replace(/\s/g, '_')}
                        </span>
                    ))}
                </div>
            </div>

            {/* Trajectory */}
            <div className="flex-1">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Projected Trajectory</h3>
                <div className="space-y-4 relative pl-4 border-l border-white/10">
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black"></div>
                        <h4 className="text-sm font-bold text-white">Advanced Biometrics</h4>
                        <p className="text-xs text-gray-500 mt-1">Recommended Certification</p>
                        <span className="inline-block mt-2 text-[10px] text-emerald-400 font-mono bg-emerald-900/20 px-2 py-1 rounded">+15% Intel</span>
                    </div>
                    <div className="relative opacity-50">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-600 border-2 border-black"></div>
                        <h4 className="text-sm font-bold text-gray-300">Team Lead: Research</h4>
                        <p className="text-xs text-gray-500 mt-1">Projected Role (Q3 2026)</p>
                    </div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-500">
                <span className="flex items-center gap-1"><Activity size={10} className="text-emerald-500" /> SYSTEM ONLINE</span>
                <span>SYNCED: NOW</span>
            </div>
        </div>
    );
};
