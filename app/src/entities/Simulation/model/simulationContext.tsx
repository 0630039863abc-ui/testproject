import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { EventLog, ClusterType, ClusterMetrics, UserData, GraphStats } from '../../../types';
import { type NarrativeInsight, generateGlobalPulse, generateHubInsight, generateDeficitInsight } from '../lib/narrativeEngine';

export const CLUSTERS: ClusterType[] = [
    'Education', 'Science', 'Labor', 'Culture', 'Volunteering', 'Patriotism',
    'Sports', 'HealthyLifestyle', 'Media', 'Diplomacy', 'Ecology', 'Tourism'
];

export const CLUSTER_TOPICS: Record<string, string[]> = {
    'Education': ['Гибридное обучение', 'Цифровая грамотность', 'Soft Skills 2.0', 'Игропрактика', 'Персонализация'],
    'Science': ['ИИ и нейросети', 'Биотехнологии', 'Квантовая физика', 'Новые материалы', 'Космические системы'],
    'Labor': ['Карьера будущего', 'Предпринимательство', 'Gig-экономика', 'Финтех инструменты', 'Личный бренд'],
    'Culture': ['Digital Art', 'Урбанистика', 'Креативный код', 'Музей будущего', 'Этно-футуризм'],
    'Volunteering': ['Инклюзия', 'Эко-волонтерство', 'Pro bono', 'Гуманитарные миссии', 'Донорство'],
    'Patriotism': ['Историческая память', 'Героика', 'Родной край', 'Цифровой архив', 'Поисковая работа'],
    'Sports': ['Киберспорт', 'Фитнес-технологии', 'Экстремальный спорт', 'Спортивная медицина', 'Командные тактики'],
    'HealthyLifestyle': ['Нутрициология', 'Ментал хелс', 'Биохакинг', 'Сон и восстановление', 'Превентивная медицина'],
    'Media': ['Стриминг', 'Фактчекинг', 'Подкастинг', 'Вирусный контент', 'Сторителлинг'],
    'Diplomacy': ['Переговоры', 'Кросс-культура', 'Международное право', 'Этикет', 'Публичные выступления'],
    'Ecology': ['Ресайклинг', 'Zero Waste', 'Климатический контроль', 'Альтернативная энергия', 'Эко-просвещение'],
    'Tourism': ['Агротуризм', 'Глэмпинг', 'Тревел-блогинг', 'Маршрутостроение', 'Гастрономия']
};

