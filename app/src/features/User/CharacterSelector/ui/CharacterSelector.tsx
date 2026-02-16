import React from 'react';
import { useSimulation } from '../../../../entities/Simulation/model/simulationContext';

interface CharacterSelectorProps {
    themeColor: string;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ themeColor }) => {
    const { selectableUsers, currentUser, switchUser } = useSimulation();

    return (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {selectableUsers.map((user) => {
                const isActive = currentUser.id === user.id;

                return (
                    <button
                        key={user.id}
                        onClick={() => switchUser(user.id)}
                        className={`
                            flex items-center gap-2 shrink-0 px-2.5 py-1.5 rounded-lg transition-all duration-300
                            ${isActive
                                ? 'bg-white/[0.08] border border-white/[0.12]'
                                : 'bg-transparent border border-transparent opacity-50 hover:opacity-80 hover:bg-white/[0.03]'
                            }
                        `}
                    >
                        {/* Node dot */}
                        <div className="relative">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300 ${
                                    isActive ? 'text-white' : 'text-white/60'
                                }`}
                                style={isActive ? {
                                    backgroundColor: `${themeColor}30`,
                                    boxShadow: `0 0 12px ${themeColor}40`,
                                    border: `1px solid ${themeColor}60`,
                                } : {
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                {user.name.charAt(0)}
                            </div>
                            {isActive && (
                                <div
                                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                    style={{ backgroundColor: themeColor }}
                                />
                            )}
                        </div>

                        {/* Name */}
                        <span className={`text-[9px] font-mono tracking-wider uppercase transition-colors ${
                            isActive ? 'text-white/80' : 'text-white/40'
                        }`}>
                            {user.name.split(' ')[0]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
