import { Outlet } from 'react-router-dom';
import { TopProgressBar } from '@/components/ui/top.progress.bar';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <TopProgressBar />
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
