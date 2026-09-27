import { create } from 'zustand';
import { ThemeMode } from '@/types/common';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('app_theme') as ThemeMode;
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    return saved;
  }
  return 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('app_theme', theme);
    set({ theme });
    applyThemeToDocument(theme);
  },
  toggleTheme: () => {
    const current = get().theme;
    const nextTheme: ThemeMode = current === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
}));

export function applyThemeToDocument(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}
