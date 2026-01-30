import React from 'react';
import type { ClusterMetrics } from '../../../types';
import { AlertTriangle, ShieldAlert, CheckCircle, Zap } from 'lucide-react';
import { CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface AnomalyEngineProps {
    metrics: ClusterMetrics | undefined;
    showAnomalies: boolean;
    onToggle: () => void;
}

const Heartbeat = ({ isCritical }: { isCritical: boolean }) => (
    <div className="h-12 w-full relative overflow-hidden opacity-80">
        <svg viewBox="0 0 200 40" className="w-full h-full preserve-3d">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <motion.path
                d="M0,20 L40,20 L45,10 L50,30 L55,20 L80,20 L85,5 L90,35 L95,20 L120,20 L125,10 L130,30 L135,20 L160,20 L165,5 L170,35 L175,20 L200,20"
                fill="none"
                stroke={isCritical ? "#ef4444" : "#3b82f6"}
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                    pathLength: 1,
                    opacity: [0.4, 1, 0.4],
                    x: [0, -100]
                }}
                transition={{
                    pathLength: { duration: 1, ease: "easeInOut" },
                    opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                    x: { repeat: Infinity, duration: 4, ease: "linear" }
                }}
            />
        </svg>
    </div>
);

export const AnomalyEngine: React.FC<AnomalyEngineProps> = ({ metrics, showAnomalies, onToggle }) => {
    const isCritical = metrics && metrics.anomalies > 5;
    const translatedName = metrics ? (CLUSTER_TRANSLATIONS[metrics.name] || metrics.name) : '';

    return (
        <div className={clsx(
            "bg-black/40 border rounded-xl overflow-hidden flex flex-col transition-all duration-500 relative font-['JetBrains_Mono',monospace]",
            showAnomalies && isCritical ? "border-red-500 animate-pulse-crimson shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "border-white/10"
        )}>
            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className={clsx(showAnomalies ? (isCritical ? "text-red-500" : "text-blue-500") : "text-gray-400")} />
                    <h3 className="text-white font-bold text-[10px] tracking-[0.2em] uppercase">Движок_Угроз</h3>
                </div>
                <button
                    onClick={onToggle}
                    className={clsx(
                        "px-3 py-1 rounded text-[8px] font-black uppercase transition-colors border",
                        showAnomalies
                            ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                            : "bg-transparent text-gray-400 border-gray-600 hover:border-white hover:text-white"
                    )}
                >
                    {showAnomalies ? "Активен" : "Ожидание"}
                </button>
            </div>

            <div className="p-4 flex-1 flex flex-col z-10 relative">
                <AnimatePresence mode="wait">
                    {showAnomalies ? (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3 flex-1"
                        >
                            <Heartbeat isCritical={!!isCritical} />

                            {metrics ? (
                                isCritical ? (
                                    <div className="p-3 bg-red-900/10 border border-red-500/30 rounded flex items-start gap-3">
                                        <AlertTriangle className="text-red-500 shrink-0 mt-1" size={16} />
                                        <div>
                                            <h4 className="text-red-400 font-bold text-[11px] uppercase tracking-wider">Предупреждение о Взломе</h4>
                                            <p className="text-red-300/50 text-[9px] mt-1 leading-relaxed">
                                                РИСК ЦЕЛОСТНОСТИ В {translatedName.toUpperCase()} ДОМЕНЕ.
                                                НЕКОГНИТИВНОЕ ПРИСУТСТВИЕ &gt; 15%.
                                            </p>
                                            <div className="mt-2 text-[10px] font-black text-red-500 flex items-center gap-1">
                                                <Zap size={10} /> {metrics.anomalies} АКТИВНЫХ УГРОЗ
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-blue-900/10 border border-blue-500/30 rounded flex items-center gap-3">
                                        <CheckCircle className="text-blue-500" size={16} />
                                        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Целостность Защищена</span>
                                    </div>
                                )
                            ) : (
                                <div className="text-gray-500 text-[9px] italic uppercase tracking-widest">Выберите региональный узел для сканирования...</div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="inactive"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center flex-1 text-gray-700 gap-2 opacity-30"
                        >
                            <ShieldAlert size={32} />
                            <span className="text-[8px] font-black tracking-[0.3em]">ДВИЖОК_ОТКЛЮЧЕН</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Scanline / HUD Noise */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        </div>
    );
};
