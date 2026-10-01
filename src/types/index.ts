export type ShipmentType = 'FCL' | 'LCL';
export type ShipmentDirection = 'Export' | 'Import';
export type ShipmentStatus = 'Booking Confirmed' | 'Documentation' | 'Cargo Received' | 'Gate In' | 'Loaded' | 'In Transit' | 'Customs Hold' | 'Discharged' | 'Delivered';

export interface Company {
  id: string;
  name: string;
  registrationNo: string;
  hqCity: string;
  country: string;
  plan: 'Growth' | 'Scale Pro' | 'Enterprise Plus';
  teusThisMonth: number;
  status: 'Active' | 'Suspended';
  usersCount: number;
  mrrUsd: number;
  adminEmail: string;
}

export interface RolePermissions {
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
}

export interface RoleItem {
  roleId: string;
  roleName: string;
  roleCategory: 'Internal Staff' | 'Client / Partner';
  description: string;
  permissions: RolePermissions;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  tenantId: string;
  tenantName: string;
  action: string;
  user: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface MonthlyMetric {
  month: string;
  fclTeu: number;
  lclCbm: number;
  exportTeu: number;
  importTeu: number;
  revenueUsd: number;
  freightCostUsd: number;
  onTimePercent: number;
}

export interface PortRotation {
  port: string;
  locode: string;
  eta: string;
  etd: string;
  status: 'completed' | 'current' | 'upcoming';
}

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
  status: 'At Sea' | 'Berthed' | 'Approaching' | 'Anchored';
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
  portRotation: PortRotation[];
}

export interface Container {
  id: string;
  containerNo: string;
  sealNo: string;
  type: string;
  vesselName: string;
  voyage: string;
  pol: string;
  pod: string;
  status: 'Loaded' | 'In Transit' | 'Discharged' | 'Gated Out';
  demurrageFreeDays: number;
  daysRemaining: number;
  demurrageRisk: 'safe' | 'warning' | 'critical';
  grossWeightKg: number;
  vgmKg: number;
  locationStatus: 'Booked' | 'At Sea' | 'At Port' | 'In Warehouse';
  ownership?: 'SOC' | 'COC';
  currentLocation?: string;
  tareWeightKg?: number;
  maxPayloadKg?: number;
  clientOwner?: string;
}

export type GatePassType = 'Gate In (Laden)' | 'Gate In (Empty)' | 'Gate Out (Laden)' | 'Gate Out (Empty)';
export type GatePassStatus = 'Approved' | 'In-Transit' | 'Completed' | 'Cancelled';

export interface GatePass {
  id: string;
  gatePassNo: string;
  type: GatePassType;
  containerNo: string;
  containerType: string;
  sealNo: string;
  truckNo: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  transporterCompany: string;
  terminalOrDepot: string;
  bookingOrBlNo: string;
  issuedAt: string;
  validUntil: string;
  status: GatePassStatus;
  eirReference?: string;
  tareWeightKg?: number;
  grossWeightKg?: number;
  securityNotes?: string;
}

export interface WarehouseCargoItem {
  id: string;
  receiptNo: string;
  clientName: string;
  cargoDesc: string;
  storageType: 'Bonded Storage' | 'General Dry Storage' | 'Temperature Controlled' | 'Yard Bulk Staging';
  packageCount: number;
  packageType: string;
  cbmVolume: number;
  grossWeightKg: number;
  warehouseName: string;
  bayLocation: string;
  inDate: string;
  dailyRateUsd: number;
  accruedChargesUsd: number;
  status: 'Stored' | 'Staged for Loading' | 'Dispatched';
  associatedContainerNo?: string;
}

export interface Shipment {
  id: string;
  shipmentNo: string;
  bookingNo: string;
  type: ShipmentType;
  direction: ShipmentDirection;
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
  status: ShipmentStatus;
  containersCount: number;
  weightKg: number;
  cbmVolume?: number;
  cargoDesc?: string;
}

export interface Booking {
  id: string;
  bookingNo: string;
  requestDate: string;
  shipper: string;
  consignee: string;
  type: ShipmentType;
  direction: ShipmentDirection;
  pol: string;
  pod: string;
  containerType: string;
  containerQty: number;
  cargoDesc: string;
  carrier: string;
  targetVessel: string;
  targetEtd: string;
  status: 'Pending Review' | 'Approved' | 'Declined';
  totalFreightUsd: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  shipmentNo: string;
  issueDate: string;
  dueDate: string;
  billTo: string;
  billToRole: string;
  type: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface Port {
  code: string;
  name: string;
  country: string;
  terminalsCount: number;
  coordinates: [number, number];
}

export interface ConsolidationLot {
  id: string;
  consolNo: string;
  masterBlNo: string;
  containerNo: string;
  containerType: string;
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
  status: string;
  houseCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'nvocc_admin' | 'freight_forwarder' | 'finance_staff' | 'operations_staff' | 'exporter' | 'importer' | 'agent' | 'platform_admin';
  workspaceId: string;
  workspaceName: string;
}
