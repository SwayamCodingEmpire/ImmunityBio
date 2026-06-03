import { Component, HostListener } from '@angular/core';
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

export interface IbCareSite {
  id: string;
  name: string;
}

export interface MasterAccount {
  masterAccountName: string;
  accountType: 'Community' | 'Hospital' | 'Academic' | '';
  ibCareSiteId: string;
  ibCareSiteName: string;
  gpoL1: string; gpoL1Start: string; gpoL1End: string;
  gpoL2: string; gpoL2Start: string; gpoL2End: string;
  gpoL3: string; gpoL3Start: string; gpoL3End: string;
  gpoL4: string; gpoL4Start: string; gpoL4End: string;
  gpoL5: string; gpoL5Start: string; gpoL5End: string;
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
  channelFilter: 'all' | 'ics' | 'accredo' = 'all';

  private sectionState = new Map<MasterAccount, { gpo: boolean; ics: boolean; accredo: boolean }>();

  // IB Care Site master list
  readonly ibCareSites: IbCareSite[] = [
    { id: 'IB-SITE-001', name: 'Bartlett Urology Main' },
    { id: 'IB-SITE-002', name: 'Adena Cancer Center' },
    { id: 'IB-SITE-003', name: 'Coastal Oncology Hub' },
    { id: 'IB-SITE-004', name: 'Atrium Advanced Urology' },
    { id: 'IB-SITE-005', name: 'AHN Cancer Center' },
    { id: 'IB-SITE-006', name: 'Allina Oncology Hub' },
    { id: 'IB-SITE-007', name: 'American Oncology AR' },
    { id: 'IB-SITE-008', name: 'American Oncology TX' },
    { id: 'IB-SITE-009', name: 'Northeast Urology Hub' },
    { id: 'IB-SITE-010', name: 'Central NY Urology Hub' },
  ];

  // IB Care Site searchable dropdown state
  editingIbSiteValue  = '';   // "ID — Name" of selected site
  ibSiteDropdownOpen  = false;
  ibSiteSearchTerm    = '';

