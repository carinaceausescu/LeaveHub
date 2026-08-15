import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Shell } from './layout/shell/shell';
import { Dashboard } from './pages/employee/dashboard/dashboard';
import { AdminRequests } from './pages/admin/requests/requests';
import { AdminPanel } from './pages/admin/panel/panel';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { NewRequest } from './pages/employee/new-request/new-request';
import { MyRequests } from './pages/employee/my-requests/my-requests';
import { DepartmentCalendar } from './pages/admin/calendar/calendar';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'requests/new',
        component: NewRequest
      },
      {
        path: 'requests/mine',
        component: MyRequests
      },
      {
        path: 'admin/requests',
        component: AdminRequests,
        canActivate: [roleGuard(['Admin', 'Dept_resp'])]
      },
      {
        path: 'admin/panel',
        component: AdminPanel,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'admin/calendar',
        component: DepartmentCalendar,
        canActivate: [roleGuard(['Admin', 'Dept_resp'])]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];