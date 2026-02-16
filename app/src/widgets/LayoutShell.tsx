import React from 'react';
import { clsx } from 'clsx';

interface LayoutShellProps {
    children: React.ReactNode;
    className?: string;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children, className }) => {
    return (
        <div className={clsx(
            "relative w-full h-screen bg-[#09090B] overflow-hidden text-white font-inter selection:bg-blue-500/30",
            className
        )}>
            <div className="relative z-[10] w-full h-full flex flex-col">
                {children}
            </div>
        </div>
    );
};
