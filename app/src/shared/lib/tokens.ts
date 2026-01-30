export const CLUSTER_COLORS: Record<string, string> = {
    'Science': '#3b82f6',     // Blue
    'Technology': '#8b5cf6',  // Violet
    'Economics': '#eab308',   // Yellow
    'Society': '#ec4899',     // Pink
    'Politics': '#ef4444',    // Red
    'Art': '#06b6d4',         // Cyan
    'Biology': '#10b981',     // Emerald
    'Psychology': '#f97316',  // Orange
    'Philosophy': '#6366f1',  // Indigo
    'Security': '#64748b',    // Slate
    'Logistics': '#84cc16',   // Lime
    'Ecology': '#22c55e',     // Green
    'Information': '#0ea5e9', // Sky
    'Health': '#f43f5e',      // Rose
    'Exploration': '#d946ef', // Fuchsia
    'Education': '#f59e0b',   // Amber
    'Justice': '#a855f7',     // Purple
    'Communication': '#14b8a6',// Teal
    'Infrastructure': '#6b7280',// Gray
    'Intelligence': '#3b82f6',  // Blue
    'Ontology': '#ffffff'       // White
};

export const CLUSTER_TRANSLATIONS: Record<string, string> = {
    'Science': 'Наука',
    'Technology': 'Технологии',
    'Economics': 'Экономика',
    'Society': 'Общество',
    'Politics': 'Политика',
    'Art': 'Искусство',
    'Biology': 'Биология',
    'Psychology': 'Психология',
    'Philosophy': 'Философия',
    'Security': 'Безопасность',
    'Logistics': 'Логистика',
    'Ecology': 'Экология',
    'Information': 'Информатика',
    'Health': 'Здоровье',
    'Exploration': 'Исследования',
    'Education': 'Образование',
    'Justice': 'Право',
    'Communication': 'Коммуникации',
    'Infrastructure': 'Инфраструктура',
    'Intelligence': 'Интеллект',
    'Ontology': 'Онтология'
};

export const HUD_COLORS = {
    primary: '#3b82f6', // blue-500
    secondary: '#60a5fa', // blue-400
    alert: '#ef4444', // red-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // yellow-500
    background: '#020202',
    surface: '#0A0A0B',
    border: 'rgba(255, 255, 255, 0.1)',
    text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.6)',
        muted: 'rgba(255, 255, 255, 0.4)',
    }
};

export const getClusterColor = (cluster: string): string => {
    return CLUSTER_COLORS[cluster] || '#ffffff';
};
