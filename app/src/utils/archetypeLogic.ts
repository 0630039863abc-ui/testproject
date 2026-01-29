export type ClusterName =
    | 'Science' | 'Technology' | 'Economics' | 'Society' | 'Politics' | 'Art'
    | 'Biology' | 'Psychology' | 'Philosophy' | 'Security' | 'Logistics'
    | 'Ecology' | 'Information' | 'Health' | 'Exploration' | 'Education'
    | 'Justice' | 'Communication' | 'Infrastructure' | 'Intelligence' | 'Ontology';

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
            Technology: { title: "System Architect", description: "Prototyping the future via fundamental synthesis." },
            Society: { title: "Ethical Futurist", description: "Investigating the human impact of scientific breakthroughs." },
            Art: { title: "Bio-Aesthetician", description: "finding beauty in complex biological structures." },
            // Self-pair fallback
            Science: { title: "Lead Science Expert", description: "Focused on deep synthesis of scientific domains." }
        },
        Technology: {
            Economics: { title: "Venture Engineer", description: "Building scalable systems with high market efficiency." },
            Politics: { title: "Digital Sovereign", description: "Designing tools for governance in a decentralized world." },
            // Self-pair fallback
            Technology: { title: "Technocrat", description: "Optimizing code and infrastructure density." }
        },
        Economics: {
            Politics: { title: "Sovereign Strategist", description: "Master of macro-economic games and geopolitical influence." },
            // Self-pair fallback
            Economics: { title: "Market Architect", description: "Modeling financial flows and incentives." }
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
