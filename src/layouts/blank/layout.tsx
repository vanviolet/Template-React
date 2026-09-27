import { Outlet } from 'react-router-dom';
import { TopProgressBar } from '@/components/ui/top.progress.bar';

export function BlankLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopProgressBar />
      <Outlet />
    </div>
  );
}
