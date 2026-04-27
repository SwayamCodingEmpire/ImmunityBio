import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-territory-manager',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './territory-manager.component.html',
  styleUrl: './territory-manager.component.scss'
})
export class TerritoryManagerComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  activeTab = 'territories';
  showForm = false;
  editingTerritoryId: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  newTerritory: any = {
    id: '',
    name: '',
    director: '',
    revenue: 0,
    product: 'Anktiva 400mcg/0.4mL'
  };

  get territories() {
    return this.dataService.getTerritories();
  }

  get salesTeam() {
    return this.dataService.getSalesTeam();
  }

  getRepsByTerritory(area: string) {
    return this.salesTeam.filter(m => m.area === area);
  }

  addTerritory() {
    if (this.editingTerritoryId) {
      const terr = this.territories.find(t => t.id === this.editingTerritoryId);
      if (terr) {
        Object.assign(terr, this.newTerritory);
      }
    } else {
      this.dataService.addTerritory({ ...this.newTerritory });
    }
    this.closeForm();
  }

  editTerritory(terr: any) {
    this.editingTerritoryId = terr.id;
    this.newTerritory = { ...terr };
    this.showForm = true;
  }

  deleteTerritory(id: string) {
    this.dataService.deleteTerritory(id);
  }

  closeForm() {
    this.showForm = false;
    this.editingTerritoryId = null;
    this.newTerritory = { id: '', name: '', director: '', revenue: 0, product: 'Anktiva 400mcg/0.4mL' };
  }
}
