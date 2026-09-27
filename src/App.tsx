import { AppProviders } from '@/app/providers';
import { AppRouter } from '@/app/router/router';
import '@/i18n';

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
