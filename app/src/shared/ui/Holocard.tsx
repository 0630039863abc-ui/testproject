import React from 'react';
import { clsx } from 'clsx';


interface HolocardProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    header?: React.ReactNode;
    description?: string;
    className?: string; // Container class
    contentClassName?: string;
    corners?: {
        tl?: boolean;
        tr?: boolean;
        bl?: boolean;
        br?: boolean;
    };
    gloss?: boolean; // Show internal reflection
}

export const Holocard: React.FC<HolocardProps> = ({
    children,
    title,
    header,
    description,
    className,
    contentClassName,
    corners = { tl: true, tr: true, bl: true, br: true },
    gloss = true
}) => {
    return (
        <div className={clsx("relative group flex flex-col font-inter backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300",
            gloss ? "bg-white/[0.02]" : "bg-black/40",
            className
        )}>
            {/* 1. Glass Edge Highlight */}
            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-[2]"></div>

            {/* 2. Iridescent Border Glow on Hover */}
            <div className="absolute inset-0 bg-transparent group-hover:bg-blue-500/[0.03] transition-colors duration-500 pointer-events-none z-[0]"></div>

            {/* 3. Tech Corners (SVG) */}
            {corners.tl && <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500/50 rounded-tl-sm z-[10] opacity-60"></div>}
            {corners.tr && <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500/50 rounded-tr-sm z-[10] opacity-60"></div>}
            {corners.bl && <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-500/50 rounded-bl-sm z-[10] opacity-60"></div>}
            {corners.br && <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500/50 rounded-br-sm z-[10] opacity-60"></div>}

            {/* 4. Header (Optional) */}
            {header ? (
                <div className="relative z-[5] px-4 py-3 border-b border-white/5 flex justify-between items-center bg-black/20">
                    {header}
                </div>
            ) : title ? (
                <div className="relative z-[5] px-4 py-3 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <div>
                        <h3 className="text-[11px] font-orbitron font-bold uppercase tracking-[0.15em] text-blue-100/90">{title}</h3>
                        {description && <p className="text-[10px] text-white/30 font-mono-data uppercase tracking-wider mt-0.5">{description}</p>}
                    </div>
                    {/* Status Dot */}
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse"></div>
                </div>
            ) : null}

            {/* 5. Content */}
            <div className={clsx("relative z-[5] flex-1 min-h-0", contentClassName)}>
                {children}
            </div>

            {/* 6. Scanline Overlay (Local) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[1]"></div>
        </div>
    );
};
