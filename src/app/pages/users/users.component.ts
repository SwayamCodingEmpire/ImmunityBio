import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  department: string;
  territory: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  role: string;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  readonly roleOptions = [
    'User',
    'Account Manager',
    'Project Manager',
    'Territory Business Manager',
    'Area Business Director',
    'Admin'
  ];

  users: UserRecord[] = [
    { id: 'USR-001', name: 'Keith DeRuiter',       email: 'k.deruiter@immunitybio.com',      department: 'Sales',      territory: 'Boston, MA',          status: 'Active',   lastLogin: '05/19/2026', role: 'Area Business Director'    },
    { id: 'USR-002', name: 'Chuck Gaetano',         email: 'c.gaetano@immunitybio.com',       department: 'Sales',      territory: 'Atlanta, GA',         status: 'Active',   lastLogin: '05/20/2026', role: 'Area Business Director'    },
    { id: 'USR-003', name: 'Katrina Caronia',       email: 'k.caronia@immunitybio.com',       department: 'Sales',      territory: 'Tampa, FL',           status: 'Active',   lastLogin: '05/21/2026', role: 'Territory Business Manager' },
    { id: 'USR-004', name: 'Alexandra Maddalosso',  email: 'a.maddalosso@immunitybio.com',    department: 'Sales',      territory: 'Los Angeles, CA',     status: 'Active',   lastLogin: '05/18/2026', role: 'Territory Business Manager' },
    { id: 'USR-005', name: 'Robb Evans',            email: 'r.evans@immunitybio.com',         department: 'Sales',      territory: 'Chicago, IL',         status: 'Active',   lastLogin: '05/20/2026', role: 'Territory Business Manager' },
    { id: 'USR-006', name: 'Chris Moffitt',         email: 'c.moffitt@immunitybio.com',       department: 'Sales',      territory: 'Indianapolis, IN',    status: 'Active',   lastLogin: '05/17/2026', role: 'Territory Business Manager' },
    { id: 'USR-007', name: 'Freddy Garzon',         email: 'f.garzon@immunitybio.com',        department: 'Sales',      territory: 'Northern California', status: 'Active',   lastLogin: '05/21/2026', role: 'Area Business Director'    },
    { id: 'USR-008', name: 'Priya Nambiar',         email: 'p.nambiar@immunitybio.com',       department: 'Operations', territory: 'National',            status: 'Active',   lastLogin: '05/19/2026', role: 'Account Manager'           },
    { id: 'USR-009', name: 'Jordan Whitfield',      email: 'j.whitfield@immunitybio.com',     department: 'Operations', territory: 'National',            status: 'Inactive', lastLogin: '04/30/2026', role: 'Project Manager'           },
    { id: 'USR-010', name: 'Camille Tran',          email: 'c.tran@immunitybio.com',          department: 'IT',         territory: 'National',            status: 'Active',   lastLogin: '05/21/2026', role: 'Admin'                     }
  ];

  trackByUserId(_index: number, user: UserRecord): string { return user.id; }
  trackByIndex(index: number): number { return index; }

  onRoleChange(user: UserRecord, newRole: string): void {
    user.role = newRole;
  }
}
