import React from 'react';
import { clsx } from 'clsx';

interface WidgetProps {
    children: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    contentClassName?: string;
    noPadding?: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
    children,
    title,
    icon,
    actions,
    className,
    contentClassName,
    noPadding = false,
}) => {
    return (
        <div className={clsx(
            "flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] transition-colors duration-150 overflow-hidden",
            "hover:bg-white/[0.04] hover:border-white/[0.10]",
            className
        )}>
            {title && (
                <div className="flex items-center justify-between px-4 h-9 border-b border-white/[0.05] shrink-0">
                    <div className="flex items-center gap-2">
                        {icon && <span className="text-zinc-500">{icon}</span>}
                        <h3 className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">{title}</h3>
                    </div>
                    {actions && <div className="flex items-center gap-1">{actions}</div>}
                </div>
            )}
            <div className={clsx("flex-1 min-h-0", noPadding ? "" : "p-4", contentClassName)}>
                {children}
            </div>
        </div>
    );
};
