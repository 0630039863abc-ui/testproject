import React from 'react';
import { clsx } from 'clsx';


interface HolocardProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    header?: React.ReactNode;
    description?: string;
    className?: string;
    contentClassName?: string;
}

export const Holocard: React.FC<HolocardProps> = ({
    children,
    title,
    header,
    description,
    className,
    contentClassName,
}) => {
    return (
        <div className={clsx(
            "relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden transition-colors duration-150 hover:bg-white/[0.04] hover:border-white/[0.10]",
            className
        )}>
            {header ? (
                <div className="px-4 py-2.5 border-b border-white/[0.05] flex justify-between items-center">
                    {header}
                </div>
            ) : title ? (
                <div className="px-4 py-2.5 border-b border-white/[0.05] flex justify-between items-center">
                    <div>
                        <h3 className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">{title}</h3>
                        {description && <p className="text-[11px] text-zinc-500 mt-0.5">{description}</p>}
                    </div>
                </div>
            ) : null}

            <div className={clsx("flex-1 min-h-0", contentClassName)}>
                {children}
            </div>
        </div>
    );
};
