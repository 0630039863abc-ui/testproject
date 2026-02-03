import React from 'react';
import { useSimulation } from '../../Simulation/model/simulationContext';
import { Shield, Share2, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroProfile: React.FC = () => {
    const { currentUser, addExternalConnection } = useSimulation();

    const progressPercent = (currentUser.eventsAttended / 236) * 100;

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">42</span>
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">{currentUser.name}</h1>
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                        <Shield size={14} />
                        <span>{currentUser.role}</span>
                        <span className="text-gray-500">•</span>
                        <span>{currentUser.age} {((n) => {
                            if (n % 10 === 1 && n % 100 !== 11) return 'год';
                            if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'года';
                            return 'лет';
                        })(currentUser.age)}</span>
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400 text-sm font-mono uppercase">Event Coverage</span>
                    <span className="text-2xl font-bold text-white">
                        {currentUser.eventsAttended} <span className="text-gray-500 text-lg">/ 236</span>
                    </span>
                </div>

                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* External Data */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Share2 size={16} className="text-purple-400" />
                    External Data Sources
                </h3>

                <div className="flex flex-wrap gap-2">
                    {currentUser.externalConnections.includes('Stepik') ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center gap-1">
                            <Zap size={12} /> Stepik Connected
                        </span>
                    ) : (
                        <button
                            onClick={() => addExternalConnection('Stepik')}
                            className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs border border-gray-700 hover:text-white hover:border-white/50 transition-colors"
                        >
                            + Connect Stepik (LMS)
                        </button>
                    )}

                    {currentUser.externalConnections.includes('MSU') ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center gap-1">
                            <Zap size={12} /> MSU Connected
                        </span>
                    ) : (
                        <button
                            onClick={() => addExternalConnection('MSU')}
                            className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs border border-gray-700 hover:text-white hover:border-white/50 transition-colors"
                        >
                            + Connect University
                        </button>
                    )}
                </div>
            </div>

            {/* Latest Achievements */}
            <div className="glass-panel p-6 rounded-2xl flex-1">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Award size={16} className="text-yellow-400" />
                    Unlocked Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                    {currentUser.skillsUnlocked.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
};
