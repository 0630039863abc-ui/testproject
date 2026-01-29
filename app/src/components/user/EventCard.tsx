import React from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventCardProps {
    event: {
        id: string;
        title: string;
        type: string;
        time: string;
        date: string;
        description?: string;
    } | null;
    onClose: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClose }) => {
    return (
        <AnimatePresence>
            {event && (
                <motion.div
                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute top-24 left-8 z-[100] w-72 overflow-hidden bg-[#050505]/90 backdrop-blur-md border-l-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)' }}
                >
                    {/* Technical Grid Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}>
                    </div>

                    <div className="p-5 relative">
                        {/* Header Actions */}
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest border border-blue-500/30 px-2 py-0.5 rounded-sm bg-blue-500/10">
                                lnk :: {event.type}
                            </span>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight tracking-tight font-sans">
                            {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[11px] text-gray-400 mb-5 leading-relaxed font-mono border-l border-white/10 pl-3">
                            {event.description || "Data packet verified. Encryption level: Standard. Subject matter requires cognitive engagement."}
                        </p>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] font-mono text-gray-300 mb-5">
                            <div className="flex items-center gap-2">
                                <Calendar size={10} className="text-blue-500" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={10} className="text-blue-500" />
                                <span>{event.time}</span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2 text-gray-400">
                                <MapPin size={10} className="text-blue-500" />
                                <span className="truncate">Sector 7G, Neuro-Lab 04</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group">
                            <span>Initialize</span>
                            <div className="w-1 h-1 bg-white rounded-full group-hover:animate-ping"></div>
                        </button>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500/20 clip-path-triangle"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
