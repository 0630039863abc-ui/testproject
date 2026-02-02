import type { EventLog, UserData } from '../../../types';
import { CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';

export interface NarrativeInsight {
    type: 'pulse' | 'hub' | 'deficit';
    text: string;
    level: 'info' | 'warning' | 'alert' | 'success';
}

const PULSE_TEMPLATES = {
    high: [
        "🔥 ВСПЛЕСК: Активность в кластере '{cluster}' выросла на {percent}% за последние 15 минут.",
        "⚡️ ПИК: Максимальная плотность событий зафиксирована в '{cluster}'.",
        "🚀 УСКОРЕНИЕ: Динамика роста '{cluster}' превышает все показатели системы.",
        "🔔 АНОМАЛИЯ: Нетипично высокая нагрузка на домен '{cluster}'.",
        "🔥 ЭКСПАНСИЯ: Кластер '{cluster}' стремительно расширяет свое влияние."
    ],
    medium: [
        "📈 ТРЕНД: Растущий интерес к '{cluster}' среди всех групп пользователей.",
        "🌊 ПОТОК: Наблюдается стабильный приток новых участников в '{cluster}'.",
        "💎 ФОКУС: Кластер '{cluster}' лидирует по количеству качественных взаимодействий.",
        "📈 ПРОГРЕСС: Система фиксирует устойчивое развитие в области '{cluster}'.",
        "⚖️ СТАБИЛИЗАЦИЯ: Вектор внимания зафиксирован на домене '{cluster}'."
    ],
    low: [
        "🌀 РЕЗОНАНС: Коллективный фокус системы сосредоточен на '{cluster}'.",
        "🧬 СИНТЕЗ: Обнаружена высокая междисциплинарная активность в '{cluster}'.",
        "🌘 ЗАТИШЬЕ: Динамика в '{cluster}' стабильна, без резких колебаний.",
        "📡 МОНИТОРИНГ: Кластер '{cluster}' передает штатный поток данных.",
        "⚙️ ФУНКЦИОНИРОВАНИЕ: Домен '{cluster}' работает в режиме номинальной нагрузки."
    ]
};

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateGlobalPulse = (logs: EventLog[]): NarrativeInsight | null => {
    if (logs.length < 100) return null;

    const recent = logs.slice(0, 50);
    const older = logs.slice(50, 150);

    const getCounts = (set: EventLog[]) => {
        const counts: Record<string, number> = {};
        set.forEach(l => { counts[l.cluster] = (counts[l.cluster] || 0) + 1; });
        return counts;
    };

    const recentCounts = getCounts(recent);
    const olderCounts = getCounts(older);

    let maxGrowth = 0;
    let targetCluster = '';

    Object.keys(recentCounts).forEach(cluster => {
        const rCount = recentCounts[cluster];
        const oCount = olderCounts[cluster] || 1;
        const growth = (rCount / (oCount / 2)) - 1;

        if (growth > maxGrowth) {
            maxGrowth = growth;
            targetCluster = cluster;
        }
    });

    const clusterName = CLUSTER_TRANSLATIONS[targetCluster] || targetCluster;
    const percent = Math.round(maxGrowth * 100);

    let template = "";
    let level: NarrativeInsight['level'] = "info";

    if (maxGrowth > 1.5) {
        template = getRandomItem(PULSE_TEMPLATES.high);
        level = "alert";
    } else if (maxGrowth > 0.4) {
        template = getRandomItem(PULSE_TEMPLATES.medium);
        level = "success";
    } else {
        template = getRandomItem(PULSE_TEMPLATES.low);
        level = "info";
    }

    return {
        type: 'pulse',
        text: template.replace('{cluster}', clusterName).replace('{percent}', percent.toString()),
        level
    };
};

const HUB_TEMPLATES = [
    "📍 ХАБ: Зона '{zone}' стала основным центром взаимодействия {role}.",
    "👥 СИНЕРГИЯ: В {zone} зафиксирована высокая концентрация междисциплинарных связей.",
    "🏢 ЭПИЦЕНТР: Большинство событий {cluster} сейчас происходит в {zone}.",
    "🚦 ТРАФИК: {zone} перегружена потоком {role}, рекомендуется мониторинг.",
    "🤝 КОВОРКИНГ: {zone} объединяет экспертов из смежных областей.",
    "🧪 ЛАБОРАТОРИЯ: Высокая интенсивность исследовательской деятельности в {zone}.",
    "🎓 ЛЕКТОРИЙ: Поток образовательных событий сосредоточен вокруг {zone}.",
    "🏗 ФУНДАМЕНТ: Зона {zone} обеспечивает стабильный приток данных.",
    "🌓 ТРАНЗИТ: {zone} используется в основном для перемещения между активными хабами.",
    "🌠 ПОРТАЛ: Зона {zone} открывает новые возможности для взаимодействия {role}."
];

const DEFICIT_TEMPLATES = [
    "⚠️ ДЕФИЦИТ: Зафиксировано критическое падение интереса к '{cluster}' среди {group}.",
    "🚨 РАЗРЫВ: Отсутствие активности {group} в стратегическом домене '{cluster}'.",
    "📉 ПРОСАДКА: Потенциал группы {group} в '{cluster}' не реализуется (DFT).",
    "🤔 ИГНОРИРОВАНИЕ: Группа {group} планомерно обходит стороной зону '{cluster}'.",
    "📉 ВАКУУМ: Недостаточное количество экспертных данных в кластере '{cluster}'.",
    "📉 КОГНИТИВНЫЙ ДЕФИЦИТ: Уровень сложности в '{cluster}' превышает возможности {group}.",
    "📉 ЭНТРОПИЯ: Хаотичное распределение интересов {group} создает шум в '{cluster}'.",
    "📉 СТАГНАЦИЯ: Отсутствие прогресса по компетенциям '{cluster}' у {group}.",
    "📉 ПАДЕНИЕ: Интерес к '{cluster}' снизился до критического уровня.",
    "📉 ОТСТАВАНИЕ: Скорость освоения '{cluster}' группой {group} ниже целевой."
];

export const generateHubInsight = (logs: EventLog[], users: UserData[]): NarrativeInsight | null => {
    if (logs.length < 20) return null;

    const recentLogs = logs.slice(0, 50);
    const zoneCounts: Record<string, Record<string, number>> = {};
    const clusterCounts: Record<string, number> = {};

    recentLogs.forEach(log => {
        if (!zoneCounts[log.zone]) zoneCounts[log.zone] = {};
        const user = users.find(u => u.name === log.userId);
        const role = user?.role || 'Участник';
        zoneCounts[log.zone][role] = (zoneCounts[log.zone][role] || 0) + 1;
        clusterCounts[log.cluster] = (clusterCounts[log.cluster] || 0) + 1;
    });

    let topZone = '';
    let maxExperts = 0;

    Object.keys(zoneCounts).forEach(zone => {
        const expertCount = zoneCounts[zone]['Эксперт'] || 0;
        if (expertCount > maxExperts) {
            maxExperts = expertCount;
            topZone = zone;
        }
    });

    const topCluster = Object.entries(clusterCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Science';
    const clusterName = CLUSTER_TRANSLATIONS[topCluster] || topCluster;
    const template = getRandomItem(HUB_TEMPLATES);

    if (topZone && maxExperts > 3) {
        return {
            type: 'hub',
            text: template.replace('{zone}', topZone).replace('{role}', 'Экспертов').replace('{cluster}', clusterName),
            level: 'info'
        };
    }

    const randomZone = Object.keys(zoneCounts)[0];
    if (randomZone) {
        return {
            type: 'hub',
            text: template.replace('{zone}', randomZone).replace('{role}', 'Участников').replace('{cluster}', clusterName),
            level: 'info'
        };
    }

    return null;
};

export const generateDeficitInsight = (logs: EventLog[], users: UserData[]): NarrativeInsight | null => {
    const ageGroups = [
        { label: 'ДЕТИ', min: 7, max: 12 },
        { label: 'ПОДРОСТКИ', min: 13, max: 17 },
        { label: 'МОЛОДЕЖЬ', min: 18, max: 35 },
    ];

    const userMap = users.reduce((acc, u) => {
        acc[u.name] = u.age;
        return acc;
    }, {} as Record<string, number>);

    for (const group of ageGroups) {
        const groupLogs = logs.slice(0, 100).filter(l => {
            const age = userMap[l.userId] || 0;
            return age >= group.min && age <= group.max;
        });

        if (groupLogs.length > 5) {
            const clusters = ['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art'];
            for (const cluster of clusters) {
                const clusterLogs = groupLogs.filter(l => l.cluster === cluster);
                if (clusterLogs.length === 0) {
                    const clusterName = CLUSTER_TRANSLATIONS[cluster] || cluster;
                    const template = getRandomItem(DEFICIT_TEMPLATES);
                    return {
                        type: 'deficit',
                        text: template.replace('{cluster}', clusterName).replace('{group}', group.label),
                        level: 'warning'
                    };
                }
            }
        }
    }

    return null;
};
