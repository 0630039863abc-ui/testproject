import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { EventLog, ClusterType, ClusterMetrics, UserData, GraphStats } from '../../../types';
import { type NarrativeInsight, generateGlobalPulse, generateHubInsight, generateDeficitInsight } from '../lib/narrativeEngine';

export const CLUSTERS: ClusterType[] = ['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art', 'Health'];
export const EVENT_CONTEXTS = [
    'ПМЭФ-2026', 'Бизнес-инкубатор', 'Креативный кластер', 'Технопарк', 'Умный Квартал',
    'Био-лаборатория', 'Цифровая Арена', 'Центр Урбанистики', 'Кибер-кафе'
];

export const CLUSTER_TOPICS: Record<string, string[]> = {
    'Science': ['Квантовые вычисления', 'Генетическая терапия', 'Космическая логистика', 'Нейроинтерфейсы'],
    'Technology': ['Когнитивные Технологии', 'Блокчейн-сети', 'Робототехника', 'Зеленая Энергетика'],
    'Economics': ['Цифровые валюты', 'Цикличная экономика', 'Токенизация активов', 'Алгоритмический трейдинг'],
    'Society': ['Цифровая демократия', 'Инклюзивность', 'Социальный капитал', 'Новое образование', 'Патриотика', 'Воспитание', 'Волонтерство'],
    'Politics': ['Кибербезопасность', 'Глобальное управление', 'Регулирование ИИ', 'Сетевой суверенитет'],
    'Art': ['NFT-галереи', 'Алгоритмическое искусство', 'Виртуальная мода', 'Интерактивные медиа'],
    'Health': ['Персонализированная медицина', 'Биохакинг', 'Долголетие', 'Спорт']
};

export const CLUSTER_EVENT_TYPES: Record<string, string[]> = {
    'Science': ['Симпозиум', 'Воркшоп', 'Лекция', 'Хакатон', 'Панель'],
    'Technology': ['Демо-день', 'Кодинг-сессия', 'Запуск продукта', 'Конференция', 'Митап'],
    'Economics': ['Форум', 'Страт-сессия', 'Инвест-питч', 'Круглый стол', 'Аукцион'],
    'Society': ['Арт-бранч', 'Дискуссия', 'Фестиваль', 'Выставка', 'Перформанс'],
    'Politics': ['Дебаты', 'Саммит', 'Брифинг', 'Конгресс', 'Семинар'],
    'Art': ['Вернисаж', 'Показ', 'Инсталляция', 'Концерт', 'Рейв'],
    'Health': ['Тренировка', 'Чек-ап', 'Медитация', 'Марафон', 'Реабилитация']
};

export interface Resident {
    name: string;
    primaryCluster: ClusterType;
    secondaryCluster: ClusterType;
    age: number;
    role: 'Participant' | 'Expert' | 'Admin' | 'Участник' | 'Эксперт' | 'Админ';
}

export const RESIDENTS: Resident[] = [
    { name: 'Евгения Козорез', primaryCluster: 'Art', secondaryCluster: 'Society', age: 28, role: 'Эксперт' },
    { name: 'Павел Орехов', primaryCluster: 'Technology', secondaryCluster: 'Science', age: 32, role: 'Эксперт' },
    { name: 'Александр Вайно', primaryCluster: 'Politics', secondaryCluster: 'Society', age: 45, role: 'Админ' },
    { name: 'Иван Терещенко', primaryCluster: 'Science', secondaryCluster: 'Technology', age: 28, role: 'Эксперт' },
    { name: 'Анастасия Кузнецова', primaryCluster: 'Society', secondaryCluster: 'Art', age: 26, role: 'Участник' },
    { name: 'Максим Борзов', primaryCluster: 'Economics', secondaryCluster: 'Politics', age: 38, role: 'Эксперт' },
    // --- New Younger Demographics ---
    { name: 'Тимур С.', primaryCluster: 'Science', secondaryCluster: 'Education', age: 10, role: 'Участник' },
    { name: 'София Л.', primaryCluster: 'Art', secondaryCluster: 'Ecology', age: 11, role: 'Участник' },
    { name: 'Артем Д.', primaryCluster: 'Technology', secondaryCluster: 'Health', age: 15, role: 'Участник' },
    { name: 'Алиса В.', primaryCluster: 'Society', secondaryCluster: 'Art', age: 16, role: 'Участник' },
    { name: 'Глеб К.', primaryCluster: 'Politics', secondaryCluster: 'Economics', age: 17, role: 'Участник' }
];

