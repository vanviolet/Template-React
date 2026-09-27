import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_ANALYTICS_METRICS } from './constants';
import { TrendingUp, BarChart3, LineChart, PieChart } from 'lucide-react';

export default function AnalitikView() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">{t('analitik.title')}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t('analitik.subtitle')}</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_ANALYTICS_METRICS.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {metric.value}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{metric.change} dari minggu lalu</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <LineChart className="h-4 w-4 text-primary" />
              <span>Tren Pertumbuhan Pengguna 2026</span>
            </CardTitle>
            <CardDescription>Visualisasi jumlah pendaftaran bulanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-xl bg-muted/30 border border-dashed border-border flex flex-col items-center justify-center text-center p-6 space-y-2">
              <BarChart3 className="h-10 w-10 text-muted-foreground/60" />
              <p className="text-xs font-semibold text-foreground">Grafik Performa Real-time Active</p>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                Data disinkronkan langsung dari endpoint server analitik.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <PieChart className="h-4 w-4 text-sky-500" />
              <span>Distribusi Peran Akun</span>
            </CardTitle>
            <CardDescription>Persentase komposisi per hak akses pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-xl bg-muted/30 border border-dashed border-border flex flex-col items-center justify-center text-center p-6 space-y-2">
              <PieChart className="h-10 w-10 text-muted-foreground/60" />
              <p className="text-xs font-semibold text-foreground">Distribusi Role Sesuai DTO</p>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                Admin (25%), Manager (25%), Executive Staff (25%), Standard User (25%).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
