import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { CloseComponent } from './pages/close/close.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { LoansComponent } from './pages/loans/loans.component';
import { LoginComponent } from './pages/login/login.component';
import { ToolsComponent } from './pages/tools/tools.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'tools', component: ToolsComponent, canActivate: [authGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [authGuard] },
  { path: 'loans', component: LoansComponent, canActivate: [authGuard] },
  { path: 'close', component: CloseComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
