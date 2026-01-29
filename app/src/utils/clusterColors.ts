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
};

export function getClusterColor(cluster: string): string {
    return CLUSTER_COLORS[cluster as ClusterType] ?? '#9CA3AF';
}
