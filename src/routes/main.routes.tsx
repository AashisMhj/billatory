import { lazy } from 'react';

// project import
import Loadable from '@/utils/Loadable';
import MainLayout from '@/layout/MainLayout';
// students page
import ListStudentFees from '@/pages/fees/ListStudentFees';
import ListStudents from '@/pages/students/ListStudents';
// classes
import ListClasses from '@/pages/class/ListClasses';
import AddStudentPage from '@/pages/students/AddStudent';
import EditStudentPage from '@/pages/students/EditStudent';
// charges
import ListCharges from '@/pages/charges/ListCharges';
// 
import ListPaymentPage from '@/pages/payment/ListPayment';
// settings page
import EditSettingPage from '@/pages/settings/EditSettings';


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
    },
    {
      path: 'students',
      element: <ListStudents />
    },
    {
      path: 'students/add',
      element: <AddStudentPage />
    },
    {
      path: 'students/:id/edit',
      element: <EditStudentPage />
    },
    {
      path: 'class',
      element: <ListClasses />
    },
    {
      path: 'fees',
      element: <ListStudentFees />
    },
    {
      path: 'charges',
      element: <ListCharges />
    },
    {
      path: 'payment',
      element: <ListPaymentPage />
    },
    {
      path: 'settings',
      element: <EditSettingPage />
    }
  ]
};

export default MainRoutes;
