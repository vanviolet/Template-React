import { AnalyticsMetric } from './types';

export const MOCK_ANALYTICS_METRICS: AnalyticsMetric[] = [
  {
    id: '1',
    title: 'Tingkat Konversi pendaftaran',
    value: '4.85%',
    change: '+1.2%',
    isPositive: true,
  },
  {
    id: '2',
    title: 'Rata-rata Durasi Sesi',
    value: '18m 42s',
    change: '+3m 10s',
    isPositive: true,
  },
  {
    id: '3',
    title: 'Rasio Aktivitas Harian (DAU/MAU)',
    value: '68.2%',
    change: '+5.4%',
    isPositive: true,
  },
  {
    id: '4',
    title: 'Tingkat Restitusi / Churn Rate',
    value: '1.15%',
    change: '-0.3%',
    isPositive: true,
  },
];
