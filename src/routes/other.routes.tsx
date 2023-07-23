// project import
import MinimalLayout from '@/layout/MinimalLayout';
import SetUpPage from '@/pages/Setup';
import NotFoundPage from '@/pages/NotFoundPage';
import LoginPage from '@/pages/settings/Login';

// render - login
// const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
// const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));


const OtherRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/setup',
      element: <SetUpPage />
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]
};

export default OtherRoutes;
