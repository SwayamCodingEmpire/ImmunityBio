import { Routes } from '@angular/router';
import { OrderManagementComponent } from './pages/order-management/order-management.component';
import { PatientEnrollmentComponent } from './pages/patient-enrollment/patient-enrollment.component';
import { GpoComponent } from './pages/gpo/gpo.component';
import { ZipToTerritoryComponent } from './pages/zip-to-territory/zip-to-territory.component';
import { RosterPlacementComponent } from './pages/roster-placement/roster-placement.component';
import { UsersComponent } from './pages/users/users.component';
import { CustomerMatrixComponent } from './pages/customer-matrix/customer-matrix.component';

export const routes: Routes = [
  { path: '', redirectTo: 'customer-matrix', pathMatch: 'full' },
  { path: 'order-management', component: OrderManagementComponent },
  { path: 'patient-enrollment', component: PatientEnrollmentComponent },
  { path: 'gpo', component: GpoComponent },
  { path: 'customer-matrix', component: CustomerMatrixComponent },
  { path: 'zip-to-territory', component: ZipToTerritoryComponent },
  { path: 'roster-placement', component: RosterPlacementComponent },
  { path: 'users', component: UsersComponent },
];
