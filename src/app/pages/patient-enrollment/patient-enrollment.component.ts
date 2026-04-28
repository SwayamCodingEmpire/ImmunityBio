import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

type PatientTab = 'directory' | 'add-patient' | 'profile' | 'enrollment' | 'timeline';
type EnrollmentStatus = 'Pending' | 'Approved' | 'Rejected' | 'On Hold' | 'Active';
type PatientStatus = 'Active' | 'Inactive';
type ProfileTab = 'overview' | 'orders' | 'enrollment' | 'timeline' | 'notes';
type TimelineFilter = 'All Events' | 'Enrollment' | 'Orders' | 'Shipments' | 'Notes';

interface PatientRecord {
  id: string;
  reportNo: string;
  hubAssigned: string;
  name: string;
  dateOfDx: string;
  doctor: string;
  physicianAddress: string;
  physicianCity: string;
  physicianState: string;
  physicianZip: string;
  facility: string;
  product: string;
  ndc: string;
  shipDate: string;
  qty: number;
  status: string;
  date: string;
  dateOfBirth?: string;
  gender?: string;
  patientStatus?: PatientStatus;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  territory?: string;
  salesRep?: string;
  enrollmentStatus?: EnrollmentStatus;
  enrollmentDate?: string;
  notes?: string;
}

interface PatientFormModel {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  patientStatus: PatientStatus;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  doctor: string;
  product: string;
  territory: string;
  salesRep: string;
  facility: string;
  enrollmentDate: string;
  enrollmentStatus: EnrollmentStatus;
  notes: string;
}

interface DirectoryFilters {
  search: string;
  enrollmentStatus: string;
  territory: string;
  physician: string;
  product: string;
  startDate: string;
  endDate: string;
}

interface EnrollmentFilters {
  status: string;
  physician: string;
  territory: string;
  salesRep: string;
  startDate: string;
  endDate: string;
}

interface TimelineEvent {
  id: string;
  patientId: string;
  title: string;
  category: TimelineFilter;
  description: string;
  date: string;
}

