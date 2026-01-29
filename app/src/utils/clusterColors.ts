import type { ClusterType } from '../types';

/**
 * Centralized cluster color mapping
 * Used across PersonalKnowledgeGraph, TelemetryStream, VenueScene
 */
export const CLUSTER_COLORS: Record<ClusterType, string> = {
    'Science': '#3B82F6',    // Blue
    'Technology': '#06B6D4', // Cyan
    'Economics': '#F59E0B',  // Amber
    'Society': '#10B981',    // Emerald
    'Politics': '#EF4444',   // Red
    'Art': '#8B5CF6',        // Purple
    // Inactive Clusters
    'Biology': '#4B5563',
    'Psychology': '#4B5563',
    'Philosophy': '#4B5563',
    'Security': '#4B5563',
    'Logistics': '#4B5563',
    'Ecology': '#4B5563',
    'Information': '#4B5563',
    'Health': '#4B5563',
    'Exploration': '#4B5563',
    'Education': '#4B5563',
    'Justice': '#4B5563',
    'Communication': '#4B5563',
    'Infrastructure': '#4B5563',
    'Intelligence': '#4B5563',
    'Ontology': '#4B5563',
};

export function getClusterColor(cluster: string): string {
    return CLUSTER_COLORS[cluster as ClusterType] ?? '#9CA3AF';
}
