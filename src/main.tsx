import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Import comprehensive weights (300, 400, 500, 600, 700, 800) to eradicate browser faux-bold blurring
import '@fontsource/plus-jakarta-sans/latin.css';
import '@fontsource/inter/latin.css';
import '@fontsource/geist-sans/latin.css';
import '@fontsource/geist-mono/latin.css';
import { useTypographyStore, applyTypographyToDocument } from '@/app/store/typography.store';
import App from './App.tsx';
import './index.css';

// Safely suppress benign ResizeObserver notifications in capture phase
if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    (e) => {
      const msg = e.message || e.error?.message || '';
      if (typeof msg === 'string' && msg.includes('ResizeObserver')) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (e) => {
      const reason = e.reason?.message || e.reason || '';
      if (typeof reason === 'string' && reason.includes('ResizeObserver')) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    true
  );
}

// Initialize persisted typography settings on root element
if (typeof window !== 'undefined') {
  const currentTypography = useTypographyStore.getState();
  applyTypographyToDocument(currentTypography.fontFamily, currentTypography.fontScale);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
