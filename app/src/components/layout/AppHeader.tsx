import React from 'react';
import { Layers, User, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface AppHeaderProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentView, onChangeView }) => {
    return (
        <div className="absolute top-0 left-0 right-0 h-[60px] bg-[#0A0A0B]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 z-50">
            {/* Left: Brand Name */}
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
                <h1 className="font-mono font-black text-white tracking-[0.15em] text-xl uppercase">
                    ЦПК
                </h1>
            </div>

            {/* Center: Tabs */}
            <nav className="flex items-center gap-1 bg-black/30 px-2 py-1.5 rounded-full border border-white/5">
                <TabButton
                    active={currentView === 'physical'}
                    onClick={() => onChangeView('physical')}
                    icon={<Layers size={14} />}
                    label="Physical"
                />
                <TabButton
                    active={currentView === 'user'}
                    onClick={() => onChangeView('user')}
                    icon={<User size={14} />}
                    label="Profile"
                />
                <TabButton
                    active={currentView === 'admin'}
                    onClick={() => onChangeView('admin')}
                    icon={<Activity size={14} />}
                    label="Region"
                />
            </nav>

            {/* Right: Empty for now, can add system info later */}
            <div className="w-[100px]"></div>
        </div>
    );
};

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={clsx(
            "group relative flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-[11px] font-mono font-bold tracking-[0.1em] uppercase",
            active ? "text-white" : "text-white/40 hover:text-white"
        )}
    >
        {active && (
            <motion.div
                layoutId="app-header-tab-bg"
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