@Component({
  selector: 'app-patient-enrollment',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-enrollment.component.html',
  styleUrl: './patient-enrollment.component.scss'
})
export class PatientEnrollmentComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeTab: PatientTab = 'directory';
  profileTab: ProfileTab = 'overview';
  timelineFilter: TimelineFilter = 'All Events';
  editingPatientId: string | null = null;
  selectedPatientId: string | null = null;

  directoryFilters: DirectoryFilters = {
    search: '',
    enrollmentStatus: 'All',
    territory: 'All',
    physician: 'All',
    product: 'All',
    startDate: '',
    endDate: ''
  };

  enrollmentFilters: EnrollmentFilters = {
    status: 'All',
    physician: 'All',
    territory: 'All',
    salesRep: 'All',
    startDate: '',
    endDate: ''
  };

  patientForm: PatientFormModel = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    patientStatus: 'Active',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    doctor: '',
    product: 'Anktiva 400mcg/0.4mL',
    territory: 'East',
    salesRep: '',
    facility: 'ACCREDO HEALTH GROUP INC.',
    enrollmentDate: new Date().toISOString().split('T')[0],
    enrollmentStatus: 'Pending',
    notes: ''
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'] as PatientTab | undefined;
      this.activeTab = tab ?? 'directory';

      if (params['patientId']) {
        this.selectedPatientId = params['patientId'];
      }

      if (!this.selectedPatientId && this.patients.length > 0) {
        this.selectedPatientId = this.patients[0].id;
      }

      if (this.activeTab === 'add-patient' && !this.editingPatientId) {
        this.resetPatientForm();
      }
    });
  }

  get patients(): PatientRecord[] {
    return this.dataService.getPatients() as PatientRecord[];
  }

  get selectedPatient(): PatientRecord | undefined {
    return this.patients.find((patient) => patient.id === this.selectedPatientId) ?? this.patients[0];
  }

  get territoryOptions(): string[] {
    return ['All', ...new Set(this.dataService.getTerritories().map((territory: any) => territory.name))];
  }

  get physicianOptions(): string[] {
    return ['All', ...new Set(this.patients.map((patient) => patient.doctor).filter(Boolean))];
  }

  get productOptions(): string[] {
    return ['All', ...new Set(this.patients.map((patient) => patient.product).filter(Boolean))];
  }

  get salesRepOptions(): string[] {
    const reps = (this.dataService.getSalesTeam() as any[])
      .filter((member) => member.position !== 'Area Business Director')
      .map((member) => member.name);

    return ['All', ...new Set(reps)];
  }

  get directoryKpis() {
    const rows = this.filteredPatients;
    const activePatients = rows.filter((patient) => this.getPatientStatus(patient) === 'Active').length;
    const pendingEnrollments = rows.filter((patient) => this.getEnrollmentStatus(patient) === 'Pending').length;
    const approvedEnrollments = rows.filter((patient) => ['Approved', 'Active'].includes(this.getEnrollmentStatus(patient))).length;
    const totalOrders = rows.reduce((sum, patient) => sum + this.getPatientOrders(patient).length, 0);

    return {
      totalPatients: rows.length,
      activePatients,
      pendingEnrollments,
      approvedEnrollments,
      totalOrders
    };
  }

  get filteredPatients(): PatientRecord[] {
    const search = this.directoryFilters.search.trim().toLowerCase();

    return this.patients.filter((patient) => {
      const enrollmentStatus = this.getEnrollmentStatus(patient);
      const territory = this.getTerritory(patient);
      const patientDate = patient.date || patient.enrollmentDate || '';

      return (!search
        || patient.name.toLowerCase().includes(search)
        || patient.id.toLowerCase().includes(search)
        || (patient.phone ?? '').toLowerCase().includes(search)
        || patient.doctor.toLowerCase().includes(search))
        && (this.directoryFilters.enrollmentStatus === 'All' || enrollmentStatus === this.directoryFilters.enrollmentStatus)
        && (this.directoryFilters.territory === 'All' || territory === this.directoryFilters.territory)
        && (this.directoryFilters.physician === 'All' || patient.doctor === this.directoryFilters.physician)
        && (this.directoryFilters.product === 'All' || patient.product === this.directoryFilters.product)
        && (!this.directoryFilters.startDate || patientDate >= this.directoryFilters.startDate)
        && (!this.directoryFilters.endDate || patientDate <= this.directoryFilters.endDate);
    });
  }

  get enrollmentRows() {
    return this.patients
      .filter((patient) => {
        const enrollmentStatus = this.getEnrollmentStatus(patient);
        const territory = this.getTerritory(patient);
        const salesRep = this.getSalesRep(patient);
        const enrollmentDate = patient.enrollmentDate ?? patient.date ?? '';

        return (this.enrollmentFilters.status === 'All' || enrollmentStatus === this.enrollmentFilters.status)
          && (this.enrollmentFilters.physician === 'All' || patient.doctor === this.enrollmentFilters.physician)
          && (this.enrollmentFilters.territory === 'All' || territory === this.enrollmentFilters.territory)
          && (this.enrollmentFilters.salesRep === 'All' || salesRep === this.enrollmentFilters.salesRep)
          && (!this.enrollmentFilters.startDate || enrollmentDate >= this.enrollmentFilters.startDate)
          && (!this.enrollmentFilters.endDate || enrollmentDate <= this.enrollmentFilters.endDate);
      })
      .map((patient) => ({
        enrollmentId: `ENR-${patient.id.replace('PT-', '')}`,
        patient,
        physician: patient.doctor,
        territory: this.getTerritory(patient),
        salesRep: this.getSalesRep(patient),
        enrollmentDate: patient.enrollmentDate ?? patient.date,
        status: this.getEnrollmentStatus(patient),
        pendingSince: this.getPendingSince(patient),
        reason: patient.notes || this.getEnrollmentReason(patient)
      }));
  }

  get enrollmentKpis() {
    return {
      total: this.enrollmentRows.length,
      pending: this.enrollmentRows.filter((row) => row.status === 'Pending').length,
      approved: this.enrollmentRows.filter((row) => row.status === 'Approved' || row.status === 'Active').length,
      onHold: this.enrollmentRows.filter((row) => row.status === 'On Hold').length,
      rejected: this.enrollmentRows.filter((row) => row.status === 'Rejected').length
    };
  }

  get selectedPatientTimeline(): TimelineEvent[] {
    if (!this.selectedPatient) {
      return [];
    }

    return this.getPatientTimeline(this.selectedPatient).filter((event) =>
      this.timelineFilter === 'All Events' || event.category === this.timelineFilter
    );
  }

  get profileSummary() {
    if (!this.selectedPatient) {
      return null;
    }

    const patient = this.selectedPatient;
    const orders = this.getPatientOrders(patient);

    return {
      patient,
      age: this.getPatientAge(patient),
      enrollmentStatus: this.getEnrollmentStatus(patient),
      territory: this.getTerritory(patient),
      salesRep: this.getSalesRep(patient),
      totalOrders: orders.length,
      lastOrderDate: this.getLastOrderDate(patient),
      distributor: patient.facility,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      units: orders.reduce((sum, order) => sum + order.units, 0)
    };
  }

  get selectedPatientOrders() {
    return this.selectedPatient ? this.getPatientOrders(this.selectedPatient) : [];
  }

  savePatient() {
    if (this.editingPatientId) {
      const patient = this.patients.find((item) => item.id === this.editingPatientId);
      if (patient) {
        Object.assign(patient, this.mapFormToPatient(patient.id, patient.reportNo, patient.hubAssigned));
      }
    } else {
      const ptId = 'PT-' + Math.floor(10000 + Math.random() * 90000);
      const reportNo = String(53190000 + Math.floor(Math.random() * 9999));
      const hubAssigned = '32' + Math.floor(100000 + Math.random() * 900000);
      this.dataService.addPatient({
        ...this.mapFormToPatient(ptId, reportNo, hubAssigned),
        date: new Date().toISOString().split('T')[0]
      });
      this.selectedPatientId = ptId;
    }

    this.editingPatientId = null;
    this.setTab('directory', this.selectedPatientId ?? this.patients[0]?.id);
  }

  editPatient(patient: PatientRecord): void {
    this.editingPatientId = patient.id;
    this.selectedPatientId = patient.id;
    this.patientForm = this.mapPatientToForm(patient);
    this.setTab('add-patient', patient.id);
  }

  deletePatient(id: string): void {
    this.dataService.deletePatient(id);
    if (this.selectedPatientId === id) {
      this.selectedPatientId = this.patients[0]?.id ?? null;
    }
  }

  startAddPatient(): void {
    this.editingPatientId = null;
    this.resetPatientForm();
    this.setTab('add-patient', this.selectedPatientId ?? undefined);
  }

  openPatientProfile(patientId: string, profileTab: ProfileTab = 'overview'): void {
    this.profileTab = profileTab;
    this.setTab('profile', patientId);
  }

  openPatientTimeline(patientId: string): void {
    this.timelineFilter = 'All Events';
    this.setTab('timeline', patientId);
  }

  addOrderForPatient(patientId: string): void {
    this.profileTab = 'orders';
    this.setTab('profile', patientId);
  }

  setTab(tab: PatientTab, patientId?: string): void {
    this.activeTab = tab;
    if (patientId) {
      this.selectedPatientId = patientId;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tab,
        patientId: patientId ?? this.selectedPatientId ?? undefined
      },
      queryParamsHandling: 'merge'
    });
  }

  updateEnrollmentStatus(patientId: string, status: EnrollmentStatus): void {
    const patient = this.patients.find((item) => item.id === patientId);
    if (!patient) {
      return;
    }

    patient.enrollmentStatus = status;
    if (status === 'Active') {
      patient.patientStatus = 'Active';
    }
  }

  addEnrollmentNote(patientId: string): void {
    const patient = this.patients.find((item) => item.id === patientId);
    if (!patient) {
      return;
    }

    patient.notes = patient.notes
      ? `${patient.notes} | Follow-up added by operations team.`
      : 'Follow-up added by operations team.';
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'Active' || status === 'Approved' || status === 'First Dose') {
      return 'ib-status-badge--success';
    }

    if (status === 'Pending' || status === 'Referral' || status === 'Insurance Auth' || status === 'On Hold') {
      return 'ib-status-badge--warning';
    }

    if (status === 'Rejected' || status === 'Inactive') {
      return 'ib-status-badge--danger';
    }

    return 'ib-status-badge--neutral';
  }

  private mapPatientToForm(patient: PatientRecord): PatientFormModel {
    const [firstName = '', ...rest] = patient.name.split(' ');

    return {
      firstName,
      lastName: rest.join(' '),
      dateOfBirth: patient.dateOfBirth ?? '',
      gender: patient.gender ?? 'Male',
      patientStatus: this.getPatientStatus(patient),
      phone: patient.phone ?? '',
      email: patient.email ?? '',
      address: patient.address ?? patient.physicianAddress ?? '',
      city: patient.city ?? patient.physicianCity ?? '',
      state: patient.state ?? patient.physicianState ?? '',
      zip: patient.zip ?? patient.physicianZip ?? '',
      doctor: patient.doctor,
      product: patient.product,
      territory: this.getTerritory(patient),
      salesRep: this.getSalesRep(patient),
      facility: patient.facility,
      enrollmentDate: patient.enrollmentDate ?? patient.date ?? new Date().toISOString().split('T')[0],
      enrollmentStatus: this.getEnrollmentStatus(patient),
      notes: patient.notes ?? ''
    };
  }

  private mapFormToPatient(id: string, reportNo: string, hubAssigned: string): PatientRecord {
    return {
      id,
      reportNo,
      hubAssigned,
      name: `${this.patientForm.firstName} ${this.patientForm.lastName}`.trim(),
      dateOfDx: this.patientForm.enrollmentDate,
      doctor: this.patientForm.doctor,
      physicianAddress: this.patientForm.address,
      physicianCity: this.patientForm.city,
      physicianState: this.patientForm.state,
      physicianZip: this.patientForm.zip,
      facility: this.patientForm.facility,
      product: this.patientForm.product,
      ndc: '61640103001',
      shipDate: '',
      qty: 0,
      status: this.patientForm.enrollmentStatus,
      date: this.patientForm.enrollmentDate,
      dateOfBirth: this.patientForm.dateOfBirth,
      gender: this.patientForm.gender,
      patientStatus: this.patientForm.patientStatus,
      phone: this.patientForm.phone,
      email: this.patientForm.email,
      address: this.patientForm.address,
      city: this.patientForm.city,
      state: this.patientForm.state,
      zip: this.patientForm.zip,
      territory: this.patientForm.territory,
      salesRep: this.patientForm.salesRep,
      enrollmentStatus: this.patientForm.enrollmentStatus,
      enrollmentDate: this.patientForm.enrollmentDate,
      notes: this.patientForm.notes
    };
  }

  private resetPatientForm(): void {
    this.patientForm = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      patientStatus: 'Active',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      doctor: '',
      product: 'Anktiva 400mcg/0.4mL',
      territory: 'East',
      salesRep: 'Lisa Volomino',
      facility: 'ACCREDO HEALTH GROUP INC.',
      enrollmentDate: new Date().toISOString().split('T')[0],
      enrollmentStatus: 'Pending',
      notes: ''
    };
  }

  private getPatientAge(patient: PatientRecord): number | string {
    if (!patient.dateOfBirth) {
      return '--';
    }

    const birthDate = new Date(patient.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private getPatientStatus(patient: PatientRecord): PatientStatus {
    return patient.patientStatus ?? (patient.status === 'Rejected' ? 'Inactive' : 'Active');
  }

  private getEnrollmentStatus(patient: PatientRecord): EnrollmentStatus {
    if (patient.enrollmentStatus) {
      return patient.enrollmentStatus;
    }

    if (patient.status === 'First Dose') {
      return 'Active';
    }

    if (patient.status === 'Insurance Auth') {
      return 'Approved';
    }

    return 'Pending';
  }

  private getTerritory(patient: PatientRecord): string {
    if (patient.territory) {
      return patient.territory;
    }

    const territoryMap: Record<string, string> = {
      NY: 'East',
      MD: 'East',
      PA: 'East',
      TX: 'South Central',
      TN: 'North Central',
      OH: 'North Central',
      CA: 'Southwest'
    };

    return territoryMap[patient.physicianState] ?? 'East';
  }

  private getSalesRep(patient: PatientRecord): string {
    if (patient.salesRep) {
      return patient.salesRep;
    }

    const territory = this.getTerritory(patient);
    const team = this.dataService.getSalesTeam() as any[];
    return team.find((member) => member.area === territory && member.position !== 'Area Business Director')?.name ?? 'Unassigned';
  }

  private getPatientOrders(patient: PatientRecord): any[] {
    const lastName = patient.name.split(' ').slice(-1)[0]?.toLowerCase() ?? '';
    const territory = this.getTerritory(patient).toLowerCase().split(' ')[0];

    return this.dataService.getRecentOrders().filter((order: any) =>
      order.facility.toLowerCase().includes(lastName)
      || order.facility.toLowerCase().includes(territory)
      || order.impTypeName.toLowerCase().includes('physician')
    ).slice(0, 3);
  }

  private getLastOrderDate(patient: PatientRecord): string {
    return patient.shipDate || this.getPatientOrders(patient)[0]?.date || '-';
  }

  private getPendingSince(patient: PatientRecord): string {
    const startDate = new Date(patient.enrollmentDate ?? patient.date);
    const today = new Date('2026-04-28');
    const diff = Math.max(0, Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    return `${diff} days`;
  }

  private getEnrollmentReason(patient: PatientRecord): string {
    const status = this.getEnrollmentStatus(patient);

    if (status === 'On Hold') {
      return 'Waiting for payer documentation';
    }

    if (status === 'Rejected') {
      return 'Coverage validation failed';
    }

    if (status === 'Approved' || status === 'Active') {
      return 'Ready for fulfillment and first shipment';
    }

    return 'Awaiting enrollment review';
  }

  private getPatientTimeline(patient: PatientRecord): TimelineEvent[] {
    const events: TimelineEvent[] = [
      {
        id: `${patient.id}-created`,
        patientId: patient.id,
        title: 'Patient Created',
        category: 'Enrollment',
        description: `Patient record created for ${patient.name}.`,
        date: patient.date
      },
      {
        id: `${patient.id}-submitted`,
        patientId: patient.id,
        title: 'Enrollment Submitted',
        category: 'Enrollment',
        description: `Enrollment submitted to ${patient.facility}.`,
        date: patient.enrollmentDate ?? patient.date
      },
      {
        id: `${patient.id}-status`,
        patientId: patient.id,
        title: `Status Changed to ${this.getEnrollmentStatus(patient)}`,
        category: 'Enrollment',
        description: this.getEnrollmentReason(patient),
        date: patient.shipDate || patient.date
      }
    ];

    if (patient.shipDate) {
      events.push(
        {
          id: `${patient.id}-shipped`,
          patientId: patient.id,
          title: 'Order Shipped',
          category: 'Shipments',
          description: `Shipment released from ${patient.facility}.`,
          date: patient.shipDate
        },
        {
          id: `${patient.id}-delivered`,
          patientId: patient.id,
          title: 'Order Delivered',
          category: 'Orders',
          description: 'Order delivery confirmed.',
          date: patient.shipDate
        }
      );
    }

    if (patient.notes) {
      events.push({
        id: `${patient.id}-notes`,
        patientId: patient.id,
        title: 'Notes Added',
        category: 'Notes',
        description: patient.notes,
        date: patient.enrollmentDate ?? patient.date
      });
    }

    return events.sort((a, b) => b.date.localeCompare(a.date));
  }
}
