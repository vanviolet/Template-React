import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  GraduationCap,
  Truck,
  PlusCircle,
  Sun,
  Moon,
  Globe,
  FolderTree,
  LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
  id: string;
  labelKey: string;
  defaultLabel: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  hasChevron?: boolean;
  disabled?: boolean;
  keywords?: string[];
}

export interface NavGroupConfig {
  group: string;
  groupKey?: string;
  items: NavItemConfig[];
}

export interface QuickActionConfig {
  id: string;
  titleKey: string;
  defaultTitle: string;
  icon: LucideIcon;
  keywords?: string[];
  action: (context: {
    navigate: (path: string) => void;
    toggleTheme: () => void;
    currentTheme: string;
    changeLanguage: (lang: string) => void;
    currentLanguage: string;
  }) => void;
}

/**
 * Single source of truth for Navigation groups (Sidebar & Command Palette)
 */
export const APP_NAV_GROUPS: NavGroupConfig[] = [
  {
    group: 'APPS & PAGES',
    groupKey: 'nav.mainMenu',
    items: [
      {
        id: 'dashboard',
        labelKey: 'nav.dashboard',
        defaultLabel: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        keywords: ['home', 'beranda', 'ringkasan', 'overview'],
      },
      {
        id: 'pengguna',
        labelKey: 'nav.pengguna',
        defaultLabel: 'Pengguna',
        path: '/pengguna',
        icon: Users,
        keywords: ['user', 'users', 'karyawan', 'pegawai', 'member'],
      },
      {
        id: 'academy',
        labelKey: 'nav.academy',
        defaultLabel: 'Academy',
        path: '/academy',
        icon: GraduationCap,
        hasChevron: true,
        disabled: true,
      },
      {
        id: 'logistics',
        labelKey: 'nav.logistics',
        defaultLabel: 'Logistics',
        path: '/logistics',
        icon: Truck,
        hasChevron: true,
        disabled: true,
      },
      {
        id: 'email',
        labelKey: 'nav.email',
        defaultLabel: 'Email',
        path: '/email',
        icon: Mail,
        badge: '12',
      },
      {
        id: 'chat',
        labelKey: 'nav.chat',
        defaultLabel: 'Chat',
        path: '/chat',
        icon: MessageSquare,
      },
      {
        id: 'calendar',
        labelKey: 'nav.calendar',
        defaultLabel: 'Kalender',
        path: '/calendar',
        icon: Calendar,
        keywords: ['jadwal', 'event', 'agenda', 'schedule'],
      },
      {
        id: 'kanban',
        labelKey: 'nav.kanban',
        defaultLabel: 'Kanban',
        path: '/kanban',
        icon: Kanban,
      },
      {
        id: 'tree',
        labelKey: 'nav.tree',
        defaultLabel: 'Tree View',
        path: '/tree',
        icon: FolderTree,
        keywords: ['tree', 'struktur', 'berkas', 'folder', 'hierarchy', 'direktori'],
        badge: 'New',
      },
      {
        id: 'analitik',
        labelKey: 'nav.analitik',
        defaultLabel: 'Analitik',
        path: '/analitik',
        icon: BarChart3,
        keywords: ['statistik', 'chart', 'laporan', 'analytics'],
      },
    ],
  },
  {
    group: 'SYSTEM',
    groupKey: 'nav.system',
    items: [
      {
        id: 'pengaturan',
        labelKey: 'nav.pengaturan',
        defaultLabel: 'Pengaturan',
        path: '/pengaturan',
        icon: Settings,
        keywords: ['setting', 'settings', 'konfigurasi', 'config', 'theme'],
      },
    ],
  },
];

/**
 * Registry of Quick Actions for Command Palette (CMDK search).
 * Any new module can easily register actions here!
 */
export const QUICK_ACTIONS_REGISTRY: QuickActionConfig[] = [
  {
    id: 'add-user',
    titleKey: 'pengguna.addTitle',
    defaultTitle: 'Tambah Pengguna Baru',
    icon: PlusCircle,
    keywords: ['create', 'new', 'user', 'tambah', 'pengguna'],
    action: ({ navigate }) => {
      navigate('/pengguna?action=add');
    },
  },
  {
    id: 'toggle-theme',
    titleKey: 'pengaturan.toggleTheme',
    defaultTitle: 'Ganti Mode Tema (Dark/Light)',
    icon: Sun,
    keywords: ['theme', 'dark', 'light', 'mode', 'tema'],
    action: ({ toggleTheme }) => {
      toggleTheme();
    },
  },
  {
    id: 'switch-language',
    titleKey: 'pengaturan.switchLang',
    defaultTitle: 'Ganti Bahasa (ID / EN)',
    icon: Globe,
    keywords: ['bahasa', 'language', 'translate', 'inggris', 'indonesia'],
    action: ({ changeLanguage, currentLanguage }) => {
      const nextLang = currentLanguage === 'id' ? 'en' : 'id';
      changeLanguage(nextLang);
    },
  },
];
