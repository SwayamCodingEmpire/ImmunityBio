import { Component, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

type OrderTab = 'directory' | 'create-order' | 'tracking';
type OrderStatus = 'Pending' | 'Shipped' | 'Credit Hold' | 'Cancelled';

interface OrderRecord {
  id: string;
  orderNo: string;
  licenseNo: string;
  impType: string;
  impTypeName: string;
  facility: string;
  salesOrderTypeCode: string;
  salesOrderTypeDesc: string;
  itemCode: string;
  product: string;
  deliveryQty: number;
  units: number;
  total: number;
  unitPrice: number;
  invoiceNo: string;
  invoiceDate: string;
  poNumber: string;
  status: string;
  date: string;
}

interface OrderFilters {
  search: string;
  status: string;
  facility: string;
  impType: string;
  product: string;
  channel: string;
}

@Component({
  selector: 'app-order-management',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  @ViewChild('importOrdersInput') importOrdersInput?: ElementRef<HTMLInputElement>;

  activeTab: OrderTab = 'directory';
  showDetails = false;
  editingOrderId: string | null = null;
  selectedOrder: OrderRecord | null = null;
  lastImportMessage = '';

  orderFilters: OrderFilters = {
    search: '',
    status: 'All',
    facility: 'All',
    impType: 'All',
    product: 'All',
    channel: 'All'
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'] as OrderTab;
      }
    });
  }

  newOrder: Partial<OrderRecord> = {
    facility: '',
    impType: 'F1',
    impTypeName: 'Physician',
    product: 'Anktiva400 mg/0.4 mL',
    units: 1,
    total: 35800,
    unitPrice: 35800,
    invoiceNo: '',
    poNumber: '',
    status: 'Pending'
  };

  get recentOrders(): OrderRecord[] {
    return this.dataService.getRecentOrders();
  }

  get statusOptions(): string[] {
    return ['All', 'Pending', 'Shipped', 'Credit Hold', 'Cancelled'];
  }

  get facilityOptions(): string[] {
    return ['All', ...new Set(this.recentOrders.map((order) => order.facility))];
  }

  get impTypeOptions(): string[] {
    return ['All', ...new Set(this.recentOrders.map((order) => order.impTypeName))];
  }

  get productOptions(): string[] {
    return ['All', ...new Set(this.recentOrders.map((order) => order.product))];
  }

  get filteredOrders(): OrderRecord[] {
    const query = this.orderFilters.search.trim().toLowerCase();

    return [...this.recentOrders]
      .filter((order) => {
        const channel = this.getOrderChannel(order);
        const matchesSearch = !query
          || order.orderNo.toLowerCase().includes(query)
          || order.facility.toLowerCase().includes(query)
          || order.product.toLowerCase().includes(query)
          || order.impTypeName.toLowerCase().includes(query)
          || order.poNumber.toLowerCase().includes(query)
          || order.invoiceNo.toLowerCase().includes(query);

        return matchesSearch
          && (this.orderFilters.status === 'All' || order.status === this.orderFilters.status)
          && (this.orderFilters.facility === 'All' || order.facility === this.orderFilters.facility)
          && (this.orderFilters.impType === 'All' || order.impTypeName === this.orderFilters.impType)
          && (this.orderFilters.product === 'All' || order.product === this.orderFilters.product)
          && (this.orderFilters.channel === 'All' || channel === this.orderFilters.channel);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  get orderKpis() {
    const orders = this.filteredOrders;

    return {
      totalOrders: orders.length,
      shippedOrders: orders.filter((order) => order.status === 'Shipped').length,
      pendingOrders: orders.filter((order) => order.status === 'Pending').length,
      cancelledOrders: orders.filter((order) => order.status === 'Cancelled' || order.status === 'Credit Hold').length,
      totalUnits: orders.reduce((sum, order) => sum + order.units, 0),
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
    };
  }

  get trackingSummary() {
    const total = this.filteredOrders.length;
    const percentOfTotal = (count: number): number => total === 0 ? 0 : Math.round((count / total) * 100);

    const verifiedCount = this.filteredOrders.filter((order) => order.status !== 'Credit Hold' && order.status !== 'Cancelled').length;
    const approvedCount = this.filteredOrders.filter((order) => order.status === 'Pending' || order.status === 'Shipped').length;
    const shippedCount = this.filteredOrders.filter((order) => order.status === 'Shipped').length;
    const onHoldCount = this.filteredOrders.filter((order) => order.status === 'Credit Hold' || order.status === 'Cancelled').length;

    const groups = [
      { key: 'Created', count: total, percent: total === 0 ? 0 : 100, tone: 'info' },
      { key: 'Verified', count: verifiedCount, percent: percentOfTotal(verifiedCount), tone: 'info' },
      { key: 'Approved', count: approvedCount, percent: percentOfTotal(approvedCount), tone: 'warning' },
      { key: 'Shipped', count: shippedCount, percent: percentOfTotal(shippedCount), tone: 'success' },
      { key: 'On Hold', count: onHoldCount, percent: percentOfTotal(onHoldCount), tone: 'danger' }
    ];

    return groups;
  }

  addOrder(): void {
    if (this.editingOrderId) {
      const order = this.dataService.getRecentOrders().find((o: OrderRecord) => o.id === this.editingOrderId);
      if (order) {
        Object.assign(order, this.newOrder);
      }
    } else {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const orderNo = '760' + Math.floor(2000000 + Math.random() * 999999);
      this.dataService.getRecentOrders().unshift({
        id: orderId,
        orderNo: orderNo,
        licenseNo: '',
        impType: this.newOrder.impType,
        impTypeName: this.newOrder.impTypeName,
        facility: this.newOrder.facility,
        salesOrderTypeCode: '7036 8803-01',
        salesOrderTypeDesc: 'EDS Sales Order',
        itemCode: '7036 8803-01',
        product: this.newOrder.product,
        deliveryQty: this.newOrder.units,
        units: this.newOrder.units,
        total: this.newOrder.units ? this.newOrder.units * 35800 : 0,
        unitPrice: 35800,
        invoiceNo: this.newOrder.invoiceNo,
        invoiceDate: '',
        poNumber: this.newOrder.poNumber,
        status: this.newOrder.status,
        date: new Date().toISOString().split('T')[0]
      });
    }
    this.closeForm();
  }

  editOrder(order: OrderRecord): void {
    this.editingOrderId = order.id;
    this.newOrder = { ...order };
    this.activeTab = 'create-order';
  }

  viewOrderDetails(order: OrderRecord): void {
    this.selectedOrder = order;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedOrder = null;
  }

  deleteOrder(id: string): void {
    this.dataService.deleteOrder(id);
    if (this.selectedOrder?.id === id) {
      this.closeDetails();
    }
  }

  closeForm(): void {
    this.editingOrderId = null;
    this.newOrder = { facility: '', impType: 'F1', impTypeName: 'Physician', product: 'Anktiva400 mg/0.4 mL', units: 1, total: 35800, unitPrice: 35800, invoiceNo: '', poNumber: '', status: 'Pending' };
  }

  updateTotal(): void {
    this.newOrder.total = (this.newOrder.units ?? 0) * 35800;
  }

  resetFilters(): void {
    this.orderFilters = {
      search: '',
      status: 'All',
      facility: 'All',
      impType: 'All',
      product: 'All',
      channel: 'All'
    };
  }

  exportOrders(): void {
    const headers = ['Order ID', 'Order No', 'Order Date', 'Facility', 'IMP Type', 'Product', 'Units', 'Status', 'Channel', 'Revenue'];
    const rows = this.filteredOrders.map((order) => [
      order.id,
      order.orderNo,
      order.date,
      order.facility,
      order.impTypeName,
      order.product,
      String(order.units),
      order.status,
      this.getOrderChannel(order),
      String(order.total)
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  openImportPicker(): void {
    this.importOrdersInput?.nativeElement.click();
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.lastImportMessage = `Import ready: ${file.name}. Demo mode keeps existing orders unchanged for now.`;
    input.value = '';
  }

  getOrderChannel(order: OrderRecord): string {
    if (order.impType.startsWith('F')) return 'ICS';
    if (order.impType.startsWith('H')) return 'Accredo';
    return 'IB Care';
  }

  getTrackingWidth(order: OrderRecord): string {
    if (order.status === 'Shipped') return '100%';
    if (order.status === 'Pending') return '55%';
    if (order.status === 'Cancelled') return '15%';
    return '20%';
  }

  getTrackingLabel(order: OrderRecord): string {
    if (order.status === 'Shipped') return 'Delivered';
    if (order.status === 'Pending') return 'Processing';
    if (order.status === 'Cancelled') return 'Cancelled';
    return 'On Hold';
  }
}