interface SimulationContextType {
    logs: EventLog[];
    currentUser: UserData;
    activeUserId: string;
    clusterMetrics: ClusterMetrics[];
    graphStats: GraphStats | null;
    isPlaying: boolean;
    activeZone: string | null;
    simulationSpeed: number;
    selectableUsers: UserData[];
    toggleSimulation: () => void;
    addExternalConnection: (source: string) => void;
    getTopicsForCluster: (cluster: string) => string[];
    getEventsForTopic: (topic: string) => any[];
    setActiveZone: (zone: string | null) => void;
    setSimulationSpeed: (speed: number) => void;
    stepSimulation: () => void;
    switchUser: (id: string) => void;
    qualitativeInsights: NarrativeInsight[];
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);


export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<EventLog[]>([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeUserId, setActiveUserId] = useState('user_0');
    const [activeZone, setActiveZone] = useState<string | null>(null);
    const [simulationSpeed, setSimulationSpeed] = useState(1);
    const [clusterMetrics, setClusterMetrics] = useState<ClusterMetrics[]>([]);
    const [graphStats, setGraphStats] = useState<GraphStats | null>(null);

    const [selectableUsers, setSelectableUsers] = useState<UserData[]>([]);

    const currentUser = useMemo(() =>
        selectableUsers.find(u => u.id === activeUserId) || (selectableUsers[0] as UserData),
        [selectableUsers, activeUserId]);

    // Web Worker Reference
    const workerRef = React.useRef<Worker | null>(null);

    // Initialize Worker
    useEffect(() => {
        workerRef.current = new Worker(new URL('./simulation.worker.ts', import.meta.url), { type: 'module' });

        workerRef.current.onmessage = (event) => {
            const { type, payload } = event.data;
            if (type === 'UPDATE') {
                setLogs(payload.logs);
                setSelectableUsers(payload.users);
                setClusterMetrics(payload.metrics);
                if (payload.graphStats) setGraphStats(payload.graphStats);
            }
        };

        // Initialize state in worker
        const initialMetrics: ClusterMetrics[] = CLUSTERS.map(name => ({
            name: name as ClusterType,
            activeUnits: Math.floor(Math.random() * 500) + 200,
            coveragePercent: Math.floor(Math.random() * 40) + 40,
            roi: +(Math.random() * 2 + 1).toFixed(2),
            anomalies: Math.floor(Math.random() * 3)
        }));

        const seaedLogs: EventLog[] = Array.from({ length: 50 }).map((_, i) => {
            const resident = RESIDENTS[i % RESIDENTS.length];
            const cluster = CLUSTERS[i % CLUSTERS.length];
            return {
                id: `seed_${i} `,
                timestamp: Date.now() - (i * 3600000),
                userId: resident.name,
                cluster: cluster as ClusterType,
                zone: EVENT_CONTEXTS[i % EVENT_CONTEXTS.length],
                evidenceLevel: 'Medium',
                method: 'NFC',
                action: 'Геовход зафиксирован',
                evidenceType: 'sensor',
                cognitiveLoad: Math.random() * 5,
                topic: CLUSTER_TOPICS[cluster][0],
                eventType: CLUSTER_EVENT_TYPES[cluster][0],
                latency: 50
            };
        });

        // Initial Local State
        setClusterMetrics(initialMetrics);
        setLogs(seaedLogs);

        // Hydrate selectableUsers with age/stats properly before sending
        const initialUsers = RESIDENTS.map((r, i) => ({
            id: `user_${i} `,
            name: r.name,
            role: r.role,
            stats: {
                Science: r.primaryCluster === 'Science' ? 60 : 20,
                Technology: r.primaryCluster === 'Technology' ? 60 : 20,
                Economics: r.primaryCluster === 'Economics' ? 60 : 20,
                Society: r.primaryCluster === 'Society' ? 60 : 20,
                Politics: r.primaryCluster === 'Politics' ? 60 : 20,
                Art: r.primaryCluster === 'Art' ? 60 : 20,
                Health: r.primaryCluster === 'Health' ? 60 : 20,
            } as any,
            eventsAttended: Math.floor(Math.random() * 50) + 20,
            skillsUnlocked: [],
            externalConnections: i === 0 ? ['Stepik', 'MSU'] : [],
            age: r.age
        }));
        setSelectableUsers(initialUsers);

        // Send INIT to worker
        workerRef.current.postMessage({
            type: 'INIT',
            payload: {
                users: initialUsers,
                metrics: initialMetrics,
                logs: seaedLogs
            }
        });

        // Start if playing
        if (isPlaying) {
            workerRef.current.postMessage({ type: 'START' });
        }

        return () => {
            workerRef.current?.terminate();
        };
    }, []); // Run once on mount

    // Sync Play State
    useEffect(() => {
        if (workerRef.current) {
            isPlaying
                ? workerRef.current.postMessage({ type: 'START' })
                : workerRef.current.postMessage({ type: 'STOP' });
        }
    }, [isPlaying]);

    // Sync Speed
    useEffect(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'SET_SPEED', payload: simulationSpeed });
        }
    }, [simulationSpeed]);


    const toggleSimulation = useCallback(() => setIsPlaying(prev => !prev), []);
    const addExternalConnection = useCallback((_source: string) => { }, []);
    const switchUser = useCallback((id: string) => setActiveUserId(id), []);
    const getTopicsForCluster = useCallback((cluster: string) => CLUSTER_TOPICS[cluster] || [], []);
    const getEventsForTopic = useCallback((topic: string) => {
        const cluster = Object.keys(CLUSTER_TOPICS).find(c => CLUSTER_TOPICS[c].includes(topic)) || 'Science';
        const types = CLUSTER_EVENT_TYPES[cluster];
        return Array.from({ length: 3 }).map((_, i) => ({
            id: `Event_${topic}_${i} `,
            label: types[i % types.length],
            type: types[i % types.length],
            date: '2026-05-12',
            duration: '2h'
        }));
    }, []);

    // Step manually
    const stepSimulation = useCallback(() => {
        workerRef.current?.postMessage({ type: 'STEP' });
    }, []);

    const qualitativeInsights = useMemo(() => {
        const pulse = generateGlobalPulse(logs);
        const hub = generateHubInsight(logs, selectableUsers);
        const deficit = generateDeficitInsight(logs, selectableUsers);

        return [pulse, hub, deficit].filter((i): i is NarrativeInsight => i !== null);
    }, [logs, selectableUsers]);

    const contextValue = useMemo(() => ({
        logs, currentUser, activeUserId, clusterMetrics, graphStats, isPlaying, activeZone,
        simulationSpeed, selectableUsers, toggleSimulation, addExternalConnection,
        getTopicsForCluster, getEventsForTopic, setActiveZone, setSimulationSpeed,
        stepSimulation, switchUser, qualitativeInsights
    }), [
        logs, currentUser, activeUserId, clusterMetrics, graphStats, isPlaying, activeZone,
        simulationSpeed, selectableUsers, toggleSimulation, addExternalConnection,
        getTopicsForCluster, getEventsForTopic, setActiveZone, setSimulationSpeed,
        stepSimulation, switchUser, qualitativeInsights
    ]);

    return (
        <SimulationContext.Provider value={contextValue}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) throw new Error('useSimulation must be used within SimulationProvider');
    return context;
};