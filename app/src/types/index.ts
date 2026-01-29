export type ClusterType = 'Science' | 'Technology' | 'Economics' | 'Society' | 'Politics' | 'Art';

export interface UserStats {
  power: number;
  agility: number;
  intel: number;
  mind: number;
  spirit: number;
}

export interface UserData {
  id: string;
  name: string;
  role: 'Participant' | 'Expert' | 'Admin';
  stats: UserStats;
  eventsAttended: number;
  skillsUnlocked: string[];
  externalConnections: string[]; // e.g., 'Stepik', 'MSU'
}

export interface EventLog {
  id: string;
  timestamp: number;
  userId: string;
  cluster: ClusterType;
  zone: string;
  evidenceLevel: 'Low' | 'Medium' | 'High';
  method: 'NFC' | 'FaceID' | 'Beacon';
  action: 'Check-in' | 'View' | 'Register' | 'Test Pass' | 'Meeting' | 'Purchase' | 'Logout';
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
