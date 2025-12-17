export enum UserRole {
  SENIOR = 'SENIOR',
  FAMILY = 'FAMILY',
  DOCTOR = 'DOCTOR',
}

export interface VitalSign {
  time: string;
  value: number;
  value2?: number; // For BP (systolic/diastolic)
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'cleaning' | 'meal' | 'medical' | 'activity';
  status: 'available' | 'booked';
}

export interface HealthAlert {
  id: string;
  seniorName: string;
  type: 'emergency' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
  time: string;
  read: boolean;
}

// Mock Data
export const MOCK_VITALS_HEART: VitalSign[] = [
  { time: '08:00', value: 72 },
  { time: '10:00', value: 75 },
  { time: '12:00', value: 82 },
  { time: '14:00', value: 78 },
  { time: '16:00', value: 74 },
  { time: '18:00', value: 70 },
];

export const MOCK_VITALS_BP: VitalSign[] = [
  { time: 'Mon', value: 120, value2: 80 },
  { time: 'Tue', value: 122, value2: 82 },
  { time: 'Wed', value: 118, value2: 78 },
  { time: 'Thu', value: 125, value2: 84 },
  { time: 'Fri', value: 121, value2: 79 },
  { time: 'Sat', value: 119, value2: 78 },
  { time: 'Sun', value: 120, value2: 80 },
];

export const MOCK_MEDS: Medication[] = [
  { id: '1', name: '降压药 (Amlodipine)', dosage: '1片', time: '08:00', taken: true },
  { id: '2', name: '维生素C', dosage: '2片', time: '12:00', taken: false },
  { id: '3', name: '钙片', dosage: '1片', time: '19:00', taken: false },
];

export const MOCK_SERVICES: ServiceItem[] = [
  { id: '1', title: '上门保洁', category: 'cleaning', status: 'available' },
  { id: '2', title: '老年营养餐配送', category: 'meal', status: 'booked' },
  { id: '3', title: '中医推拿', category: 'medical', status: 'available' },
];

export const MOCK_ALERTS: HealthAlert[] = [
  {
    id: '1',
    seniorName: '张建国',
    type: 'emergency',
    title: '心率异常升高',
    description: '检测到心率持续超过 110 bpm (115 bpm)',
    suggestion: '请立即联系老人或查看实时监控，确认是否有身体不适。',
    time: '10分钟前',
    read: false,
  },
  {
    id: '2',
    seniorName: '张建国',
    type: 'warning',
    title: '血压偏高',
    description: '今日晨间血压测量值为 150/95 mmHg',
    suggestion: '请提醒老人按时服用降压药，并注意休息。',
    time: '2小时前',
    read: false,
  },
  {
    id: '3',
    seniorName: '张建国',
    type: 'info',
    title: '长时间未活动',
    description: '客厅红外传感器显示超过3小时无活动迹象',
    suggestion: '建议拨打电话确认老人位置。',
    time: '昨天 15:30',
    read: true,
  },
];