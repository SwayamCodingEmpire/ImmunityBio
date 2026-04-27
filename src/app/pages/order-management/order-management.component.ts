import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-management',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  
  activeTab = 'view-orders';
  showForm = false;
  editingOrderId: string | null = null;
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }
  
  newOrder: any = {
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

  get recentOrders() {
    return this.dataService.getRecentOrders();
  }

  addOrder() {
    if (this.editingOrderId) {
      const order = this.dataService.getRecentOrders().find(o => o.id === this.editingOrderId);
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
        total: this.newOrder.units * 35800,
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

  editOrder(order: any) {
    this.editingOrderId = order.id;
    this.newOrder = { ...order };
    this.showForm = true;
  }

  deleteOrder(id: string) {
    this.dataService.deleteOrder(id);
  }

  closeForm() {
    this.showForm = false;
    this.editingOrderId = null;
    this.newOrder = { facility: '', impType: 'F1', impTypeName: 'Physician', product: 'Anktiva400 mg/0.4 mL', units: 1, total: 35800, unitPrice: 35800, invoiceNo: '', poNumber: '', status: 'Pending' };
  }
  
  updateTotal() {
    this.newOrder.total = this.newOrder.units * 35800;
  }
}
