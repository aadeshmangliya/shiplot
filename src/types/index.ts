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
  // WPCargo Company Branding & Detailed Profile
  logoUrl?: string;
  displayName?: string;
  tagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  address?: string;
  stateProvince?: string;
  postalCode?: string;
  phone?: string;
  emergencyPhone?: string;
  email?: string;
  billingEmail?: string;
  nationalId?: string; // NTN / Tax ID / TRN
  ntnNumber?: string;
  salesTaxNumber?: string;
  website?: string;
  scacCode?: string;
  blPrefix?: string;
  ediGateway?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  bankName?: string;
  bankAccountTitle?: string;
  bankIban?: string;
  bankSwift?: string;
  selectedTemplates?: Record<string, string>;
}

export type CompanyUserRole =
  | 'freight_forwarder'
  | 'importer'
  | 'exporter'
  | 'finance'
  | 'operations'
  | 'documentation'
  | 'nvocc_admin';

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: CompanyUserRole;
  roleTitle: string;
  department: string;
  phone?: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  companyId: string;
}

export type TemplateDocType =
  | 'HBL'
  | 'MBL'
  | 'DO'
  | 'AIR_BILL'
  | 'GATE_PASS'
  | 'INVOICE'
  | 'ARRIVAL_NOTICE'
  | 'SHIPPING_INSTRUCTION';

export interface DocumentTemplate {
  id: string;
  name: string;
  docType: TemplateDocType;
  docTypeLabel: string;
  description: string;
  version: string;
  isShiplotMaster: boolean; // Created by Shiplot Admin
  isDefault: boolean; // Default format
  companyId?: string; // If company-specific customized variant
  htmlContent: string;
  availableTags: string[];
  lastUpdated: string;
  author: string; // 'Shiplot SuperAdmin' or Company Name
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
  // SRS Extended Permissions
  ledgerAccess: boolean;
  igmEgmAccess: boolean;
  customsClearanceAccess: boolean;
  canGenerateDeliveryOrder: boolean;
  agencyOperations: boolean;
  exportWorkflow: boolean;
}

export interface RoleItem {
  roleId: string;
  roleName: string;
  roleCategory: 'Internal Staff' | 'Client / Partner';
  description: string;
  permissions: RolePermissions;
}

export type AuditSeverity = 'info' | 'warning' | 'critical';

export type AuditCategory =
  | 'Shipments & B/L'
  | 'Users & Security'
  | 'Customs & Manifests'
  | 'Finance & Billing'
  | 'Documents & Templates'
  | 'Containers & Gate Pass'
  | 'Tenant Management'
  | 'Platform Security'
  | 'EDI & Telemetry';

export type AuditScope = 'NVOCC' | 'SHIPLOT_PLATFORM' | 'BOTH';

export interface AuditLog {
  id: string;
  timestamp: string;
  tenantId: string;
  tenantName: string;
  action: string;
  user: string;
  severity: AuditSeverity;
  category?: AuditCategory;
  scope?: AuditScope;
  ipAddress?: string;
  station?: string;
  details?: string;
  targetRef?: string;
  status?: 'Success' | 'Warning' | 'Blocked' | 'Flagged';
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

export type ContainerCommercialPurpose = 'Self-Use' | 'For-Booking' | 'For-Sale' | 'Leased-In';
export type ContainerConditionGrade = 'IICL-5' | 'Cargo Worthy (CW)' | 'Wind & Water Tight (WWT)' | 'As-Is';

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
  // Extended Fleet, Asset & Photo Management
  images?: string[]; // Up to 3 high-res photos
  imageCaptions?: string[];
  commercialPurpose?: ContainerCommercialPurpose;
  conditionGrade?: ContainerConditionGrade;
  salePriceUsd?: number;
  leaseDailyRateUsd?: number;
  sourceProvider?: string; // 'Company Owned (Direct Title)' or 'Triton Leasing' etc.
  cscPlateNumber?: string;
  manufactureYear?: number;
  manufacturer?: string;
  lastSurveyDate?: string;
  yardSlot?: string;
  floorType?: 'Marine Hardwood' | 'Bamboo Composite' | 'Steel Plate';
  isSold?: boolean;
  soldToParty?: string;
  soldPriceUsd?: number;
  soldDate?: string;
  leaseClient?: string;
}

// LoLo (Lift-on / Lift-off) Handling Types
export type LoloLiftType =
  | 'Inbound Lift-Off (Trailer to Ground)'
  | 'Outbound Lift-On (Ground to Chassis)'
  | 'Yard Restack / Shift'
  | 'CFS Destuffing / Stuffing Lift';

export interface LoloTicket {
  id: string;
  ticketNo: string;
  containerNo: string;
  containerType: string;
  liftType: LoloLiftType;
  status: 'Laden' | 'Empty';
  equipmentType: 'Reach Stacker' | 'Top Loader' | 'RTG Crane' | 'Heavy Forklift';
  equipmentId: string;
  operatorName: string;
  truckNo: string;
  transporter: string;
  loloFeeUsd: number;
  paymentMode: 'Billed to Invoice' | 'Prepaid by Shipper' | 'Cash at Gate' | 'Included in D/O';
  isPaid: boolean;
  timestamp: string;
  depotName: string;
  receiptOrBlRef?: string;
  remarks?: string;
}

