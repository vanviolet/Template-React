import { create } from 'zustand';

export type FontFamilyChoice = 'plus-jakarta' | 'inter' | 'geist';
export type FontScaleChoice = 'compact' | 'normal' | 'relaxed';

interface TypographyState {
  fontFamily: FontFamilyChoice;
  fontScale: FontScaleChoice;
  setFontFamily: (font: FontFamilyChoice) => void;
  setFontScale: (scale: FontScaleChoice) => void;
}

const getInitialFontFamily = (): FontFamilyChoice => {
  if (typeof window === 'undefined') return 'plus-jakarta';
  const saved = localStorage.getItem('app_font_family') as FontFamilyChoice;
  if (saved && ['plus-jakarta', 'inter', 'geist'].includes(saved)) {
    return saved;
  }
  return 'plus-jakarta';
};

const getInitialFontScale = (): FontScaleChoice => {
  if (typeof window === 'undefined') return 'normal';
  const saved = localStorage.getItem('app_font_scale') as FontScaleChoice;
  if (saved && ['compact', 'normal', 'relaxed'].includes(saved)) {
    return saved;
  }
  return 'normal';
};

export function applyTypographyToDocument(font: FontFamilyChoice, scale: FontScaleChoice) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-font', font);
  root.setAttribute('data-font-scale', scale);
}

export const useTypographyStore = create<TypographyState>((set, get) => ({
  fontFamily: getInitialFontFamily(),
  fontScale: getInitialFontScale(),
  setFontFamily: (font: FontFamilyChoice) => {
    localStorage.setItem('app_font_family', font);
    set({ fontFamily: font });
    applyTypographyToDocument(font, get().fontScale);
  },
  setFontScale: (scale: FontScaleChoice) => {
    localStorage.setItem('app_font_scale', scale);
    set({ fontScale: scale });
    applyTypographyToDocument(get().fontFamily, scale);
  },
}));
