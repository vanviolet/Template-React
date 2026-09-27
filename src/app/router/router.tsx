import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminLayout } from '@/layouts/app/layout';
import { AuthLayout } from '@/layouts/auth/layout';
import { adminRoutes } from './admin.routes';

const LoginView = lazy(() => import('@/views/auth/login/view'));
const RegisterView = lazy(() => import('@/views/auth/register/view'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={null}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <LoginView />,
      },
    ],
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={null}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <RegisterView />,
      },
    ],
  },
  {
    element: (
      <Suspense fallback={null}>
        <AdminLayout />
      </Suspense>
    ),
    children: adminRoutes,
  },
  {
    path: '*',
    element: (
      <Suspense fallback={null}>
        <AdminLayout />
      </Suspense>
    ),
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