  get filteredIbSites(): IbCareSite[] {
    const q = this.ibSiteSearchTerm.trim().toLowerCase();
    return !q ? this.ibCareSites : this.ibCareSites.filter(
      s => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.ibSiteDropdownOpen = false;
  }

  openIbSiteDropdown(): void {
    if (this.ibSiteDropdownOpen) {
      this.ibSiteDropdownOpen = false;
      this.ibSiteSearchTerm   = '';
      return;
    }
    this.ibSiteDropdownOpen = true;
    this.ibSiteSearchTerm   = '';
    setTimeout(() => {
      (document.querySelector('.cm-site-dropdown__search-input') as HTMLInputElement)?.focus();
    }, 30);
  }

  selectIbSite(site: IbCareSite | null): void {
    this.editingIbSiteValue = site ? `${site.id} — ${site.name}` : '';
    this.ibSiteDropdownOpen = false;
    this.ibSiteSearchTerm   = '';
    // stop the click from bubbling to document and re-triggering close
    event?.stopPropagation();
  }

  applyIbSiteToAccount(account: MasterAccount): void {
    const site = this.ibCareSites.find(s => `${s.id} — ${s.name}` === this.editingIbSiteValue);
    account.ibCareSiteId   = site?.id   ?? '';
    account.ibCareSiteName = site?.name ?? '';
  }

  ibCareSiteDisplay(account: MasterAccount): string {
    return account.ibCareSiteId ? `${account.ibCareSiteId} — ${account.ibCareSiteName}` : '';
  }

  // Inline master-name + account type editing
  editingNameAccount: MasterAccount | null = null;
  editingNameValue = '';
  editingAccountType: 'Community' | 'Hospital' | 'Academic' | '' = '';

  // GPO hierarchy modal editing
  editingGpoAccount: MasterAccount | null = null;
  editingGpoForm = {
    gpoL1: '', gpoL1Start: '', gpoL1End: '',
    gpoL2: '', gpoL2Start: '', gpoL2End: '',
    gpoL3: '', gpoL3Start: '', gpoL3End: '',
    gpoL4: '', gpoL4Start: '', gpoL4End: '',
    gpoL5: '', gpoL5Start: '', gpoL5End: '',
  };

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
      masterAccountName: 'BARTLETT UROLOGY ASSOCIATES', accountType: 'Community', ibCareSiteId: 'IB-SITE-001', ibCareSiteName: 'Bartlett Urology Main',
      gpoL1: 'Cornerstone', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'Urology Management Alliance (UMA)', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Minnesota Urology', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '420193847', shipToName: 'BARTLETT UROLOGY MAIN CAMPUS', address: '6025 LAKE RD', city: 'WOODBURY', state: 'MN', zip: '55125' },
        { bpNumber: '387204561', shipToName: 'BARTLETT UROLOGY SATELLITE', address: '6025 LAKE RD STE 2', city: 'WOODBURY', state: 'MN', zip: '55125' },
        { bpNumber: '551836204', shipToName: 'BARTLETT UROLOGY EAST CAMPUS', address: '1200 MILLER RD', city: 'SAINT PAUL', state: 'MN', zip: '55101' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'ACCREDO HEALTH GROUP INC', accountType: 'Hospital', ibCareSiteId: '', ibCareSiteName: '',
      gpoL1: '', gpoL1Start: '', gpoL1End: '',
      gpoL2: '', gpoL2Start: '', gpoL2End: '',
      gpoL3: '', gpoL3Start: '', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1487392056', providerName: 'ACCREDO HEALTH MEMPHIS', address: '1620 CENTURY CENTER PKWY', city: 'MEMPHIS', state: 'TN', zip: '38134' },
        { npiNumber: '1603847291', providerName: 'ACCREDO HEALTH EAST DIVISION', address: '2840 RIDGELINE DR STE 100', city: 'NASHVILLE', state: 'TN', zip: '37211' },
        { npiNumber: '1920384756', providerName: 'ACCREDO HEALTH SOUTHWEST', address: '9901 LINN STATION RD', city: 'LOUISVILLE', state: 'KY', zip: '40223' },
      ],
    },
    {
      masterAccountName: 'ADENA REGIONAL MED CNTR', accountType: 'Hospital', ibCareSiteId: 'IB-SITE-002', ibCareSiteName: 'Adena Cancer Center',
      gpoL1: 'Cencora GPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'OneOncology', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Ohio Network', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '628374019', shipToName: 'ADENA REGIONAL MED CNTR MAIN', address: '4435 SR 159', city: 'CHILLICOTHE', state: 'OH', zip: '45601' },
        { bpNumber: '473920184', shipToName: 'ADENA CANCER CARE CTR', address: '272 N PAINT ST', city: 'CHILLICOTHE', state: 'OH', zip: '45601' },
        { bpNumber: '819302746', shipToName: 'ADENA ONCOLOGY SOUTH', address: '480 N BRIDGE ST', city: 'CHILLICOTHE', state: 'OH', zip: '45601' },
        { bpNumber: '302847561', shipToName: 'ADENA HIGHLAND DISTRICT HOSP', address: '1275 N HIGH ST', city: 'HILLSBORO', state: 'OH', zip: '45133' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'COASTAL ONCOLOGY PARTNERS', accountType: 'Community', ibCareSiteId: 'IB-SITE-003', ibCareSiteName: 'Coastal Oncology Hub',
      gpoL1: 'UroGPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'US Urology Partners', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Southeast Network', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '748203916', shipToName: 'COASTAL ONCOLOGY MAIN', address: '3435 BRECKINRIDGE BLVD', city: 'DULUTH', state: 'GA', zip: '30096' },
        { bpNumber: '563019482', shipToName: 'COASTAL ONCOLOGY BUFORD', address: '2700 MALL OF GEORGIA BLVD', city: 'BUFORD', state: 'GA', zip: '30519' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'ADVANCED UROLOGY ATRIUM HEALTH', accountType: 'Hospital', ibCareSiteId: 'IB-SITE-004', ibCareSiteName: 'Atrium Advanced Urology',
      gpoL1: 'UroGPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'US Urology Partners', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Atlantic Region', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: 'Atrium Health', gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
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
      masterAccountName: 'ADVANCED UROLOGY PLLC', accountType: 'Community', ibCareSiteId: '', ibCareSiteName: '',
      gpoL1: 'Cencora GPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'OneOncology', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'United Urology Grp', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: 'Colorado Urology', gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: 'Advanced Urology Pllc', gpoL5Start: '2025-01-01', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '782039146', shipToName: 'ADVANCED UROLOGY LONE TREE', address: '10535 PARK MEADOWS BLVD', city: 'LONE TREE', state: 'CO', zip: '80124' },
        { bpNumber: '930481726', shipToName: 'ADVANCED UROLOGY HIGHLANDS RANCH', address: '9336 DORCHESTER ST', city: 'HIGHLANDS RANCH', state: 'CO', zip: '80129' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'HASSAN NADEEM MD', accountType: 'Community', ibCareSiteId: '', ibCareSiteName: '',
      gpoL1: '', gpoL1Start: '', gpoL1End: '',
      gpoL2: '', gpoL2Start: '', gpoL2End: '',
      gpoL3: '', gpoL3Start: '', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1837264091', providerName: 'HASSAN NADEEM MD RICHARDSON', address: '3030 WATERVIEW PKWY', city: 'RICHARDSON', state: 'TX', zip: '75080' },
        { npiNumber: '1049382756', providerName: 'HASSAN NADEEM MD PLANO', address: '5200 W PLANO PKWY', city: 'PLANO', state: 'TX', zip: '75093' },
        { npiNumber: '1728304965', providerName: 'HASSAN NADEEM MD DALLAS NORTH', address: '8200 WALNUT HILL LN', city: 'DALLAS', state: 'TX', zip: '75231' },
        { npiNumber: '1506293847', providerName: 'HASSAN NADEEM MD FRISCO', address: '3535 LEGACY DR', city: 'FRISCO', state: 'TX', zip: '75034' },
      ],
    },
    {
      masterAccountName: 'GARZA RAYMOND J MD', accountType: 'Community', ibCareSiteId: '', ibCareSiteName: '',
      gpoL1: '', gpoL1Start: '', gpoL1End: '',
      gpoL2: '', gpoL2Start: '', gpoL2End: '',
      gpoL3: '', gpoL3Start: '', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1374920583', providerName: 'GARZA RAYMOND J MD WATKINSVILLE', address: '1150 GOLDEN WAY', city: 'WATKINSVILLE', state: 'GA', zip: '30677' },
        { npiNumber: '1829304756', providerName: 'GARZA RAYMOND J MD ATHENS', address: '1199 PRINCE AVE', city: 'ATHENS', state: 'GA', zip: '30606' },
      ],
    },
    {
      masterAccountName: 'FELDMAN DAVID B MD', accountType: 'Community', ibCareSiteId: '', ibCareSiteName: '',
      gpoL1: '', gpoL1Start: '', gpoL1End: '',
      gpoL2: '', gpoL2Start: '', gpoL2End: '',
      gpoL3: '', gpoL3Start: '', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1647382910', providerName: 'FELDMAN DAVID B MD MONROEVILLE', address: '2790 MOSSIDE BLVD', city: 'MONROEVILLE', state: 'PA', zip: '15146' },
        { npiNumber: '1028374659', providerName: 'FELDMAN DAVID B MD PITTSBURGH', address: '4800 FRIENDSHIP AVE', city: 'PITTSBURGH', state: 'PA', zip: '15224' },
        { npiNumber: '1593027481', providerName: 'FELDMAN DAVID B MD CRANBERRY TWP', address: '1 ST FRANCIS WAY', city: 'CRANBERRY TWP', state: 'PA', zip: '16066' },
      ],
    },
    {
      masterAccountName: 'ALLEGHENY HEALTH NETWORK CANCER', accountType: 'Hospital', ibCareSiteId: 'IB-SITE-005', ibCareSiteName: 'AHN Cancer Center',
      gpoL1: 'Cencora GPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'OneOncology', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Pennsylvania Group', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: 'AHN', gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '874013629', shipToName: 'AHN CANCER CTR MONACA', address: '81 WAGNER RD', city: 'MONACA', state: 'PA', zip: '15061' },
        { bpNumber: '531029847', shipToName: 'AHN CANCER CTR PITTSBURGH', address: '4818 LIBERTY AVE', city: 'PITTSBURGH', state: 'PA', zip: '15224' },
        { bpNumber: '298473016', shipToName: 'AHN CANCER CTR WEXFORD', address: '10990 PERRY HWY', city: 'WEXFORD', state: 'PA', zip: '15090' },
        { bpNumber: '647830192', shipToName: 'AHN CANCER CTR BETHEL PARK', address: '100 MOFFETT RD', city: 'BETHEL PARK', state: 'PA', zip: '15102' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'ALLINA HEALTH SYSTEM', accountType: 'Hospital', ibCareSiteId: 'IB-SITE-006', ibCareSiteName: 'Allina Oncology Hub',
      gpoL1: 'Cornerstone', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'Urology Management Alliance (UMA)', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Minnesota Urology', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: 'Allina Group', gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
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
      masterAccountName: 'AMERICAN ONC ARKANSAS', accountType: 'Community', ibCareSiteId: 'IB-SITE-007', ibCareSiteName: 'American Oncology AR',
      gpoL1: 'Cencora GPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'OneOncology', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'South Central Group', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: 'AR Oncology', gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '904738261', shipToName: 'AMERICAN ONC AR HOT SPRINGS', address: '133 HARMONY PARK CIR', city: 'HOT SPRINGS', state: 'AR', zip: '71913' },
        { bpNumber: '371829046', shipToName: 'AMERICAN ONC AR LITTLE ROCK', address: '9500 KANIS RD', city: 'LITTLE ROCK', state: 'AR', zip: '72205' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'AMERICAN ONC TEXAS', accountType: 'Community', ibCareSiteId: 'IB-SITE-008', ibCareSiteName: 'American Oncology TX',
      gpoL1: 'Cencora GPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'OneOncology', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Texas Group', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: 'TX Oncology', gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
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
      masterAccountName: 'NORTHEAST UROLOGY ASSOCIATES', accountType: 'Community', ibCareSiteId: 'IB-SITE-009', ibCareSiteName: 'Northeast Urology Hub',
      gpoL1: 'UroGPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'US Urology Partners', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Associated Medical Professionals', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '620394817', shipToName: 'NORTHEAST UROLOGY HARTFORD', address: '2 ELLINWOOD DRIVE', city: 'HARTFORD', state: 'NY', zip: '13413' },
        { bpNumber: '847201396', shipToName: 'NORTHEAST UROLOGY NEW HARTFORD', address: '35 CLINTON RD', city: 'NEW HARTFORD', state: 'NY', zip: '13413' },
        { bpNumber: '503847129', shipToName: 'NORTHEAST UROLOGY ROME', address: '264 W DOMINICK ST', city: 'ROME', state: 'NY', zip: '13440' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'CENTRAL NY UROLOGY GROUP', accountType: 'Community', ibCareSiteId: 'IB-SITE-010', ibCareSiteName: 'Central NY Urology Hub',
      gpoL1: 'UroGPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'US Urology Partners', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Associated Medical Professionals', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '739201485', shipToName: 'CENTRAL NY UROLOGY SYRACUSE', address: '1226 EAST WATER ST', city: 'SYRACUSE', state: 'NY', zip: '13210' },
        { bpNumber: '481930276', shipToName: 'CENTRAL NY UROLOGY DEWITT', address: '4900 BROAD RD', city: 'DEWITT', state: 'NY', zip: '13214' },
      ],
      accredoAccounts: [],
    },
    {
      masterAccountName: 'PATEL VIKRAM R MD', accountType: 'Community', ibCareSiteId: '', ibCareSiteName: '',
      gpoL1: '', gpoL1Start: '', gpoL1End: '',
      gpoL2: '', gpoL2Start: '', gpoL2End: '',
      gpoL3: '', gpoL3Start: '', gpoL3End: '',
      gpoL4: '', gpoL4Start: '', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [],
      accredoAccounts: [
        { npiNumber: '1203847596', providerName: 'PATEL VIKRAM R MD JOHNSON CITY', address: '1301 SUNSET DR STE 3', city: 'JOHNSON CITY', state: 'TN', zip: '37604' },
        { npiNumber: '1748392065', providerName: 'PATEL VIKRAM R MD KINGSPORT', address: '2204 PAVILION DR', city: 'KINGSPORT', state: 'TN', zip: '37660' },
        { npiNumber: '1039284756', providerName: 'PATEL VIKRAM R MD ELIZABETHTON', address: '425 CENTURY LN', city: 'ELIZABETHTON', state: 'TN', zip: '37643' },
        { npiNumber: '1574829036', providerName: 'PATEL VIKRAM R MD GREENEVILLE', address: '1641 TUSCULUM BLVD', city: 'GREENEVILLE', state: 'TN', zip: '37745' },
      ],
    },
    {
      masterAccountName: 'ANNE ARUNDEL UROLOGY PA', accountType: 'Community', ibCareSiteId: '', ibCareSiteName: '',
      gpoL1: 'UroGPO', gpoL1Start: '2025-01-01', gpoL1End: '',
      gpoL2: 'Urology Alliance', gpoL2Start: '2025-01-01', gpoL2End: '',
      gpoL3: 'Solaris', gpoL3Start: '2025-01-01', gpoL3End: '',
      gpoL4: 'Anne Arundel Urology', gpoL4Start: '2025-01-01', gpoL4End: '',
      gpoL5: '', gpoL5Start: '', gpoL5End: '',
      icsAccounts: [
        { bpNumber: '362019847', shipToName: 'ANNE ARUNDEL UROLOGY ANNAPOLIS', address: '600 RIDGELY AVE', city: 'ANNAPOLIS', state: 'MD', zip: '21401' },
        { bpNumber: '819304726', shipToName: 'ANNE ARUNDEL UROLOGY GLEN BURNIE', address: '1 HOSPITAL DR', city: 'GLEN BURNIE', state: 'MD', zip: '21061' },
        { bpNumber: '547830219', shipToName: 'ANNE ARUNDEL UROLOGY MILLERSVILLE', address: '8322 VETERANS HWY', city: 'MILLERSVILLE', state: 'MD', zip: '21108' },
      ],
      accredoAccounts: [],
    },
  ];

  trackByMasterAccountName(_index: number, account: MasterAccount): string { return account.masterAccountName; }
  trackByIbSiteId(_index: number, site: IbCareSite): string { return site.id; }
  trackByIcsAccountBp(_index: number, row: IcsAccount): string { return row.bpNumber; }
  trackByAccredoAccountNpi(_index: number, row: AccredoAccount): string { return row.npiNumber; }
  trackByAccountName(_index: number, name: string): string { return name; }

  // ── Computed ──────────────────────────────────────────────────
  get masterAccountNames(): string[] {
    return this.accounts.map(a => a.masterAccountName);
  }

  get filteredAccounts(): MasterAccount[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = q ? this.accounts.filter(a => a.masterAccountName.toLowerCase().includes(q)) : this.accounts;

    switch (this.channelFilter) {
      case 'ics':     list = list.filter(a => a.icsAccounts.length > 0 && a.accredoAccounts.length === 0); break;
      case 'accredo': list = list.filter(a => a.accredoAccounts.length > 0 && a.icsAccounts.length === 0); break;
    }
    return list;
  }

  // ── Section expand / collapse ─────────────────────────────────
  isSectionOpen(account: MasterAccount, section: 'gpo' | 'ics' | 'accredo'): boolean {
    return this.sectionState.get(account)?.[section] ?? false;
  }

  toggleSection(account: MasterAccount, section: 'gpo' | 'ics' | 'accredo'): void {
    const current = this.isSectionOpen(account, section);
    const existing = this.sectionState.get(account) ?? { gpo: false, ics: false, accredo: false };
    this.sectionState.set(account, { ...existing, [section]: !current });
  }

  get allExpanded(): boolean {
    return this.filteredAccounts.every(a => {
      const s = this.sectionState.get(a);
      return s?.ics && s?.accredo;
    });
  }

  expandAll(): void {
    this.filteredAccounts.forEach(a => {
      const existing = this.sectionState.get(a) ?? { gpo: false, ics: false, accredo: false };
      this.sectionState.set(a, { ...existing, ics: true, accredo: true });
    });
  }

  collapseAll(): void {
    this.filteredAccounts.forEach(a => {
      const existing = this.sectionState.get(a) ?? { gpo: false, ics: false, accredo: false };
      this.sectionState.set(a, { ...existing, ics: false, accredo: false });
    });
  }

  // ── Inline master-name editing ────────────────────────────────
  startEditName(account: MasterAccount): void {
    this.editingNameAccount  = account;
    this.editingNameValue    = account.masterAccountName;
    this.editingAccountType  = account.accountType;
    this.editingIbSiteValue  = this.ibCareSiteDisplay(account);
  }

  saveEditName(): void {
    if (this.editingNameAccount && this.editingNameValue.trim()) {
      this.editingNameAccount.masterAccountName = this.editingNameValue.trim();
      this.editingNameAccount.accountType       = this.editingAccountType;
      this.applyIbSiteToAccount(this.editingNameAccount);
    }
    this.editingNameAccount = null;
    this.editingNameValue   = '';
    this.editingAccountType = '';
    this.editingIbSiteValue = '';
  }

  cancelEditName(): void {
    this.editingNameAccount = null;
    this.editingNameValue   = '';
    this.editingAccountType = '';
    this.editingIbSiteValue = '';
  }

  // ── GPO level active/inactive ─────────────────────────────────
  isLevelActive(endDate: string): boolean {
    if (!endDate) return true;
    return new Date(endDate) > new Date();
  }

  // ── GPO hierarchy modal editing ──────────────────────────────
  openGpoEdit(account: MasterAccount): void {
    this.editingGpoAccount = account;
    this.editingGpoForm = {
      gpoL1: account.gpoL1, gpoL1Start: account.gpoL1Start, gpoL1End: account.gpoL1End,
      gpoL2: account.gpoL2, gpoL2Start: account.gpoL2Start, gpoL2End: account.gpoL2End,
      gpoL3: account.gpoL3, gpoL3Start: account.gpoL3Start, gpoL3End: account.gpoL3End,
      gpoL4: account.gpoL4, gpoL4Start: account.gpoL4Start, gpoL4End: account.gpoL4End,
      gpoL5: account.gpoL5, gpoL5Start: account.gpoL5Start, gpoL5End: account.gpoL5End,
    };
  }

  saveEditGpo(): void {
    if (!this.editingGpoAccount) return;
    Object.assign(this.editingGpoAccount, this.editingGpoForm);
    this.editingGpoAccount = null;
  }

  cancelEditGpo(): void {
    this.editingGpoAccount = null;
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
    const existing = this.sectionState.get(account) ?? { gpo: false, ics: false, accredo: false };
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
    const existing = this.sectionState.get(account) ?? { gpo: false, ics: false, accredo: false };
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
