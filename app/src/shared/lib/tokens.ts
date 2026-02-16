export const CLUSTER_COLORS: Record<string, string> = {
    'Education': '#3B82F6', // Blue (Science/Knowledge)
    'HealthyLifestyle': '#10B981', // Emerald (Health/Growth)
    'Labor': '#F59E0B', // Amber (Work/Economy)
    'Culture': '#EC4899', // Pink (Art/Creativity)
    'Volunteering': '#8B5CF6', // Violet (Society/Helping)
    'Patriotism': '#EF4444', // Red (Country/Politics)
    'Science': '#06B6D4', // Cyan
    'Sports': '#F97316', // Orange
    'Media': '#6366F1', // Indigo
    'Diplomacy': '#14B8A6', // Teal
    'Ecology': '#84CC16', // Lime
    'Tourism': '#EAB308', // Yellow
};

export const CLUSTER_TRANSLATIONS: Record<string, string> = {
    'Education': 'ОБРАЗОВАНИЕ И ЗНАНИЯ',
    'HealthyLifestyle': 'ЗДОРОВЫЙ ОБРАЗ ЖИЗНИ',
    'Labor': 'ТРУД И ПРОФЕССИЯ',
    'Culture': 'КУЛЬТУРА И ИСКУССТВО',
    'Volunteering': 'ВОЛОНТЁРСТВО',
    'Patriotism': 'ПАТРИОТИЗМ',

    'Science': 'НАУКА И ТЕХНОЛОГИИ',
    'Sports': 'СПОРТ',
    'Media': 'МЕДИА И КОММУНИКАЦИИ',
    'Diplomacy': 'МЕЖДУНАРОДНЫЕ ОТНОШЕНИЯ',
    'Ecology': 'ЭКОЛОГИЯ',
    'Tourism': 'ТУРИЗМ И ПУТЕШЕСТВИЯ',
};

export const HUD_COLORS = {
    primary: '#3b82f6', // blue-500
    secondary: '#60a5fa', // blue-400
    alert: '#ef4444', // red-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // yellow-500
    background: '#020202', // Deep Void
    surface: '#0A0A0B', // Metallic Black
    border: 'rgba(59, 130, 246, 0.1)', // Subtle BlueTint
    text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        muted: 'rgba(255, 255, 255, 0.4)',
    }
};

export const FONTS = {
    header: '"Orbitron", sans-serif',
    mono: '"JetBrains Mono", monospace'
};

export const getClusterColor = (cluster: string): string => {
    return CLUSTER_COLORS[cluster] || '#ffffff';
};
