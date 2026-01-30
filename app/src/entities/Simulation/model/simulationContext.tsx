import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { EventLog, UserData, ClusterMetrics, ClusterType } from '../../../types';

interface SimulationContextType {
    logs: EventLog[];
    currentUser: UserData;
    clusterMetrics: ClusterMetrics[];
    isPlaying: boolean;
    toggleSimulation: () => void;
    addExternalConnection: (source: string) => void;
    getTopicsForCluster: (cluster: string) => string[];
    getEventsForTopic: (topic: string) => { id: string; label: string; date: string }[];
    activeZone: ClusterType | null;
    setActiveZone: (zone: ClusterType | null) => void;
    simulationSpeed: number;
    setSimulationSpeed: (speed: number) => void;
    stepSimulation: () => void;
    selectableUsers: UserData[];
    switchUser: (id: string) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const INITIAL_USER: UserData = {
    id: 'User_42',
    name: 'Алекс Новиков',
    role: 'Участник',
    stats: {
        'Science': 200, 'Technology': 350, 'Economics': 150, 'Society': 100, 'Politics': 50, 'Art': 400,
        'Biology': 0, 'Psychology': 0, 'Philosophy': 0, 'Security': 0, 'Logistics': 0, 'Ecology': 0, 'Information': 0, 'Health': 0, 'Exploration': 0, 'Education': 0, 'Justice': 0, 'Communication': 0, 'Infrastructure': 0, 'Intelligence': 0, 'Ontology': 0
    },
    eventsAttended: 1, skillsUnlocked: ['Основы Сетей'], externalConnections: [],
};

const SELECTABLE_USERS_DATA: UserData[] = [
    INITIAL_USER,
    {
        id: 'User_02', name: 'Masha Rostova', role: 'Expert',
        stats: {
            'Science': 850, 'Technology': 120, 'Biology': 600, 'Ecology': 400, 'Health': 300,
            'Economics': 50, 'Society': 200, 'Politics': 100, 'Art': 50,
            'Psychology': 0, 'Philosophy': 0, 'Security': 0, 'Logistics': 0, 'Information': 0, 'Exploration': 0, 'Education': 0, 'Justice': 0, 'Communication': 0, 'Infrastructure': 0, 'Intelligence': 0, 'Ontology': 0
        } as any,
        eventsAttended: 124, skillsUnlocked: ['Биоинженерия', 'Анализ Данных'], externalConnections: ['МГУ']
    },
    {
        id: 'User_03', name: 'Иван Петров', role: 'Участник',
        stats: {
            'Economics': 700, 'Politics': 600, 'Logistics': 400, 'Infrastructure': 300,
            'Science': 100, 'Technology': 200, 'Society': 150, 'Art': 0,
            'Biology': 0, 'Psychology': 0, 'Philosophy': 0, 'Security': 0, 'Ecology': 0, 'Information': 0, 'Health': 0, 'Exploration': 0, 'Education': 0, 'Justice': 0, 'Communication': 0, 'Intelligence': 0, 'Ontology': 0
        } as any,
        eventsAttended: 45, skillsUnlocked: ['Теория Игр'], externalConnections: ['ВШЭ']
    },
    {
        id: 'User_04', name: 'Елена Соколова', role: 'Участник',
        stats: {
            'Society': 800, 'Art': 500, 'Communication': 600, 'Education': 400, 'Psychology': 350,
            'Science': 50, 'Technology': 100, 'Economics': 100, 'Politics': 150,
            'Biology': 0, 'Philosophy': 0, 'Security': 0, 'Logistics': 0, 'Ecology': 0, 'Information': 0, 'Health': 0, 'Exploration': 0, 'Justice': 0, 'Infrastructure': 0, 'Intelligence': 0, 'Ontology': 0
        } as any,
        eventsAttended: 88, skillsUnlocked: ['Ораторское искусство'], externalConnections: []
    },
    {
        id: 'User_05', name: 'Дмитрий Волков', role: 'Эксперт',
        stats: {
            'Technology': 900, 'Security': 850, 'Information': 700, 'Intelligence': 500,
            'Science': 300, 'Economics': 200, 'Politics': 100, 'Society': 50, 'Art': 20,
            'Biology': 0, 'Psychology': 0, 'Philosophy': 0, 'Logistics': 0, 'Ecology': 0, 'Health': 0, 'Exploration': 0, 'Education': 0, 'Justice': 0, 'Communication': 0, 'Infrastructure': 0, 'Ontology': 0
        } as any,
        eventsAttended: 210, skillsUnlocked: ['Кибербезопасность', 'Криптография'], externalConnections: ['Яндекс']
    }
];

export const CLUSTERS: ClusterType[] = ['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art'];
// Density mapping for reference: Science 85, Tech 45, Econ 30, Society 12, Politics 8, Art 5

export const CLUSTER_TOPICS: Record<string, string[]> = {
    'Science': ['Нейробиология', 'Квантовая Физика', 'Синтетическая Биология', 'Экология', 'Астробиология', 'Материаловедение', 'Геномика', 'Термодинамика', 'Органическая Химия', 'Когнитивная Психология'],
    'Technology': ['Искусственный Интеллект', 'Блокчейн', 'Кибербезопасность', 'Квантовые Вычисления', 'Периферийные Вычисления', 'Робототехника', 'DevSecOps', 'IoT', 'AR/VR', 'Биотехнологии'],
    'Economics': ['DeFi', 'Теория Игр', 'Венчурный Капитал', 'Циркулярная Экономика', 'Макроэкономика', 'Поведенческие Финансы', 'Управление Активами', 'Цепочки Поставок', 'Рынки Труда', 'Финтех'],
    'Society': ['Антропология', 'Урбанистика', 'EdTech', 'Этика', 'Лингвистика', 'Демография', 'Психология', 'История', 'Миграция', 'Культурология'],
    'Politics': ['Геополитика', 'Цифровой Суверенитет', 'Дипломатия', 'Legal Tech', 'Публичная Политика', 'Идеология', 'Разрешение Конфликтов', 'Госуправление', 'Активизм', 'Международное Право'],
    'Art': ['Генеративное Искусство', 'Архитектура', 'Теория Музыки', 'Кино', 'Цифровой Дизайн', 'Философия', 'Литература', 'Мода', 'Медиа-исследования', 'Перформанс']
};

const CLUSTER_EVENT_TYPES: Record<string, string[]> = {
    'Science': ['Лабораторный Эксперимент', 'Рецензирование', 'Ключевой Доклад', 'Моделирование Данных', 'Сбор Полевых Образцов'],
    'Technology': ['Код-Спринт', 'Обзор Архитектуры', 'Прототипирование', 'Оптимизация Алгоритмов', 'Аудит Техстека'],
    'Economics': ['Анализ Рынка', 'Инвест-Питч', 'Голосование Протокола', 'Экон. Симуляция', 'Ребалансировка Портфеля'],
    'Society': ['Этнографическое Исследование', 'Воркшоп по Политике', 'Аудит Соц. Воздействия', 'Встреча Сообщества', 'Работа в Архивах'],
    'Politics': ['Дипломатический Брифинг', 'Анализ Правовых Норм', 'Сессия Think Tank', 'Разработка Политики', 'Геополитический Прогноз'],
    'Art': ['Концептуальный Эскиз', 'Посещение Выставки', 'Эстетический Аудит', 'Философское Исследование', 'Медиа-Критика']
};

interface Resident {
    name: string;
    primaryCluster: ClusterType;
    secondaryCluster: ClusterType;
}

// Per-agent bias patterns - agents focus on 2 dominant clusters but participate in all 6
const RESIDENTS: Resident[] = [
    { name: 'Алекс Новиков', primaryCluster: 'Society', secondaryCluster: 'Art' },
    { name: 'Masha Rostova', primaryCluster: 'Science', secondaryCluster: 'Technology' },
    { name: 'Иван Петров', primaryCluster: 'Economics', secondaryCluster: 'Politics' },
    { name: 'Елена Соколова', primaryCluster: 'Society', secondaryCluster: 'Economics' },
    { name: 'Дмитрий Волков', primaryCluster: 'Technology', secondaryCluster: 'Science' },
];

const EVENT_CONTEXTS = [
    'Форум "Сильные идеи для нового времени"',
    'ПМЭФ',
    'Всемирный фестиваль молодежи',
    'Архипелаг 2024',
    'Технопром',
    'Открытые инновации',
    'Цифровая индустрия промышленной России',
    'Игры Будущего',
    'Битва роботов',
    'Хакатон "Цифровой прорыв"',
    'Национальная технологическая олимпиада',
    'Конгресс молодых ученых',
    'Восточный экономический форум',
    'Форум будущих технологий',
    'Атомэкспо'
];

// Observable Actions with probability weights and evidence types
interface ActionDefinition {
    action: string;
    probability: number;
    evidenceType: 'web' | 'mobile' | 'sensor' | 'platform' | 'location';
}

const OBSERVABLE_ACTIONS: ActionDefinition[] = [
    { action: 'Просмотр анонса', probability: 0.85, evidenceType: 'web' },
    { action: 'Переход ссылке', probability: 0.70, evidenceType: 'web' },
    { action: 'Добавил календарь', probability: 0.45, evidenceType: 'platform' },
    { action: 'Геовход зафиксирован', probability: 0.60, evidenceType: 'location' },
    { action: 'Регистрация скан', probability: 0.55, evidenceType: 'sensor' },
    { action: 'Фото сделано', probability: 0.35, evidenceType: 'mobile' },
    { action: 'Публикация поста', probability: 0.25, evidenceType: 'platform' },
    { action: 'Чат сообщение', probability: 0.50, evidenceType: 'platform' },
    { action: 'Участие трансляция', probability: 0.40, evidenceType: 'web' },
    { action: 'Тест пройден', probability: 0.30, evidenceType: 'platform' },
    { action: 'Материал скачан', probability: 0.55, evidenceType: 'web' },
    { action: 'Отметка выход', probability: 0.65, evidenceType: 'location' },
];

// Weighted random selection based on probability
const selectNextAction = (): ActionDefinition => {
    const totalWeight = OBSERVABLE_ACTIONS.reduce((sum, a) => sum + a.probability, 0);
    let random = Math.random() * totalWeight;
    for (const actionDef of OBSERVABLE_ACTIONS) {
        random -= actionDef.probability;
        if (random <= 0) return actionDef;
    }
    return OBSERVABLE_ACTIONS[0]; // Fallback
};

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<EventLog[]>([]);
    const [selectableUsers, setSelectableUsers] = useState<UserData[]>(SELECTABLE_USERS_DATA);
    const [activeUserId, setActiveUserId] = useState<string>(INITIAL_USER.id);
    const [isPlaying, setIsPlaying] = useState(true);
    const [clusterMetrics, setClusterMetrics] = useState<ClusterMetrics[]>([]);
    const [activeZone, setActiveZone] = useState<ClusterType | null>(null);
    const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x = 2000ms

