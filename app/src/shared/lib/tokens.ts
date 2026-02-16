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

// Inactive clusters — user hasn't engaged with these yet
export const INACTIVE_CLUSTER_COLORS: Record<string, string> = {
    'Entrepreneurship': '#7C8599',
    'FinancialLiteracy': '#6B7A8D',
    'DigitalTech': '#5E7186',
    'Psychology': '#8B7A9E',
    'ArchDesign': '#7A8B8D',
    'Music': '#8D7A7A',
    'Cinema': '#7A7A8D',
    'Robotics': '#6E8599',
    'SpaceAviation': '#7A8599',
    'Agriculture': '#7A8D7A',
    'LegalCulture': '#8D8A7A',
    'FamilyTraditions': '#8D7A86',
    'LifeSafety': '#7A868D',
    'FashionStyle': '#8D7A95',
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

    // Inactive clusters
    'Entrepreneurship': 'ПРЕДПРИНИМАТЕЛЬСТВО',
    'FinancialLiteracy': 'ФИНАНСОВАЯ ГРАМОТНОСТЬ',
    'DigitalTech': 'ЦИФРОВЫЕ ТЕХНОЛОГИИ',
    'Psychology': 'ПСИХОЛОГИЯ И САМОРАЗВИТИЕ',
    'ArchDesign': 'АРХИТЕКТУРА И ДИЗАЙН',
    'Music': 'МУЗЫКА И ЗВУК',
    'Cinema': 'КИНЕМАТОГРАФ',
    'Robotics': 'РОБОТОТЕХНИКА',
    'SpaceAviation': 'КОСМОС И АВИАЦИЯ',
    'Agriculture': 'СЕЛЬСКОЕ ХОЗЯЙСТВО',
    'LegalCulture': 'ПРАВОВАЯ КУЛЬТУРА',
    'FamilyTraditions': 'СЕМЬЯ И ТРАДИЦИИ',
    'LifeSafety': 'БЕЗОПАСНОСТЬ ЖИЗНИ',
    'FashionStyle': 'МОДА И СТИЛЬ',
};

export const HUD_COLORS = {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    alert: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    background: '#09090B',
    surface: 'rgba(255,255,255,0.03)',
    surfaceHover: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.06)',
    borderHover: 'rgba(255,255,255,0.10)',
    text: {
        primary: '#f4f4f5',
        secondary: '#a1a1aa',
        muted: '#71717a',
    }
};

export const FONTS = {
    header: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace'
};

export const getClusterColor = (cluster: string): string => {
    return CLUSTER_COLORS[cluster] || '#ffffff';
};
