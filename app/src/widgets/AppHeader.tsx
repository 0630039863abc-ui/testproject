import React from 'react';
import { Layers, User, Activity } from 'lucide-react';
import { TabButton } from '../shared/ui/TabButton';

interface AppHeaderProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentView, onChangeView }) => {
    return (
        <div className="flex-none h-[60px] bg-[#0A0A0B]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 z-50">
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
                    label="Симуляция"
                    layoutId="app-header-tab-bg"
                />
                <TabButton
                    active={currentView === 'admin'}
                    onClick={() => onChangeView('admin')}
                    icon={<Activity size={14} />}
                    label="Дашборд"
                    layoutId="app-header-tab-bg"
                />
                <TabButton
                    active={currentView === 'user'}
                    onClick={() => onChangeView('user')}
                    icon={<User size={14} />}
                    label="Профиль"
                    layoutId="app-header-tab-bg"
                />
            </nav>

            {/* Right: Empty for now, can add system info later */}
            <div className="w-[100px]"></div>
        </div>
    );
};
