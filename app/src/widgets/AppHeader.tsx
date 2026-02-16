import React from 'react';
import { User, Activity } from 'lucide-react';
import { TabButton } from '../shared/ui/TabButton';

interface AppHeaderProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentView, onChangeView }) => {
    return (
        <div className="flex-none h-12 flex items-center justify-between px-6 z-50 border-b border-white/[0.06]">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
                <h1 className="font-semibold text-zinc-100 tracking-wide text-base">
                    ЦПК
                </h1>
                <span className="text-[11px] text-zinc-500 font-medium tracking-wider uppercase hidden sm:inline">
                    Панель управления
                </span>
            </div>

            {/* Center: Tabs */}
            <nav className="flex items-center gap-1 bg-white/[0.03] px-1.5 py-1.5 rounded-xl border border-white/[0.06]">
                <TabButton
                    active={currentView === 'admin'}
                    onClick={() => onChangeView('admin')}
                    icon={<Activity size={15} className={currentView === 'admin' ? "text-zinc-100" : "text-zinc-500"} />}
                    label="Управление"
                    layoutId="app-header-tab-bg"
                />
                <TabButton
                    active={currentView === 'user'}
                    onClick={() => onChangeView('user')}
                    icon={<User size={15} className={currentView === 'user' ? "text-zinc-100" : "text-zinc-500"} />}
                    label="Профиль"
                    layoutId="app-header-tab-bg"
                />
            </nav>

            {/* Right: Status */}
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[11px] text-zinc-500 font-medium">Онлайн</span>
            </div>
        </div>
    );
};
