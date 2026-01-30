import React, { useRef } from 'react';
import { useSimulation } from '../../Simulation/model/simulationContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import clsx from 'clsx';

export const TelemetryLog: React.FC = () => {
    const { logs } = useSimulation();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Keep it compact for the overlay
    const recentLogs = logs.slice(0, 5);

    return (
        <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                <Radio size={14} className="text-green-500 animate-pulse" />
                <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-mono">
                    Live Telemetry Stream
                </h3>
            </div>

            <div
                ref={scrollRef}
                className="flex flex-col gap-1.5"
            >
                <AnimatePresence initial={false}>
                    {recentLogs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3 text-xs font-mono"
                        >
                            <span className="text-gray-500 w-[60px]">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                            </span>

                            <span className={clsx(
                                "font-bold",
                                log.userId.includes('Novikov') ? "text-yellow-500" : "text-blue-400"
                            )}>
                                {log.userId}
                            </span>

                            <span className="text-gray-400">
                                {log.action || 'Action'}
                            </span>

                            <span className="text-white/40 truncate flex-1 text-right">
                                {log.zone}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
