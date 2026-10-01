import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  PlusCircle,
  BarChart,
  ShieldCheck,
} from 'lucide-react';
import { ApiClient } from '@/services/api-generated';
import { queryKeys } from '@/services/query.keys';
import { formatRupiah } from '@/utils/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export default function DashboardView() {
  const { t } = useTranslation();

  const { data: metrics, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: () => ApiClient.getDashboardMetrics(),
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{t('dashboard.title')}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t('dashboard.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link to="/pengguna?action=add">
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              <span>{t('pengguna.addTitle')}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total User */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t('dashboard.totalUser')}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div>
                <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {metrics?.totalUser}
                </div>
                <div className="flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  <span>+{metrics?.userGrowthPercentage}% {t('dashboard.growthRate')}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active User */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t('dashboard.activeUser')}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div>
                <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {metrics?.activeUser}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {Math.round(((metrics?.activeUser || 0) / (metrics?.totalUser || 1)) * 100)}% dari total pengguna
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t('dashboard.monthlyRevenue')}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-32" />
            ) : (
              <div>
                <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                  {formatRupiah(metrics?.monthlyRevenue || 0)}
                </div>
                <div className="flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  <span>+{metrics?.revenueGrowthPercentage}% bulan ini</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t('dashboard.systemHealth')}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div>
                <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {metrics?.systemHealth}%
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  Semua layanan operasional
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>Log audit aktivitas terkini dalam portal admin</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {metrics?.recentActivities.map((act) => (
                  <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{act.user}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{act.action}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-muted-foreground block">{act.timestamp}</span>
                      <Badge variant={act.type === 'success' ? 'success' : act.type === 'warning' ? 'warning' : 'secondary'} className="text-[9px] mt-0.5">
                        {act.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & System Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              <CardDescription>Akses cepat navigasi modul utama</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left" asChild>
                <Link to="/pengguna">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <span>Kelola Pengguna ({metrics?.totalUser || 0})</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" asChild>
                <Link to="/analitik">
                  <BarChart className="h-4 w-4 mr-2 text-sky-500" />
                  <span>Lihat Laporan Analitik</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" asChild>
                <Link to="/pengaturan">
                  <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
                  <span>Atur Preferensi Sistem</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
