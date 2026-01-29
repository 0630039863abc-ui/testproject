import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Clock, CheckCircle } from 'lucide-react';

const generateHash = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash << 5) - hash + id.charCodeAt(i);
        hash |= 0;
    }
    return '0x' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
};

export const ExperienceFeed: React.FC = () => {
    const { logs } = useSimulation();
    // Filter logs for User_42 only to build "Personal Ledger"
    const userLogs = logs.filter(l => l.userId === 'User_42');

    return (
        <div className="w-full h-full flex flex-col glass-panel rounded-2xl overflow-hidden relative">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" />
                    Experience Ledger
                </h3>
                <span className="text-xs font-mono text-gray-500">BLOCK_HEIGHT: {logs.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide space-y-1">
                <AnimatePresence initial={false}>
                    {userLogs.length === 0 ? (
                        <div className="text-center p-8 text-gray-600 italic">No verified events recorded yet.</div>
                    ) : (
                        userLogs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group flex items-center justify-between p-3 rounded hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-crosshair"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-blue-500/10 text-blue-400 font-mono text-xs">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-medium">{log.cluster} Interaction</div>
                                        <div className="text-gray-500 text-xs font-mono flex items-center gap-1">
                                            <Hash size={10} />
                                            {generateHash(log.id)} • Zone: {log.zone.split('_').pop()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <span className="block text-emerald-400 text-xs font-bold">+15 XP</span>
                                        <span className="block text-gray-600 text-[10px] uppercase">{log.method}</span>
                                    </div>
                                    <CheckCircle size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Footer / Gradient fade */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>
    );
};