export const TOPIC_EVENTS: Record<string, string[]> = {
    // Education
    'Гибридное обучение': ['Семинар: "Эффективность Zoom-конференций"', 'Лекция: "Будущее смешанных форматов"', 'Воркшоп: "Настройка гибридного класса"', 'Хакатон: "Инструменты для удаленки"', 'Круглый стол: "Проблемы вовлеченности"'],
    'Цифровая грамотность': ['Мастер-класс: "Безопасность в сети"', 'Лекция: "Цифровая гигиена"', 'Тренинг: "Фактчекинг для всех"', 'Квиз: "Основы кибербезопасности"'],
    'Soft Skills 2.0': ['Тренинг: "Эмоциональный интеллект лидера"', 'Воркшоп: "Креативное мышление"', 'Семинар: "Навыки переговоров"', 'Игра: "Командное взаимодействие"', 'Лекция: "Адаптивность в хаосе"'],
    'Игропрактика': ['Хакатон: "Разработка образовательных игр"', 'Мастер-класс: "Геймификация уроков"', 'Лекция: "Психология игры"', 'Демо-день: "Лучшие edu-игры"'],
    'Персонализация': ['Семинар: "ИИ-тьюторы"', 'Лекция: "Индивидуальные траектории"', 'Воркшоп: "Анализ данных ученика"', 'Круглый стол: "Этика сбора данных"'],

    // Science
    'ИИ и нейросети': ['Лекция: "GPT-5: Чего ждать?"', 'Хакатон: "Генеративное искусство"', 'Семинар: "Этика искусственного интеллекта"', 'Воркшоп: "Обучение нейросетей"', 'Панельная дискуссия: "ИИ в медицине"'],
    'Биотехнологии': ['Лекция: "CRISPR и редактирование генома"', 'Экскурсия: "Лаборатория биохакинга"', 'Семинар: "Синтетическая биология"', 'Конференция: "Продление жизни"'],
    'Квантовая физика': ['Лекция: "Квантовый компьютер для чайников"', 'Семинар: "Квантовая криптография"', 'Воркшоп: "Моделирование кубитов"', 'Научное шоу: "Парадоксы квантовой механики"'],
    'Новые материалы': ['Выставка: "Материалы будущего"', 'Лекция: "Графен и его применение"', 'Семинар: "Самовосстанавливающиеся материалы"', 'Хакатон: "Эко-пластик"'],
    'Космические системы': ['Лекция: "Колонизация Марса"', 'Воркшоп: "Спутникостроение"', 'Хакатон: "Анализ космических снимков"', 'Встреча: "Диалог с космонавтом"'],

    // Labor
    'Карьера будущего': ['Лекция: "Профессии 2030 года"', 'Воркшоп: "Карьерная карта"', 'Семинар: "Как не потерять работу из-за ИИ"', 'Ярмарка вакансий: "Tech-компании"'],
    'Предпринимательство': ['Питч-сессия: "Стартапы выходного дня"', 'Мастер-класс: "Unit-экономика"', 'Лекция: "MVP за 24 часа"', 'Встреча: "Fail Night: Истории провалов"', 'Менторская сессия: "Разбор бизнес-модели"'],
    'Gig-экономика': ['Семинар: "Фриланс как стиль жизни"', 'Лекция: "Правовые аспекты самозанятости"', 'Воркшоп: "Платформы для заработка"', 'Нетворкинг: "Встреча фрилансеров"'],
    'Финтех инструменты': ['Лекция: "DeFi и крипта"', 'Воркшоп: "Управление личными финансами"', 'Семинар: "Инвестиции для начинающих"', 'Хакатон: "Финтех решения"'],
    'Личный бренд': ['Мастер-класс: "LinkedIn профиль"', 'Лекция: "Нетворкинг стратегия"', 'Воркшоп: "Публичные выступления"', 'Фотосессия: "Медиакит"'],

    // Culture
    'Digital Art': ['Выставка: "NFT революция"', 'Мастер-класс: "Рисуем в VR"', 'Лекция: "Искусство нейросетей"', 'Воркшоп: "Generative Design"'],
    'Урбанистика': ['Лекция: "Город для людей"', 'Воркшоп: "Тактический урбанизм"', 'Экскурсия: "Скрытая архитектура"', 'Хакатон: "Умный город"'],
    'Креативный код': ['Воркшоп: "Processing для художников"', 'Лекция: "Алгоритмическая музыка"', 'Перформанс: "Код и танец"', 'Хакатон: "Creative Coding"'],
    'Музей будущего': ['Лекция: "AR в музее"', 'Воркшоп: "Виртуальные выставки"', 'Экскурсия: "Цифровой архив"', 'Круглый стол: "Сохранение цифрового наследия"'],
    'Этно-футуризм': ['Фестиваль: "Традиции и технологии"', 'Лекция: "Нео-фолк"', 'Мастер-класс: "Орнамент 2.0"', 'Концерт: "Электронная этника"'],

    // Volunteering
    'Инклюзия': ['Лекция: "Культура инклюзии"', 'Воркшоп: "Жестовый язык"', 'Семинар: "Доступная среда"', 'Кинопоказ: "Кино без барьеров"'],
    'Эко-волонтерство': ['Акция: "Раздельный сбор"', 'Субботник: "Чистый берег"', 'Лекция: "Ноль отходов"', 'Воркшоп: "Вторая жизнь вещей"'],
    'Pro bono': ['Встреча: "Юристы помогают"', 'Хакатон: "IT для НКО"', 'Семинар: "Маркетинг для фондов"', 'Консультация: "Дизайн для добра"'],
    'Гуманитарные миссии': ['Лекция: "Психология помощи"', 'Тренинг: "Первая помощь"', 'Встреча: "Опыт волонтеров ООН"', 'Сбор: "Помощь пострадавшим"'],
    'Донорство': ['Лекция: "Мифы о донорстве"', 'Акция: "День донора"', 'Встреча: "Почетные доноры"', 'Квиз: "Анатомия крови"'],

    // Patriotism
    'Историческая память': ['Лекция: "Неизвестные страницы войны"', 'Кинопоказ: "Документальное кино"', 'Встреча: "Живая история"', 'Квест: "По следам героев"'],
    'Героика': ['Встреча: "Диалог с героем"', 'Лекция: "Подвиг в цифровую эпоху"', 'Выставка: "Лица победы"', 'Урок мужества: "Служение отечеству"'],
    'Родной край': ['Экскурсия: "Тайны нашего города"', 'Лекция: "Краеведение 2.0"', 'Фотоконкурс: "Моя малая родина"', 'Воркшоп: "Карта достопримечательностей"'],
    'Цифровой архив': ['Мастер-класс: "Оцифровка фото"', 'Хакатон: "Семейное древо"', 'Лекция: "Генеалогия онлайн"', 'Проект: "Восстановление имен"'],
    'Поисковая работа': ['Тренинг: "Основы поиска"', 'Экспедиция: "Вахта памяти"', 'Лекция: "Археология войны"', 'Встреча: "Поисковый отряд"'],

    // Sports
    'Киберспорт': ['Турнир: "Dota 2 Championship"', 'Лекция: "Психология киберспортсмена"', 'Мастер-класс: "Стриминг игр"', 'Турнир: "CS:GO Open"', 'Встреча: "Про-игроки"'],
    'Фитнес-технологии': ['Лекция: "Носимые гаджеты"', 'Воркшоп: "Анализ тренировок"', 'Тест-драйв: "Умные тренажеры"', 'Семинар: "VR-фитнес"'],
    'Экстремальный спорт': ['Мастер-класс: "Скейтбординг"', 'Соревнования: "BMX Freestyle"', 'Лекция: "Безопасность в экстриме"', 'Показ фильма: "Жизнь на грани"'],
    'Спортивная медицина': ['Лекция: "Травмы и восстановление"', 'Воркшоп: "Тейпирование"', 'Семинар: "Питание атлета"', 'Чек-ап: "Здоровье спортсмена"'],
    'Командные тактики': ['Тренинг: "Лидерство в спорте"', 'Семинар: "Стратегия победы"', 'Мастер-класс: "Баскетбол: тактика"', 'Игра: "Футбольный матч аналитиков"'],

    // HealthyLifestyle
    'Нутрициология': ['Лекция: "Сахар и мозг"', 'Мастер-класс: "Готовим полезно"', 'Семинар: "Витамины и БАДы"', 'Дегустация: "Суперфуды"'],
    'Ментал хелс': ['Медитация: "Осознанность"', 'Лекция: "Борьба с выгоранием"', 'Воркшоп: "Арт-терапия"', 'Тренинг: "Управление стрессом"'],
    'Биохакинг': ['Лекция: "Сон как суперсила"', 'Семинар: "Генетика и ЗОЖ"', 'Воркшоп: "Гаджеты для здоровья"', 'Встреча: "Клуб биохакеров"'],
    'Сон и восстановление': ['Лекция: "Циркадные ритмы"', 'Практика: "Йога-нидра"', 'Мастер-класс: "Гигиена сна"', 'Семинар: "Релаксация"'],
    'Превентивная медицина': ['Лекция: "Чекап организма"', 'Семинар: "Долголетие"', 'Встреча: "Вопросы врачу"', 'Тест: "Биологический возраст"'],

    // Media
    'Стриминг': ['Мастер-класс: "Настройка OBS"', 'Лекция: "Монетизация стримов"', 'Воркшоп: "Харизма в кадре"', 'Встреча: "Топовые стримеры"'],
    'Фактчекинг': ['Лекция: "Фейк ньюс"', 'Воркшоп: "Проверка источников"', 'Игра: "Правда или ложь"', 'Семинар: "Критическое мышление"'],
    'Подкастинг': ['Мастер-класс: "Запись голоса"', 'Лекция: "Аудиосторителлинг"', 'Воркшоп: "Монтаж звука"', 'Встреча: "Клуб подкастеров"'],
    'Вирусный контент': ['Лекция: "Алгоритмы TikTok"', 'Семинар: "Мемы как контент"', 'Воркшоп: "Снимаем Reels"', 'Кейс-стади: "Почему это залетело?"'],
    'Сторителлинг': ['Тренинг: "Искусство рассказывать истории"', 'Лекция: "Сценарий для блога"', 'Воркшоп: "Текст, который продает"', 'Мастер-класс: "Драматургия"'],

    // Diplomacy
    'Переговоры': ['Тренинг: "Жесткие переговоры"', 'Симуляция: "Бизнес-сделка"', 'Лекция: "Психология влияния"', 'Воркшоп: "Гарвардский метод"'],
    'Кросс-культура': ['Лекция: "Культурный код"', 'Семинар: "Деловой этикет Азии"', 'Встреча: "Разговорный клуб"', 'Воркшоп: "Межкультурная коммуникация"'],
    'Международное право': ['Лекция: "Права человека"', 'Семинар: "Международные суды"', 'Дебаты: "Глобальные вызовы"', 'Кейс-стади: "Дипломатические конфликты"'],
    'Этикет': ['Мастер-класс: "Деловой ужин"', 'Лекция: "Дресс-код"', 'Тренинг: "Светская беседа"', 'Воркшоп: "Правила переписки"'],
    'Публичные выступления': ['Тренинг: "TED-формат"', 'Лекция: "Страх сцены"', 'Воркшоп: "Голос и дикция"', 'Питч-сессия: "Самопрезентация"'],

    // Ecology
    'Ресайклинг': ['Мастер-класс: "Сортировка дома"', 'Экскурсия: "Перерабатывающий завод"', 'Лекция: "Мифы о пластике"', 'Воркшоп: "Апсайклинг одежды"'],
    'Zero Waste': ['Лекция: "Жизнь без мусора"', 'Мастер-класс: "Эко-сумки"', 'Семинар: "Осознанное потребление"', 'Своп-вечеринка: "Обмен вещами"'],
    'Климатический контроль': ['Лекция: "Глобальное потепление"', 'Семинар: "Углеродный след"', 'Кинопоказ: "Планета Земля"', 'Дебаты: "Энергетика будущего"'],
    'Альтернативная энергия': ['Экскурсия: "Солнечная станция"', 'Лекция: "Ветроэнергетика"', 'Воркшоп: "Собери модель ГЭС"', 'Хакатон: "Зеленые технологии"'],
    'Эко-просвещение': ['Лекция: "Эко-привычки"', 'Игротека: "Экологика"', 'Семинар: "Как говорить об экологии"', 'Встреча: "Эко-активисты"'],

    // Tourism
    'Агротуризм': ['Тур: "На ферму"', 'Мастер-класс: "Сыроварение"', 'Лекция: "Сельский бизнес"', 'Дегустация: "Фермерские продукты"'],
    'Глэмпинг': ['Лекция: "Бизнес на природе"', 'Обзор: "Лучшие места"', 'Воркшоп: "Комфортный кемпинг"', 'Встреча: "Владельцы глэмпингов"'],
    'Тревел-блогинг': ['Мастер-класс: "Тревел-фото"', 'Лекция: "Как путешествовать бесплатно"', 'Воркшоп: "Видео из поездок"', 'Встреча: "Истории кругосветки"'],
    'Маршрутостроение': ['Воркшоп: "Планируем маршрут"', 'Лекция: "Логистика путешествия"', 'Хакатон: "Туристическое приложение"', 'Семинар: "Безопасность в походе"'],
    'Гастрономия': ['Гастро-тур: "Вкусы региона"', 'Мастер-класс: "Местная кухня"', 'Лекция: "История еды"', 'Фестиваль: "Уличная еда"']
};

