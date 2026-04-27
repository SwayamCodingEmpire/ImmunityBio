import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sales-registry',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './sales-registry.component.html',
  styleUrl: './sales-registry.component.scss'
})
export class SalesRegistryComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  
  activeTab = 'daily-sales';
  showForm = false;
  editingSalesId: string | null = null;
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }
  
  newSale: any = {
    date: new Date().toISOString().split('T')[0],
    product: 'Anktiva 400mcg/0.4mL',
    region: 'East',
    repName: '',
    icsUnits: 0,
    icsSales: 0,
    accredoUnits: 0,
    accredoSales: 0,
    units: 0,
    revenue: 0
  };

  reportGenerated = false;
  generatedReportData: any[] = [];

  performanceData = [
    { repName: 'Keith DeRuiter', territory: 'East', target: 75, achieved: 69, percentage: 92, status: 'On Track' },
    { repName: 'Lisa Volomino', territory: 'Boston, MA', target: 50, achieved: 55, percentage: 110, status: 'Exceeded' },
    { repName: 'Chuck Gaetano', territory: 'North Central', target: 80, achieved: 60, percentage: 75, status: 'Needs Attention' },
    { repName: 'Amanda Rippy', territory: 'Nashville, TN', target: 65, achieved: 40, percentage: 61, status: 'Needs Attention' }
  ];

  get dailySales() {
    return this.dataService.getDailySales();
  }

  addDailySale() {
    if (this.editingSalesId) {
      const sale = this.dailySales.find(s => s.id === this.editingSalesId);
      if (sale) {
        Object.assign(sale, this.newSale);
      }
    } else {
      const saleId = 'SLS-' + Math.floor(100 + Math.random() * 900);
      this.dataService.addDailySale({
        id: saleId,
        date: this.newSale.date,
        product: this.newSale.product,
        region: this.newSale.region,
        repName: this.newSale.repName,
        icsUnits: this.newSale.icsUnits,
        icsSales: this.newSale.icsUnits * 35800,
        accredoUnits: this.newSale.accredoUnits,
        accredoSales: this.newSale.accredoUnits * 35800,
        units: this.newSale.icsUnits + this.newSale.accredoUnits,
        revenue: (this.newSale.icsUnits + this.newSale.accredoUnits) * 35800
      });
    }
    this.closeForm();
  }

  editDailySale(sale: any) {
    this.editingSalesId = sale.id;
    this.newSale = { ...sale };
    this.showForm = true;
  }

  deleteDailySale(id: string) {
    this.dataService.deleteDailySale(id);
  }

  closeForm() {
    this.showForm = false;
    this.editingSalesId = null;
    this.newSale = { date: new Date().toISOString().split('T')[0], product: 'Anktiva 400mcg/0.4mL', region: 'East', repName: '', icsUnits: 0, icsSales: 0, accredoUnits: 0, accredoSales: 0, units: 0, revenue: 0 };
  }
  
  updateRevenue() {
    this.newSale.icsSales = this.newSale.icsUnits * 35800;
    this.newSale.accredoSales = this.newSale.accredoUnits * 35800;
    this.newSale.units = this.newSale.icsUnits + this.newSale.accredoUnits;
    this.newSale.revenue = this.newSale.units * 35800;
  }

  generateReport() {
    this.reportGenerated = true;
    this.generatedReportData = [
      { product: 'Anktiva', region: 'East', totalUnits: 125, totalRevenue: 125 * 35800 },
      { product: 'Anktiva', region: 'North Central', totalUnits: 98, totalRevenue: 98 * 35800 },
      { product: 'Anktiva', region: 'South Central', totalUnits: 64, totalRevenue: 64 * 35800 },
      { product: 'Anktiva', region: 'West', totalUnits: 142, totalRevenue: 142 * 35800 }
    ];
  }
}
