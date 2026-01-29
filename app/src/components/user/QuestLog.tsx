import React from 'react';
import { Scan, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for "Discovery Vectors"
const vectors = [
    {
        id: 'VEC_442_XO',
        name: 'Bridge The Gap',
        desc: 'Connect unconnected nodes in the knowledge graph to stabilize the neural grid.',
        impact: '+15% COHERENCE',
        logicTag: 'BRIDGE_DETECTION',
        rationale: 'High activity in Science paired with low Society weight triggers this recommendation.',
        progress: 35,
        total: 100,
        imgUrl: '/mission_bg_neural.png',
        coordinates: 'LAT: 55.75 | LONG: 37.61',
        probability: '84%',
        encryption: 'ENC::SECURE'
    },
    {
        id: 'VEC_119_SVR',
        name: 'Tech Stack Audit',
        desc: 'Review and optimize the underlying server architecture for maximum throughput.',
        impact: '+8% EFFICIENCY',
        logicTag: 'DEPTH_EXPANSION',
        rationale: 'System latency nearing critical threshold. Optimization required.',
        progress: 0,
        total: 1,
        imgUrl: '/mission_bg_server.png',
        coordinates: 'LAT: 55.79 | LONG: 37.54',
        probability: '92%',
        encryption: 'ENC::OPEN'
    }
];

export const QuestLog: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            {vectors.map((v) => (
                <div
                    key={v.id}
                    className="relative w-full bg-[#050505]/40 backdrop-blur-sm tech-border-container rounded-sm overflow-hidden group transition-all duration-500 hover:border-blue-500/50 hover:bg-[#050505]/60"
                >
                    {/* Background Image Layer - Higher Transparency */}
                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                        <img
                            src={v.imgUrl}
                            alt={v.name}
                            className="w-full h-full object-cover grayscale mix-blend-luminosity"
                        />
                        {/* Digital Scanline Overlay */}
                        <div className="absolute inset-0 bg-grain opacity-30 mix-blend-overlay"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 p-4 flex flex-col gap-3">

                        {/* Header: Logic Tag & Impact */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[8px] text-blue-400/80 tracking-widest border border-blue-500/30 px-1 py-0.5 bg-blue-500/5 rounded-[1px]">
                                    {v.logicTag}
                                </span>
                            </div>

                            {/* Competency Impact Badge */}
                            <div className="text-[9px] font-bold text-white/90 text-glow-blue">
                                {v.impact}
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-tight text-lg mb-1 group-hover:text-blue-200 transition-colors">
                                {v.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed w-[90%] font-light">
                                {v.desc}
                            </p>
                        </div>

                        {/* Rationale Block */}
                        <div className="bg-blue-900/10 border-l-2 border-blue-500/30 p-2 my-1">
                            <div className="flex items-center gap-1 mb-1">
                                <Activity size={8} className="text-blue-500" />
                                <span className="text-[8px] font-mono text-blue-400 uppercase tracking-wider">AI RATIONALE</span>
                            </div>
                            <p className="text-[9px] text-blue-200/70 italic leading-tight">
                                "{v.rationale}"
                            </p>
                        </div>

                        {/* Footer: Action & Telemetry */}
                        <div className="flex justify-between items-end border-t border-white/5 pt-3 mt-1">
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2 text-[8px] font-mono text-gray-600">
                                    <span>ID: {v.id}</span>
                                    <span className="text-blue-500/30">|</span>
                                    <span>{v.probability} PROBABILITY</span>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/20 hover:text-white transition-all rounded-[1px] group/btn box-glow-blue">
                                <Scan size={10} className="text-blue-400 group-hover/btn:text-white" />
                                <span className="text-[9px] font-bold text-blue-400 tracking-wider group-hover/btn:text-white">ANALYZE</span>
                            </button>
                        </div>
                    </div>

                    {/* Hover Decoration: Corner Accents */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            ))}
        </div>
    );
};
