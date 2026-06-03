import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type RosterStatus = 'Active' | 'Open' | 'Upcoming' | 'Inactive';

interface RosterRow {
  id: number;
  territoryId: string;
  abd: string;
  tbm: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-roster-placement',
  imports: [CommonModule, FormsModule],
  templateUrl: './roster-placement.component.html',
  styleUrl: './roster-placement.component.scss'
})
export class RosterPlacementComponent {

  // ── Filters ──────────────────────────────────────────────
  pendingTerritory = '';
  pendingAbd       = '';
  pendingTbm       = '';
  pendingStatus    = 'All';

  filterTerritory = '';
  filterAbd       = '';
  filterTbm       = '';
  filterStatus    = 'All';

  readonly statusOptions = ['All', 'Active', 'Open', 'Upcoming', 'Inactive'];

  // ── Data ─────────────────────────────────────────────────
  private nextId = 10;

  rows: RosterRow[] = [
    { id: 1,  territoryId: 'TX3829', abd: 'C. Gaetano',    tbm: 'A. Rippy',             startDate: '2026-01-01', endDate: ''           },
    { id: 2,  territoryId: 'NC4721', abd: 'K. DeRuiter',   tbm: 'L. Volomino',          startDate: '2026-01-01', endDate: ''           },
    { id: 3,  territoryId: 'TX5614', abd: 'A. Maddalozzo', tbm: 'K. Denor-Alcala',      startDate: '2026-01-01', endDate: ''           },
    { id: 4,  territoryId: 'MD2983', abd: 'C. Gaetano',    tbm: 'B. Girbes',            startDate: '2026-01-01', endDate: '2026-03-31' },
    { id: 5,  territoryId: 'MD2983', abd: 'C. Gaetano',    tbm: '',                     startDate: '2026-04-01', endDate: ''           },
    { id: 6,  territoryId: 'FL9201', abd: 'C. Gaetano',    tbm: 'K. Caronia',           startDate: '2026-02-15', endDate: '2026-05-14' },
    { id: 7,  territoryId: 'CA1140', abd: 'F. Garzon',     tbm: 'A. Maddalosso',        startDate: '2026-07-01', endDate: ''           },
    { id: 8,  territoryId: 'IN4471', abd: 'K. DeRuiter',   tbm: 'C. Moffitt',           startDate: '2026-01-01', endDate: ''           },
    { id: 9,  territoryId: 'IL5982', abd: 'K. DeRuiter',   tbm: 'R. Evans',             startDate: '2026-01-01', endDate: '2026-04-30' },
    { id: 10, territoryId: 'IL5982', abd: 'K. DeRuiter',   tbm: '',                     startDate: '2026-05-01', endDate: ''           },
    { id: 11, territoryId: 'GA7741', abd: 'C. Gaetano',    tbm: 'M. Real',              startDate: '2026-01-01', endDate: ''           },
    { id: 12, territoryId: 'CA2291', abd: 'F. Garzon',     tbm: 'T. Kibel',             startDate: '2026-03-01', endDate: ''           },
    { id: 13, territoryId: 'PA8834', abd: 'K. DeRuiter',   tbm: 'C. Urch',              startDate: '2026-01-01', endDate: '2026-02-28' },
    { id: 14, territoryId: 'PA8834', abd: 'K. DeRuiter',   tbm: 'H. Ritter',            startDate: '2026-03-01', endDate: ''           },
    { id: 15, territoryId: 'SD4920', abd: 'A. Maddalozzo', tbm: 'J. Reiff',             startDate: '2026-08-01', endDate: ''           },
  ];

  rowStatus(row: RosterRow): RosterStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(row.startDate);
    const end   = row.endDate ? new Date(row.endDate) : null;

    if (start > today) return 'Upcoming';
    if (end && end < today) return !row.tbm ? 'Open' : 'Inactive';
    if (!row.tbm) return 'Open';
    return 'Active';
  }

  countByStatus(status: RosterStatus): number {
    return this.rows.filter(r => this.rowStatus(r) === status).length;
  }

  get filteredRows(): RosterRow[] {
    const t = this.filterTerritory.trim().toLowerCase();
    const a = this.filterAbd.trim().toLowerCase();
    const b = this.filterTbm.trim().toLowerCase();
    return this.rows.filter(r => {
      const status = this.rowStatus(r);
      return (!t || r.territoryId.toLowerCase().includes(t))
          && (!a || r.abd.toLowerCase().includes(a))
          && (!b || r.tbm.toLowerCase().includes(b))
          && (this.filterStatus === 'All' || status === this.filterStatus);
    });
  }

  applyFilters(): void {
    this.filterTerritory = this.pendingTerritory;
    this.filterAbd       = this.pendingAbd;
    this.filterTbm       = this.pendingTbm;
    this.filterStatus    = this.pendingStatus;
  }

  resetFilters(): void {
    this.pendingTerritory = ''; this.filterTerritory = '';
    this.pendingAbd       = ''; this.filterAbd       = '';
    this.pendingTbm       = ''; this.filterTbm       = '';
    this.pendingStatus    = 'All'; this.filterStatus  = 'All';
  }

  // ── Add modal ────────────────────────────────────────────
  showAddModal = false;
  addForm: Partial<RosterRow> = {};

  openAddModal(): void {
    this.addForm = { territoryId: '', abd: '', tbm: '', startDate: '', endDate: '' };
    this.showAddModal = true;
  }
  closeAddModal(): void { this.showAddModal = false; this.addForm = {}; }

  get addFormValid(): boolean {
    return !!(this.addForm.territoryId?.trim() && this.addForm.abd?.trim() && this.addForm.startDate);
  }

  saveAdd(): void {
    if (!this.addFormValid) return;
    this.rows.unshift({
      id:          this.nextId++,
      territoryId: this.addForm.territoryId!,
      abd:         this.addForm.abd!,
      tbm:         this.addForm.tbm ?? '',
      startDate:   this.addForm.startDate!,
      endDate:     this.addForm.endDate ?? '',
    });
    this.closeAddModal();
  }

  // ── Edit modal ───────────────────────────────────────────
  editingRow: RosterRow | null = null;
  editForm: Partial<RosterRow> = {};

  openEdit(row: RosterRow): void {
    this.editingRow = row;
    this.editForm   = { ...row };
  }
  closeEdit(): void { this.editingRow = null; this.editForm = {}; }

  saveEdit(): void {
    if (!this.editingRow) return;
    Object.assign(this.editingRow, this.editForm);
    this.closeEdit();
  }

  trackByRosterId(_index: number, row: RosterRow): number { return row.id; }
  trackByIndex(index: number): number { return index; }

  // ── Export ───────────────────────────────────────────────
  exportCsv(): void {
    const headers = ['Territory ID', 'ABD', 'TBM', 'Start Date', 'End Date', 'Status'];
    const escape  = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csvRows = this.filteredRows.map(r => [
      r.territoryId, r.abd, r.tbm, r.startDate, r.endDate, this.rowStatus(r)
    ].map(escape).join(','));
    const csv  = [headers.map(escape).join(','), ...csvRows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `roster-placement-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
