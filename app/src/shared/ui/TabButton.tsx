import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    label: string;
    layoutId?: string;
}

export const TabButton: React.FC<TabButtonProps> = ({
    active,
    onClick,
    icon,
    label,
    layoutId = "tab-bg"
}) => (
    <button
        onClick={onClick}
        className={clsx(
            "group relative flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-[11px] font-mono font-bold tracking-[0.1em] uppercase",
            active ? "text-white" : "text-white/40 hover:text-white"
        )}
    >
        {active && (
            <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
        <span className="relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300">
            {icon}
        </span>
        <span className="relative z-10">{label}</span>
    </button>
);
