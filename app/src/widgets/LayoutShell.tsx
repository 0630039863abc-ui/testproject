import React from 'react';
import { clsx } from 'clsx';


interface LayoutShellProps {
    children: React.ReactNode;
    className?: string;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children, className }) => {
    return (
        <div className={clsx("relative w-full h-screen bg-void overflow-hidden text-white font-inter selection:bg-blue-500/30", className)}>
            {/* 1. Global Noise Grain */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-grain"></div>

            {/* 2. Hex Pattern Background */}
            <div className="absolute inset-0 z-[0] bg-hex-pattern opacity-[0.4] pointer-events-none"></div>

            {/* 3. Scanlines */}
            <div className="absolute inset-0 z-[100] pointer-events-none scanlines opacity-[0.05]"></div>

            {/* 4. Vignette */}
            <div className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_120%)]"></div>

            {/* 5. Content Layer */}
            <div className="relative z-[10] w-full h-full flex flex-col">
                {children}
            </div>

            {/* 6. Decoration: Corner Ticks (Global Frame) */}
            <div className="absolute top-0 left-0 w-full h-full z-[50] pointer-events-none p-4">
                <div className="w-full h-full border border-white/5 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-blue-500/30 rounded-tl-2xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-blue-500/30 rounded-tr-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-blue-500/30 rounded-bl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-blue-500/30 rounded-br-2xl"></div>
                </div>
            </div>
        </div>
    );
};
