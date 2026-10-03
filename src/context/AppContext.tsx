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
  DebitCreditNote
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
  approveBooking: (id: string) => void;
  invoices: Invoice[];
  recordPayment: (id: string) => void;
  auditLogs: AuditLog[];
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
  const [currentCompany, setCurrentCompany] = useState<Company>(initialCompanies[0]);

  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [containers, setContainers] = useState<Container[]>(initialContainers);
  const [gatePasses, setGatePasses] = useState<GatePass[]>(initialGatePasses);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseCargoItem[]>(initialWarehouseItems);
  const [vessels] = useState<Vessel[]>(initialVessels);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
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
  };

  const addEgm = (newEgm: ExportGeneralManifest) => {
    setEgms(prev => [newEgm, ...prev]);
  };

  const addDeliveryOrder = (newOrder: DeliveryOrder) => {
    setDeliveryOrders(prev => [newOrder, ...prev]);
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
    setCompanies(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const updateCompanyPlan = (id: string, plan: Company['plan']) => {
    setCompanies(prev => prev.map(c => (c.id === id ? { ...c, plan } : c)));
  };

  const provisionCompany = (newCompany: Company) => {
    setCompanies(prev => [newCompany, ...prev]);
    setCurrentCompany(newCompany);
    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        tenantId: newCompany.id,
        tenantName: newCompany.name,
        action: `New NVOCC Tenant provisioned with ${newCompany.plan} plan (${newCompany.teusThisMonth} TEU quota)`,
        user: currentUser.email,
        severity: 'info'
      },
      ...prev
    ]);
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

  const approveBooking = (id: string) => {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'Approved' } : b)));
  };

  const recordPayment = (id: string) => {
    setInvoices(prev => prev.map(inv => (inv.id === id ? { ...inv, paymentStatus: 'Paid' } : inv)));
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
        approveBooking,
        invoices,
        recordPayment,
        auditLogs,
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
