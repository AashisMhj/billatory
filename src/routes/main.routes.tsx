import { lazy } from 'react';

// project import
import Loadable from '@/utils/Loadable';
import MainLayout from '@/layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('@/pages/Dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: <MainLayout />,
  children: [
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    }
  ]
};

export default MainRoutes;
