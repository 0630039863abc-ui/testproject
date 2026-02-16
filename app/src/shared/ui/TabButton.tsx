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
            "relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg transition-colors duration-150 text-[13px] font-semibold tracking-wide",
            active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
        )}
    >
        {active && (
            <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-white/[0.08] rounded-lg border border-white/[0.06]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
        )}
        <span className="relative z-10">{icon}</span>
        <span className="relative z-10">{label}</span>
    </button>
);
