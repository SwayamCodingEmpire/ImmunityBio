import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ZipRow {
  mdoZip: string;
  territoryId: string;
  city: string;
  state: string;
  currTerr: string;
  lgcyTerr: string;
  abd: string;
  tbm: string;
  effective: string;
  startDate: string;
  endDate: string;
  source: string;
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

  readonly rows: ZipRow[] = [
    { mdoZip: '75082', territoryId: 'TX3829', city: 'Richardson', state: 'TX', currTerr: 'NC1', lgcyTerr: 'NCA',     abd: 'C. Gaetano',    tbm: 'A. Rippy',        effective: '04/01/2026', startDate: '2026-04-01', endDate: '',           source: 'Veeva'        },
    { mdoZip: '27701', territoryId: 'NC4721', city: 'Durham',    state: 'NC', currTerr: 'EA1', lgcyTerr: 'EAA',     abd: 'K. DeRuiter',   tbm: 'L. Volomino',     effective: '04/01/2026', startDate: '2026-04-01', endDate: '',           source: 'Veeva'        },
    { mdoZip: '75201', territoryId: 'TX5614', city: 'Dallas',    state: 'TX', currTerr: 'SW1', lgcyTerr: 'SWA',     abd: 'A. Maddalozzo', tbm: 'K. Denor-Alcala', effective: '04/01/2026', startDate: '2026-04-01', endDate: '',           source: 'Veeva'        },
    { mdoZip: '15224', territoryId: 'PA8834', city: 'Pittsburgh', state: 'PA', currTerr: 'EA1', lgcyTerr: 'EA1',    abd: 'K. DeRuiter',   tbm: 'H. Ritter',       effective: '03/01/2026', startDate: '2026-03-01', endDate: '',           source: 'Veeva'        },
    { mdoZip: '21201', territoryId: 'MD2983', city: 'Baltimore', state: 'MD', currTerr: 'NC1', lgcyTerr: 'SC1→NC1', abd: 'C. Gaetano',    tbm: 'B. Girbes',       effective: '01/01/2026', startDate: '2026-01-01', endDate: '2026-03-31', source: 'Realigned Q2' },
    { mdoZip: '60430', territoryId: 'IL5982', city: 'Homewood',  state: 'IL', currTerr: 'NC1', lgcyTerr: 'NCA',     abd: 'K. DeRuiter',   tbm: 'R. Evans',        effective: '01/01/2026', startDate: '2026-01-01', endDate: '2026-04-30', source: 'Veeva'        },
    { mdoZip: '30043', territoryId: 'GA7741', city: 'Lawrenceville', state: 'GA', currTerr: 'SC1', lgcyTerr: 'SCA', abd: 'C. Gaetano',    tbm: 'M. Real',         effective: '01/01/2026', startDate: '2026-01-01', endDate: '',           source: 'Veeva'        },
  ];

  get filteredRows(): ZipRow[] {
    const zip  = this.filterZip.trim().toLowerCase();
    const terr = this.filterTerritory.trim().toLowerCase();
    return this.rows.filter(r =>
      (!zip  || r.mdoZip.includes(zip) || r.city.toLowerCase().includes(zip) || r.state.toLowerCase().includes(zip)) &&
      (!terr || r.currTerr.toLowerCase().includes(terr) || r.lgcyTerr.toLowerCase().includes(terr))
    );
  }

  applyFilters(): void {
    this.filterZip       = this.pendingZip;
    this.filterTerritory = this.pendingTerritory;
  }

  exportCsv(): void {
    const headers = ['MDO ZIP','Territory ID','City','State','Curr Terr','Lgcy Terr','ABD','TBM','Effective','Start Date','End Date','Source'];
    const escape  = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows    = this.filteredRows.map(r => [
      r.mdoZip, r.territoryId, r.city, r.state, r.currTerr, r.lgcyTerr,
      r.abd, r.tbm, r.effective, r.startDate, r.endDate, r.source
    ].map(escape).join(','));
    const csv  = [headers.map(escape).join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `zip-to-territory-${new Date().toISOString().slice(0,10)}.csv`;
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
