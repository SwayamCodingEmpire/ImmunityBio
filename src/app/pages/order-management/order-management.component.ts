import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface OrderRow {
  id: string;
  accountNo: string;
  distribution: string;
  status: string;
  shipToName: string;
  shipToAddress: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  deliveryQty: number;
  orderDate: string;
  invoiceDate: string;
  deliveryDate: string;
  area: string;
  abd: string;
  businessManager: string;
  territory: string;
  unitsAssigned: number;
  isCommercial: boolean;
  icEligible: boolean;
  shipmentIssueFlag: boolean;
  shipmentIssueStatus: string;
  shipmentIssueNotes: string;
}

interface OrderFilters {
  search: string;
  status: string;
  distribution: string;
}

interface TimelineStep {
  label: string;
  date: string;
  detail: string;
  state: 'completed' | 'current' | 'upcoming' | 'issue';
}

interface SplitAssignment {
  abd: string;
  businessManager: string;
  territory: string;
  units: number;
}

@Component({
  selector: 'app-order-management',
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent implements OnInit {
  private route = inject(ActivatedRoute);

  // active filters — only updated on Apply click
  orderFilters: OrderFilters = { search: '', status: 'All', distribution: 'All' };
  // staged filters — bound to the filter inputs
  pendingFilters: OrderFilters = { search: '', status: 'All', distribution: 'All' };

  // ── Sorting (#5) ─────────────────────────────────────────────
  sortColumn: keyof OrderRow = 'invoiceDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  sortBy(column: keyof OrderRow): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn    = column;
      this.sortDirection = 'asc';
    }
  }

  private allOrders: OrderRow[] = [
    { id: 'ORD-001', accountNo: '362019847', distribution: 'ICS',     status: 'Shipped',     invoiceDate: '2026-05-01', shipToName: 'ANNE ARUNDEL UROLOGY ANNAPOLIS',  shipToAddress: '600 RIDGELY AVE',          shipToCity: 'ANNAPOLIS',     shipToState: 'MD', shipToZip: '21401', deliveryQty: 1, orderDate: '2026-04-30', deliveryDate: '2026-05-01', area: 'East',          abd: 'Keith DeRuiter',      businessManager: 'OPEN',                territory: 'Boston, MA',          unitsAssigned: 2, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-002', accountNo: '628374019', distribution: 'ICS',     status: 'Pending',     invoiceDate: '2026-04-30', shipToName: 'ADENA CANCER CARE CTR',           shipToAddress: '272 N PAINT ST',           shipToCity: 'CHILLICOTHE',   shipToState: 'OH', shipToZip: '45601', deliveryQty: 2, orderDate: '2026-04-30', deliveryDate: '2026-05-01', area: 'South Central', abd: 'Chuck Gaetano',       businessManager: 'Katrina Caronia',     territory: 'Tampa, FL',           unitsAssigned: 1, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-003', accountNo: '782039146', distribution: 'ICS',     status: 'Pending',     invoiceDate: '',           shipToName: 'ADVANCED UROLOGY LONE TREE',      shipToAddress: '10535 PARK MEADOWS BLVD',  shipToCity: 'LONE TREE',     shipToState: 'CO', shipToZip: '80124', deliveryQty: 3, orderDate: '2026-04-30', deliveryDate: '2026-05-01', area: 'Southwest',     abd: 'OPEN',                businessManager: 'Alexandra Maddalosso', territory: 'Los Angeles, CA',    unitsAssigned: 3, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-004', accountNo: '904738261', distribution: 'ICS',     status: 'Pending',     invoiceDate: '',           shipToName: 'AMERICAN ONC AR HOT SPRINGS',     shipToAddress: '133 HARMONY PARK CIR',    shipToCity: 'HOT SPRINGS',   shipToState: 'AR', shipToZip: '71913', deliveryQty: 2, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'Southwest',     abd: 'OPEN',                businessManager: 'James Reiff',          territory: 'Boise, ID',           unitsAssigned: 2, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-005', accountNo: '419203857', distribution: 'ICS',     status: 'Pending',     invoiceDate: '',           shipToName: 'ALLINA ABBOTT NORTHWESTERN HOSP', shipToAddress: '800 E 28TH ST',           shipToCity: 'MINNEAPOLIS',   shipToState: 'MN', shipToZip: '55407', deliveryQty: 2, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'North Central', abd: 'OPEN',                businessManager: 'Robb Evans',           territory: 'Chicago, IL',         unitsAssigned: 1, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-006', accountNo: '874013629', distribution: 'ICS',     status: 'Credit Hold', invoiceDate: '',           shipToName: 'AHN CANCER CTR WEXFORD',          shipToAddress: '10990 PERRY HWY',          shipToCity: 'WEXFORD',       shipToState: 'PA', shipToZip: '15090', deliveryQty: 2, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'East',          abd: 'OPEN',                businessManager: 'Freddy Garzon',        territory: 'Northern California', unitsAssigned: 2, isCommercial: false, icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-007', accountNo: '739201485', distribution: 'ICS',     status: 'Pending',     invoiceDate: '',           shipToName: 'CENTRAL NY UROLOGY SYRACUSE',     shipToAddress: '1226 EAST WATER ST',       shipToCity: 'SYRACUSE',      shipToState: 'NY', shipToZip: '13210', deliveryQty: 1, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'North Central', abd: 'OPEN',                businessManager: 'Chris Moffitt',        territory: 'Indianapolis, IN',    unitsAssigned: 1, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-008', accountNo: '531029847', distribution: 'ICS',     status: 'Shipped',     invoiceDate: '2026-05-04', shipToName: 'AHN CANCER CTR PITTSBURGH',       shipToAddress: '4818 LIBERTY AVE',         shipToCity: 'PITTSBURGH',    shipToState: 'PA', shipToZip: '15224', deliveryQty: 1, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'East',          abd: 'Keith DeRuiter',      businessManager: 'OPEN',                territory: 'Northern California', unitsAssigned: 1, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-009', accountNo: '',          distribution: 'Accredo', status: 'Shipped',     invoiceDate: '2026-05-01', shipToName: 'GARZA RAYMOND J MD ATHENS',       shipToAddress: '1199 PRINCE AVE',          shipToCity: 'ATHENS',        shipToState: 'GA', shipToZip: '30606', deliveryQty: 3, orderDate: '2026-04-30', deliveryDate: '2026-05-01', area: 'South Central', abd: 'Chuck Gaetano',       businessManager: 'Michael Real',         territory: 'Atlanta, GA',         unitsAssigned: 1, isCommercial: true,  icEligible: false, shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-010', accountNo: '',          distribution: 'Accredo', status: 'Pending',     invoiceDate: '',           shipToName: 'PATEL VIKRAM R MD JOHNSON CITY',  shipToAddress: '1301 SUNSET DR STE 3',    shipToCity: 'JOHNSON CITY',  shipToState: 'TN', shipToZip: '37604', deliveryQty: 1, orderDate: '2026-05-02', deliveryDate: '2026-05-10', area: 'South Central', abd: 'Chuck Gaetano',       businessManager: 'Amanda Rippy',         territory: 'Nashville, TN',       unitsAssigned: 1, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' },
    { id: 'ORD-011', accountNo: '658302914', distribution: 'ICS',     status: 'Shipped',     invoiceDate: '2026-05-08', shipToName: 'AMERICAN ONC TX HOUSTON MAIN',    shipToAddress: '2130 W HOLCOMBE BLVD',     shipToCity: 'HOUSTON',       shipToState: 'TX', shipToZip: '77030', deliveryQty: 2, orderDate: '2026-05-03', deliveryDate: '2026-05-08', area: 'South Central', abd: 'Chuck Gaetano',       businessManager: 'Katrina Caronia',      territory: 'Tampa, FL',           unitsAssigned: 2, isCommercial: true,  icEligible: true,  shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: '' }
  ];

  // ── Track modal ──────────────────────────────────────────────
  trackingOrder: OrderRow | null = null;
  trackingSteps: TimelineStep[] = [];

  openTrackModal(order: OrderRow): void {
    this.trackingOrder = order;
    this.trackingSteps = this.getTimelineSteps(order);
  }
  closeTrackModal(): void {
    this.trackingOrder = null;
    this.trackingSteps = [];
    this.closeFlagForm();
  }

  // ── Step flag UI ─────────────────────────────────────────────
  stepFlags: Record<string, { status: string; notes: string }> = {};
  flaggingKey: string | null = null;
  flagForm = { status: '', notes: '' };

  readonly issueStatusOptions = [
    'Delayed', 'Damaged', 'Lost in Transit',
    'Documentation Error', 'Address Issue',
    'Temperature Excursion', 'Other'
  ];

  getFlagKey(orderId: string, stepIndex: number): string {
    return `${orderId}-${stepIndex}`;
  }

  getStepFlag(orderId: string, stepIndex: number): { status: string; notes: string } | null {
    return this.stepFlags[this.getFlagKey(orderId, stepIndex)] ?? null;
  }

  openFlagForm(orderId: string, stepIndex: number): void {
    const key = this.getFlagKey(orderId, stepIndex);
    const existing = this.stepFlags[key];
    this.flagForm = existing ? { ...existing } : { status: '', notes: '' };
    this.flaggingKey = key;
  }

  closeFlagForm(): void {
    this.flaggingKey = null;
    this.flagForm = { status: '', notes: '' };
  }

  saveFlagForm(orderId: string, stepIndex: number): void {
    if (!this.flagForm.status) return;
    this.stepFlags[this.getFlagKey(orderId, stepIndex)] = { ...this.flagForm };
    this.closeFlagForm();
  }

  clearFlag(orderId: string, stepIndex: number): void {
    delete this.stepFlags[this.getFlagKey(orderId, stepIndex)];
  }

  getTimelineSteps(order: OrderRow): TimelineStep[] {
    const base    = new Date(order.orderDate);
    const deliver = new Date(order.deliveryDate);
    const fmt     = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const add     = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

    if (order.status === 'Shipped') {
      return [
        { label: 'Order Placed',       date: fmt(base),        detail: 'Order received and logged into the system.',        state: 'completed' },
        { label: 'Documents Verified', date: fmt(add(base,1)), detail: 'Facility credentials and order details validated.',  state: 'completed' },
        { label: 'Packed & Ready',     date: fmt(add(base,1)), detail: 'Shipment prepared and handed to fulfillment team.', state: 'completed' },
        { label: 'Dispatched',         date: fmt(add(base,2)), detail: 'Package picked up by courier and in transit.',      state: 'completed' },
        { label: 'Shipped',            date: fmt(deliver),     detail: 'Order shipped successfully to facility.',           state: 'completed' }
      ];
    }
    if (order.status === 'Credit Hold') {
      return [
        { label: 'Order Placed',        date: fmt(base),           detail: 'Order received and logged into the system.',                  state: 'completed' },
        { label: 'Documents Verified',  date: fmt(add(base, 1)),   detail: 'Initial review completed before release to fulfillment.',     state: 'completed' },
        { label: 'Credit Hold Flagged', date: fmt(add(base, 2)),   detail: 'Order paused — account under credit review. Action required.',state: 'issue'     },
        { label: 'Dispatched',          date: 'Awaiting release',  detail: 'Will proceed once the credit hold is resolved.',              state: 'upcoming'  },
        { label: 'Delivered',           date: 'Pending',           detail: 'Delivery pending resolution of credit hold.',                 state: 'upcoming'  }
      ];
    }
    if (order.status === 'Cancelled') {
      return [
        { label: 'Order Placed',   date: fmt(base),         detail: 'Order received and logged into the system.',  state: 'completed' },
        { label: 'Review Started', date: fmt(add(base, 1)), detail: 'Order entered the processing queue.',          state: 'completed' },
        { label: 'Cancelled',      date: fmt(add(base, 2)), detail: 'Order was cancelled before shipment.',         state: 'issue'     },
        { label: 'Dispatched',     date: 'Not applicable',  detail: 'Shipment was not initiated.',                  state: 'upcoming'  },
        { label: 'Delivered',      date: 'Not applicable',  detail: 'Order will not be delivered.',                 state: 'upcoming'  }
      ];
    }
    return [
      { label: 'Order Placed',       date: fmt(base),           detail: 'Order received and logged into the system.',        state: 'completed' },
      { label: 'Documents Verified', date: fmt(add(base, 1)),   detail: 'Facility credentials and order details validated.',  state: 'completed' },
      { label: 'Processing',         date: fmt(add(base, 1)),   detail: 'Order is being prepared for dispatch.',             state: 'current'   },
      { label: 'Dispatched',         date: 'Awaiting dispatch', detail: 'Shipment will update once it leaves the warehouse.', state: 'upcoming'  },
      { label: 'Delivered',          date: 'Pending',           detail: 'Estimated on completion of dispatch.',              state: 'upcoming'  }
    ];
  }

  // ── Details modal ────────────────────────────────────────────
  detailsOrder: OrderRow | null = null;
  openDetailsModal(order: OrderRow): void { this.detailsOrder = order; }
  closeDetailsModal(): void               { this.detailsOrder = null;  }

  // ── Edit modal ───────────────────────────────────────────────
  editingOrder: OrderRow | null = null;
  editForm: Partial<OrderRow> = {};

  openEditModal(order: OrderRow): void {
    this.editingOrder = order;
    this.editForm = { ...order };
  }
  closeEditModal(): void {
    this.editingOrder = null;
    this.editForm = {};
  }
  saveEdit(): void {
    if (!this.editingOrder) return;
    Object.assign(this.editingOrder, this.editForm);
    this.closeEditModal();
  }

  // ── Add modal ────────────────────────────────────────────────
  showAddModal = false;
  addForm: Partial<OrderRow> = {};

  private emptyAddForm(): Partial<OrderRow> {
    return {
      accountNo: '', distribution: '', status: 'Pending',
      shipToName: '', shipToAddress: '', shipToCity: '', shipToState: '', shipToZip: '',
      area: '', abd: '', businessManager: '', territory: '',
      deliveryQty: 1, unitsAssigned: 1,
      orderDate: new Date().toISOString().slice(0, 10),
      invoiceDate: '',
      deliveryDate: '',
      isCommercial: true, icEligible: true,
      shipmentIssueFlag: false, shipmentIssueStatus: '', shipmentIssueNotes: ''
    };
  }

  openAddModal(): void {
    this.addForm = this.emptyAddForm();
    this.showAddModal = true;
  }
  closeAddModal(): void {
    this.showAddModal = false;
    this.addForm = {};
  }
  get addFormValid(): boolean {
    return !!(this.addForm.shipToName?.trim() && this.addForm.distribution && this.addForm.status);
  }
  saveAdd(): void {
    if (!this.addFormValid) return;
    const next = this.allOrders.length + 1;
    const newOrder: OrderRow = {
      id:                    `ORD-${String(next).padStart(3, '0')}`,
      accountNo:             this.addForm.accountNo           ?? '',
      distribution:          this.addForm.distribution        ?? '',
      status:                this.addForm.status              ?? 'Pending',
      shipToName:            this.addForm.shipToName          ?? '',
      shipToAddress:         this.addForm.shipToAddress       ?? '',
      shipToCity:            this.addForm.shipToCity          ?? '',
      shipToState:           this.addForm.shipToState         ?? '',
      shipToZip:             this.addForm.shipToZip           ?? '',
      area:                  this.addForm.area                ?? '',
      abd:                   this.addForm.abd                 ?? '',
      businessManager:       this.addForm.businessManager     ?? '',
      territory:             this.addForm.territory           ?? '',
      deliveryQty:           Number(this.addForm.deliveryQty)   || 0,
      unitsAssigned:         Number(this.addForm.unitsAssigned) || 0,
      orderDate:             this.addForm.orderDate           ?? '',
      invoiceDate:           this.addForm.invoiceDate         ?? '',
      deliveryDate:          this.addForm.deliveryDate        ?? '',
      isCommercial:          this.addForm.isCommercial        ?? true,
      icEligible:            this.addForm.icEligible          ?? true,
      shipmentIssueFlag:     false,
      shipmentIssueStatus:   '',
      shipmentIssueNotes:    '',
    };
    this.allOrders.unshift(newOrder);
    this.closeAddModal();
  }

  // ── Shipment Issue Flag modal (#7) ───────────────────────────
  issueFlagOrder: OrderRow | null = null;
  issueFlagForm  = { status: '', notes: '' };

  openIssueFlagModal(order: OrderRow): void {
    this.issueFlagOrder = order;
    this.issueFlagForm  = { status: order.shipmentIssueStatus, notes: order.shipmentIssueNotes };
  }
  closeIssueFlagModal(): void {
    this.issueFlagOrder = null;
  }
  saveIssueFlag(): void {
    if (!this.issueFlagOrder) return;
    this.issueFlagOrder.shipmentIssueStatus = this.issueFlagForm.status;
    this.issueFlagOrder.shipmentIssueNotes  = this.issueFlagForm.notes;
    this.issueFlagOrder.shipmentIssueFlag   = !!(this.issueFlagForm.status || this.issueFlagForm.notes.trim());
    this.closeIssueFlagModal();
  }

  // ── Split modal (#4 ABD→TBM branching) ──────────────────────
  splittingOrder: OrderRow | null = null;
  splitAssignments: SplitAssignment[] = [];

  readonly abdOptions       = ['Keith DeRuiter', 'Chuck Gaetano', 'OPEN', 'Freddy Garzon'];
  readonly territoryOptions = ['Boston, MA', 'Tampa, FL', 'Los Angeles, CA', 'Atlanta, GA', 'Boise, ID', 'Chicago, IL', 'Northern California', 'Indianapolis, IN'];

  private readonly abdToManagers: Record<string, string[]> = {
    'Keith DeRuiter':  ['OPEN', 'Lisa Volomino', 'Karen Martinez', 'Timothy Kibel', 'Brian Girbes', 'Linda Phillips', 'Catherine Urch', 'Heather Ritter'],
    'Chuck Gaetano':   ['OPEN', 'Amanda Rippy', 'Debra Henderson', 'Dylan Mazelton', 'Chris Moffitt'],
    'Freddy Garzon':   ['OPEN', 'Katrina Caronia', 'James Reiff', 'Robb Evans'],
  };

  readonly allManagerOptions = ['OPEN', 'Katrina Caronia', 'Alexandra Maddalosso', 'James Reiff', 'Robb Evans', 'Chris Moffitt', 'Amanda Rippy', 'Michael Real', 'Lisa Volomino', 'Karen Martinez', 'Timothy Kibel', 'Brian Girbes', 'Linda Phillips', 'Catherine Urch', 'Heather Ritter', 'Debra Henderson', 'Dylan Mazelton'];

  getManagersForAbd(abd: string): string[] {
    if (!abd || abd === 'OPEN') return this.allManagerOptions;
    return this.abdToManagers[abd] ?? this.allManagerOptions;
  }

  onSplitAbdChange(row: SplitAssignment): void {
    row.businessManager = '';
  }

  canSplit(order: OrderRow): boolean {
    return order.isCommercial && order.icEligible;
  }

  toggleCommercial(order: OrderRow): void { order.isCommercial = !order.isCommercial; }
  toggleIcEligible(order: OrderRow): void { order.icEligible  = !order.icEligible;  }

  openSplitModal(order: OrderRow): void {
    if (!this.canSplit(order)) return;
    this.splittingOrder   = order;
    this.splitAssignments = [{ abd: '', businessManager: '', territory: '', units: 0 }];
  }
  closeSplitModal(): void {
    this.splittingOrder   = null;
    this.splitAssignments = [];
  }
  addSplitRow(): void            { this.splitAssignments.push({ abd: '', businessManager: '', territory: '', units: 0 }); }
  removeSplitRow(i: number): void { this.splitAssignments.splice(i, 1); }

  get splitTotal(): number {
    return this.splitAssignments.reduce((sum, a) => sum + (Number(a.units) || 0), 0);
  }
  get splitProgressPercent(): number {
    if (!this.splittingOrder || this.splittingOrder.unitsAssigned === 0) return 0;
    return Math.min((this.splitTotal / this.splittingOrder.unitsAssigned) * 100, 100);
  }
  get splitIsOver(): boolean {
    return !!this.splittingOrder && this.splitTotal > this.splittingOrder.unitsAssigned;
  }
  get splitIsValid(): boolean {
    return !this.splitIsOver && this.splitTotal > 0
      && this.splitAssignments.every(a => !!a.abd && !!a.businessManager && !!a.territory && a.units > 0);
  }
  saveSplit(): void {
    if (!this.splitIsValid) return;
    console.log('Split saved for', this.splittingOrder?.id, this.splitAssignments);
    this.closeSplitModal();
  }

  // ── Filters ──────────────────────────────────────────────────
  readonly statusOptions       = ['All', 'Shipped', 'Pending', 'Credit Hold', 'Cancelled'];
  readonly distributionOptions = ['All', 'ICS', 'Accredo', 'IB Care'];

  get filteredOrders(): OrderRow[] {
    const q = this.orderFilters.search.trim().toLowerCase();
    const filtered = this.allOrders.filter(o => {
      const matchSearch = !q || [o.accountNo, o.distribution, o.shipToName, o.area, o.abd, o.businessManager, o.territory, o.status]
        .some(v => v.toLowerCase().includes(q));
      const matchStatus = this.orderFilters.status === 'All' || o.status === this.orderFilters.status;
      const matchDist   = this.orderFilters.distribution === 'All' || o.distribution === this.orderFilters.distribution;
      return matchSearch && matchStatus && matchDist;
    });

    const col = this.sortColumn;
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return filtered.sort((a, b) => {
      const aVal = String(a[col] ?? '');
      const bVal = String(b[col] ?? '');
      if (aVal === '' && bVal !== '') return 1;
      if (bVal === '' && aVal !== '') return -1;
      return aVal.localeCompare(bVal, undefined, { numeric: true }) * dir;
    });
  }

  applyFilters(): void  { this.orderFilters = { ...this.pendingFilters }; }
  resetFilters(): void  {
    this.orderFilters   = { search: '', status: 'All', distribution: 'All' };
    this.pendingFilters = { search: '', status: 'All', distribution: 'All' };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(() => {});
  }
}
