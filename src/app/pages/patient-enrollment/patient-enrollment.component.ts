import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-enrollment',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-enrollment.component.html',
  styleUrl: './patient-enrollment.component.scss'
})
export class PatientEnrollmentComponent {
  private dataService = inject(DataService);
  
  showForm = false;
  editingPatientId: string | null = null;
  
  newPatient: any = {
    name: '',
    hubAssigned: '',
    doctor: '',
    dateOfDx: '',
    facility: '',
    product: 'Anktiva 400mcg/0.4mL',
    ndc: '61640103001',
    shipDate: '',
    qty: 1,
    status: 'Referral'
  };

  get patients() {
    return this.dataService.getPatients();
  }

  getPatientsByStatus(status: string) {
    return this.patients.filter(p => p.status === status);
  }

  addPatient() {
    if (this.editingPatientId) {
      const p = this.patients.find(x => x.id === this.editingPatientId);
      if (p) {
        Object.assign(p, this.newPatient);
      }
    } else {
      const ptId = 'PT-' + Math.floor(10000 + Math.random() * 90000);
      const reportNo = String(53190000 + Math.floor(Math.random() * 9999));
      this.dataService.addPatient({
        id: ptId,
        reportNo: reportNo,
        hubAssigned: this.newPatient.hubAssigned,
        name: this.newPatient.name,
        dateOfDx: this.newPatient.dateOfDx,
        doctor: this.newPatient.doctor,
        facility: this.newPatient.facility,
        product: this.newPatient.product,
        ndc: this.newPatient.ndc,
        shipDate: this.newPatient.shipDate,
        qty: this.newPatient.qty,
        status: this.newPatient.status,
        date: new Date().toISOString().split('T')[0]
      });
    }
    this.closeForm();
  }

  editPatient(p: any) {
    this.editingPatientId = p.id;
    this.newPatient = { ...p };
    this.showForm = true;
  }

  deletePatient(id: string) {
    this.dataService.deletePatient(id);
  }

  closeForm() {
    this.showForm = false;
    this.editingPatientId = null;
    this.newPatient = { name: '', hubAssigned: '', doctor: '', dateOfDx: '', facility: '', product: 'Anktiva 400mcg/0.4mL', ndc: '61640103001', shipDate: '', qty: 1, status: 'Referral' };
  }
}
