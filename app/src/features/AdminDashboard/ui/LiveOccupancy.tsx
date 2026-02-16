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
            <div className="flex items-end gap-1.5 h-full">
                {sortedMetrics.map((c) => {
                    const color = CLUSTER_COLORS[c.name] || '#ffffff';
                    const percentage = Math.max((c.activeUnits / maxUnits) * 100, 8);
                    const translatedName = CLUSTER_TRANSLATIONS[c.name] || c.name;

                    return (
                        <div key={c.name} className="flex-1 flex flex-col items-center group" style={{ height: '100%' }}>
                            <div className="flex-1 w-full flex items-end justify-center px-0.5">
                                <div
                                    className="w-full max-w-[32px] rounded-t-md transition-all duration-300 group-hover:opacity-100"
                                    style={{
                                        height: `${percentage}%`,
                                        backgroundColor: color,
                                        opacity: 0.75,
                                    }}
                                />
                            </div>
                            <div className="flex flex-col items-center gap-0 pt-1.5 pb-1 shrink-0">
                                <span className="text-[10px] font-mono text-zinc-300 tabular-nums font-medium leading-none">
                                    {c.activeUnits}
                                </span>
                                <span className="text-[8px] text-zinc-500 uppercase tracking-wider leading-none mt-0.5">
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
