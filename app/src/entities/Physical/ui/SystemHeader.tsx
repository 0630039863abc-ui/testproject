import React, { useState, useEffect } from 'react';
import { Activity, Server, ShieldCheck, Zap } from 'lucide-react';

export const SystemHeader: React.FC = () => {
    const [uptime, setUptime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (sec: number) => {
        const h = Math.floor(sec / 3600).toString().padStart(2, '0');
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="h-[50px] w-full bg-[#0A0A0B] border-b border-white/10 flex items-center justify-between px-6 z-50 relative">
            {/* Branding */}
            <div className="flex items-center gap-4">
                <div className="font-mono font-bold text-white tracking-widest text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#34C759]"></div>
                    GATEWAY_01 // PHYSICAL_LAYER
                </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-8 h-full">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <Activity size={12} className="text-blue-500" />
                    <span>UPTIME: <span className="text-white">{formatUptime(uptime)}</span></span>
                </div>
                <div className="w-px h-4 bg-white/10"></div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <Zap size={12} className="text-yellow-500" />
                    <span>THROUGHPUT: <span className="text-white">142 eps</span></span>
                </div>
                <div className="w-px h-4 bg-white/10"></div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span>HEALTH: <span className="text-emerald-400">99.9% OPTIMAL</span></span>
                </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
                <Server size={14} className="text-gray-500" />
                <span className="text-[10px] text-gray-500 font-mono">v4.2.0-RC3</span>
            </div>
        </div>
    );
};
