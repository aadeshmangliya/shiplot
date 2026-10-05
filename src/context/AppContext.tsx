import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Company,
  RoleItem,
  AuditLog,
  MonthlyMetric,
  Vessel,
  Container,
  Shipment,
  Booking,
  Invoice,
  Port,
  UserProfile,
  GatePass,
  GatePassStatus,
  WarehouseCargoItem,
  RolePermissions,
  ImportGeneralManifest,
  ExportGeneralManifest,
  DeliveryOrder,
  ShippingInstruction,
  PortCall,
  LedgerEntry,
  DisbursementAccount,
  DebitCreditNote,
  CompanyUser,
  DocumentTemplate,
  TemplateDocType
} from '../types';
import {
  initialCompanies,
  initialRoles,
  initialAuditLogs,
  initialMonthlyMetrics,
  initialVessels,
  initialContainers,
  initialShipments,
  initialBookings,
  initialInvoices,
  initialPorts,
  initialGatePasses,
  initialWarehouseItems,
  initialIgms,
  initialEgms,
  initialDeliveryOrders,
  initialShippingInstructions,
  initialPortCalls,
  initialLedgerEntries,
  initialDisbursementAccounts,
  initialDebitCreditNotes
} from '../mock/data';
import { initialCompanyUsers, initialDocumentTemplates } from '../mock/templateMockData';

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Auth & User
  isAuthenticated: boolean;
  currentUser: UserProfile;
  login: (user: Partial<UserProfile> & { workspaceId?: string }) => void;
  logout: () => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;

  // Companies / Multi-Tenant & Branding
  companies: Company[];
  currentCompany: Company;
  setCurrentCompany: (company: Company) => void;
  toggleCompanyStatus: (id: string) => void;
  updateCompanyPlan: (id: string, plan: Company['plan']) => void;
  provisionCompany: (company: Company) => void;
  updateCompanyBranding: (branding: Partial<Company>) => void;
  updateCompanyProfile: (details: Partial<Company>) => void;

  // Company User Management (Forwarder, Importer, Exporter, Finance, Ops)
  companyUsers: CompanyUser[];
  addCompanyUser: (user: CompanyUser) => void;
  updateCompanyUser: (id: string, updates: Partial<CompanyUser>) => void;
  deleteCompanyUser: (id: string) => void;

  // Master Document Templates Engine (Shiplot Admin + NVOCC Company Selection)
  documentTemplates: DocumentTemplate[];
  addDocumentTemplate: (template: DocumentTemplate) => void;
  updateDocumentTemplate: (id: string, updates: Partial<DocumentTemplate>) => void;
  deleteDocumentTemplate: (id: string) => void;
  selectCompanyTemplate: (docType: TemplateDocType, templateId: string) => void;

  // Logistics Core State
  shipments: Shipment[];
  addShipment: (shipment: Shipment) => void;
  containers: Container[];
  addContainer: (container: Container) => void;
  updateContainerLocation: (id: string, locationStatus: Container['locationStatus'], location?: string) => void;
  gatePasses: GatePass[];
  addGatePass: (gatePass: GatePass) => void;
  updateGatePassStatus: (id: string, status: GatePassStatus) => void;
  warehouseItems: WarehouseCargoItem[];
  addWarehouseItem: (item: WarehouseCargoItem) => void;
  dispatchWarehouseItem: (id: string) => void;
  vessels: Vessel[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  approveBooking: (id: string) => void;
  invoices: Invoice[];
  recordPayment: (id: string) => void;
  auditLogs: AuditLog[];
  addAuditLog: (entry: Partial<AuditLog> & { action: string }) => void;
  monthlyMetrics: MonthlyMetric[];
  ports: Port[];
  roles: RoleItem[];
  togglePermission: (roleId: string, permissionKey: string) => void;
  canUserPerform: (permissionKey: keyof RolePermissions) => boolean;

  // SRS & WPCargo Modules
  igms: ImportGeneralManifest[];
  addIgm: (igm: ImportGeneralManifest) => void;
  egms: ExportGeneralManifest[];
  addEgm: (egm: ExportGeneralManifest) => void;
  deliveryOrders: DeliveryOrder[];
  addDeliveryOrder: (order: DeliveryOrder) => void;
  shippingInstructions: ShippingInstruction[];
  addShippingInstruction: (si: ShippingInstruction) => void;
  portCalls: PortCall[];
  updatePortCall: (id: string, updates: Partial<PortCall>) => void;
  ledgerEntries: LedgerEntry[];
  addLedgerEntry: (entry: LedgerEntry) => void;
  disbursementAccounts: DisbursementAccount[];
  addDisbursementAccount: (pda: DisbursementAccount) => void;
  debitCreditNotes: DebitCreditNote[];
  addDebitCreditNote: (note: DebitCreditNote) => void;

  // Global Interactive Modals
  selectedShipmentForDetail: Shipment | null;
  setSelectedShipmentForDetail: (shipment: Shipment | null) => void;
  selectedShipmentForBl: Shipment | null;
  setSelectedShipmentForBl: (shipment: Shipment | null) => void;
  isNewBookingOpen: boolean;
  setIsNewBookingOpen: (open: boolean) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('shiplot_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('shiplot_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Capt. Ethan Roberts',
    email: 'ops.director@pacificcrest.com',
    role: 'nvocc_admin',
    workspaceId: 'COMP-001',
    workspaceName: 'Pacific Crest Freight Logistics (NVOCC)'
  });

  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [currentCompany, setCurrentCompany] = useState<Company>(() => {
    try {
      const saved = localStorage.getItem('shiplot_current_company');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialCompanies[0];
  });

  // Multi-Tenant & Platform Security Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('shiplot_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialAuditLogs;
  });

  const addAuditLog = (entry: Partial<AuditLog> & { action: string }) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      tenantId: entry.tenantId || currentCompany.id,
      tenantName: entry.tenantName || currentCompany.name,
      action: entry.action,
      user: entry.user || currentUser.email,
      severity: entry.severity || 'info',
      category: entry.category || 'Users & Security',
      scope: entry.scope || 'NVOCC',
      ipAddress: entry.ipAddress || (entry.scope === 'SHIPLOT_PLATFORM' ? '104.28.192.14' : '110.39.24.182'),
      station: entry.station || (entry.scope === 'SHIPLOT_PLATFORM' ? 'Shiplot SaaS Root Control' : `${currentCompany.hqCity || 'Operations'} Terminal Desk`),
      details: entry.details,
      targetRef: entry.targetRef,
      status: entry.status || 'Success'
    };

    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('shiplot_audit_logs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Company User Directory (Forwarders, Importers, Exporters, Finance, Ops)
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>(() => {
    try {
      const saved = localStorage.getItem('shiplot_company_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialCompanyUsers;
  });

  // Document Templates Engine (Shiplot Master + NVOCC Selection)
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('shiplot_document_templates');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialDocumentTemplates;
  });

  const addCompanyUser = (newUser: CompanyUser) => {
    setCompanyUsers(prev => {
      const updated = [newUser, ...prev];
      try { localStorage.setItem('shiplot_company_users', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `New Company User created: ${newUser.name} (${newUser.email}) with role: ${newUser.role}`,
      user: currentUser.email,
      severity: 'info',
      category: 'Users & Security',
      scope: 'NVOCC',
      details: `Role assigned: ${newUser.role}, Department: ${newUser.department || 'Operations'}, Phone: ${newUser.phone || 'N/A'}`,
      targetRef: newUser.id,
      status: 'Success'
    });
  };

  const updateCompanyUser = (id: string, updates: Partial<CompanyUser>) => {
    setCompanyUsers(prev => {
      const updated = prev.map(u => (u.id === id ? { ...u, ...updates } : u));
      try { localStorage.setItem('shiplot_company_users', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Company user permissions or profile updated (User ID: ${id})`,
      user: currentUser.email,
      severity: 'info',
      category: 'Users & Security',
      scope: 'NVOCC',
      details: `Updated attributes: ${Object.keys(updates).join(', ')}`,
      targetRef: id,
      status: 'Success'
    });
  };

  const deleteCompanyUser = (id: string) => {
    setCompanyUsers(prev => {
      const updated = prev.filter(u => u.id !== id);
      try { localStorage.setItem('shiplot_company_users', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Company user revoked / removed (User ID: ${id})`,
      user: currentUser.email,
      severity: 'warning',
      category: 'Users & Security',
      scope: 'NVOCC',
      targetRef: id,
      status: 'Warning'
    });
  };

  const addDocumentTemplate = (newTmpl: DocumentTemplate) => {
    setDocumentTemplates(prev => {
      const updated = [newTmpl, ...prev];
      try { localStorage.setItem('shiplot_document_templates', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `HTML Document Template published: "${newTmpl.name}" (${newTmpl.docType})`,
      user: currentUser.email,
      severity: 'info',
      category: 'Documents & Templates',
      scope: newTmpl.isShiplotMaster ? 'SHIPLOT_PLATFORM' : 'NVOCC',
      details: `Version: ${newTmpl.version}, Master: ${newTmpl.isShiplotMaster ? 'Global Master' : 'Company Custom'}, Author: ${newTmpl.author}`,
      targetRef: newTmpl.id,
      status: 'Success'
    });
  };

  const updateDocumentTemplate = (id: string, updates: Partial<DocumentTemplate>) => {
    setDocumentTemplates(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...updates } : t));
      try { localStorage.setItem('shiplot_document_templates', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Document Template updated (Template ID: ${id})`,
      user: currentUser.email,
      severity: 'info',
      category: 'Documents & Templates',
      scope: 'BOTH',
      targetRef: id,
      status: 'Success'
    });
  };

  const deleteDocumentTemplate = (id: string) => {
    setDocumentTemplates(prev => {
      const updated = prev.filter(t => t.id !== id);
      try { localStorage.setItem('shiplot_document_templates', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Document Template deleted (Template ID: ${id})`,
      user: currentUser.email,
      severity: 'warning',
      category: 'Documents & Templates',
      scope: 'BOTH',
      targetRef: id,
      status: 'Warning'
    });
  };

  const selectCompanyTemplate = (docType: TemplateDocType, templateId: string) => {
    setCurrentCompany(prev => {
      const updated = {
        ...prev,
        selectedTemplates: {
          ...(prev.selectedTemplates || {}),
          [docType]: templateId
        }
      };
      try { localStorage.setItem('shiplot_current_company', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setCompanies(prev =>
      prev.map(c =>
        c.id === currentCompany.id
          ? {
              ...c,
              selectedTemplates: {
                ...(c.selectedTemplates || {}),
                [docType]: templateId
              }
            }
          : c
      )
    );
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Default print template selected for ${docType}: Template #${templateId}`,
      user: currentUser.email,
      severity: 'info',
      category: 'Documents & Templates',
      scope: 'NVOCC',
      details: `Document type ${docType} will render using template ${templateId}`,
      targetRef: templateId,
      status: 'Success'
    });
  };

  const updateCompanyProfile = (details: Partial<Company>) => {
    setCurrentCompany(prev => {
      const updated = { ...prev, ...details };
      try { localStorage.setItem('shiplot_current_company', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setCompanies(prev => {
      const updated = prev.map(c => (c.id === currentCompany.id ? { ...c, ...details } : c));
      return updated;
    });
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Carrier legal profile & FMC / WeBOC credentials updated`,
      user: currentUser.email,
      severity: 'info',
      category: 'Users & Security',
      scope: 'BOTH',
      details: `Updated fields: ${Object.keys(details).join(', ')}`,
      targetRef: currentCompany.id,
      status: 'Success'
    });
  };

  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [containers, setContainers] = useState<Container[]>(initialContainers);
  const [gatePasses, setGatePasses] = useState<GatePass[]>(initialGatePasses);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseCargoItem[]>(initialWarehouseItems);
  const [vessels] = useState<Vessel[]>(initialVessels);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [monthlyMetrics] = useState<MonthlyMetric[]>(initialMonthlyMetrics);
  const [ports] = useState<Port[]>(initialPorts);
  const [roles, setRoles] = useState<RoleItem[]>(initialRoles);

  // SRS & WPCargo Module States
  const [igms, setIgms] = useState<ImportGeneralManifest[]>(initialIgms);
  const [egms, setEgms] = useState<ExportGeneralManifest[]>(initialEgms);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(initialDeliveryOrders);
  const [shippingInstructions, setShippingInstructions] = useState<ShippingInstruction[]>(initialShippingInstructions);
  const [portCalls, setPortCalls] = useState<PortCall[]>(initialPortCalls);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(initialLedgerEntries);
  const [disbursementAccounts, setDisbursementAccounts] = useState<DisbursementAccount[]>(initialDisbursementAccounts);
  const [debitCreditNotes, setDebitCreditNotes] = useState<DebitCreditNote[]>(initialDebitCreditNotes);

  const addIgm = (newIgm: ImportGeneralManifest) => {
    setIgms(prev => [newIgm, ...prev]);
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Import General Manifest (IGM) filed for Vessel: ${newIgm.vesselName} (Voyage: ${newIgm.voyageNumber})`,
      user: currentUser.email,
      severity: 'info',
      category: 'Customs & Manifests',
      scope: 'NVOCC',
      details: `IGM Index: ${newIgm.igmNumber}, Port of Arrival: ${newIgm.portOfArrival}, Filing Status: ${newIgm.webocFilingStatus}`,
      targetRef: newIgm.igmNumber,
      status: 'Success'
    });
  };

  const addEgm = (newEgm: ExportGeneralManifest) => {
    setEgms(prev => [newEgm, ...prev]);
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Export General Manifest (EGM) filed for Vessel: ${newEgm.vesselName} (Voyage: ${newEgm.voyageNumber})`,
      user: currentUser.email,
      severity: 'info',
      category: 'Customs & Manifests',
      scope: 'NVOCC',
      details: `EGM Index: ${newEgm.egmNumber}, Port of Loading: ${newEgm.portOfLoading}`,
      targetRef: newEgm.egmNumber,
      status: 'Success'
    });
  };

  const addDeliveryOrder = (newOrder: DeliveryOrder) => {
    setDeliveryOrders(prev => [newOrder, ...prev]);
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Import Delivery Order (D.O.) issued: ${newOrder.doNumber} for Consignee ${newOrder.consigneeName}`,
      user: currentUser.email,
      severity: 'info',
      category: 'Customs & Manifests',
      scope: 'NVOCC',
      details: `Terminal: ${newOrder.destinationPort}, Containers: ${newOrder.containers?.length || 1}, Status: ${newOrder.status}`,
      targetRef: newOrder.doNumber,
      status: 'Success'
    });
  };

  const addShippingInstruction = (newSi: ShippingInstruction) => {
    setShippingInstructions(prev => [newSi, ...prev]);
  };

  const updatePortCall = (id: string, updates: Partial<PortCall>) => {
    setPortCalls(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addLedgerEntry = (entry: LedgerEntry) => {
    setLedgerEntries(prev => [entry, ...prev]);
  };

  const addDisbursementAccount = (pda: DisbursementAccount) => {
    setDisbursementAccounts(prev => [pda, ...prev]);
  };

  const addDebitCreditNote = (note: DebitCreditNote) => {
    setDebitCreditNotes(prev => [note, ...prev]);
  };

  const updateCompanyBranding = (branding: Partial<Company>) => {
    setCurrentCompany(prev => ({ ...prev, ...branding }));
    setCompanies(prev =>
      prev.map(c => (c.id === currentCompany.id ? { ...c, ...branding } : c))
    );
  };

  const canUserPerform = (permissionKey: keyof RolePermissions): boolean => {
    const userRole = roles.find(r => r.roleId === currentUser.role) || roles[0];
    return !!userRole.permissions[permissionKey];
  };

  // Modals state
  const [selectedShipmentForDetail, setSelectedShipmentForDetail] = useState<Shipment | null>(null);
  const [selectedShipmentForBl, setSelectedShipmentForBl] = useState<Shipment | null>(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const login = (userData: Partial<UserProfile> & { workspaceId?: string }) => {
    const ws = companies.find(c => c.id === userData.workspaceId) || currentCompany;
    setCurrentCompany(ws);
    setCurrentUser(prev => ({
      ...prev,
      ...userData,
      workspaceId: ws.id,
      workspaceName: ws.name
    }));
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const toggleCompanyStatus = (id: string) => {
    let nextStatus: 'Active' | 'Suspended' = 'Active';
    let targetName = id;
    let isNowSuspended = false;
    setCompanies(prev =>
      prev.map(c => {
        if (c.id === id) {
          const toggled: 'Active' | 'Suspended' = (c.status as string) === 'Active' ? 'Suspended' : 'Active';
          nextStatus = toggled;
          isNowSuspended = toggled === 'Suspended';
          targetName = c.name;
          return { ...c, status: toggled };
        }
        return c;
      })
    );
    addAuditLog({
      tenantId: id,
      tenantName: targetName,
      action: `NVOCC Carrier workspace status changed to: ${nextStatus}`,
      user: currentUser.email,
      severity: isNowSuspended ? 'warning' : 'info',
      category: 'Tenant Management',
      scope: 'SHIPLOT_PLATFORM',
      details: `Workspace ${id} (${targetName}) set to ${nextStatus}`,
      targetRef: id,
      status: isNowSuspended ? 'Warning' : 'Success'
    });
  };

  const updateCompanyPlan = (id: string, plan: Company['plan']) => {
    let targetName = id;
    setCompanies(prev => prev.map(c => {
      if (c.id === id) {
        targetName = c.name;
        return { ...c, plan };
      }
      return c;
    }));
    addAuditLog({
      tenantId: id,
      tenantName: targetName,
      action: `NVOCC Subscription plan updated to ${plan}`,
      user: currentUser.email,
      severity: 'info',
      category: 'Tenant Management',
      scope: 'SHIPLOT_PLATFORM',
      details: `Carrier ${targetName} quota updated for plan tier: ${plan}`,
      targetRef: id,
      status: 'Success'
    });
  };

  const provisionCompany = (newCompany: Company) => {
    setCompanies(prev => [newCompany, ...prev]);
    setCurrentCompany(newCompany);
    addAuditLog({
      tenantId: newCompany.id,
      tenantName: newCompany.name,
      action: `New NVOCC Carrier Workspace provisioned on ${newCompany.plan} tier`,
      user: currentUser.email,
      severity: 'info',
      category: 'Tenant Management',
      scope: 'SHIPLOT_PLATFORM',
      details: `HQ: ${newCompany.hqCity}, ${newCompany.country}, FMC Reg: ${newCompany.registrationNo}, Quota: ${newCompany.teusThisMonth} TEUs`,
      targetRef: newCompany.id,
      status: 'Success'
    });
  };

  const addShipment = (newShipment: Shipment) => {
    setShipments(prev => [newShipment, ...prev]);
    if (newShipment.type === 'FCL') {
      const newCnt: Container = {
        id: `cnt_${Date.now()}`,
        containerNo: `MSKU${Math.floor(1000000 + Math.random() * 9000000)}`,
        sealNo: `SL-${Math.floor(100000 + Math.random() * 900000)}`,
        type: '40HC',
        vesselName: newShipment.vesselName,
        voyage: newShipment.voyageNo,
        pol: `${newShipment.pol} (${newShipment.polCode})`,
        pod: `${newShipment.pod} (${newShipment.podCode})`,
        status: 'Loaded',
        demurrageFreeDays: 7,
        daysRemaining: 7,
        demurrageRisk: 'safe',
        grossWeightKg: newShipment.weightKg,
        vgmKg: newShipment.weightKg + 3820,
        locationStatus: 'Booked',
        ownership: 'SOC',
        currentLocation: `Allocated to ${newShipment.shipmentNo}`
      };
      setContainers(prev => [newCnt, ...prev]);
    }
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Ocean shipment record created: ${newShipment.shipmentNo}`,
      user: currentUser.email,
      severity: 'info',
      category: 'Shipments & B/L',
      scope: 'NVOCC',
      details: `Vessel: ${newShipment.vesselName} (${newShipment.voyageNo}), POL: ${newShipment.polCode}, POD: ${newShipment.podCode}, Consignee: ${newShipment.consignee}`,
      targetRef: newShipment.shipmentNo,
      status: 'Success'
    });
  };

  const addContainer = (newContainer: Container) => {
    setContainers(prev => [newContainer, ...prev]);
  };

  const updateContainerLocation = (id: string, locationStatus: Container['locationStatus'], location?: string) => {
    setContainers(prev =>
      prev.map(c => (c.id === id ? { ...c, locationStatus, currentLocation: location || c.currentLocation } : c))
    );
  };

  const addGatePass = (newGatePass: GatePass) => {
    setGatePasses(prev => [newGatePass, ...prev]);
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `EIR Gate Pass generated: ${newGatePass.gatePassNo} for container ${newGatePass.containerNo}`,
      user: currentUser.email,
      severity: 'info',
      category: 'Containers & Gate Pass',
      scope: 'NVOCC',
      details: `Type: ${newGatePass.type}, Driver: ${newGatePass.driverName}, Vehicle: ${newGatePass.truckNo}, Port/Terminal: ${newGatePass.terminalOrDepot}`,
      targetRef: newGatePass.gatePassNo,
      status: 'Success'
    });
  };

  const updateGatePassStatus = (id: string, status: GatePassStatus) => {
    setGatePasses(prev => prev.map(gp => (gp.id === id ? { ...gp, status } : gp)));
  };

  const addWarehouseItem = (newItem: WarehouseCargoItem) => {
    setWarehouseItems(prev => [newItem, ...prev]);
  };

  const dispatchWarehouseItem = (id: string) => {
    setWarehouseItems(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'Dispatched' } : item))
    );
  };

  const addBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Commercial Freight Booking created: ${newBooking.bookingNo} (${newBooking.type} - ${newBooking.pol} -> ${newBooking.pod})`,
      user: currentUser.email,
      severity: 'info',
      category: 'Shipments & B/L',
      scope: 'NVOCC',
      details: `Shipper: ${newBooking.shipper}, Consignee: ${newBooking.consignee}, Equipment/Vol: ${newBooking.type === 'FCL' ? `${newBooking.containerQty}x ${newBooking.containerType}` : `${newBooking.cbmVolume || 0} CBM`}, Total Freight: $${newBooking.totalFreightUsd}`,
      targetRef: newBooking.bookingNo,
      status: 'Success'
    });
  };

  const approveBooking = (id: string) => {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'Approved' } : b)));
  };

  const recordPayment = (id: string) => {
    setInvoices(prev => prev.map(inv => (inv.id === id ? { ...inv, paymentStatus: 'Paid' } : inv)));
    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: `Freight Invoice payment processed & marked as Paid (${id})`,
      user: currentUser.email,
      severity: 'info',
      category: 'Finance & Billing',
      scope: 'NVOCC',
      targetRef: id,
      status: 'Success'
    });
  };

  const togglePermission = (roleId: string, permKey: string) => {
    setRoles(prev =>
      prev.map(r => {
        if (r.roleId === roleId) {
          return {
            ...r,
            permissions: {
              ...r.permissions,
              [permKey]: !r.permissions[permKey as keyof typeof r.permissions]
            }
          };
        }
        return r;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuthenticated,
        currentUser,
        login,
        logout,
        setCurrentUser,
        companies,
        currentCompany,
        setCurrentCompany,
        toggleCompanyStatus,
        updateCompanyPlan,
        provisionCompany,
        updateCompanyBranding,
        updateCompanyProfile,
        companyUsers,
        addCompanyUser,
        updateCompanyUser,
        deleteCompanyUser,
        documentTemplates,
        addDocumentTemplate,
        updateDocumentTemplate,
        deleteDocumentTemplate,
        selectCompanyTemplate,
        shipments,
        addShipment,
        containers,
        addContainer,
        updateContainerLocation,
        gatePasses,
        addGatePass,
        updateGatePassStatus,
        warehouseItems,
        addWarehouseItem,
        dispatchWarehouseItem,
        vessels,
        bookings,
        addBooking,
        approveBooking,
        invoices,
        recordPayment,
        auditLogs,
        addAuditLog,
        monthlyMetrics,
        ports,
        roles,
        togglePermission,
        canUserPerform,
        igms,
        addIgm,
        egms,
        addEgm,
        deliveryOrders,
        addDeliveryOrder,
        shippingInstructions,
        addShippingInstruction,
        portCalls,
        updatePortCall,
        ledgerEntries,
        addLedgerEntry,
        disbursementAccounts,
        addDisbursementAccount,
        debitCreditNotes,
        addDebitCreditNote,
        selectedShipmentForDetail,
        setSelectedShipmentForDetail,
        selectedShipmentForBl,
        setSelectedShipmentForBl,
        isNewBookingOpen,
        setIsNewBookingOpen,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
