import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-network',
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-network.component.html',
  styleUrl: './provider-network.component.scss'
})
export class ProviderNetworkComponent {
  private dataService = inject(DataService);
  
  showForm = false;
  editingNpi: string | null = null;
  
  newPhysician: any = {
    npi: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    product: 'Anktiva 400mcg/0.4mL',
    pharmacy: ''
  };

  get physicians() {
    return this.dataService.getPhysicians();
  }

  addPhysician() {
    if (this.editingNpi) {
      const doc = this.physicians.find(x => x.npi === this.editingNpi);
      if (doc) {
        Object.assign(doc, this.newPhysician);
      }
    } else {
      this.dataService.addPhysician({ ...this.newPhysician });
    }
    this.closeForm();
  }

  editPhysician(doc: any) {
    this.editingNpi = doc.npi;
    this.newPhysician = { ...doc };
    this.showForm = true;
  }

  deletePhysician(npi: string) {
    this.dataService.deletePhysician(npi);
  }

  closeForm() {
    this.showForm = false;
    this.editingNpi = null;
    this.newPhysician = { npi: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '', product: 'Anktiva 400mcg/0.4mL', pharmacy: '' };
  }
}
