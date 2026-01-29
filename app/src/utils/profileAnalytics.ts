import type { EventLog } from '../types';

// --- Types ---
export interface DNAComposition {
    cluster: string;
    percentage: number;
    color: string;
}

export interface EngagementStats {
    observer: number; // VIEW
    operator: number; // REGISTER
    vanguard: number; // TEST PASS
    dominantStyle: 'Observer' | 'Operator' | 'Vanguard' | 'Balanced';
}

export interface CognitiveTrend {
    cluster: string;
    velocity: number; // Positive = Rising, Negative = Falling
}

// --- Helpers ---
const CLUSTER_COLORS: Record<string, string> = {
    // Mapping from existing clusterColors.ts or duplicating for isolation
    'Science': '#3b82f6', // blue
    'Technology': '#06b6d4', // cyan
    'Engineering': '#f59e0b', // amber
    'Mathematics': '#ec4899', // pink
    'Physics': '#8b5cf6', // violet
    'Chemistry': '#10b981', // emerald
    'Biology': '#84cc16', // lime
    'Psychology': '#e11d48', // rose
    'Philosophy': '#78716c', // stone
    'Art': '#d946ef', // fuchsia
    'History': '#d97706', // amber-600
    'Economics': '#14b8a6', // teal
    'Sociology': '#f97316', // orange
    'Politics': '#ef4444', // red
    'Law': '#64748b', // slate
    'Ethics': '#a855f7', // purple
    'Education': '#f43f5e', // rose
    'Environment': '#22c55e', // green
    'Finance': '#16a34a', // green-600
    'Medicine': '#0ea5e9', // sky
    'Media': '#8b5cf6', // violet
    // Defaults/Fallbacks
    'Society': '#f97316',
    'Logistics': '#6366f1',
    'Security': '#ef4444',
    'Information': '#06b6d4',
    'Health': '#10b981',
    'Exploration': '#0ea5e9',
    'Justice': '#64748b',
    'Communication': '#d946ef',
    'Infrastructure': '#f59e0b',
    'Intelligence': '#8b5cf6',
    'Ontology': '#78716c'
};

const getClusterColor = (cluster: string): string => CLUSTER_COLORS[cluster] || '#ffffff';

// --- Logic ---

export const calculateDNA = (stats: Record<string, number>): DNAComposition[] => {
    const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;

    // Sort by value descending
    const sorted = Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3); // Top 3

    return sorted.map(([cluster, value]) => ({
        cluster,
        percentage: Math.round((value / total) * 100),
        color: getClusterColor(cluster)
    }));
};

export const calculateEngagement = (logs: EventLog[]): EngagementStats => {
    let observer = 0;
    let operator = 0;
    let vanguard = 0;

    // Use last 50 logs for recent signature
    const recentLogs = logs.slice(0, 50);

    recentLogs.forEach(log => {
        if (log.action === 'View') observer++;
        if (log.action === 'Register' || log.action === 'Check-in') operator++;
        if (log.action === 'Test Pass') vanguard++;
    });

    const total = observer + operator + vanguard || 1;

    const stats = {
        observer: Math.round((observer / total) * 100),
        operator: Math.round((operator / total) * 100),
        vanguard: Math.round((vanguard / total) * 100)
    };

    // Determine Dominant
    let dominant: 'Observer' | 'Operator' | 'Vanguard' | 'Balanced' = 'Balanced';
    const max = Math.max(stats.observer, stats.operator, stats.vanguard);

    if (max === stats.observer && max > 33) dominant = 'Observer';
    else if (max === stats.operator && max > 33) dominant = 'Operator';
    else if (max === stats.vanguard && max > 33) dominant = 'Vanguard';

    return { ...stats, dominantStyle: dominant };
};
