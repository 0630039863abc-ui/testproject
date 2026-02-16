import React, { useMemo } from 'react';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { CLUSTER_TRANSLATIONS, CLUSTER_COLORS } from '../../../shared/lib/tokens';
import { Target } from 'lucide-react';
import { Widget } from '../../../shared/ui/Widget';

const AGE_GROUPS = [
    { label: '7-12', min: 7, max: 12, stage: 'Дети' },
    { label: '13-17', min: 13, max: 17, stage: 'Подростки' },
    { label: '18-35', min: 18, max: 35, stage: 'Молодёжь' },
];

export const DemographicMatrix: React.FC = () => {
    const { logs, selectableUsers } = useSimulation();

    const matrix = useMemo(() => {
        if (!selectableUsers || !logs) {
            return AGE_GROUPS.map(g => ({ group: g.label, stage: g.stage, clusters: [] as { name: string; interest: number }[] }));
        }

        const userMap = selectableUsers.reduce((acc, u) => {
            if (u) {
                if (u.id) acc[u.id.toLowerCase().trim()] = u;
                if (u.name) acc[u.name.toLowerCase().trim()] = u;
            }
            return acc;
        }, {} as Record<string, typeof selectableUsers[0]>);

        const clusters = [
            'Education', 'Science', 'Labor', 'Culture', 'Volunteering', 'Patriotism',
        ];

        return AGE_GROUPS.map(group => {
            const groupLogs = logs.filter(l => {
                if (!l.userId) return false;
                const user = userMap[l.userId.toLowerCase().trim()];
                if (!user) return false;
                const age = user.age || 0;
                return age >= group.min && age <= group.max;
            });

            return {
                group: group.label,
                stage: group.stage,
                clusters: clusters.map(cluster => {
                    const interest = groupLogs.filter(l => l.cluster === cluster).length;
                    return { name: cluster, interest };
                })
            };
        });
    }, [logs, selectableUsers]);

    const clusters = matrix[0]?.clusters || [];
    const maxVal = Math.max(...matrix.flatMap(r => r.clusters.map(c => c.interest)), 1);

    return (
        <Widget
            title="Демография"
            icon={<Target size={14} />}
            className="h-full"
            noPadding
        >
            <div className="overflow-auto h-full">
                <table className="w-full text-[11px] lg:text-[12px]">
                    <thead>
                        <tr className="border-b border-white/[0.05]">
                            <th className="text-left text-[10px] lg:text-[11px] text-zinc-500 font-medium uppercase tracking-wider px-2 lg:px-4 py-2 w-16 lg:w-20">Возраст</th>
                            {clusters.map(c => (
                                <th key={c.name} className="text-center text-[9px] lg:text-[10px] text-zinc-500 font-medium uppercase tracking-wider px-1 lg:px-2 py-2">
                                    {CLUSTER_TRANSLATIONS[c.name]?.slice(0, 4) || c.name.slice(0, 4)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map(row => (
                            <tr key={row.group} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors duration-150">
                                <td className="px-2 lg:px-4 py-2">
                                    <div className="text-[12px] lg:text-[13px] text-zinc-200 font-mono tabular-nums">{row.group}</div>
                                    <div className="text-[9px] lg:text-[10px] text-zinc-500">{row.stage}</div>
                                </td>
                                {row.clusters.map(cell => {
                                    const intensity = cell.interest / maxVal;
                                    const color = CLUSTER_COLORS[cell.name] || '#3b82f6';
                                    return (
                                        <td key={cell.name} className="text-center px-2 py-2.5">
                                            <span
                                                className="inline-flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-md font-mono text-[12px] lg:text-[13px] tabular-nums"
                                                style={{
                                                    backgroundColor: intensity > 0.1 ? `${color}10` : 'transparent',
                                                    color: intensity > 0.3 ? '#f4f4f5' : '#71717a',
                                                }}
                                            >
                                                {cell.interest || '-'}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Widget>
    );
};
