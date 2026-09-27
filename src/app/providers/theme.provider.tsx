import { useEffect } from 'react';
import { useThemeStore, applyThemeToDocument } from '@/app/store/theme.store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return <>{children}</>;
}
