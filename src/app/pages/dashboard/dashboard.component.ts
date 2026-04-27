import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private dataService = inject(DataService);

  kpis = this.dataService.getKpis();
  territories = this.dataService.getTerritories();

  // Image 2: Weekly Sales table (Fri/Sat/Sun, Mon, Tue, Wed, Thu, Total)
  weeklySales = [
    { label: 'Shipped',   fri: 23, mon: 18, tue: 0, wed: 0, thu: 0, total: 41 },
    { label: 'Pending',   fri: 0,  mon: 22, tue: 0, wed: 0, thu: 0, total: 22 },
    { label: 'TOTAL',     fri: 23, mon: 40, tue: 0, wed: 0, thu: 0, total: 63 }
  ];

  weeklyRevenue = [
    { label: 'Sales $', fri: 823400, mon: 1432000, tue: 0, wed: 0, thu: 0, total: 2255400 },
    { label: 'Enrolm.', fri: 1,      mon: 1,       tue: 0, wed: 0, thu: 0, total: 2 }
  ];

  // Image 2: Quarterly Breakdown
  quarterlyBreakdown = [
    { quarter: 'Q1', period: 'January',  shipped: 315, pending: 0, totalUnits: 315, totalSales: 11277000, icsUnits: 276, icsSales: 9880800, accredoSales: 1611000, ibCare: 100, accredo: 5 },
    { quarter: '',   period: 'February', shipped: 587, pending: 0, totalUnits: 587, totalSales: 21014800, icsUnits: 508, icsSales: 18186400, accredoSales: 2613400, ibCare: 63,  accredo: 13 },
    { quarter: '',   period: 'March',    shipped: 571, pending: 0, totalUnits: 571, totalSales: 20441800, icsUnits: 417, icsSales: 14928400, accredoSales: 2506000, ibCare: 54,  accredo: 8 },
    { quarter: 'Q1 TOTAL', period: '', shipped: 1473, pending: 0, totalUnits: 1473, totalSales: 52733400, icsUnits: 1201, icsSales: 42995800, accredoSales: 6730400, ibCare: 217, accredo: 26, isTotal: true },
    { quarter: 'Q2', period: 'April',   shipped: 304, pending: 22, totalUnits: 326, totalSales: 11678800, icsUnits: 304, icsSales: 10883200, accredoSales: 1324600, ibCare: 38, accredo: 8 },
  ];

  // Image 2: Territory/Rep table (Current Week, Current Quarter, YTD)
  repPerformance = [
    { territory: 'EAST', director: 'Keith DeRuiter', rep: 'Lisa Volomino (Boston, MA)', cwEnroll: 1, cwUnits: 0, cqEnroll: 11, cqUnits: 61, ytdEnroll: 11, ytdUnits: 61 },
    { territory: '', director: '', rep: 'Karen Martinez (New York, NY)', cwEnroll: 0, cwUnits: 3, cqEnroll: 4, cqUnits: 23, ytdEnroll: 4, ytdUnits: 23 },
    { territory: '', director: '', rep: 'Timothy Kibel (Syracuse, NY)', cwEnroll: 0, cwUnits: 0, cqEnroll: 27, cqUnits: 28, ytdEnroll: 27, ytdUnits: 139 },
    { territory: '', director: '', rep: 'Brian Girbes (Philadelphia, PA)', cwEnroll: 0, cwUnits: 0, cqEnroll: 9, cqUnits: 8, ytdEnroll: 9, ytdUnits: 51 },
    { territory: 'NORTH CENTRAL', director: 'Chuck Gaetano', rep: 'Amanda Rippy (Nashville, TN)', cwEnroll: 1, cwUnits: 0, cqEnroll: 27, cqUnits: 7, ytdEnroll: 27, ytdUnits: 97 },
    { territory: '', director: '', rep: 'Dylan Mazelton (Detroit, MI)', cwEnroll: 0, cwUnits: 1, cqEnroll: 1, cqUnits: 15, ytdEnroll: 1, ytdUnits: 68 },
  ];
}
