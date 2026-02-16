import React from 'react';
import { User, Activity, Globe } from 'lucide-react';
import { TabButton } from '../shared/ui/TabButton';

interface AppHeaderProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentView, onChangeView }) => {
    return (
        <div className="flex-none h-[64px] bg-void/80 backdrop-blur-2xl border-b border-prism flex items-center justify-between px-10 z-50 relative overflow-hidden">
            {/* Scanline Overlay */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 animate-scan"></div>

            {/* Left: Brand Name */}
            <div className="flex items-center gap-4 relative z-20">
                <div className="relative">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_#3b82f6]"></div>
                    <div className="absolute inset-0 bg-blue-400 blur-sm opacity-50 animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                    <h1 className="font-orbitron font-black text-white tracking-[0.3em] text-lg uppercase leading-none">
                        ЦПК
                    </h1>
                    <span className="text-[7px] text-blue-400/50 font-mono-data tracking-[0.5em] uppercase mt-1">АДМИНИСТРАТИВНЫЙ_КОНТУР_01</span>
                </div>
            </div>

            {/* Center: Tabs */}
            <nav className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-sm border border-white/5 backdrop-blur-md relative z-20">
                <TabButton
                    active={currentView === 'admin'}
                    onClick={() => onChangeView('admin')}
                    icon={<Activity size={12} className={currentView === 'admin' ? "text-blue-400" : "text-white/20"} />}
                    label="УПРАВЛЕНИЕ"
                    layoutId="app-header-tab-bg"
                />
                <TabButton
                    active={currentView === 'user'}
                    onClick={() => onChangeView('user')}
                    icon={<User size={12} className={currentView === 'user' ? "text-blue-400" : "text-white/20"} />}
                    label="ОПЕРАТОР"
                    layoutId="app-header-tab-bg"
                />
            </nav>

            {/* Right: Network Status */}
            <div className="flex items-center gap-6 relative z-20">
                <div className="flex items-center gap-3 px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-[2px] backdrop-blur-sm">
                    <Globe size={10} className="text-white/20" />
                    <div className="flex flex-col">
                        <span className="text-[7px] font-orbitron font-black text-white/60 uppercase tracking-widest">СТАТУС_СЕТИ: НОМИНАЛЬНЫЙ</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-75" />
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                            </div>
                            <span className="text-[6px] font-mono-data text-white/20 uppercase tracking-widest">ms_latency: 14</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
    );
};
