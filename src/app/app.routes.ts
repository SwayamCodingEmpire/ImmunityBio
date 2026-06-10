import { Routes } from '@angular/router';
import { OrderManagementComponent } from './pages/order-management/order-management.component';
import { PatientEnrollmentComponent } from './pages/patient-enrollment/patient-enrollment.component';
import { GpoComponent } from './pages/gpo/gpo.component';
import { ZipToTerritoryComponent } from './pages/zip-to-territory/zip-to-territory.component';
import { RosterPlacementComponent } from './pages/roster-placement/roster-placement.component';
import { UsersComponent } from './pages/users/users.component';
import { CustomerMatrixComponent } from './pages/customer-matrix/customer-matrix.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'order-management', component: OrderManagementComponent, canActivate: [authGuard] },
  { path: 'patient-enrollment', component: PatientEnrollmentComponent, canActivate: [authGuard] },
  { path: 'gpo', component: GpoComponent, canActivate: [authGuard] },
  { path: 'customer-matrix', component: CustomerMatrixComponent, canActivate: [authGuard] },
  { path: 'zip-to-territory', component: ZipToTerritoryComponent, canActivate: [authGuard] },
  { path: 'roster-placement', component: RosterPlacementComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
];
