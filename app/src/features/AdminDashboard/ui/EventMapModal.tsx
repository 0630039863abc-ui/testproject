import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, X, Clock, Calendar } from 'lucide-react';
import { CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';

interface EventMapModalProps {
    cluster: string;
    onClose: () => void;
}

export const EventMapModal: React.FC<EventMapModalProps> = ({ cluster, onClose }) => {

    // Generate random events for this cluster
    const events = useMemo(() => {
        const count = 15;
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 80 + 10, // 10-90%
            y: Math.random() * 80 + 10, // 10-90%
            title: `${cluster} Event ${i + 1}`,
            date: '2026-05-12',
            time: '14:00'
        }));
    }, [cluster]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-8" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full h-full max-w-5xl bg-[#0F0F10] border border-white/10 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1A1A1C]">
                    <div className="flex items-center gap-3">
                        <MapPin className="text-blue-500" size={20} />
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-wide uppercase">{CLUSTER_TRANSLATIONS[cluster] || cluster} / Карта Событий</h2>
                            <p className="text-[10px] text-gray-400 font-mono tracking-widest">ОБНАРУЖЕНО РЕГИОНАЛЬНОЕ ПОКРЫТИЕ</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="text-gray-400 hover:text-white" size={20} />
                    </button>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative bg-[#050505] overflow-hidden">
                    {/* Grid Background */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    ></div>

                    {/* Events */}
                    {events.map((evt) => (
                        <motion.div
                            key={evt.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: evt.id * 0.05 }}
                            className="absolute group cursor-pointer"
                            style={{ left: `${evt.x}%`, top: `${evt.y}%` }}
                        >
                            <div className="relative">
                                {/* Pin Body */}
                                <div className="w-8 h-8 -ml-4 -mt-8 relative z-10">
                                    <MapPin
                                        size={32}
                                        className="text-blue-500 fill-blue-500/20 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform duration-200"
                                    />
                                </div>
                                {/* Ripple Effect */}
                                <div className="absolute top-0 left-0 -ml-4 -mt-4 w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>

                                {/* Tooltip */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-[#1A1A1C] border border-white/10 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                    <h4 className="text-white text-sm font-bold mb-1">{evt.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Calendar size={10} /> <span>{evt.date}</span>
                                        <Clock size={10} /> <span>{evt.time}</span>
                                    </div>
                                    <div className="mt-2 text-[10px] text-blue-400 flex items-center gap-1">
                                        <Navigation size={8} /> НАЖМИТЕ ДЛЯ НАВИГАЦИИ
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
