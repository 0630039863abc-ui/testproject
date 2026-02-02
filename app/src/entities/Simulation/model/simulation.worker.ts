/* eslint-disable no-restricted-globals */
import type { EventLog, ClusterType, ClusterMetrics, UserData, ObservableAction, EvidenceType, GraphEdge } from '../../../types';

// Redefine constants locally to avoid import issues in Worker context if bundler is strict
const CLUSTERS: ClusterType[] = ['Science', 'Technology', 'Economics', 'Society', 'Politics', 'Art', 'Health'];
const EVENT_CONTEXTS = [
    'ПМЭФ-2026', 'Бизнес-инкубатор', 'Креативный кластер', 'Технопарк', 'Умный Квартал',
    'Био-лаборатория', 'Цифровая Арена', 'Центр Урбанистики', 'Кибер-кафе'
];

const CLUSTER_TOPICS: Record<string, string[]> = {
    'Science': ['Квантовые вычисления', 'Генетическая терапия', 'Космическая логистика', 'Нейроинтерфейсы'],
    'Technology': ['Когнитивные Технологии', 'Блокчейн-сети', 'Робототехника', 'Зеленая Энергетика'],
    'Economics': ['Цифровые валюты', 'Цикличная экономика', 'Токенизация активов', 'Алгоритмический трейдинг'],
    'Society': ['Цифровая демократия', 'Инклюзивность', 'Социальный капитал', 'Новое образование', 'Патриотика'],
    'Politics': ['Кибербезопасность', 'Глобальное управление', 'Регулирование ИИ', 'Сетевой суверенитет'],
    'Art': ['NFT-галереи', 'Алгоритмическое искусство', 'Виртуальная мода', 'Интерактивные медиа'],
    'Health': ['Персонализированная медицина', 'Биохакинг', 'Долголетие', 'Спорт']
};

const CLUSTER_EVENT_TYPES: Record<string, string[]> = {
    'Science': ['Симпозиум', 'Воркшоп', 'Лекция', 'Хакатон', 'Панель'],
    'Technology': ['Демо-день', 'Кодинг-сессия', 'Запуск продукта', 'Конференция', 'Митап'],
    'Economics': ['Форум', 'Страт-сессия', 'Инвест-питч', 'Круглый стол', 'Аукцион'],
    'Society': ['Арт-бранч', 'Дискуссия', 'Фестиваль', 'Выставка', 'Перформанс'],
    'Politics': ['Дебаты', 'Саммит', 'Брифинг', 'Конгресс', 'Семинар'],
    'Art': ['Вернисаж', 'Показ', 'Инсталляция', 'Концерт', 'Рейв'],
    'Health': ['Тренировка', 'Чек-ап', 'Медитация', 'Марафон', 'Реабилитация']
};

// --- State ---
let logs: EventLog[] = [];
let users: UserData[] = [];
let metrics: ClusterMetrics[] = [];
let isRunning = false;
let simulationSpeed = 1;
let intervalId: ReturnType<typeof setInterval> | null = null;

// --- Logic ---

const selectNextAction = () => {
    const actions: Array<{ action: ObservableAction; evidenceType: EvidenceType }> = [
        { action: 'Просмотр анонса', evidenceType: 'mobile' },
        { action: 'Переход ссылке', evidenceType: 'web' },
        { action: 'Геовход зафиксирован', evidenceType: 'sensor' },
        { action: 'Регистрация скан', evidenceType: 'platform' },
        { action: 'Фото сделано', evidenceType: 'mobile' },
    ];
    return actions[Math.floor(Math.random() * actions.length)];
};

// --- Graph Logic ---
interface ConnectionMap {
    [key: string]: number; // "Science-Technology": 5
}

let connectionMap: ConnectionMap = {};
const CONNECTION_DECAY = 0.99; // Fade old connections

const updateGraph = (userUpdates: { userId: string, oldCluster: ClusterType, newCluster: ClusterType }[]) => {
    // 1. Trace Connections
    userUpdates.forEach(({ oldCluster, newCluster }) => {
        if (oldCluster === newCluster) return;

        // Sort to ensure undirected graph consistency
        const key = [oldCluster, newCluster].sort().join('-');
        connectionMap[key] = (connectionMap[key] || 0) + 1;
    });

    // 2. Decay & Prune Connections
    const edges: GraphEdge[] = [];
    for (const key in connectionMap) {
        connectionMap[key] *= CONNECTION_DECAY;
        if (connectionMap[key] < 0.1) {
            delete connectionMap[key];
            continue;
        }

        const [source, target] = key.split('-') as [ClusterType, ClusterType];
        // Normalize weight roughly 0-1 for visualization
        const weight = Math.min(connectionMap[key] / 5, 1);
        edges.push({ source, target, weight });
    }

    // 3. Find Influencers (Simple Centrality: count of visited clusters + high event count)
    // For this demo, we'll just pick top 3 users by events attended who have visited > 2 clusters
    const influencers = users
        .filter(u => Object.keys(u.stats).filter(k => u.stats[k as ClusterType] > 0).length > 2)
        .sort((a, b) => b.eventsAttended - a.eventsAttended)
        .slice(0, 3)
        .map(u => u.name);

    return { edges, influencers };
};
// --- End Graph Logic ---