    // Derive currentUser from selectableUsers using activeUserId
    const currentUser = selectableUsers.find(u => u.id === activeUserId) || selectableUsers[0];

    // Initialize metrics and SEED HISTORICAL DATA
    useEffect(() => {
        const initialMetrics: ClusterMetrics[] = [
            { name: 'Science', activeUnits: 850, coveragePercent: 85, roi: 2.5, anomalies: 2 },
            { name: 'Technology', activeUnits: 450, coveragePercent: 45, roi: 1.8, anomalies: 5 },
            { name: 'Economics', activeUnits: 300, coveragePercent: 30, roi: 1.5, anomalies: 1 },
            { name: 'Society', activeUnits: 120, coveragePercent: 12, roi: 0.8, anomalies: 0 },
            { name: 'Politics', activeUnits: 80, coveragePercent: 8, roi: 0.5, anomalies: 3 },
            { name: 'Art', activeUnits: 50, coveragePercent: 5, roi: 1.2, anomalies: 0 },
        ];
        setClusterMetrics(initialMetrics);

        // SEED HISTORICAL LOGS for Cognitive Drift & Rhythm
        const seedLogs: EventLog[] = [];
        const now = Date.now();
        const ONE_HOUR = 3600 * 1000;

        for (let i = 0; i < 100; i++) {
            // Random time within last 24 hours
            const timeOffset = Math.floor(Math.random() * 24 * ONE_HOUR);
            const resident = RESIDENTS[Math.floor(Math.random() * RESIDENTS.length)];
            const cluster = resident.primaryCluster; // Simplified logic for seed
            const topic = CLUSTER_TOPICS[cluster][Math.floor(Math.random() * CLUSTER_TOPICS[cluster].length)];
            const eventType = CLUSTER_EVENT_TYPES[cluster]?.[0] || 'Generic Event';
            const selectedAction = selectNextAction();

            seedLogs.push({
                id: `seed_${i}`,
                timestamp: now - timeOffset,
                userId: resident.name,
                cluster: cluster,
                zone: 'Simulated Past',
                evidenceLevel: 'Medium',
                method: 'Beacon',
                action: selectedAction.action as any,
                evidenceType: selectedAction.evidenceType,
                cognitiveLoad: Math.random() * 10,
                topic,
                eventType,
                latency: Math.floor(Math.random() * 50) + 10
            });
        }
        // Sort by timestamp (newest first)
        seedLogs.sort((a, b) => b.timestamp - a.timestamp);
        setLogs(seedLogs);

    }, []);

