import { lazy } from 'react';

// project import
import Loadable from '@/utils/Loadable';
import MinimalLayout from '@/layout/MinimalLayout';
import SetUpPage from '@/pages/Setup';
import NotFoundPage from '@/pages/NotFoundPage';

// render - login
// const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
// const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const OtherRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/setup',
      element: <SetUpPage />
    },
    // {
    //   path: '*',
    //   element: <NotFoundPage />
    // }
  ]
};

export default OtherRoutes;
