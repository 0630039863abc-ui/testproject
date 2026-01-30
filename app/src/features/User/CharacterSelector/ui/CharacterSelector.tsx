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
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Simulated Agents</span>
            </div>

            {/* Agent List */}
            <div className="flex gap-1.5 relative z-10 w-full overflow-x-auto no-scrollbar">
                {selectableUsers.map((user) => {
                    const isActive = currentUser.id === user.id;
                    return (
                        <button
                            key={user.id}
                            onClick={() => switchUser(user.id)}
                            className={`
                                 flex items-center gap-2 p-1.5 pr-3 rounded-sm transition-all duration-300 relative group/agent flex-1 min-w-[80px] border
                                 ${isActive ? 'bg-white/5' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}
                             `}
                            style={{
                                borderColor: isActive ? `${themeColor}4d` : 'transparent',
                                boxShadow: isActive ? `0 0 15px ${themeColor}1a` : 'none'
                            }}
                        >
                            {/* Avatar Placeholder */}
                            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-black border border-white/10 group-hover/agent:border-white/30 transition-all flex-none">
                                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-500 group-hover/agent:text-white transition-colors">
                                    {user.name.charAt(0)}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-start gap-0.5 min-w-0">
                                <span className={`text-[10px] font-bold tracking-tight leading-none truncate w-full text-left ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                    {user.name.split(' ')[0]}
                                </span>
                                <span className="text-[8px] font-mono text-gray-600 uppercase truncate w-full text-left">
                                    {user.role}
                                </span>
                            </div>

                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: themeColor, color: themeColor }}></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
