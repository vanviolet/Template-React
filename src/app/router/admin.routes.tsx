import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

const DashboardView = lazy(() => import('@/views/dashboard/view'));
const PenggunaView = lazy(() => import('@/views/pengguna/view'));
const AnalitikView = lazy(() => import('@/views/analitik/view'));
const PengaturanView = lazy(() => import('@/views/pengaturan/view'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <DashboardView />,
  },
  {
    path: '/pengguna',
    element: <PenggunaView />,
  },
  {
    path: '/analitik',
    element: <AnalitikView />,
  },
  {
    path: '/pengaturan',
    element: <PengaturanView />,
  },
];
