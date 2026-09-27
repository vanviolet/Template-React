import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './sidebar';
import { AppHeader } from './header';
import { TopProgressBar } from '@/components/ui/top.progress.bar';
import { LoadingOverlay } from '@/components/ui/loading.overlay';
import { useSidebarStore } from '@/app/store/sidebar.store';
import { useIsMobile } from '@/hooks/use.mobile';
import { cn } from '@/utils/cn';

export function AdminLayout() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <TopProgressBar />
      <LoadingOverlay />
      <AppHeader />
      <AppSidebar />

      <main
        className={cn(
          'flex-1 pt-16 transition-all duration-300 flex flex-col',
          isMobile ? 'pl-0' : isCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
