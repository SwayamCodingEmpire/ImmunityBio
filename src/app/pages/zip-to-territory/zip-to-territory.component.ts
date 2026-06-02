import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ZipHistory {
  territoryId: string;
  currTerr: string;
  veevaAreaId: string;
  tbm: string;
  startDate: string;
  endDate: string;
}

interface ZipRow {
  mdoZip: string;
  territoryId: string;
  city: string;
  state: string;
  currTerr: string;
  veevaAreaId: string;
  tbm: string;
  startDate: string;
  endDate: string;
  history: ZipHistory[];
}

@Component({
  selector: 'app-zip-to-territory',
  imports: [CommonModule, FormsModule],
  templateUrl: './zip-to-territory.component.html',
  styleUrl: './zip-to-territory.component.scss'
})
export class ZipToTerritoryComponent {

  filterZip = '';
  filterTerritory = '';
  pendingZip = '';
  pendingTerritory = '';

  editingRow: ZipRow | null = null;
  editForm: Partial<ZipRow> = {};

  private expandedZips = new Set<string>();

  readonly rows: ZipRow[] = [
    {
      mdoZip: '75082', territoryId: 'TX3829', city: 'Richardson',    state: 'TX',
      currTerr: 'NC1', veevaAreaId: 'VA-NC01', tbm: 'A. Rippy',
      startDate: '2026-04-01', endDate: '',
      history: [
        { territoryId: 'TX1247', currTerr: 'SW1', veevaAreaId: 'VA-SW01', tbm: 'D. Martinez', startDate: '2025-01-01', endDate: '2025-12-31' }
      ]
    },
    {
      mdoZip: '27701', territoryId: 'NC4712', city: 'Durham',        state: 'NC',
      currTerr: 'EA1', veevaAreaId: 'VA-EA01', tbm: 'L. Volomino',
      startDate: '2026-04-01', endDate: '',
      history: []
    },
    {
      mdoZip: '75201', territoryId: 'TX8043', city: 'Dallas',        state: 'TX',
      currTerr: 'SW1', veevaAreaId: 'VA-SW01', tbm: 'K. Denor-Alcala',
      startDate: '2026-04-01', endDate: '',
      history: [
        { territoryId: 'TX6091', currTerr: 'NC1', veevaAreaId: 'VA-NC01', tbm: 'P. Chen', startDate: '2025-07-01', endDate: '2026-03-31' }
      ]
    },
    {
      mdoZip: '15224', territoryId: 'PA2156', city: 'Pittsburgh',    state: 'PA',
      currTerr: 'EA1', veevaAreaId: 'VA-EA01', tbm: 'H. Ritter',
      startDate: '2026-03-01', endDate: '',
      history: [
        { territoryId: 'PA8834', currTerr: 'NE1', veevaAreaId: 'VA-NE01', tbm: 'S. Walsh', startDate: '2025-01-01', endDate: '2026-02-28' }
      ]
    },
    {
      mdoZip: '21201', territoryId: 'MD7394', city: 'Baltimore',     state: 'MD',
      currTerr: 'NC1', veevaAreaId: 'VA-NC01', tbm: 'B. Girbes',
      startDate: '2026-01-01', endDate: '2026-03-31',
      history: [
        { territoryId: 'MD3156', currTerr: 'EA1', veevaAreaId: 'VA-EA01', tbm: 'T. Brown', startDate: '2025-06-01', endDate: '2025-12-31' }
      ]
    },
    {
      mdoZip: '60430', territoryId: 'IL5628', city: 'Homewood',      state: 'IL',
      currTerr: 'NC1', veevaAreaId: 'VA-NC01', tbm: 'R. Evans',
      startDate: '2026-01-01', endDate: '2026-04-30',
      history: []
    },
    {
      mdoZip: '30043', territoryId: 'GA9017', city: 'Lawrenceville', state: 'GA',
      currTerr: 'SC1', veevaAreaId: 'VA-SC01', tbm: 'M. Real',
      startDate: '2026-01-01', endDate: '',
      history: []
    },
  ];

  get filteredRows(): ZipRow[] {
    const zip  = this.filterZip.trim().toLowerCase();
    const terr = this.filterTerritory.trim().toLowerCase();
    return this.rows.filter(r =>
      (!zip  || r.mdoZip.includes(zip) || r.city.toLowerCase().includes(zip) || r.state.toLowerCase().includes(zip)) &&
      (!terr || r.currTerr.toLowerCase().includes(terr))
    );
  }

  applyFilters(): void {
    this.filterZip       = this.pendingZip;
    this.filterTerritory = this.pendingTerritory;
  }

  isExpanded(zip: string): boolean {
    return this.expandedZips.has(zip);
  }

  toggleHistory(zip: string): void {
    if (this.expandedZips.has(zip)) {
      this.expandedZips.delete(zip);
    } else {
      this.expandedZips.add(zip);
    }
  }

  exportCsv(): void {
    const headers = ['MDO ZIP', 'Territory ID', 'City', 'State', 'Curr Terr', 'Veeva Area ID', 'TBM', 'Start Date', 'End Date'];
    const escape  = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows    = this.filteredRows.map(r => [
      r.mdoZip, r.territoryId, r.city, r.state, r.currTerr,
      r.veevaAreaId, r.tbm, r.startDate, r.endDate
    ].map(escape).join(','));
    const csv  = [headers.map(escape).join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `zip-to-territory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  openEdit(row: ZipRow): void {
    this.editingRow = row;
    this.editForm = { ...row };
  }

  closeEdit(): void {
    this.editingRow = null;
    this.editForm = {};
  }

  saveEdit(): void {
    if (!this.editingRow) return;
    Object.assign(this.editingRow, this.editForm);
    this.closeEdit();
  }
}
