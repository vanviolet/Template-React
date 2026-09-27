import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import idTranslation from './id.json';
import enTranslation from './en.json';

const savedLanguage = localStorage.getItem('app_language') || 'id';

i18n.use(initReactI18next).init({
  resources: {
    id: { translation: idTranslation },
    en: { translation: enTranslation },
  },
  lng: savedLanguage,
  fallbackLng: 'id',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
