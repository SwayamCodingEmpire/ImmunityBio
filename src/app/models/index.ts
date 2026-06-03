// ── Shared domain models ─────────────────────────────────────

export type OrderStatus = 'Shipped' | 'Pending' | 'Credit Hold' | 'Cancelled';
export type EnrollmentStatus = 'In Progress' | 'Completed' | 'Cancelled' | 'Missing Information' | 'On Hold';

export interface Territory {
  id: string;
  name: string;
  director: string;
  revenue: number;
  product: string;
}

export interface Order {
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
  status: OrderStatus;
  date: string;
  // Extended fields used in order-management component
  shipToName?: string;
  shipToAddress?: string;
  shipToCity?: string;
  shipToState?: string;
  shipToZip?: string;
  bpNumber?: string;
  npiNumber?: string;
  territory?: string;
  businessManager?: string;
  distribution?: string;
  isCommercial?: boolean;
  icEligible?: boolean;
  abd?: string;
  shipmentIssueFlag?: boolean;
  shipmentIssueStatus?: string;
  shipmentIssueNotes?: string;
  trackingSteps?: TrackingStep[];
}

export interface TrackingStep {
  label: string;
  date: string;
  detail: string;
  status: 'completed' | 'current' | 'pending' | 'issue';
}

export interface Patient {
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
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate: string;
  enrollmentCompletionDate: string;
  // Extended profile fields
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  patientStatus?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  insurance?: string;
  insuranceId?: string;
  hcpName?: string;
  hcpNpi?: string;
  siteName?: string;
  abd?: string;
  notes?: string;
  timeline?: PatientTimelineEntry[];
}

export interface PatientTimelineEntry {
  date: string;
  event: string;
  detail: string;
  type: 'enrollment' | 'shipment' | 'status' | 'note';
}

export interface TeamMember {
  name: string;
  position: string;
  areaId: string;
  area: string;
  product: string;
  allTeamMark: string;
  glbNcl: string;
  leadershipTeam: string;
  ariTeam: string;
}

