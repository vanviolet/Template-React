import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

const DashboardView = lazy(() => import('@/views/dashboard/view'));
const PenggunaView = lazy(() => import('@/views/pengguna/view'));
const AnalitikView = lazy(() => import('@/views/analitik/view'));
const PengaturanView = lazy(() => import('@/views/pengaturan/view'));
const CalendarView = lazy(() => import('@/views/calendar/view'));
const TreeViewPage = lazy(() => import('@/views/tree/view'));
const WizardView = lazy(() => import('@/views/wizard/view'));
const EditorView = lazy(() => import('@/views/editor/view'));

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
    path: '/editor',
    element: <EditorView />,
  },
  {
    path: '/wizard',
    element: <WizardView />,
  },
  {
    path: '/pengguna',
    element: <PenggunaView />,
  },
  {
    path: '/tree',
    element: <TreeViewPage />,
  },
  {
    path: '/analitik',
    element: <AnalitikView />,
  },
  {
    path: '/calendar',
    element: <CalendarView />,
  },
  {
    path: '/pengaturan',
    element: <PengaturanView />,
  },
];
