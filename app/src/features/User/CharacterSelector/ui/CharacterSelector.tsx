import React from 'react';
import { useSimulation } from '../../../../entities/Simulation/model/simulationContext';
import { Users } from 'lucide-react';

interface CharacterSelectorProps {
    themeColor: string;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ themeColor }) => {
    const { selectableUsers, currentUser, switchUser } = useSimulation();

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-2 px-1">
                <Users size={12} style={{ color: themeColor }} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Агенты</span>
            </div>

            {/* Neural Roster (Connected Network) */}
            <div className="relative w-full min-h-[60px] h-auto bg-black/20 rounded-lg border border-white/5 overflow-hidden group/roster transition-all duration-300">
                <div className="absolute inset-0 bg-hex-pattern opacity-10 pointer-events-none" />

                {/* Connection Lines (SVG) - Adaptive */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path d="M40,20 L120,40 L200,20 L280,40" stroke="url(#lineGrad)" strokeWidth="1" fill="none" className="animate-pulse" />
                    <path d="M40,60 L120,40 L200,60 L280,40" stroke="url(#lineGrad)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
                </svg>

                <div className="grid grid-cols-4 gap-4 p-4 relative z-10">
                    {selectableUsers.map((user, idx) => {
                        const isActive = currentUser.id === user.id;
                        // Stagger animation for nodes
                        const delay = idx * 0.1;

                        return (
                            <button
                                key={user.id}
                                onClick={() => switchUser(user.id)}
                                className={`
                                     relative flex flex-col items-center justify-center gap-2 transition-all duration-500 group/node
                                     ${isActive ? 'scale-110' : 'scale-100 hover:scale-105 opacity-60 hover:opacity-100'}
                                 `}
                                style={{ animationDelay: `${delay}s` }}
                            >
                                {/* Node Visual */}
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center relative
                                    ${isActive ? 'bg-blue-500/20 shadow-[0_0_15px_#3b82f6] border border-blue-400' : 'bg-white/5 border border-white/10 hover:border-white/30'}
                                    transition-all duration-300
                                `}>
                                    {/* Rotating Ring for Active */}
                                    {isActive && (
                                        <div className="absolute inset-[-4px] rounded-full border border-blue-500/30 border-t-transparent animate-spin" />
                                    )}

                                    {/* Inner Core */}
                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'}`} />

                                    {/* Initials Overlay */}
                                    <span className={`absolute text-[10px] font-black ${isActive ? 'text-white' : 'text-transparent group-hover/node:text-white/50'}`}>
                                        {user.name.charAt(0)}
                                    </span>
                                </div>

                                {/* Label */}
                                <span className={`
                                    text-[7px] font-mono tracking-widest uppercase transition-colors
                                    ${isActive ? 'text-blue-400 font-bold' : 'text-gray-500 group-hover/node:text-gray-300'}
                                `}>
                                    {user.name.split(' ')[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
