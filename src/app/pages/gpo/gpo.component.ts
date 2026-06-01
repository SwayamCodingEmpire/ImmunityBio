import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GpoHierarchy {
  id: string;
  gpoL1: string; gpoL1Start: string; gpoL1End: string; gpoL1Rebate: string;
  gpoL2: string; gpoL2Start: string; gpoL2End: string; gpoL2Rebate: string;
  gpoL3: string; gpoL3Start: string; gpoL3End: string; gpoL3Rebate: string;
  gpoL4: string; gpoL4Start: string; gpoL4End: string;
  gpoL5: string; gpoL5Start: string; gpoL5End: string;
}

function emptyHierarchy(id = ''): GpoHierarchy {
  return {
    id,
    gpoL1: '', gpoL1Start: '', gpoL1End: '', gpoL1Rebate: '',
    gpoL2: '', gpoL2Start: '', gpoL2End: '', gpoL2Rebate: '',
    gpoL3: '', gpoL3Start: '', gpoL3End: '', gpoL3Rebate: '',
    gpoL4: '', gpoL4Start: '', gpoL4End: '',
    gpoL5: '', gpoL5Start: '', gpoL5End: '',
  };
}

@Component({
  selector: 'app-gpo',
  imports: [CommonModule, FormsModule],
  templateUrl: './gpo.component.html',
  styleUrl: './gpo.component.scss'
})
export class GpoComponent {

  editingRow: GpoHierarchy | null = null;
  editForm: GpoHierarchy = emptyHierarchy();
  isAddMode = false;

  rows: GpoHierarchy[] = [
    {
      id: 'GPO-001',
      gpoL1: 'Cornerstone',         gpoL1Start: '2025-01-01', gpoL1End: '',        gpoL1Rebate: '3.0',
      gpoL2: 'Urology Management Alliance (UMA)', gpoL2Start: '2025-01-01', gpoL2End: '', gpoL2Rebate: '2.5',
      gpoL3: 'Minnesota Urology',   gpoL3Start: '2025-01-01', gpoL3End: '',        gpoL3Rebate: '1.5',
      gpoL4: '',                    gpoL4Start: '',            gpoL4End: '',
      gpoL5: '',                    gpoL5Start: '',            gpoL5End: '',
    },
    {
      id: 'GPO-002',
      gpoL1: 'UroGPO',              gpoL1Start: '2025-01-01', gpoL1End: '',        gpoL1Rebate: '4.0',
      gpoL2: 'US Urology Partners', gpoL2Start: '2025-01-01', gpoL2End: '',        gpoL2Rebate: '3.0',
      gpoL3: 'Associated Medical Professionals', gpoL3Start: '2025-01-01', gpoL3End: '', gpoL3Rebate: '2.0',
      gpoL4: '',                    gpoL4Start: '',            gpoL4End: '',
      gpoL5: '',                    gpoL5Start: '',            gpoL5End: '',
    },
    {
      id: 'GPO-003',
      gpoL1: 'Cencora GPO',         gpoL1Start: '2025-01-01', gpoL1End: '',        gpoL1Rebate: '3.5',
      gpoL2: 'OneOncology',         gpoL2Start: '2025-01-01', gpoL2End: '',        gpoL2Rebate: '2.75',
      gpoL3: 'United Urology Grp',  gpoL3Start: '2025-01-01', gpoL3End: '',        gpoL3Rebate: '1.5',
      gpoL4: 'Colorado Urology',    gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: 'Advanced Urology Pllc', gpoL5Start: '2025-01-01', gpoL5End: '',
    },
    {
      id: 'GPO-004',
      gpoL1: 'UroGPO',              gpoL1Start: '2025-01-01', gpoL1End: '',        gpoL1Rebate: '4.0',
      gpoL2: 'Urology Alliance',    gpoL2Start: '2025-01-01', gpoL2End: '',        gpoL2Rebate: '3.25',
      gpoL3: 'Solaris',             gpoL3Start: '2025-01-01', gpoL3End: '',        gpoL3Rebate: '2.5',
      gpoL4: 'Anne Arundel Urology', gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: '',                    gpoL5Start: '',            gpoL5End: '',
    },
    {
      id: 'GPO-005',
      gpoL1: 'UroGPO',              gpoL1Start: '2024-01-01', gpoL1End: '',        gpoL1Rebate: '4.0',
      gpoL2: 'Urology Management Alliance (UMA)', gpoL2Start: '2024-01-01', gpoL2End: '', gpoL2Rebate: '2.5',
      gpoL3: 'Georgia Urology',     gpoL3Start: '2024-01-01', gpoL3End: '2025-12-31', gpoL3Rebate: '1.0',
      gpoL4: '',                    gpoL4Start: '',            gpoL4End: '',
      gpoL5: '',                    gpoL5Start: '',            gpoL5End: '',
    },
  ];

  isLevelActive(endDate: string): boolean {
    if (!endDate) return true;
    return new Date(endDate) > new Date();
  }

  openEdit(row: GpoHierarchy): void {
    this.isAddMode  = false;
    this.editingRow = row;
    this.editForm   = { ...row };
  }

  openAdd(): void {
    this.isAddMode  = true;
    this.editingRow = emptyHierarchy('__new__');
    this.editForm   = emptyHierarchy();
  }

  closeEdit(): void {
    this.editingRow = null;
    this.editForm   = emptyHierarchy();
  }

  saveEdit(): void {
    if (!this.editingRow) return;
    if (this.isAddMode) {
      const next = this.rows.length + 1;
      this.rows.push({ ...this.editForm, id: `GPO-${String(next).padStart(3, '0')}` });
    } else {
      Object.assign(this.editingRow, this.editForm);
    }
    this.closeEdit();
  }

  deleteRow(row: GpoHierarchy): void {
    if (!confirm(`Delete GPO hierarchy "${row.gpoL1}"? This cannot be undone.`)) return;
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
