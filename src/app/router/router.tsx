import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/layouts/app/layout';
import { adminRoutes } from './admin.routes';

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={null}>
        <AppLayout />
      </Suspense>
    ),
    children: adminRoutes,
  },
  {
    path: '*',
    element: <Suspense fallback={null}><AppLayout /></Suspense>,
    children: [
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 text-center">
            <h1 className="text-4xl font-bold font-mono text-foreground">404</h1>
            <p className="text-xs text-muted-foreground">Halaman yang Anda cari tidak ditemukan.</p>
          </div>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
