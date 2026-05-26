import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface IcsAccount {
  bpNumber: string;
  shipToName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface AccredoAccount {
  npiNumber: string;
  providerName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface MasterAccount {
  masterAccountName: string;
  icsAccounts: IcsAccount[];
  accredoAccounts: AccredoAccount[];
}

function emptyIcs(): IcsAccount {
  return { bpNumber: '', shipToName: '', address: '', city: '', state: '', zip: '' };
}
function emptyAccredo(): AccredoAccount {
  return { npiNumber: '', providerName: '', address: '', city: '', state: '', zip: '' };
}

@Component({
  selector: 'app-customer-matrix',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-matrix.component.html',
  styleUrl: './customer-matrix.component.scss'
})
export class CustomerMatrixComponent {

  searchQuery = '';
  channelFilter: 'all' | 'ics' | 'accredo' | 'both' | 'neither' = 'all';

  private sectionState = new Map<MasterAccount, { ics: boolean; accredo: boolean }>();

  // Inline master-name editing
  editingNameAccount: MasterAccount | null = null;
  editingNameValue = '';

  // Inline row editing
  editingIcsRow: { account: MasterAccount; index: number; form: IcsAccount } | null = null;
  editingAccredoRow: { account: MasterAccount; index: number; form: AccredoAccount } | null = null;

  // Inline row adding
  addingIcsAccount: MasterAccount | null = null;
  addingAccredoAccount: MasterAccount | null = null;
  newIcsRow: IcsAccount = emptyIcs();
  newAccredoRow: AccredoAccount = emptyAccredo();

  // ── Sample data ───────────────────────────────────────────────
  accounts: MasterAccount[] = [
    {
      masterAccountName: 'BARTLETT UROLOGY ASSOCIATES',
      icsAccounts: [
        { bpNumber: '420193847', shipToName: 'BARTLETT UROLOGY MAIN CAMPUS', address: '6025 LAKE RD', city: 'WOODBURY', state: 'MN', zip: '55125' },
        { bpNumber: '387204561', shipToName: 'BARTLETT UROLOGY SATELLITE', address: '6025 LAKE RD STE 2', city: 'WOODBURY', state: 'MN', zip: '55125' },
        { bpNumber: '551836204', shipToName: 'BARTLETT UROLOGY EAST CAMPUS', address: '1200 MILLER RD', city: 'SAINT PAUL', state: 'MN', zip: '55101' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'ACCREDO HEALTH GROUP INC',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1487392056', providerName: 'ACCREDO HEALTH MEMPHIS', address: '1620 CENTURY CENTER PKWY', city: 'MEMPHIS', state: 'TN', zip: '38134' },
        { npiNumber: '1603847291', providerName: 'ACCREDO HEALTH EAST DIVISION', address: '2840 RIDGELINE DR STE 100', city: 'NASHVILLE', state: 'TN', zip: '37211' },
        { npiNumber: '1920384756', providerName: 'ACCREDO HEALTH SOUTHWEST', address: '9901 LINN STATION RD', city: 'LOUISVILLE', state: 'KY', zip: '40223' },
      ],
    },
    {
      masterAccountName: 'ADENA REGIONAL MED CNTR',
      icsAccounts: [
        { bpNumber: '628374019', shipToName: 'ADENA REGIONAL MED CNTR MAIN', address: '4435 SR 159', city: 'CHILLICOTHE', state: 'OH', zip: '45601' },
        { bpNumber: '473920184', shipToName: 'ADENA CANCER CARE CTR', address: '272 N PAINT ST', city: 'CHILLICOTHE', state: 'OH', zip: '45601' },
        { bpNumber: '819302746', shipToName: 'ADENA ONCOLOGY SOUTH', address: '480 N BRIDGE ST', city: 'CHILLICOTHE', state: 'OH', zip: '45601' },
        { bpNumber: '302847561', shipToName: 'ADENA HIGHLAND DISTRICT HOSP', address: '1275 N HIGH ST', city: 'HILLSBORO', state: 'OH', zip: '45133' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'COASTAL ONCOLOGY PARTNERS',
      icsAccounts: [
        { bpNumber: '748203916', shipToName: 'COASTAL ONCOLOGY MAIN', address: '3435 BRECKINRIDGE BLVD', city: 'DULUTH', state: 'GA', zip: '30096' },
        { bpNumber: '563019482', shipToName: 'COASTAL ONCOLOGY BUFORD', address: '2700 MALL OF GEORGIA BLVD', city: 'BUFORD', state: 'GA', zip: '30519' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'ADVANCED UROLOGY ATRIUM HEALTH',
      icsAccounts: [
        { bpNumber: '392018475', shipToName: 'ADVANCED UROLOGY LELAND', address: '144 POOLE RD', city: 'LELAND', state: 'NC', zip: '28451' },
        { bpNumber: '847361029', shipToName: 'ADVANCED UROLOGY WILMINGTON MAIN', address: '1800 MEDICAL CENTER DR', city: 'WILMINGTON', state: 'NC', zip: '28403' },
        { bpNumber: '205938471', shipToName: 'ADVANCED UROLOGY BRUNSWICK CTY', address: '50 DOCTORS DR', city: 'SUPPLY', state: 'NC', zip: '28462' },
        { bpNumber: '693847102', shipToName: 'ADVANCED UROLOGY MYRTLE GROVE', address: '4901 OLEANDER DR', city: 'WILMINGTON', state: 'NC', zip: '28403' },
        { bpNumber: '417382950', shipToName: 'ADVANCED UROLOGY SCOTTS HILL', address: '3985 SCOTTS HILL LOOP RD', city: 'WILMINGTON', state: 'NC', zip: '28411' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'ADVANCED UROLOGY PLLC',
      icsAccounts: [
        { bpNumber: '782039146', shipToName: 'ADVANCED UROLOGY LONE TREE', address: '10535 PARK MEADOWS BLVD', city: 'LONE TREE', state: 'CO', zip: '80124' },
        { bpNumber: '930481726', shipToName: 'ADVANCED UROLOGY HIGHLANDS RANCH', address: '9336 DORCHESTER ST', city: 'HIGHLANDS RANCH', state: 'CO', zip: '80129' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'HASSAN NADEEM MD',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1837264091', providerName: 'HASSAN NADEEM MD RICHARDSON', address: '3030 WATERVIEW PKWY', city: 'RICHARDSON', state: 'TX', zip: '75080' },
        { npiNumber: '1049382756', providerName: 'HASSAN NADEEM MD PLANO', address: '5200 W PLANO PKWY', city: 'PLANO', state: 'TX', zip: '75093' },
        { npiNumber: '1728304965', providerName: 'HASSAN NADEEM MD DALLAS NORTH', address: '8200 WALNUT HILL LN', city: 'DALLAS', state: 'TX', zip: '75231' },
        { npiNumber: '1506293847', providerName: 'HASSAN NADEEM MD FRISCO', address: '3535 LEGACY DR', city: 'FRISCO', state: 'TX', zip: '75034' },
      ],
    },
    {
      masterAccountName: 'GARZA RAYMOND J MD',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1374920583', providerName: 'GARZA RAYMOND J MD WATKINSVILLE', address: '1150 GOLDEN WAY', city: 'WATKINSVILLE', state: 'GA', zip: '30677' },
        { npiNumber: '1829304756', providerName: 'GARZA RAYMOND J MD ATHENS', address: '1199 PRINCE AVE', city: 'ATHENS', state: 'GA', zip: '30606' },
      ],
    },
    {
      masterAccountName: 'FELDMAN DAVID B MD',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1647382910', providerName: 'FELDMAN DAVID B MD MONROEVILLE', address: '2790 MOSSIDE BLVD', city: 'MONROEVILLE', state: 'PA', zip: '15146' },
        { npiNumber: '1028374659', providerName: 'FELDMAN DAVID B MD PITTSBURGH', address: '4800 FRIENDSHIP AVE', city: 'PITTSBURGH', state: 'PA', zip: '15224' },
        { npiNumber: '1593027481', providerName: 'FELDMAN DAVID B MD CRANBERRY TWP', address: '1 ST FRANCIS WAY', city: 'CRANBERRY TWP', state: 'PA', zip: '16066' },
      ],
    },
    {
      masterAccountName: 'ALLEGHENY HEALTH NETWORK CANCER',
      icsAccounts: [
        { bpNumber: '874013629', shipToName: 'AHN CANCER CTR MONACA', address: '81 WAGNER RD', city: 'MONACA', state: 'PA', zip: '15061' },
        { bpNumber: '531029847', shipToName: 'AHN CANCER CTR PITTSBURGH', address: '4818 LIBERTY AVE', city: 'PITTSBURGH', state: 'PA', zip: '15224' },
        { bpNumber: '298473016', shipToName: 'AHN CANCER CTR WEXFORD', address: '10990 PERRY HWY', city: 'WEXFORD', state: 'PA', zip: '15090' },
        { bpNumber: '647830192', shipToName: 'AHN CANCER CTR BETHEL PARK', address: '100 MOFFETT RD', city: 'BETHEL PARK', state: 'PA', zip: '15102' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'ALLINA HEALTH SYSTEM',
      icsAccounts: [
        { bpNumber: '419203857', shipToName: 'ALLINA ABBOTT NORTHWESTERN HOSP', address: '800 E 28TH ST', city: 'MINNEAPOLIS', state: 'MN', zip: '55407' },
        { bpNumber: '736481029', shipToName: 'ALLINA UNITY HOSPITAL', address: '550 OSBORNE RD NE', city: 'FRIDLEY', state: 'MN', zip: '55432' },
        { bpNumber: '582930147', shipToName: 'ALLINA MERCY HOSPITAL COON RAPIDS', address: '4050 COON RAPIDS BLVD', city: 'COON RAPIDS', state: 'MN', zip: '55433' },
      ],
      accredoAccounts: [
        { npiNumber: '1382047596', providerName: 'ALLINA HEALTH HOME INFUSION MPLS', address: '2925 CHICAGO AVE', city: 'MINNEAPOLIS', state: 'MN', zip: '55407' },
      ],
    },
    {
      masterAccountName: 'AMERICAN ONC ARKANSAS',
      icsAccounts: [
        { bpNumber: '904738261', shipToName: 'AMERICAN ONC AR HOT SPRINGS', address: '133 HARMONY PARK CIR', city: 'HOT SPRINGS', state: 'AR', zip: '71913' },
        { bpNumber: '371829046', shipToName: 'AMERICAN ONC AR LITTLE ROCK', address: '9500 KANIS RD', city: 'LITTLE ROCK', state: 'AR', zip: '72205' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'AMERICAN ONC TEXAS',
      icsAccounts: [
        { bpNumber: '658302914', shipToName: 'AMERICAN ONC TX HOUSTON MAIN', address: '2130 W HOLCOMBE BLVD 10TH FL', city: 'HOUSTON', state: 'TX', zip: '77030' },
        { bpNumber: '192847036', shipToName: 'AMERICAN ONC TX HOUSTON WEST', address: '2130 W HOLCOMBE BLVD 9TH FL', city: 'HOUSTON', state: 'TX', zip: '77030' },
        { bpNumber: '847203961', shipToName: 'AMERICAN ONC TX SUGAR LAND', address: '17520 W GRAND PKWY S', city: 'SUGAR LAND', state: 'TX', zip: '77479' },
        { bpNumber: '503918274', shipToName: 'AMERICAN ONC TX THE WOODLANDS', address: '17183 ST LUKES WAY', city: 'THE WOODLANDS', state: 'TX', zip: '77384' },
        { bpNumber: '729480163', shipToName: 'AMERICAN ONC TX KATY', address: '23900 KATY FREEWAY', city: 'KATY', state: 'TX', zip: '77494' },
        { bpNumber: '381029475', shipToName: 'AMERICAN ONC TX PEARLAND', address: '11200 BROADWAY ST', city: 'PEARLAND', state: 'TX', zip: '77584' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'NORTHEAST UROLOGY ASSOCIATES',
      icsAccounts: [
        { bpNumber: '620394817', shipToName: 'NORTHEAST UROLOGY HARTFORD', address: '2 ELLINWOOD DRIVE', city: 'HARTFORD', state: 'NY', zip: '13413' },
        { bpNumber: '847201396', shipToName: 'NORTHEAST UROLOGY NEW HARTFORD', address: '35 CLINTON RD', city: 'NEW HARTFORD', state: 'NY', zip: '13413' },
        { bpNumber: '503847129', shipToName: 'NORTHEAST UROLOGY ROME', address: '264 W DOMINICK ST', city: 'ROME', state: 'NY', zip: '13440' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'CENTRAL NY UROLOGY GROUP',
      icsAccounts: [
        { bpNumber: '739201485', shipToName: 'CENTRAL NY UROLOGY SYRACUSE', address: '1226 EAST WATER ST', city: 'SYRACUSE', state: 'NY', zip: '13210' },
        { bpNumber: '481930276', shipToName: 'CENTRAL NY UROLOGY DEWITT', address: '4900 BROAD RD', city: 'DEWITT', state: 'NY', zip: '13214' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'PATEL VIKRAM R MD',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1203847596', providerName: 'PATEL VIKRAM R MD JOHNSON CITY', address: '1301 SUNSET DR STE 3', city: 'JOHNSON CITY', state: 'TN', zip: '37604' },
        { npiNumber: '1748392065', providerName: 'PATEL VIKRAM R MD KINGSPORT', address: '2204 PAVILION DR', city: 'KINGSPORT', state: 'TN', zip: '37660' },
        { npiNumber: '1039284756', providerName: 'PATEL VIKRAM R MD ELIZABETHTON', address: '425 CENTURY LN', city: 'ELIZABETHTON', state: 'TN', zip: '37643' },
        { npiNumber: '1574829036', providerName: 'PATEL VIKRAM R MD GREENEVILLE', address: '1641 TUSCULUM BLVD', city: 'GREENEVILLE', state: 'TN', zip: '37745' },
      ],
    },
    {
      masterAccountName: 'ANNE ARUNDEL UROLOGY PA',
      icsAccounts: [
        { bpNumber: '362019847', shipToName: 'ANNE ARUNDEL UROLOGY ANNAPOLIS', address: '600 RIDGELY AVE', city: 'ANNAPOLIS', state: 'MD', zip: '21401' },
        { bpNumber: '819304726', shipToName: 'ANNE ARUNDEL UROLOGY GLEN BURNIE', address: '1 HOSPITAL DR', city: 'GLEN BURNIE', state: 'MD', zip: '21061' },
        { bpNumber: '547830219', shipToName: 'ANNE ARUNDEL UROLOGY MILLERSVILLE', address: '8322 VETERANS HWY', city: 'MILLERSVILLE', state: 'MD', zip: '21108' },
      ],
      accredoAccounts: [],
    },
  ];

  // ── Computed ──────────────────────────────────────────────────
  get filteredAccounts(): MasterAccount[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = q ? this.accounts.filter(a => a.masterAccountName.toLowerCase().includes(q)) : this.accounts;

    switch (this.channelFilter) {
      case 'ics':     list = list.filter(a => a.icsAccounts.length > 0 && a.accredoAccounts.length === 0); break;
      case 'accredo': list = list.filter(a => a.accredoAccounts.length > 0 && a.icsAccounts.length === 0); break;
      case 'both':    list = list.filter(a => a.icsAccounts.length > 0 && a.accredoAccounts.length > 0); break;
      case 'neither': list = list.filter(a => a.icsAccounts.length === 0 && a.accredoAccounts.length === 0); break;
    }
    return list;
  }

  // ── Section expand / collapse ─────────────────────────────────
  isSectionOpen(account: MasterAccount, section: 'ics' | 'accredo'): boolean {
    return this.sectionState.get(account)?.[section] ?? false;
  }

  toggleSection(account: MasterAccount, section: 'ics' | 'accredo'): void {
    const current = this.isSectionOpen(account, section);
    const existing = this.sectionState.get(account) ?? { ics: false, accredo: false };
    this.sectionState.set(account, { ...existing, [section]: !current });
  }

  get allExpanded(): boolean {
    return this.filteredAccounts.every(a => {
      const s = this.sectionState.get(a);
      return s?.ics && s?.accredo;
    });
  }

  expandAll(): void {
    this.filteredAccounts.forEach(a =>
      this.sectionState.set(a, { ics: true, accredo: true })
    );
  }

  collapseAll(): void {
    this.filteredAccounts.forEach(a =>
      this.sectionState.set(a, { ics: false, accredo: false })
    );
  }

  // ── Inline master-name editing ────────────────────────────────
  startEditName(account: MasterAccount): void {
    this.editingNameAccount = account;
    this.editingNameValue = account.masterAccountName;
  }

  saveEditName(): void {
    if (this.editingNameAccount && this.editingNameValue.trim()) {
      this.editingNameAccount.masterAccountName = this.editingNameValue.trim();
    }
    this.editingNameAccount = null;
    this.editingNameValue = '';
  }

  cancelEditName(): void {
    this.editingNameAccount = null;
    this.editingNameValue = '';
  }

  // ── ICS row actions ───────────────────────────────────────────
  isEditingIcsRow(account: MasterAccount, index: number): boolean {
    return this.editingIcsRow?.account === account && this.editingIcsRow?.index === index;
  }

  startEditIcsRow(account: MasterAccount, index: number): void {
    this.editingIcsRow = { account, index, form: { ...account.icsAccounts[index] } };
    this.editingAccredoRow = null;
  }

  saveEditIcsRow(): void {
    if (!this.editingIcsRow) return;
    const { account, index, form } = this.editingIcsRow;
    account.icsAccounts[index] = { ...form };
    this.editingIcsRow = null;
  }

  cancelEditIcsRow(): void {
    this.editingIcsRow = null;
  }

  deleteIcsRow(account: MasterAccount, index: number): void {
    const row = account.icsAccounts[index];
    if (!confirm(`Delete BP account "${row.bpNumber} — ${row.shipToName}"?\nThis cannot be undone.`)) return;
    account.icsAccounts.splice(index, 1);
    if (this.editingIcsRow?.account === account && this.editingIcsRow?.index === index) {
      this.editingIcsRow = null;
    }
  }

  startAddIcsRow(account: MasterAccount): void {
    this.addingIcsAccount = account;
    this.newIcsRow = emptyIcs();
    this.editingIcsRow = null;
    const existing = this.sectionState.get(account) ?? { ics: false, accredo: false };
    this.sectionState.set(account, { ...existing, ics: true });
  }

  confirmAddIcsRow(): void {
    if (!this.addingIcsAccount || !this.newIcsRow.bpNumber.trim()) return;
    this.addingIcsAccount.icsAccounts.push({ ...this.newIcsRow });
    this.addingIcsAccount = null;
    this.newIcsRow = emptyIcs();
  }

  cancelAddIcsRow(): void {
    this.addingIcsAccount = null;
    this.newIcsRow = emptyIcs();
  }

  // ── Accredo row actions ───────────────────────────────────────
  isEditingAccredoRow(account: MasterAccount, index: number): boolean {
    return this.editingAccredoRow?.account === account && this.editingAccredoRow?.index === index;
  }

  startEditAccredoRow(account: MasterAccount, index: number): void {
    this.editingAccredoRow = { account, index, form: { ...account.accredoAccounts[index] } };
    this.editingIcsRow = null;
  }

  saveEditAccredoRow(): void {
    if (!this.editingAccredoRow) return;
    const { account, index, form } = this.editingAccredoRow;
    account.accredoAccounts[index] = { ...form };
    this.editingAccredoRow = null;
  }

  cancelEditAccredoRow(): void {
    this.editingAccredoRow = null;
  }

  deleteAccredoRow(account: MasterAccount, index: number): void {
    const row = account.accredoAccounts[index];
    if (!confirm(`Delete Accredo account "${row.npiNumber} — ${row.providerName}"?\nThis cannot be undone.`)) return;
    account.accredoAccounts.splice(index, 1);
    if (this.editingAccredoRow?.account === account && this.editingAccredoRow?.index === index) {
      this.editingAccredoRow = null;
    }
  }

  startAddAccredoRow(account: MasterAccount): void {
    this.addingAccredoAccount = account;
    this.newAccredoRow = emptyAccredo();
    this.editingAccredoRow = null;
    const existing = this.sectionState.get(account) ?? { ics: false, accredo: false };
    this.sectionState.set(account, { ...existing, accredo: true });
  }

  confirmAddAccredoRow(): void {
    if (!this.addingAccredoAccount || !this.newAccredoRow.npiNumber.trim()) return;
    this.addingAccredoAccount.accredoAccounts.push({ ...this.newAccredoRow });
    this.addingAccredoAccount = null;
    this.newAccredoRow = emptyAccredo();
  }

  cancelAddAccredoRow(): void {
    this.addingAccredoAccount = null;
    this.newAccredoRow = emptyAccredo();
  }
}