const tick = () => {
    if (!users.length) return;

    // Simulate 1-3 events per tick for high density feel
    const eventCount = Math.floor(Math.random() * 3) + 1;
    const newLogs: EventLog[] = [];

    const userUpdates: { userId: string, oldCluster: ClusterType, newCluster: ClusterType }[] = [];

    for (let i = 0; i < eventCount; i++) {
        const userIndex = Math.floor(Math.random() * users.length);
        const resident = users[userIndex];

        // Pick cluster
        const rand = Math.random();
        // @ts-ignore
        const primary = resident.stats ? Object.keys(resident.stats).reduce((a, b) => resident.stats[a] > resident.stats[b] ? a : b) : 'Science';

        let cluster: ClusterType = primary as ClusterType;
        if (rand > 0.7) cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];

        // Track movement for graph
        // For simplicity, we'll assume the 'primary' cluster is the 'old' cluster for this tick's movement
        // and the newly chosen 'cluster' is the 'new' one.
        // This simulates movement between a user's primary interest and a potentially new cluster.
        if (cluster !== primary) {
            userUpdates.push({ userId: resident.name, oldCluster: primary as ClusterType, newCluster: cluster });
        }

        const evidence = Math.random() > 0.8 ? 'Low' : Math.random() > 0.5 ? 'Medium' : 'High';
        const eventContext = EVENT_CONTEXTS[Math.floor(Math.random() * EVENT_CONTEXTS.length)];
        const nextAction = selectNextAction();
        const topic = CLUSTER_TOPICS[cluster][Math.floor(Math.random() * CLUSTER_TOPICS[cluster].length)];
        const eventType = CLUSTER_EVENT_TYPES[cluster][Math.floor(Math.random() * CLUSTER_EVENT_TYPES[cluster].length)];

        const newLog: EventLog = {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            userId: resident.name,
            cluster,
            zone: eventContext,
            evidenceLevel: evidence as any,
            method: 'NFC',
            action: nextAction.action,
            evidenceType: nextAction.evidenceType,
            cognitiveLoad: Math.random() * 10,
            topic,
            eventType,
            latency: Math.floor(Math.random() * 190) + 10
        };

        newLogs.push(newLog);

        // Update User Stats
        if (evidence !== 'Low') {
            users[userIndex] = {
                ...resident,
                eventsAttended: resident.eventsAttended + 1,
                stats: {
                    ...resident.stats,
                    [cluster]: (resident.stats[cluster] || 0) + 1
                }
            };
        }

        // Update Metrics
        const mIndex = metrics.findIndex(m => m.name === cluster);
        if (mIndex !== -1) {
            metrics[mIndex] = {
                ...metrics[mIndex],
                activeUnits: metrics[mIndex].activeUnits + 1,
                anomalies: evidence === 'Low' ? metrics[mIndex].anomalies + 1 : metrics[mIndex].anomalies
            };
        }
    }

    logs = [...newLogs, ...logs].slice(0, 500); // Keep last 500

    // Calculate Graph
    const graphStats = updateGraph(userUpdates);

    // Send update
    self.postMessage({ type: 'UPDATE', payload: { logs, users, metrics, graphStats } });
};

// --- Handlers ---

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'INIT':
            users = payload.users;
            metrics = payload.metrics;
            logs = payload.logs;
            // Immediate tick
            tick();
            break;
        case 'START':
            if (isRunning) return;
            isRunning = true;
            intervalId = setInterval(tick, 1000 / simulationSpeed);
            break;
        case 'STOP':
            isRunning = false;
            if (intervalId) clearInterval(intervalId);
            break;
        case 'SET_SPEED':
            simulationSpeed = payload;
            if (isRunning) {
                if (intervalId) clearInterval(intervalId);
                intervalId = setInterval(tick, 1000 / simulationSpeed);
            }
            break;
        case 'STEP':
            tick();
            break;
    }
};
