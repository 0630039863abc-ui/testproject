import React from 'react';

export const XPBar: React.FC<{ current: number; max: number; level: number; themeColor?: string }> = ({ current, max, level, themeColor = '#3b82f6' }) => {
    const progress = (current / max) * 100;
    const segments = 10;
    const filledSegments = Math.floor((progress / 100) * segments);

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2 font-mono">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] animate-pulse" style={{ color: themeColor }}>●</span>
                    <span className="text-xs text-white font-bold tracking-widest uppercase">Clearance Progress</span>
                </div>
                <span className="text-[10px] text-gray-500">LVL {level} &gt;&gt; {Math.floor(progress)}%</span>
            </div>

            {/* Segmented Bar */}
            <div className="flex gap-1 h-3">
                {Array.from({ length: segments }).map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 skew-x-[-20deg] transition-all duration-500 ${i < filledSegments
                            ? ''
                            : 'bg-white/5 border border-white/10'
                            }`}
                        style={i < filledSegments ? {
                            backgroundColor: themeColor,
                            boxShadow: `0 0 10px ${themeColor}66`
                        } : {}}
                    />
                ))}
            </div>
            <div className="mt-2 text-[9px] font-mono text-gray-600 text-right uppercase tracking-tighter">
                {current} / {max} XP to next elevation
            </div>
        </div>
    );
};
