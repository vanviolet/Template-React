import { Outlet } from 'react-router-dom';
import { TopProgressBar } from '@/components/ui/top.progress.bar';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-foreground flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans selection:bg-primary/20 transition-colors">
      <TopProgressBar />
      <div className="w-full max-w-6xl flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
}