export interface LoloTariff {
  id: string;
  category: string;
  rateLaden20: number;
  rateLaden40: number;
  rateEmpty20: number;
  rateEmpty40: number;
  hazardousSurcharge: number;
  overweightSurcharge: number;
  restackFee: number;
  currency: string;
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
  // LoLo & Customs handling specs
  loloChargeInboundUsd?: number;
  loloChargeOutboundUsd?: number;
  loloPaymentStatus?: 'Paid' | 'Pending' | 'Billed on Invoice';
  customsBondNumber?: string;
  freeDaysGranted?: number;
  handlingStatus?: 'Unloaded' | 'Racked' | 'Cross-Docked' | 'Released';
  hsCode?: string;
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
  carrierCode?: string;
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
  // Detailed Operational Specifications
  shipperAddress?: string;
  shipperPhone?: string;
  shipperEmail?: string;
  shipperTaxId?: string;
  consigneeAddress?: string;
  consigneePhone?: string;
  consigneeEmail?: string;
  consigneeTaxId?: string;
  notifyPartyName?: string;
  notifyPartyAddress?: string;
  contractNo?: string;
  tradeLane?: string;
  placeOfReceipt?: string;
  placeOfDelivery?: string;
  targetEta?: string;
  cargoCutOff?: string;
  siCutOff?: string;
  vgmCutOff?: string;
  grossWeightKg?: number;
  tareWeightKg?: number;
  vgmKg?: number;
  vgmMethod?: string;
  cbmVolume?: number;
  revenueTons?: number;
  packagesCount?: string;
  hsCode?: string;
  incoterms?: string;
  freightTerms?: 'FREIGHT PREPAID' | 'FREIGHT COLLECT';
  demurrageFreeDays?: number;
  detentionFreeDays?: number;
  emptyDepot?: string;
  cfsOrigin?: string;
  cfsDestination?: string;
  groupageLotNo?: string;
  masterBlNo?: string;
  masterContainerNo?: string;
  isDangerousGoods?: boolean;
  dgDetails?: string;
  isReefer?: boolean;
  reeferDetails?: string;
  blType?: string;
  specialInstructions?: string;
  // Extended Maritime Fields
  cargoReadyDate?: string;
  bookingExpiryDate?: string;
  forwarderName?: string;
  forwarderLicenseNo?: string;
  forwarderContact?: string;
  movementType?: string;
  quotationRef?: string;
  shipperRef?: string;
  coLoaderRef?: string;
  coLoaderMasterBookingNo?: string;
  lcNumber?: string;
  lcIssuingBank?: string;
  serviceLoop?: string;
  polTerminal?: string;
  podTerminal?: string;
  isTransshipment?: boolean;
  transshipmentPort?: string;
  customsCutOff?: string;
  emptyReleaseRef?: string;
  emptyPickupDate?: string;
  earliestReturnDate?: string;
  haulageMode?: string;
  truckingCompany?: string;
  driverCnic?: string;
  trailerPlateNo?: string;
  solasStation?: string;
  scaleCertNo?: string;
  vgmSignatory?: string;
  declaredValueUsd?: number;
  insurancePolicyNo?: string;
  currency?: string;
  cfsOriginBay?: string;
  cfsAppointmentId?: string;
  cfsDestBay?: string;
  stuffingDate?: string;
  destripDate?: string;
  ispm15Certified?: boolean;
  wpmTreatment?: string;
  destAgentName?: string;
  destAgentPhone?: string;
  destAgentEmail?: string;
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

// ============================================
// SRS SECTION 5 & 6 — IGM / EGM MANIFESTS
// ============================================
export interface ManifestBlItem {
  blNumber: string;
  lineNo: number;
  subLineNo: number;
  shipper: string;
  consignee: string;
  notifyParty?: string;
  packagesCount: number;
  packageType: string;
  cargoDesc: string;
  grossWeightKg: number;
  cbmVolume: number;
  containers: string[];
  marksAndNumbers: string;
}

export interface ImportGeneralManifest {
  id: string;
  igmNumber: string;
  vesselName: string;
  imoNumber: string;
  voyageNumber: string;
  callSign: string;
  shippingLine: string;
  portOfArrival: string;
  portCode: string;
  terminalName: string;
  etaDate: string;
  filingDate: string;
  totalBls: number;
  totalContainers: number;
  totalGrossWeightKg: number;
  customsStation: string;
  webocFilingStatus: 'Draft' | 'Submitted' | 'Acknowledged' | 'Approved' | 'Query Raised';
  blItems: ManifestBlItem[];
}

export interface ExportGeneralManifest {
  id: string;
  egmNumber: string;
  vesselName: string;
  imoNumber: string;
  voyageNumber: string;
  shippingLine: string;
  portOfLoading: string;
  portCode: string;
  terminalName: string;
  sailingDate: string;
  filingDate: string;
  totalBls: number;
  totalContainers: number;
  totalGrossWeightKg: number;
  customsStation: string;
  status: 'Draft' | 'Filed' | 'Sailing Clearance Issued';
  blItems: ManifestBlItem[];
}

// ============================================
// WPCARGO PARITY — DELIVERY ORDER (D.O.)
// ============================================
export interface DeliveryOrderContainer {
  containerNo: string;
  sizeType: string;
  sealNo: string;
  emptyReturnLocation: string;
  emptyReturnValidity: string;
  marksAndNumbers: string;
  packageCount: number;
  packageType: string;
  cargoDesc: string;
  grossWeightKg: number;
}

export interface DeliveryOrder {
  id: string;
  doNumber: string;
  issueDate: string;
  validityDate: string;
  vesselName: string;
  voyage: string;
  virNumber: string;
  mblNumber: string;
  hblNumber: string;
  destinationPort: string;
  igmNumber: string;
  igmLineNo: number;
  igmSubLineNo: number;
  issuedTo: string;
  consigneeName: string;
  consigneeAddress: string;
  notifyPartyName: string;
  notifyPartyAddress: string;
  containers: DeliveryOrderContainer[];
  lineRemarks: string;
  status: 'Issued' | 'Expired' | 'Surrendered' | 'Gate Pass Generated';
  clearingAgent?: string;
}

// ============================================
// EXPORT-SIDE NVOCC & SHIPPING INSTRUCTIONS
// ============================================
export interface ShippingInstruction {
  id: string;
  siNumber: string;
  bookingNo: string;
  shipperName: string;
  consigneeName: string;
  notifyPartyName: string;
  vesselName: string;
  voyage: string;
  pol: string;
  pod: string;
  finalDestination: string;
  cargoDesc: string;
  packagesCount: number;
  packageType: string;
  grossWeightKg: number;
  cbmVolume: number;
  submissionDate: string;
  status: 'Draft' | 'Submitted' | 'Verified' | 'Draft B/L Prepared';
  containers: string[];
}

export interface ExportStuffingPlan {
  id: string;
  planNumber: string;
  vesselName: string;
  voyage: string;
  loadingTerminal: string;
  cutoffDate: string;
  containerNo: string;
  sizeType: string;
  allocatedWeightKg: number;
  vgmVerified: boolean;
  assignedSlot: string; // e.g., Bay 14, Row 06, Tier 82
  status: 'Planned' | 'Stuffed' | 'Gated In' | 'Loaded';
}

// ============================================
// SHIPPING AGENCY OPERATIONS & PORT CALLS
// ============================================
export interface SofEvent {
  id: string;
  timestamp: string;
  event: string;
  category: 'Navigation' | 'Berthing' | 'Cargo Ops' | 'Customs/Clearance' | 'Bunkering';
  remarks?: string;
}

export interface PortCall {
  id: string;
  callId: string;
  vesselName: string;
  imo: string;
  voyage: string;
  carrier: string;
  principalName: string;
  portName: string;
  portCode: string;
  terminalName: string;
  berthNo: string;
  eta: string;
  etb: string; // Estimated Time of Berthing
  etd: string;
  actualArrival?: string;
  actualBerthing?: string;
  actualDeparture?: string;
  status: 'Scheduled' | 'At Anchorage' | 'Berthed' | 'Operations Completed' | 'Sailed';
  noticeOfReadinessTendered?: string;
  portClearanceStatus: 'Pending' | 'Granted';
  sailingClearanceStatus: 'Pending' | 'Granted';
  sofEvents: SofEvent[];
}

// ============================================
// ACCOUNTS / LEDGER / DISBURSEMENT ACCOUNTS
// ============================================
export interface LedgerEntry {
  id: string;
  date: string;
  accountCode: string;
  accountTitle: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  voucherNo: string;
  voucherType: 'JV' | 'BPV' | 'BRV' | 'CPV' | 'CRV';
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
  entityName?: string;
  vesselVoyage?: string;
}

export interface DisbursementAccount {
  id: string;
  accountNo: string; // PDA or FDA Number
  type: 'PDA' | 'FDA'; // Proforma or Final Disbursement Account
  vesselName: string;
  voyage: string;
  portName: string;
  principalName: string;
  eta: string;
  etd: string;
  currency: string;
  pilotageDues: number;
  towageAndTugs: number;
  portBerthHire: number;
  customsLightDues: number;
  immigrationFormalities: number;
  agencyFee: number;
  stevedoringOps: number;
  bunkeringFuel: number;
  freshWaterProvision: number;
  totalDisbursement: number;
  advanceReceived: number;
  balanceDue: number;
  status: 'Draft' | 'Approved by Principal' | 'Disbursed' | 'Settled';
}

export interface DebitCreditNote {
  id: string;
  noteNumber: string;
  type: 'Debit Note' | 'Credit Note';
  issueDate: string;
  partyName: string;
  partyRole: 'Principal' | 'Shipper' | 'Consignee' | 'Shipping Line' | 'Vendor';
  referenceDoc: string; // Invoice or B/L No
  vesselVoyage: string;
  currency: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Adjusted';
}