    const toggleSimulation = () => setIsPlaying(prev => !prev);

    const addExternalConnection = (_source: string) => {
        // ... kept same
    };

    const switchUser = (id: string) => {
        setActiveUserId(id);
    };

    const getTopicsForCluster = (cluster: string) => {
        return CLUSTER_TOPICS[cluster] || [];
    };

    const getEventsForTopic = (topic: string) => {
        // Find which cluster this topic belongs to
        const cluster = Object.keys(CLUSTER_TOPICS).find(c => CLUSTER_TOPICS[c].includes(topic)) || 'Science';
        const types = CLUSTER_EVENT_TYPES[cluster];

        return Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map((_, i) => ({
            id: `Event_${topic}_${i}`,
            label: `${types[i % types.length]}`,
            type: types[i % types.length],
            date: '2026-05-12',
            duration: '2h'
        }));
    };

    const triggerSimulationStep = () => {
        // 1. Pick a Resident
        const resident = RESIDENTS[Math.floor(Math.random() * RESIDENTS.length)];

        // 2. Weighted Cluster choice: 50% primary, 30% secondary, 20% random
        const rand = Math.random();
        let cluster: ClusterType;
        if (rand < 0.5) {
            cluster = resident.primaryCluster;
        } else if (rand < 0.8) {
            cluster = resident.secondaryCluster;
        } else {
            cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
        }

        const evidence = Math.random() > 0.8 ? 'Low' : Math.random() > 0.5 ? 'Medium' : 'High';

        // Use new Russian Contexts as "Coordinates"
        const eventContext = EVENT_CONTEXTS[Math.floor(Math.random() * EVENT_CONTEXTS.length)];
        const selectedAction = selectNextAction();

        // Generate richer data for Telemetry
        const topic = CLUSTER_TOPICS[cluster][Math.floor(Math.random() * CLUSTER_TOPICS[cluster].length)];
        const eventType = CLUSTER_EVENT_TYPES[cluster][Math.floor(Math.random() * CLUSTER_EVENT_TYPES[cluster].length)];

        const newLog: EventLog = {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            userId: resident.name,
            cluster,
            zone: eventContext, // Shows "ПМЭФ" etc. Coordinate
            evidenceLevel: evidence as 'Low' | 'Medium' | 'High',
            method: Math.random() > 0.5 ? 'NFC' : 'FaceID',
            action: selectedAction.action as any,
            evidenceType: selectedAction.evidenceType,
            cognitiveLoad: Math.random() * 10,
            topic,
            eventType,
            latency: Math.floor(Math.random() * 190) + 10 // 10ms - 200ms
        };

        setLogs(prev => [newLog, ...prev].slice(0, 200));

        // 2. Update Stats (Real-time progression)
        // 2. Update Stats (Real-time progression for ALL selectable users)
        if (evidence !== 'Low') {
            setSelectableUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user => {
                    if (user.name === newLog.userId) {
                        const boost = 1;
                        return {
                            ...user,
                            eventsAttended: user.eventsAttended + 1,
                            stats: {
                                ...user.stats,
                                [cluster]: (user.stats[cluster] || 0) + boost
                            }
                        };
                    }
                    return user;
                });

                return updatedUsers;
            });
        }

        // 3. Update Cluster Metrics
        setClusterMetrics(prev => prev.map(m => {
            if (m.name === cluster) {
                return {
                    ...m,
                    activeUnits: m.activeUnits + 1,
                    anomalies: evidence === 'Low' ? m.anomalies + 1 : m.anomalies
                };
            }
            return m;
        }));
    };

    const stepSimulation = () => triggerSimulationStep();

    // Game Loop
    useEffect(() => {
        if (!isPlaying) return;

        const baseInterval = 500; // 500ms for faster updates
        const intervalMs = baseInterval / simulationSpeed;

        const interval = setInterval(() => {
            triggerSimulationStep();
        }, intervalMs);

        return () => clearInterval(interval);
    }, [isPlaying, simulationSpeed]);

    return (
        <SimulationContext.Provider value={{
            logs,
            currentUser,
            clusterMetrics,
            isPlaying,
            toggleSimulation,
            addExternalConnection,
            getTopicsForCluster,
            getEventsForTopic,
            activeZone,
            setActiveZone,
            simulationSpeed,
            setSimulationSpeed,
            stepSimulation,
            selectableUsers,
            switchUser
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) throw new Error('useSimulation must be used within SimulationProvider');
    return context;
};
