import React from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { Activity } from 'lucide-react';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { Widget } from '../../../shared/ui/Widget';

export const LiveOccupancy: React.FC = () => {
    const { clusterMetrics } = useSimulation();

    const sortedMetrics = [...clusterMetrics]
        .filter(c => c.activeUnits > 0)
        .sort((a, b) => b.activeUnits - a.activeUnits)
        .slice(0, 8);

    const totalActive = clusterMetrics.reduce((sum, c) => sum + c.activeUnits, 0);
    const maxUnits = Math.max(...clusterMetrics.map(c => c.activeUnits), 1);

    return (
        <Widget
            title="Активность"
            icon={<Activity size={14} />}
            className="h-full"
            actions={
                <span className="text-[11px] text-zinc-500 font-mono tabular-nums">
                    {totalActive.toLocaleString()} всего
                </span>
            }
        >
            <div className="flex items-end justify-between gap-2 h-full pb-2">
                {sortedMetrics.map((c) => {
                    const color = CLUSTER_COLORS[c.name] || '#ffffff';
                    const percentage = (c.activeUnits / maxUnits) * 100;
                    const translatedName = CLUSTER_TRANSLATIONS[c.name] || c.name;

                    return (
                        <div key={c.name} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full flex flex-col items-center justify-end h-full min-h-[80px]">
                                <div
                                    className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-90"
                                    style={{
                                        height: `${percentage}%`,
                                        backgroundColor: color,
                                        opacity: 0.7,
                                        minHeight: '4px',
                                    }}
                                />
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[11px] font-mono text-zinc-200 tabular-nums font-medium">
                                    {c.activeUnits}
                                </span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    {translatedName.slice(0, 3)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Widget>
    );
};
