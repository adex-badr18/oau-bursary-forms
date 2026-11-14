import { createBrowserRouter } from 'react-router';

// Auth Pages
import Login from './pages/Login';
import DepartmentLogin from './pages/DepartmentLogin';
import BursaryLogin from './pages/BursaryLogin';

// Department Pages
import DepartmentDashboardLayout from './pages/department/DashboardLayout';
import AvailableForms from './pages/department/AvailableForms';
import MySubmissions from './pages/department/MySubmissions';
import SubmissionSuccess from './pages/department/SubmissionSuccess';
import DepartmentSubmissionDetail from './pages/department/SubmissionDetail';

// Department Forms
import CashAdvanceForm from './pages/department/forms/CashAdvanceForm';
import DLPOForm from './pages/department/forms/DLPOForm';
import ExpenditureAuthorizationForm from './pages/department/forms/ExpenditureAuthorizationForm';
import DutyMileageForm from './pages/department/forms/DutyMileageForm';
import ImprestHolderForm from './pages/department/forms/ImprestHolderForm';

// Bursary Pages
import BursaryDashboardLayout from './pages/bursary/BursaryDashboardLayout';
import BursaryDashboard from './pages/bursary/BursaryDashboard';
import CashAdvanceSubmissions from './pages/bursary/CashAdvanceSubmissions';
import DLPOSubmissions from './pages/bursary/DLPOSubmissions';
import ExpenditureSubmissions from './pages/bursary/ExpenditureSubmissions';
import DutyMileageSubmissions from './pages/bursary/DutyMileageSubmissions';
import ImprestSubmissions from './pages/bursary/ImprestSubmissions';
import BursarySubmissionDetail from './pages/bursary/SubmissionDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/department-login',
    Component: DepartmentLogin,
  },
  {
    path: '/bursary-login',
    Component: BursaryLogin,
  },
  {
    path: '/department',
    Component: DepartmentDashboardLayout,
    children: [
      {
        path: 'dashboard',
        Component: AvailableForms,
      },
      {
        path: 'submissions',
        Component: MySubmissions,
      },
      {
        path: 'submission/:id',
        Component: DepartmentSubmissionDetail,
      },
      {
        path: 'forms/cash-advance',
        Component: CashAdvanceForm,
      },
      {
        path: 'forms/dlpo',
        Component: DLPOForm,
      },
      {
        path: 'forms/expenditure-authorization',
        Component: ExpenditureAuthorizationForm,
      },
      {
        path: 'forms/duty-mileage',
        Component: DutyMileageForm,
      },
      {
        path: 'forms/imprest-holder',
        Component: ImprestHolderForm,
      },
      {
        path: 'submission-success',
        Component: SubmissionSuccess,
      },
    ],
  },
  {
    path: '/bursary',
    Component: BursaryDashboardLayout,
    children: [
      {
        path: 'dashboard',
        Component: BursaryDashboard,
      },
      {
        path: 'cash-advance',
        Component: CashAdvanceSubmissions,
      },
      {
        path: 'dlpo',
        Component: DLPOSubmissions,
      },
      {
        path: 'expenditure',
        Component: ExpenditureSubmissions,
      },
      {
        path: 'duty-mileage',
        Component: DutyMileageSubmissions,
      },
      {
        path: 'imprest',
        Component: ImprestSubmissions,
      },
      {
        path: 'submission/:id',
        Component: BursarySubmissionDetail,
      },
    ],
  },
]);
