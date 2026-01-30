import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Thermometer, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export const HardwareStats: React.FC = () => {
    const [stats, setStats] = useState({
        cpu: 42,
        power: 88,
        temp: 36,
        signal: 99
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats({
                cpu: 40 + Math.random() * 10,
                power: 85 + Math.random() * 10,
                temp: 35 + Math.random() * 5,
                signal: 98 + Math.random() * 2
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-4 p-4 bg-black/40 backdrop-blur-md border border-blue-500/20 rounded-sm w-[180px]">
            <div className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.2em] mb-2">Hardware Status</div>

            <StatRow
                icon={<Cpu size={12} />}
                label="NEURAL-CORE"
                value={stats.cpu.toFixed(1)}
                unit="%"
                percentage={stats.cpu}
            />
            <StatRow
                icon={<Zap size={12} />}
                label="IO-LOAD"
                value={stats.power.toFixed(0)}
                unit="W"
                percentage={stats.power / 2} // Scaled for bar
            />
            <StatRow
                icon={<Thermometer size={12} />}
                label="CORE-TEMP"
                value={stats.temp.toFixed(1)}
                unit="°C"
                percentage={stats.temp * 1.5}
                color="text-orange-500"
            />
            <StatRow
                icon={<Radio size={12} />}
                label="LINK-SNR"
                value={stats.signal.toFixed(1)}
                unit="dB"
                percentage={stats.signal}
                color="text-emerald-500"
            />

            <div className="mt-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-[8px] font-mono text-white/30 truncate">
                    <span>UPTIME:</span>
                    <span className="text-white/60">12:44:02:11</span>
                </div>
            </div>
        </div>
    );
};

const StatRow = ({ icon, label, value, unit, percentage, color = "text-blue-400" }: any) => (
    <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center h-4">
            <div className={`flex items-center gap-1.5 ${color} opacity-80 shrink-0`}>
                {icon}
                <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-white/80 tabular-nums min-w-[45px] text-right">
                {value}<span className="text-[8px] opacity-40 ml-0.5">{unit}</span>
            </span>
        </div>
        <div className="h-[2px] w-full bg-white/5 overflow-hidden">
            <motion.div
                className={`h-full ${color.replace('text-', 'bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1 }}
            />
        </div>
    </div>
);
