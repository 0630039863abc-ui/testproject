export type ClusterName =
    | 'Education' | 'Science' | 'Labor' | 'Culture' | 'Volunteering' | 'Patriotism'
    | 'Sports' | 'HealthyLifestyle' | 'Media' | 'Diplomacy' | 'Ecology' | 'Tourism';

interface Archetype {
    title: string;
    description: string;
}

export const calculateArchetype = (stats: any): Archetype => {
    // Сортируем кластеры по весу: Cast to Record<string, number> to satisfy TS
    const sorted = Object.entries(stats as Record<string, number>).sort(([, a], [, b]) => b - a);
    // Ensure we have at least one stat, otherwise default
    if (sorted.length === 0) {
        return { title: "Neophyte Observer", description: "Awaiting initial data calibration." };
    }

    const [top1] = sorted[0]; // Самый сильный кластер
    // Handle case where there is no second cluster
    const top2 = sorted.length > 1 ? sorted[1][0] : top1;

    const mapping: Record<string, Record<string, Archetype>> = {
        Science: {
            Education: { title: "Nexus Scholar", description: "Fusing fundamental research with advanced pedagogy." },
            Labor: { title: "R&D Strategist", description: "Driving economic value through scientific innovation." },
            Culture: { title: "Aesthetic Theoretical", description: "Exploring the intersections of logic and art." },
            Science: { title: "Lead Science Expert", description: "Focused on deep synthesis of scientific domains." }
        },
        Education: {
            Labor: { title: "Skills Architect", description: "Building the future workforce through active knowledge." },
            Culture: { title: "Cultural Educator", description: "Preserving heritage through modern learning systems." },
            Education: { title: "Pedagogical Lead", description: "Optimizing knowledge transmission protocols." }
        },
        Labor: {
            Patriotism: { title: "Industrial Guardian", description: "Supporting national interests through economic strength." },
            HealthyLifestyle: { title: "Human Capital Optimizer", description: "Balancing peak performance with sustainable health." },
            Labor: { title: "Economic Engineer", description: "Modeling labor flows and corporate efficiency." }
        }
    };

    // Возвращаем найденный архетип или дефолтный по самому сильному кластеру
    return mapping[top1]?.[top2] || {
        title: `Lead ${top1} Expert`,
        description: `Focused on deep domain study of ${top1}.`
    };
};

export const getDominantCluster = (stats: Record<string, number>): ClusterName => {
    const entries = Object.entries(stats);
    if (entries.length === 0) return 'Science';

    const sorted = entries.sort(([, a], [, b]) => b - a);
    return sorted[0][0] as ClusterName;
};
