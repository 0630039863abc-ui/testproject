/* eslint-disable no-restricted-globals */
import type { EventLog, ClusterType, ClusterMetrics, UserData, ObservableAction, EvidenceType, GraphEdge } from '../../../types';

// Redefine constants locally to avoid import issues in Worker context if bundler is strict
// Redefine constants locally to avoid import issues in Worker context if bundler is strict
const CLUSTERS: ClusterType[] = [
    'Education', 'Science', 'Labor', 'Culture', 'Volunteering', 'Patriotism',
    'Sports', 'HealthyLifestyle', 'Media', 'Diplomacy', 'Ecology', 'Tourism'
];

const EVENT_CONTEXTS = [
    'ПМЭФ-2026', 'Бизнес-инкубатор', 'Креативный кластер', 'Технопарк', 'Умный Квартал',
    'Био-лаборатория', 'Цифровая Арена', 'Центр Урбанистики', 'Кибер-кафе'
];

const CLUSTER_TOPICS: Record<string, string[]> = {
    'Education': ['Новая педагогика', 'EdTech платформы', 'Геймификация', 'Наставничество'],
    'Science': ['Квантовые вычисления', 'Космос', 'Биотех', 'Нейросети'],
    'Labor': ['Стартапы', 'Карьерный трек', 'Фриланс', 'Финансовая грамотность'],
    'Culture': ['Цифровое искусство', 'Креативные индустрии', 'Наследие', 'Дизайн'],
    'Volunteering': ['Эко-акции', 'Социальная помощь', 'Донорство', 'Зоозащита'],
    'Patriotism': ['История', 'Поисковые отряды', 'Краеведение', 'Герои нашего времени'],
    'Sports': ['Киберспорт', 'Воркаут', 'Йога', 'Марафоны'],
    'HealthyLifestyle': ['Биохакинг', 'Правильное питание', 'Ментал хелс', 'Режим дня'],
    'Media': ['Блогинг', 'Подкасты', 'Новые медиа', 'Фактчекинг'],
    'Diplomacy': ['Мягкая сила', 'Культурный обмен', 'Языкознание', 'Переговоры'],
    'Ecology': ['Переработка', 'Устойчивое развитие', 'Озеленение', 'Климат'],
    'Tourism': ['Внутренний туризм', 'Экотропы', 'Гастротуры', 'Кемпинг']
};

const CLUSTER_EVENT_TYPES: Record<string, string[]> = {
    'Education': ['Лекция', 'Семинар', 'Мастер-класс', 'Курс'],
    'Science': ['Хакатон', 'Симпозиум', 'Лабораторная', 'Открытие'],
    'Labor': ['Ярмарка вакансий', 'Питч-сессия', 'Бизнес-завтрак', 'Тренинг'],
    'Culture': ['Выставка', 'Концерт', 'Перформанс', 'Показ'],
    'Volunteering': ['Сбор', 'Акция', 'Выезд', 'Помощь'],
    'Patriotism': ['Встреча', 'Реконструкция', 'Урок мужества', 'Экскурсия'],
    'Sports': ['Турнир', 'Забег', 'Матч', 'Тренировка'],
    'HealthyLifestyle': ['Чек-ап', 'Медитация', 'Воркшоп', 'Пробежка'],
    'Media': ['Стрим', 'Интервью', 'Пресс-тур', 'Медиа-школа'],
    'Diplomacy': ['Дебаты', 'Форум', 'Модель ООН', 'Круглый стол'],
    'Ecology': ['Субботник', 'Сбор сырья', 'Лекторий', 'Посадка'],
    'Tourism': ['Поход', 'Слет', 'Тур', 'Экспедиция']
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
        { action: 'Переход по ссылке', evidenceType: 'web' },
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

        // Pick cluster: Balanced selection
        const rand = Math.random();
        const primary = resident.stats ? Object.keys(resident.stats).reduce((a, b) => resident.stats[a] > resident.stats[b] ? a : b) : 'Science';
        const secondary = resident.stats && Object.keys(resident.stats).length > 1
            ? Object.keys(resident.stats).sort((a, b) => resident.stats[b] - resident.stats[a])[1]
            : primary;

        let cluster: ClusterType;

        if (rand > 0.6) {
            // 40% absolute randomness for high entropy
            cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
        } else if (rand > 0.3) {
            // 30% swap between primary and secondary
            cluster = (Math.random() > 0.5 ? primary : secondary) as ClusterType;
        } else {
            // 30% stay on primary
            cluster = primary as ClusterType;
        }

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
                activeUnits: metrics[mIndex].activeUnits + 1
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
