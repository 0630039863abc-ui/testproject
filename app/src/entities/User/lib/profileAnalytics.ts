import { CLUSTER_COLORS } from '../../../shared/lib/tokens';
import type { EventLog } from '../../../types';

export interface DNASegment {
    cluster: string;
    percentage: number;
    color: string;
}

export const calculateDNA = (stats: Record<string, number>): DNASegment[] => {
    const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;

    // Sort by value descending
    const sorted = Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3); // Top 3

    return sorted.map(([cluster, value]) => ({
        cluster,
        percentage: Math.round((value / total) * 100),
        color: CLUSTER_COLORS[cluster as keyof typeof CLUSTER_COLORS] || '#ffffff'
    }));
};

export const calculateEngagement = (logs: EventLog[]) => {
    const actionCounts = logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Simple heuristic based on observable actions
    const participation = (actionCounts['Геовход зафиксирован'] || 0) + (actionCounts['Регистрация скан'] || 0) + (actionCounts['Отметка выход'] || 0);
    const active = (actionCounts['Тест пройден'] || 0) + (actionCounts['Публикация поста'] || 0) + (actionCounts['Чат сообщение'] || 0);
    const passive = (actionCounts['Просмотр анонса'] || 0) + (actionCounts['Переход ссылке'] || 0) + (actionCounts['Материал скачан'] || 0);

    let dominantStyle = 'Balanced';
    if (passive > participation && passive > active) dominantStyle = 'Observer';
    else if (participation > passive && participation > active) dominantStyle = 'Operator';
    else if (active > participation && active > passive) dominantStyle = 'Vanguard';

    return { dominantStyle };
};