export const CLUSTER_EVENT_TYPES: Record<string, string[]> = {
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

export interface Resident {
    name: string;
    primaryCluster: ClusterType;
    secondaryCluster: ClusterType;
    age: number;
    role: 'Participant' | 'Expert' | 'Admin' | 'Участник' | 'Эксперт' | 'Админ';
}

export const RESIDENTS: Resident[] = [
    { name: 'Михаил Громов', primaryCluster: 'Science', secondaryCluster: 'Education', age: 34, role: 'Эксперт' },
    { name: 'Дарья Светлова', primaryCluster: 'Culture', secondaryCluster: 'Media', age: 10, role: 'Участник' },
    { name: 'Виктор Корнеев', primaryCluster: 'Labor', secondaryCluster: 'Diplomacy', age: 16, role: 'Участник' },
    { name: 'Полина Андреева', primaryCluster: 'Volunteering', secondaryCluster: 'Ecology', age: 29, role: 'Эксперт' },
    { name: 'Андрей Тихонов', primaryCluster: 'Sports', secondaryCluster: 'HealthyLifestyle', age: 22, role: 'Участник' },
    { name: 'Светлана Мельникова', primaryCluster: 'Patriotism', secondaryCluster: 'Tourism', age: 41, role: 'Админ' }
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

        const initialMetrics: ClusterMetrics[] = CLUSTERS.map(name => {
            return {
                name: name as ClusterType,
                activeUnits: Math.floor(Math.random() * 500) + 200, // All 12 active
                coveragePercent: Math.floor(Math.random() * 40) + 40,
                roi: +(Math.random() * 2 + 1).toFixed(2)
            };
        });

        const seaedLogs: EventLog[] = Array.from({ length: 50 }).map((_, i) => {
            const resident = RESIDENTS[i % RESIDENTS.length];
            const cluster = resident.primaryCluster; // Use resident's cluster instead of cycling all
            return {
                id: `seed_${i}`,
                timestamp: Date.now() - (i * 3600000),
                userId: resident.name,
                cluster: cluster as ClusterType,
                zone: 'Локация_' + i, // Generic placeholder
                evidenceLevel: 'Medium',
                method: 'NFC',
                action: 'Геовход зафиксирован',
                evidenceType: 'sensor',
                cognitiveLoad: Math.random() * 5,
                topic: (CLUSTER_TOPICS[cluster] || [])[0] || 'Общее',
                eventType: (CLUSTER_EVENT_TYPES[cluster] || [])[0] || 'Событие',
                latency: 50
            };
        });

        // Initial Local State
        setClusterMetrics(initialMetrics);
        setLogs(seaedLogs);

        // Hydrate selectableUsers with age/stats properly before sending
        const initialUsers = RESIDENTS.map((r, i) => ({
            id: `user_${i}`,
            name: r.name,
            stats: {
                [r.primaryCluster]: 70,
                [r.secondaryCluster]: 40
            } as any,
            eventsAttended: Math.floor(Math.random() * 50) + 20,
            skillsUnlocked: [],
            externalConnections: i === 0 ? ['Stepik', 'MSU'] : [],
            age: r.age,
            role: r.age < 18 ? 'Участник' : r.role // Force 'Student' role for minors
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
        const events = TOPIC_EVENTS[topic] || [];
        return events.map((event, i) => ({
            id: `Event_${topic}_${i}`,
            label: event,
            type: 'Event', // Generic type as specific types were part of the name mostly
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