import React from 'react';
import { calculateDNA } from '../lib/profileAnalytics';

interface ArchetypeDNAProps {
    stats: Record<string, number>;
}

export const ArchetypeDNA: React.FC<ArchetypeDNAProps> = ({ stats }) => {
    const dna = calculateDNA(stats);

    return (
        <div className="flex flex-col w-full max-w-[200px]">
            {/* Label */}
            <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Neural DNA</span>
            </div>

            {/* The Bar */}
            <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-white/5">
                {dna.map((segment) => (
                    <div
                        key={segment.cluster}
                        style={{
                            width: `${segment.percentage}%`,
                            backgroundColor: segment.color,
                            boxShadow: `0 0 10px ${segment.color}4d`
                        }}
                        className="h-full relative group cursor-help transition-all duration-500 hover:brightness-125"
                    >
                        {/* Tooltip on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-3 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 z-50 pointer-events-none whitespace-nowrap">
                            <span className="text-[8px] font-bold uppercase" style={{ color: segment.color }}>
                                {segment.cluster}: {segment.percentage}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend Labels for Top 3 */}
            <div className="flex justify-between mt-1">
                {dna.map((segment) => (
                    <div key={segment.cluster} className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: segment.color }}></div>
                        <span className="text-[7px] font-mono text-gray-400 uppercase">{segment.cluster.slice(0, 3)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
