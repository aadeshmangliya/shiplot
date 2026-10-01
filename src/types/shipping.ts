export type ShipmentType = 'FCL' | 'LCL';
export type DirectionType = 'Export' | 'Import';

export type VesselStatus = 'At Sea' | 'Approaching' | 'Berthed' | 'Anchored' | 'Delayed';

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  carrier: string;
  carrierCode: string;
  voyage: string;
  flag: string;
  capacityTeu: number;
  currentTeuLoad: number;
  currentSpeedKnots: number;
  headingDegrees: number;
  lat: number;
  lng: number;
  status: VesselStatus;
  currentPortOrSea: string;
  originPort: string;
  originPortCode: string;
  destinationPort: string;
  destinationPortCode: string;
  etd: string;
  eta: string;
  progressPercent: number;
  weatherCondition: string;
  seaState: string;
  delayHours: number;
  portRotation: Array<{
    port: string;
    locode: string;
    eta: string;
    etd: string;
    status: 'completed' | 'current' | 'upcoming';
  }>;
}

export interface MonthlyVolumeRecord {
  month: string;
  fclTeu: number;
  lclCbm: number;
  exportTeu: number;
  importTeu: number;
  revenueUsd: number;
  freightCostUsd: number;
  onTimePercent: number;
}

export interface TradeLaneShare {
  lane: string;
  code: string;
  teu: number;
  percentage: number;
  color: string;
}

export interface CarrierPerformance {
  carrier: string;
  code: string;
  activeVessels: number;
  teuAllocated: number;
  onTimeRate: number;
  avgDelayDays: number;
}

export interface ContainerItem {
  id: string;
  containerNo: string;
  sealNo: string;
  type: '20GP' | '40GP' | '40HC' | '45HC' | '40RF' | '40FR';
  vesselName: string;
  voyage: string;
  pol: string;
  pod: string;
  status: 'Gate In' | 'Loaded' | 'In Transit' | 'Discharged' | 'Delivered';
  demurrageFreeDays: number;
  daysRemaining: number;
  demurrageRisk: 'safe' | 'warning' | 'critical';
  grossWeightKg: number;
  vgmKg: number;
}

export interface ShipmentItem {
  id: string;
  shipmentNo: string;
  bookingNo: string;
  type: ShipmentType;
  direction: DirectionType;
  shipper: string;
  consignee: string;
  pol: string;
  polCode: string;
  pod: string;
  podCode: string;
  carrier: string;
  vesselName: string;
  voyageNo: string;
  etd: string;
  eta: string;
  status: 'Booking Confirmed' | 'Loaded' | 'In Transit' | 'Customs Hold' | 'Customs Cleared' | 'Discharged' | 'Completed';
  containersCount: number;
  cbmVolume?: number;
  weightKg: number;
}

export interface WorkspaceCompany {
  id: string;
  name: string;
  registrationNo: string;
  hqCity: string;
  country: string;
  plan: string;
  teusThisMonth: number;
  status: 'Active' | 'Suspended' | 'Trial';
  usersCount: number;
  mrrUsd: number;
  adminEmail: string;
}

export interface PortalPermissionConfig {
  roleId: string;
  roleName: string;
  roleCategory: 'Internal Staff' | 'Client / Partner';
  description: string;
  permissions: {
    aisTracking: boolean;
    demurrageOverride: boolean;
    mblManagement: boolean;
    hblGeneration: boolean;
    profitMargins: boolean;
    cfsConsolidation: boolean;
    customsHolds: boolean;
    carrierContracts: boolean;
    ledgerInvoicing: boolean;
    extraTelemetry: boolean;
  };
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  tenantId: string;
  tenantName: string;
  action: string;
  user: string;
  severity: 'info' | 'warning' | 'critical';
}


export interface BookingItem {
  id: string;
  bookingNo: string;
  requestDate: string;
  shipper: string;
  consignee: string;
  type: ShipmentType;
  direction: DirectionType;
  pol: string;
  pod: string;
  containerType?: string;
  containerQty?: number;
  cbm?: number;
  cargoDesc: string;
  carrier: string;
  targetVessel?: string;
  targetEtd: string;
  status: 'Pending Review' | 'Approved' | 'Container Released' | 'Cancelled';
  totalFreightUsd: number;
}

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  shipmentNo: string;
  issueDate: string;
  dueDate: string;
  billTo: string;
  billToRole: 'Shipper' | 'Consignee' | 'Agent';
  type: 'Ocean Freight' | 'THC & Handling' | 'Customs Brokerage' | 'Combined Freight';
  currency: 'USD' | 'EUR' | 'SGD';
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'Paid' | 'Outstanding' | 'Overdue' | 'Partially Paid';
}

export interface ConsolidationItem {
  id: string;
  consolNo: string;
  masterBlNo: string;
  containerNo: string;
  containerType: '40HC' | '40GP';
  maxCapacityCbm: number;
  allocatedCbm: number;
  pol: string;
  pod: string;
  cfsOrigin: string;
  cfsDestination: string;
  vesselName: string;
  voyage: string;
  cutOffDate: string;
  etd: string;
  eta: string;
  status: 'Receiving' | 'Stuffed' | 'Gate In' | 'Sailing' | 'Stripped' | 'Completed';
  houseCount: number;
}

