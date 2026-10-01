import {
  Users,
  Sparkles,
  PlusCircle,
  Sun,
  Moon,
  Globe,
  FolderTree,
  Calendar,
  PenTool,
  Sliders,
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
 * Hanya 2 Menu Utama: Example & Pengguna
 */
export const APP_NAV_GROUPS: NavGroupConfig[] = [
  {
    group: 'MENU UTAMA',
    groupKey: 'nav.mainMenu',
    items: [
      {
        id: 'examples',
        labelKey: 'nav.examples',
        defaultLabel: 'Example',
        path: '/examples',
        icon: Sparkles,
        keywords: [
          'example',
          'examples',
          'komponen',
          'showcase',
          'kalender',
          'tree',
          'editor',
          'input',
          'wizard',
          'analitik',
        ],
        badge: 'Hub',
      },
      {
        id: 'pengguna',
        labelKey: 'nav.pengguna',
        defaultLabel: 'Pengguna',
        path: '/pengguna',
        icon: Users,
        keywords: ['user', 'users', 'karyawan', 'pegawai', 'member', 'table', 'tabel'],
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
    id: 'open-examples',
    titleKey: 'nav.examples',
    defaultTitle: 'Buka Halaman Example Components Hub',
    icon: Sparkles,
    keywords: ['example', 'contoh', 'showcase', 'komponen'],
    action: ({ navigate }) => {
      navigate('/examples');
    },
  },
  {
    id: 'example-tree',
    titleKey: 'nav.tree',
    defaultTitle: 'Buka Example Tree View & Network Graph',
    icon: FolderTree,
    keywords: ['tree', 'graph', 'diagram', 'relasi', 'hierarki'],
    action: ({ navigate }) => {
      navigate('/examples?tab=tree');
    },
  },
  {
    id: 'example-calendar',
    titleKey: 'nav.calendar',
    defaultTitle: 'Buka Example Kalender Interaktif',
    icon: Calendar,
    keywords: ['calendar', 'kalender', 'agenda', 'jadwal'],
    action: ({ navigate }) => {
      navigate('/examples?tab=calendar');
    },
  },
  {
    id: 'example-editor',
    titleKey: 'nav.editor',
    defaultTitle: 'Buka Example Rich Text Editor (Lexical)',
    icon: PenTool,
    keywords: ['editor', 'lexical', 'wysiwyg', 'dokumen'],
    action: ({ navigate }) => {
      navigate('/examples?tab=editor');
    },
  },
  {
    id: 'example-inputs',
    titleKey: 'nav.inputs',
    defaultTitle: 'Buka Example Input & Form (Rupiah, No HP, NIK)',
    icon: Sliders,
    keywords: ['input', 'number', 'rupiah', 'phone', 'nik', 'combobox'],
    action: ({ navigate }) => {
      navigate('/examples?tab=inputs');
    },
  },
  {
    id: 'add-user',
    titleKey: 'pengguna.addTitle',
    defaultTitle: 'Tambah Pengguna Baru',
    icon: PlusCircle,
    keywords: ['create', 'new', 'user', 'tambah', 'pengguna', 'table'],
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
