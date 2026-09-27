import { useTranslation } from 'react-i18next';
import { useLoadingStore } from '@/app/store/loading.store';
import { CubeSpinner } from './cube.spinner';
import { cn } from '@/utils/cn';

export function LoadingOverlay() {
  const { t } = useTranslation();
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs transition-all duration-300 animate-in fade-in-0'
      )}
      aria-busy="true"
      aria-label="Loading Overlay"
    >
      <div className="flex flex-col items-center justify-center p-6  space-y-4 max-w-xs text-center">
        <CubeSpinner size={48} />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {message || t('common.processing')}
          </p>
          <p className="text-[11px] animate-pulse">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    </div>
  );
}
