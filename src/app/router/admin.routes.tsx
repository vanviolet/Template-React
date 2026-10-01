import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

const ExamplesView = lazy(() => import('@/views/examples/view'));
const PenggunaView = lazy(() => import('@/views/pengguna/view'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/examples" replace />,
  },
  {
    path: '/examples',
    element: <ExamplesView />,
  },
  {
    path: '/example',
    element: <Navigate to="/examples" replace />,
  },
  {
    path: '/pengguna',
    element: <PenggunaView />,
  },
  // Backward compatibility redirects to the unified examples hub
  {
    path: '/dashboard',
    element: <Navigate to="/examples" replace />,
  },
  {
    path: '/calendar',
    element: <Navigate to="/examples?tab=calendar" replace />,
  },
  {
    path: '/tree',
    element: <Navigate to="/examples?tab=tree" replace />,
  },
  {
    path: '/editor',
    element: <Navigate to="/examples?tab=editor" replace />,
  },
  {
    path: '/wizard',
    element: <Navigate to="/examples?tab=wizard" replace />,
  },
  {
    path: '/analitik',
    element: <Navigate to="/examples?tab=analitik" replace />,
  },
  {
    path: '/pengaturan',
    element: <Navigate to="/examples" replace />,
  },
];
