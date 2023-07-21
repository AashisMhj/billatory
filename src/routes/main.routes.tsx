import { lazy } from 'react';

// project import
import Loadable from '@/utils/Loadable';
import MainLayout from '@/layout/MainLayout';
// students page
import ListFees from '@/pages/fees/ListFees';
import ListStudents from '@/pages/students/ListStudents';
import StudentDetailPage from '@/pages/students/StudentDetail';
import AddStudentPage from '@/pages/students/AddStudent';
import EditStudentPage from '@/pages/students/EditStudent';
import StudentFeePage from '@/pages/students/StudentFee';
import StudentBillPage from '@/pages/students/StudentBill';
import ListStudentCharges from '@/pages/students/ListStudentCharges';
// classes
import ListClasses from '@/pages/class/ListClasses';
// charges
import ListCharges from '@/pages/charges/ListCharges';
import ApplyChargesPage from '@/pages/charges/ApplyCharges';
// 
import ListPaymentPage from '@/pages/payment/ListPayment';
// settings page
import EditSettingPage from '@/pages/settings/EditSettings';
import ViewLogsPage from '@/pages/settings/ViewLogs';
import ChangePassword from '@/pages/settings/ChangePassword';
// payment
import AddPaymentPage from '@/pages/payment/AddPayment';
import PrintPaymentPage from '@/pages/payment/PrintPayment';



// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('@/pages/Dashboard')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: <MainLayout />,
  children: [
    {
      path: 'home',
      element: <DashboardDefault />
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
      path: 'students/:id/info',
      element: <StudentDetailPage />
    },
    {
      path: 'students/:id/fee',
      element: <StudentFeePage />
    },
    {
      path: 'students/:id/bill',
      element: <StudentBillPage />
    },
    {
      path: 'students/:id/charges',
      element: <ListStudentCharges />
    },
    {
      path: 'class',
      element: <ListClasses />
    },
    {
      path: 'fees',
      element: <ListFees />
    },
    {
      path: 'charges',
      element: <ListCharges />
    },
    {
      path: 'charges/:id/apply', 
      element: <ApplyChargesPage />
    },
    {
      path: 'payment',
      element: <ListPaymentPage />
    },
    {
      path: 'payment/add',
      element: <AddPaymentPage />
    },
    {
      path: 'payment/:id/info',
      element: <PrintPaymentPage />
    },
    {
      path: 'settings/edit',
      element: <EditSettingPage />
    },
    {
      path: 'logs',
      element: <ViewLogsPage />
    },
    {
      path: 'change-password',
      element: <ChangePassword />
    }
  ]
};

export default MainRoutes;
