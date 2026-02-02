import type { UserData, EventLog, ClusterMetrics } from '../../../types';

export type InsightTag = {
    id: string;
    label: string;
    description: string; // Internal description for debugging/tooltip
    color: string; // Tailwind color class or hex
};

export const generateInsights = (
    user: UserData,
    logs: EventLog[],
    metrics: ClusterMetrics[]
): InsightTag[] => {
    const insights: InsightTag[] = [];
    if (!user || logs.length === 0) return insights;

    const userLogs = logs.filter(l => l.userId === user.name); // Using name as ID based on context, or user.id if logs had it
    // Note: simulationContext uses user.name in logs, so we filter by that.

    if (userLogs.length === 0) return [{ id: 'new', label: 'НОВЫЙ СУБЪЕКТ', description: 'No data yet', color: 'text-white/50' }];

    // Stats Calculation
    const totalEvents = userLogs.length;
    const clusterCounts: Record<string, number> = {};
    const clusterLoad: Record<string, number> = {};

    userLogs.forEach(l => {
        clusterCounts[l.cluster] = (clusterCounts[l.cluster] || 0) + 1;
        clusterLoad[l.cluster] = (clusterLoad[l.cluster] || 0) + (l.cognitiveLoad || 0);
    });

    const dominantCluster = Object.entries(clusterCounts).sort((a, b) => b[1] - a[1])[0];
    const dominantShare = dominantCluster ? dominantCluster[1] / totalEvents : 0;

    // 1. The Connector: High social activity across 3+ clusters
    const activeClusters = Object.keys(clusterCounts).filter(k => clusterCounts[k] > totalEvents * 0.15); // >15% in a cluster to count
    if (activeClusters.length >= 3) {
        insights.push({ id: 'connector', label: 'СВЯЗНОЙ КООРДИНАТОР', description: 'Active in 3+ clusters', color: 'text-pink-400' });
    }

    // 2. Academic Purist: >80% events in Science
    if (dominantCluster && dominantCluster[0] === 'Science' && dominantShare > 0.8) {
        insights.push({ id: 'purist', label: 'НАУЧНЫЙ СОТРУДНИК', description: '>80% Science', color: 'text-cyan-400' });
    }

    // 3. Political Strategist: Focus on Politics
    if (dominantCluster && dominantCluster[0] === 'Politics' && dominantShare > 0.4) {
        insights.push({ id: 'strategist', label: 'ПОЛИТИЧЕСКИЙ ТЕХНОЛОГ', description: 'High Politics activity', color: 'text-red-400' });
    }

    // 4. Tech Evangelist: Focus on Technology
    if (dominantCluster && dominantCluster[0] === 'Technology' && dominantShare > 0.5) {
        insights.push({ id: 'evangelist', label: 'ТЕХНИЧЕСКИЙ ЭКСПЕРТ', description: 'High Technology activity', color: 'text-blue-400' });
    }

    // 5. Capital Allocator: Focus on Economics
    if (dominantCluster && dominantCluster[0] === 'Economics' && dominantShare > 0.5) {
        insights.push({ id: 'allocator', label: 'ЭКОНОМИЧЕСКИЙ АГЕНТ', description: 'High Economics activity', color: 'text-yellow-400' });
    }

    // 6. Cultural Architect: Art + Society > 50%
    const artCount = clusterCounts['Art'] || 0;
    const societyCount = clusterCounts['Society'] || 0;
    if ((artCount + societyCount) / totalEvents > 0.5) {
        insights.push({ id: 'architect', label: 'КУЛЬТУРНЫЙ ДЕЯТЕЛЬ', description: 'Dominant Art/Society', color: 'text-purple-400' });
    }

    // 7. Observer: Low interaction (Low evidence)
    const lowEvidenceCount = userLogs.filter(l => l.evidenceLevel === 'Low').length;
    if (lowEvidenceCount / totalEvents > 0.6) {
        insights.push({ id: 'observer', label: 'НАБЛЮДАТЕЛЬ', description: 'High Low-Evidence events', color: 'text-gray-400' });
    }

    // 8. Instigator: High cognitive load
    const highLoadCount = userLogs.filter(l => (l.cognitiveLoad || 0) > 7).length;
    if (highLoadCount / totalEvents > 0.3) {
        insights.push({ id: 'instigator', label: 'ИНИЦИАТОР АКТИВНОСТИ', description: 'Frequent high cognitive load', color: 'text-orange-500' });
    }

    // 9. Nomad: No dominant cluster (<30%)
    if (dominantShare < 0.3) {
        insights.push({ id: 'nomad', label: 'МОБИЛЬНЫЙ СУБЪЕКТ', description: 'No dominant cluster', color: 'text-emerald-300' });
    }

    // 10. Specialist: >90% in one cluster (stricter than Purist)
    if (dominantShare > 0.9) {
        insights.push({ id: 'specialist', label: 'ПРОФИЛЬНЫЙ СПЕЦИАЛИСТ', description: '>90% single cluster', color: 'text-indigo-400' });
    }

    // 11. Gossip Node: Low latency events
    const fastEvents = userLogs.filter(l => (l.latency || 0) < 30).length;
    if (fastEvents / totalEvents > 0.4) {
        insights.push({ id: 'gossip', label: 'УЗЕЛ РАСПРОСТРАНЕНИЯ', description: 'High frequency low latency', color: 'text-yellow-200' });
    }

    // 12. Deep Diver: High latency
    const slowEvents = userLogs.filter(l => (l.latency || 0) > 100).length;
    if (slowEvents / totalEvents > 0.4) {
        insights.push({ id: 'deep_diver', label: 'ЭКСПЕРТ-АНАЛИТИК', description: 'High latency interactions', color: 'text-blue-800' });
    }

    // 13. Trend Follower: Enters clusters when activity is high
    // We compare log cluster to current metrics (approximation, ideally we'd need historical metrics)
    let trendScore = 0;
    userLogs.slice(0, 20).forEach(l => {
        const m = metrics.find(m => m.name === l.cluster);
        if (m && m.activeUnits > 500) trendScore++;
    });
    if (trendScore > 10) {
        insights.push({ id: 'trend', label: 'УЧАСТНИК ТРЕНДОВ', description: 'Follows high activity', color: 'text-green-400' });
    }

    // 14. Contrarian: Enters clusters when activity is low
    let contrarianScore = 0;
    userLogs.slice(0, 20).forEach(l => {
        const m = metrics.find(m => m.name === l.cluster);
        if (m && m.activeUnits < 300) contrarianScore++;
    });
    if (contrarianScore > 10) {
        insights.push({ id: 'contrarian', label: 'НЕЗАВИСИМЫЙ ОЦЕНЩИК', description: 'Seeks low activity zones', color: 'text-rose-400' });
    }

    // 15. System Ghost: Very low footprint
    if (lowEvidenceCount / totalEvents > 0.8 && slowEvents > 0) {
        insights.push({ id: 'ghost', label: 'СКРЫТЫЙ ПРОФИЛЬ', description: 'Minimal trace', color: 'text-white/10' });
    }

    return insights.slice(0, 4); // Return top 4 insights to avoid UI clutter
};
