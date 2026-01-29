import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useSimulation } from '../../context/SimulationContext';
import { Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 border border-blue-500/30 p-4 rounded-lg shadow-xl backdrop-blur-md max-w-xs">
                <h4 className="text-white font-bold mb-1">{label}</h4>
                <p className="text-blue-400 font-mono text-sm mb-2">Value: {payload[0].value}</p>
                <div className="border-t border-white/10 pt-2 mt-2">
                    <p className="text-gray-500 text-xs font-mono mb-1">Growth Function:</p>
                    <div className="font-mono text-xs text-emerald-400 bg-white/5 p-2 rounded">
                        Hd(t) = ∫(Σwi·Ei)dt
                    </div>
                    <p className="text-gray-600 text-[10px] mt-1 italic">
                        Integral of weighted experiential inputs over time.
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export const SkillMatrix: React.FC = () => {
    const { currentUser } = useSimulation();

    const data = [
        { subject: 'Power', A: currentUser.stats.power, fullMark: 100 },
        { subject: 'Agility', A: currentUser.stats.agility, fullMark: 100 },
        { subject: 'Intel', A: currentUser.stats.intel, fullMark: 100 },
        { subject: 'Mind', A: currentUser.stats.mind, fullMark: 100 },
        { subject: 'Spirit', A: currentUser.stats.spirit, fullMark: 100 },
    ];

    return (
        <div className="w-full h-full flex flex-col glass-panel rounded-2xl p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Info size={16} className="text-blue-400" />
            </div>

            <div className="mb-2">
                <h3 className="text-white font-bold text-lg">Competency Map</h3>
                <p className="text-gray-500 text-xs font-mono">Multi-vector analysis</p>
            </div>

            <div className="flex-1 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="User Stats"
                            dataKey="A"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            fill="#3B82F6"
                            fillOpacity={0.2}
                            isAnimationActive={true}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1 }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 border border-blue-500/10 rounded-2xl pointer-events-none" />
        </div>
    );
};
