export type ClusterType =
  | 'Science' | 'Technology' | 'Economics' | 'Society' | 'Politics' | 'Art'
  | 'Biology' | 'Psychology' | 'Philosophy' | 'Security' | 'Logistics'
  | 'Ecology' | 'Information' | 'Health' | 'Exploration' | 'Education'
  | 'Justice' | 'Communication' | 'Infrastructure';

export type UserStats = Record<ClusterType, number>;

export interface UserData {
  id: string;
  name: string;
  role: 'Participant' | 'Expert' | 'Admin' | 'Участник' | 'Эксперт' | 'Админ';
  stats: UserStats;
  eventsAttended: number;
  skillsUnlocked: string[];
  externalConnections: string[]; // e.g., 'Stepik', 'MSU'
  age: number;
}

export type EvidenceType = 'web' | 'mobile' | 'sensor' | 'platform' | 'location';

export type ObservableAction =
  | 'Просмотр анонса'
  | 'Переход ссылке'
  | 'Добавил календарь'
  | 'Геовход зафиксирован'
  | 'Регистрация скан'
  | 'Фото сделано'
  | 'Публикация поста'
  | 'Чат сообщение'
  | 'Участие трансляция'
  | 'Тест пройден'
  | 'Материал скачан'
  | 'Отметка выход';

export interface EventLog {
  id: string;
  timestamp: number;
  userId: string;
  cluster: ClusterType;
  zone: string;
  evidenceLevel: 'Low' | 'Medium' | 'High';
  method: 'NFC' | 'FaceID' | 'Beacon';
  action: ObservableAction;
  evidenceType: EvidenceType;
  cognitiveLoad?: number; // L2 signal
  topic?: string;
  eventType?: string;
  latency?: number; // Network latency in ms
}

export interface ClusterMetrics {
  name: ClusterType;
  activeUnits: number;
  coveragePercent: number;
  roi: number; // Return on Investment (competence growth vs cost)
  anomalies: number;
}

export interface GraphEdge {
  source: ClusterType;
  target: ClusterType;
  weight: number; // 0 to 1, based on traffic volume
}

export interface GraphStats {
  edges: GraphEdge[]; // Aggregated connections
  influencers: string[]; // IDs of users with high centrality
}
