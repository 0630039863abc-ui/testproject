import React from 'react';
import { Lock, Cpu, Brain } from 'lucide-react';

export const PrivilegesBlock: React.FC = () => {
    // Mock Data for Progression
    const currentXP = 2450;
    const maxXP = 4000;
    const progress = (currentXP / maxXP) * 100;
    const segments = 20;
    const activeSegments = Math.floor((progress / 100) * segments);

    return (
        <div className="relative overflow-hidden text-left">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}>
            </div>

            {/* SECTION 1: CLEARANCE PROGRESSION */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">
                        Clearance Progression [LVL 2 <span className="text-gray-600">→</span> 3]
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400">
                        <span className="text-white">{currentXP}</span> / {maxXP} XP
                    </span>
                </div>

                {/* Segmented Progress Bar */}
                <div className="h-4 flex gap-[2px] relative">
                    {Array.from({ length: segments }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-[1px] transition-all duration-300 relative overflow-hidden ${i < activeSegments
                                ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                                : 'bg-[#1A1A1A]'
                                }`}
                        >
                            {/* Scanline FX on active segments */}
                            {i < activeSegments && (
                                <div className="absolute inset-0 bg-white/30 w-full animate-scan-fast" style={{ animationDelay: `${i * 0.05}s` }}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 2: ACTIVE NEURAL MODULES */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                        Active Neural Modules
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Module 1: Science (Active) */}
                    <div className="group relative p-3 bg-[#0A0A0A] border border-blue-900/30 rounded flex items-center gap-3 hover:border-blue-500/50 transition-colors cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 text-blue-400">
                            <Brain size={16} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-200 uppercase tracking-tight">Neuro-Link</div>
                            <div className="text-[9px] font-mono text-blue-400">+15% Analysis</div>
                        </div>
                    </div>

                    {/* Module 2: Tech (Active) */}
                    <div className="group relative p-3 bg-[#0A0A0A] border border-purple-900/30 rounded flex items-center gap-3 hover:border-purple-500/50 transition-colors cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/50 text-purple-400">
                            <Cpu size={16} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-200 uppercase tracking-tight">Dev Protocol</div>
                            <div className="text-[9px] font-mono text-purple-400">Unlock Terminal</div>
                        </div>
                    </div>

                    {/* Module 3: Storage (Locked) */}
                    <div className="p-3 bg-transparent border border-white/5 rounded flex items-center gap-3 opacity-50 grayscale">
                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
                            <Lock size={14} className="text-gray-500" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">[ENCRYPTED]</div>
                            <div className="text-[9px] font-mono text-gray-600">Lvl 3 Required</div>
                        </div>
                    </div>

                    {/* Module 4: Defense (Locked) */}
                    <div className="p-3 bg-transparent border border-white/5 rounded flex items-center gap-3 opacity-50 grayscale">
                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
                            <Lock size={14} className="text-gray-500" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">[ENCRYPTED]</div>
                            <div className="text-[9px] font-mono text-gray-600">SysAdmin Only</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
