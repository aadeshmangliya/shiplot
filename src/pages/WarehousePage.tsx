import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WarehouseCargoItem, LoloTicket, LoloLiftType } from '../types';
import {
  Warehouse,
  Plus,
  Search,
  Filter,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  DollarSign,
  Ticket,
  BookmarkCheck,
  Check,
  X,
  MapPin,
  Scale,
  ShieldCheck,
  Thermometer,
  Boxes,
  Truck,
  Printer,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowUpDown
} from 'lucide-react';

export const WarehousePage: React.FC = () => {
  const {
    warehouseItems,
    addWarehouseItem,
    dispatchWarehouseItem,
    currentCompany,
    loloTickets,
    loloTariffs,
    addLoloTicket,
    updateLoloTicket,
    containers
  } = useApp();
  const navigate = useNavigate();

  // Tab State: Storage Inventory vs LoLo Yard Operations vs Depots
  const [activeTab, setActiveTab] = useState<'inventory' | 'lolo' | 'facilities'>('inventory');

  // Inventory Filters
  const [activeFilter, setActiveFilter] = useState<'All' | 'Bonded Storage' | 'General Dry Storage' | 'Temperature Controlled' | 'Yard Bulk Staging'>('All');
  const [search, setSearch] = useState('');
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<WarehouseCargoItem | null>(null);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);

  // Inbound Cargo Form State
  const [clientName, setClientName] = useState('Pacific Precision Electronics Inc.');
  const [cargoDesc, setCargoDesc] = useState('High-density semiconductor wafer modules in antistatic packaging');
  const [storageType, setStorageType] = useState<WarehouseCargoItem['storageType']>('Bonded Storage');
  const [packageCount, setPackageCount] = useState(36);
  const [packageType, setPackageType] = useState('Pallets (600 Cartons)');
  const [cbmVolume, setCbmVolume] = useState(16.5);
  const [grossWeightKg, setGrossWeightKg] = useState(7200);
  const [warehouseName, setWarehouseName] = useState('Pacific Crest Central Bonded Logistics Hub (Long Beach)');
  const [bayLocation, setBayLocation] = useState('Bonded Zone A-08 (Rack R2-01)');
  const [dailyRateUsd, setDailyRateUsd] = useState(42);
  const [associatedContainerNo, setAssociatedContainerNo] = useState('PCXU1002910');
  const [loloChargeInboundUsd, setLoloChargeInboundUsd] = useState(95);
  const [customsBondNumber, setCustomsBondNumber] = useState('BND-USLAX-88192');
  const [freeDaysGranted, setFreeDaysGranted] = useState(5);
  const [hsCode, setHsCode] = useState('8542.31.00');

  // LoLo Form State
  const [isLoloFormOpen, setIsLoloFormOpen] = useState(false);
  const [selectedLoloForView, setSelectedLoloForView] = useState<LoloTicket | null>(null);
  const [loloContainerNo, setLoloContainerNo] = useState('PCXU1002910');
  const [loloContainerType, setLoloContainerType] = useState('40HC');
  const [loloLiftType, setLoloLiftType] = useState<LoloLiftType>('Inbound Lift-Off (Trailer to Ground)');
  const [loloStatus, setLoloStatus] = useState<'Laden' | 'Empty'>('Laden');
  const [loloEquipmentType, setLoloEquipmentType] = useState<'Reach Stacker' | 'Top Loader' | 'RTG Crane' | 'Heavy Forklift'>('Reach Stacker');
  const [loloEquipmentId, setLoloEquipmentId] = useState('RS-KALMAR-01');
  const [loloOperatorName, setLoloOperatorName] = useState('David Miller');
  const [loloTruckNo, setLoloTruckNo] = useState('TL-9920-CA');
  const [loloTransporter, setLoloTransporter] = useState('Pacific Drayage Logistics');
  const [loloPaymentMode, setLoloPaymentMode] = useState<'Billed to Invoice' | 'Prepaid by Shipper' | 'Cash at Gate' | 'Included in D/O'>('Billed to Invoice');
  const [loloDepotName, setLoloDepotName] = useState('Pacific Crest Central Bonded Logistics Hub (Long Beach)');
  const [loloRemarks, setLoloRemarks] = useState('Grounded onto yard stack tier 2 with twistlocks secured.');
  const [loloFilterLiftType, setLoloFilterLiftType] = useState<string>('All');

  // Auto-calculated LoLo fee based on tariffs
  const calculateStandardLoloFee = (cType: string, isLaden: boolean, lift: LoloLiftType) => {
    if (lift === 'Yard Restack / Shift') return 40;
    const is20 = cType.includes('20');
    if (isLaden) {
      return is20 ? 65 : 95;
    } else {
      return is20 ? 35 : 45;
    }
  };

  // Warehouse Facilities
  const warehouseFacilities = [
    {
      id: 'fac_1',
      name: 'Pacific Crest Central Bonded Logistics Hub',
      locode: 'USLAX-WH1',
      city: 'Long Beach, CA',
      capacityCbm: 35000,
      occupiedCbm: 26800,
      bondedCertified: true,
      zonesCount: 6,
      securityLevel: 'C-TPAT Tier 3 / Customs Bonded',
      reachStackers: 2,
      groundSlotsTeu: 450
    },
    {
      id: 'fac_2',
      name: 'Waigaoqiao Ocean Groupage Depot #4',
      locode: 'CNSHA-CFS4',
      city: 'Shanghai, China',
      capacityCbm: 42000,
      occupiedCbm: 34500,
      bondedCertified: true,
      zonesCount: 8,
      securityLevel: 'Customs Supervised Warehouse',
      reachStackers: 3,
      groundSlotsTeu: 600
    },
    {
      id: 'fac_3',
      name: 'Pacific Crest Temperature Controlled Cold Terminal',
      locode: 'USLAX-COLD',
      city: 'Irvine, CA',
      capacityCbm: 12000,
      occupiedCbm: 8900,
      bondedCertified: false,
      zonesCount: 4,
      securityLevel: 'FDA Registered / Cold Chain 2-8°C',
      reachStackers: 1,
      groundSlotsTeu: 120
    },
    {
      id: 'fac_4',
      name: 'Keppel Distripark CFS Ocean Consolidation Hub',
      locode: 'SGSIN-CFS2',
      city: 'Singapore',
      capacityCbm: 28000,
      occupiedCbm: 19400,
      bondedCertified: true,
      zonesCount: 5,
      securityLevel: 'PSA Free Trade Zone (FTZ)',
      reachStackers: 2,
      groundSlotsTeu: 380
    }
  ];

  const totalCbmStored = warehouseItems.reduce((acc, i) => acc + (i.status === 'Stored' ? i.cbmVolume : 0), 0);
  const totalAccruedStorage = warehouseItems.reduce((acc, i) => acc + (i.status === 'Stored' ? i.accruedChargesUsd : 0), 0);
  const activeConsignments = warehouseItems.filter(i => i.status === 'Stored').length;
  const totalLoloRevenue = loloTickets.reduce((acc, t) => acc + t.loloFeeUsd, 0);

  const filteredItems = warehouseItems.filter(i => {
    if (activeFilter !== 'All' && i.storageType !== activeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        i.receiptNo.toLowerCase().includes(q) ||
        i.clientName.toLowerCase().includes(q) ||
        i.cargoDesc.toLowerCase().includes(q) ||
        i.bayLocation.toLowerCase().includes(q) ||
        (i.associatedContainerNo && i.associatedContainerNo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredLoloTickets = loloTickets.filter(t => {
    if (loloFilterLiftType !== 'All' && t.liftType !== loloFilterLiftType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.ticketNo.toLowerCase().includes(q) ||
        t.containerNo.toLowerCase().includes(q) ||
        t.truckNo.toLowerCase().includes(q) ||
        t.transporter.toLowerCase().includes(q) ||
        t.operatorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString();
    try {
      localStorage.setItem('shiplot_warehouse_draft', JSON.stringify({
        clientName,
        cargoDesc,
        storageType,
        packageCount,
        cbmVolume,
        warehouseName,
        bayLocation
      }));
    } catch {
      // ignore
    }
    setDraftSavedMsg(`Warehouse receipt draft saved at ${time}`);
    setTimeout(() => setDraftSavedMsg(null), 3000);
  };

  const handleRegisterCargo = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const todayStr = new Date().toISOString().substring(0, 10);

    const newItem: WarehouseCargoItem = {
      id: `wr_${Date.now()}`,
      receiptNo: `WR-2026-${idNum}`,
      clientName,
      cargoDesc,
      storageType,
      packageCount: Number(packageCount),
      packageType,
      cbmVolume: Number(cbmVolume),
      grossWeightKg: Number(grossWeightKg),
      warehouseName,
      bayLocation,
      inDate: todayStr,
      dailyRateUsd: Number(dailyRateUsd),
      accruedChargesUsd: Number(dailyRateUsd), // 1st day accrual
      status: 'Stored',
      associatedContainerNo: associatedContainerNo.toUpperCase(),
      loloChargeInboundUsd: Number(loloChargeInboundUsd),
      loloPaymentStatus: 'Paid',
      customsBondNumber,
      freeDaysGranted: Number(freeDaysGranted),
      hsCode
    };

    addWarehouseItem(newItem);
    setIsRegisterFormOpen(false);
  };

  const handleCreateLoloTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = Math.floor(1000 + Math.random() * 9000);
    const calculatedFee = calculateStandardLoloFee(loloContainerType, loloStatus === 'Laden', loloLiftType);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newTicket: LoloTicket = {
      id: `lolo_${Date.now()}`,
      ticketNo: `LOLO-2026-${randomTicket}`,
      containerNo: loloContainerNo.toUpperCase(),
      containerType: loloContainerType,
      liftType: loloLiftType,
      status: loloStatus,
      equipmentType: loloEquipmentType,
      equipmentId: loloEquipmentId,
      operatorName: loloOperatorName,
      truckNo: loloTruckNo.toUpperCase(),
      transporter: loloTransporter,
      loloFeeUsd: calculatedFee,
      paymentMode: loloPaymentMode,
      isPaid: loloPaymentMode === 'Cash at Gate' || loloPaymentMode === 'Prepaid by Shipper',
      timestamp: nowStr,
      depotName: loloDepotName,
      remarks: loloRemarks
    };

    addLoloTicket(newTicket);
    setIsLoloFormOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100 select-text">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center gap-1.5">
              <Warehouse className="w-3.5 h-3.5" />
              WAREHOUSE & TERMINAL CFS OPERATIONS
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Customs Bonded &amp; Yard LoLo Terminal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1.5">
            NVOCC Warehousing &amp; LoLo Handling Operations
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Commercial cargo receipts, bonded racking, CFS stuffing/destuffing, and container Lift-on / Lift-off (LoLo) yard crane operations.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === 'inventory' ? (
            <button
              onClick={() => setIsRegisterFormOpen(!isRegisterFormOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs cursor-pointer ${
                isRegisterFormOpen
                  ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950'
              }`}
            >
              {isRegisterFormOpen ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Close Form</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>+ Register Inbound Cargo</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setIsLoloFormOpen(!isLoloFormOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs cursor-pointer ${
                isLoloFormOpen
                  ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950'
              }`}
            >
              {isLoloFormOpen ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Close Form</span>
                </>
              ) : (
                <>
                  <ArrowUpDown className="w-4 h-4" />
                  <span>+ Issue LoLo Lift Ticket</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Active Cargo Stored</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
            {activeConsignments}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Total {totalCbmStored.toFixed(1)} CBM allocated
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Accrued Storage Fees</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            ${totalAccruedStorage.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Daily billing across active lots
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>LoLo Crane Lifts Recorded</span>
            <ArrowUpDown className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
            {loloTickets.length} Lifts
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Inbound &amp; outbound chassis moves
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>LoLo Handling Revenue</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
            ${totalLoloRevenue.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Lift-on &amp; lift-off terminal charges
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-1 overflow-x-auto scrollbar-none font-mono text-xs">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-bold bg-neutral-100/60 dark:bg-neutral-900/60'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>Warehouse Cargo &amp; Receipts ({warehouseItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lolo')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'lolo'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-bold bg-neutral-100/60 dark:bg-neutral-900/60'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>LoLo Charges &amp; Container Lifts ({loloTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facilities')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'facilities'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-bold bg-neutral-100/60 dark:bg-neutral-900/60'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Depot &amp; Facility Network ({warehouseFacilities.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WAREHOUSE CARGO & RECEIPTS INVENTORY */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Inline Inbound Cargo Registration Form */}
          {isRegisterFormOpen && (
            <div className="rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden font-mono text-xs">
              <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4" />
                  <span className="font-bold text-sm">
                    Inbound Warehouse Receipt (WR) &amp; Storage Registration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-2.5 py-1 rounded border border-neutral-700 dark:border-neutral-300 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterFormOpen(false)}
                    className="p-1 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {draftSavedMsg && (
                <div className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-5 py-1.5 flex items-center justify-between text-neutral-900 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> {draftSavedMsg}
                  </span>
                </div>
              )}

              <form onSubmit={handleRegisterCargo} className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-500 mb-1">Client / Commercial Shipper *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Storage Classification *</label>
                    <select
                      value={storageType}
                      onChange={e => setStorageType(e.target.value as WarehouseCargoItem['storageType'])}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    >
                      <option>Bonded Storage</option>
                      <option>General Dry Storage</option>
                      <option>Temperature Controlled</option>
                      <option>Yard Bulk Staging</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Associated Container No</label>
                    <input
                      type="text"
                      placeholder="e.g. PCXU1002910"
                      value={associatedContainerNo}
                      onChange={e => setAssociatedContainerNo(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-500 mb-1">Commercial Cargo Description *</label>
                    <input
                      type="text"
                      required
                      value={cargoDesc}
                      onChange={e => setCargoDesc(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Harmonized HS Code</label>
                    <input
                      type="text"
                      value={hsCode}
                      onChange={e => setHsCode(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-neutral-500 mb-1">Package Count *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={packageCount}
                      onChange={e => setPackageCount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Package Type</label>
                    <input
                      type="text"
                      value={packageType}
                      onChange={e => setPackageType(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Volume (CBM) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={cbmVolume}
                      onChange={e => setCbmVolume(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Gross Weight (KG) *</label>
                    <input
                      type="number"
                      required
                      value={grossWeightKg}
                      onChange={e => setGrossWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Warehouse Bay & LoLo Charges */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                  <div>
                    <label className="block text-neutral-500 mb-1">Depot Facility</label>
                    <select
                      value={warehouseName}
                      onChange={e => setWarehouseName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                    >
                      {warehouseFacilities.map(f => (
                        <option key={f.id} value={`${f.name} (${f.city})`}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Bay / Rack Slot</label>
                    <input
                      type="text"
                      value={bayLocation}
                      onChange={e => setBayLocation(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Daily Storage Rate ($/day)</label>
                    <input
                      type="number"
                      value={dailyRateUsd}
                      onChange={e => setDailyRateUsd(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Inbound LoLo Lift-Off Fee ($)</label>
                    <input
                      type="number"
                      value={loloChargeInboundUsd}
                      onChange={e => setLoloChargeInboundUsd(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsRegisterFormOpen(false)}
                    className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Register Cargo &amp; Issue Receipt
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row gap-3 font-mono text-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search warehouse receipt, shipper, cargo commodity, container number, or rack bay..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {(['All', 'Bonded Storage', 'General Dry Storage', 'Temperature Controlled', 'Yard Bulk Staging'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeFilter === f
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Warehouse Cargo Table */}
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                    <th className="py-3 px-4">Receipt Ref / Date</th>
                    <th className="py-3 px-4">Client / Shipper</th>
                    <th className="py-3 px-4">Commodity Description</th>
                    <th className="py-3 px-4">Storage Zone / Rack</th>
                    <th className="py-3 px-4">Volume &amp; Weight</th>
                    <th className="py-3 px-4">LoLo / Accrued Charges</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-neutral-400 font-sans">
                        <Warehouse className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                        <p className="font-semibold text-neutral-700 dark:text-neutral-300">No warehouse consignments found</p>
                        <p className="text-xs text-neutral-400 mt-1">Click &quot;+ Register Inbound Cargo&quot; to issue a new receipt.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                      const isStored = item.status === 'Stored';
                      return (
                        <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-neutral-900 dark:text-white">{item.receiptNo}</div>
                            <div className="text-[10px] text-neutral-400">Inbound: {item.inDate}</div>
                            {item.associatedContainerNo && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-mono">
                                {item.associatedContainerNo}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 max-w-[180px]">
                            <div className="font-semibold font-sans truncate text-neutral-900 dark:text-white">{item.clientName}</div>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              {item.storageType}
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-[220px]">
                            <div className="font-sans text-[11px] truncate text-neutral-800 dark:text-neutral-200">{item.cargoDesc}</div>
                            <div className="text-[10px] text-neutral-400">{item.packageCount}x {item.packageType}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-neutral-900 dark:text-white">{item.bayLocation}</div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">{item.warehouseName}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-neutral-900 dark:text-white">{item.cbmVolume} CBM</div>
                            <div className="text-[10px] text-neutral-400">{item.grossWeightKg.toLocaleString()} KG</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-emerald-600 dark:text-emerald-400">
                              ${item.accruedChargesUsd} USD
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              Rate: ${item.dailyRateUsd}/day
                              {item.loloChargeInboundUsd ? ` · LoLo: $${item.loloChargeInboundUsd}` : ''}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'Stored'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : item.status === 'Staged for Loading'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedReceiptForView(item)}
                              className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                            >
                              Inspect
                            </button>

                            {isStored && (
                              <button
                                type="button"
                                onClick={() => dispatchWarehouseItem(item.id)}
                                className="px-2.5 py-1 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer"
                              >
                                Dispatch
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LOLO (LIFT-ON / LIFT-OFF) CONTAINER OPERATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'lolo' && (
        <div className="space-y-5">
          {/* LoLo Explanatory Header Banner */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-sm">
                <ArrowUpDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Terminal &amp; Depot LoLo Handling Charges Matrix
              </span>
              <p className="text-neutral-500 text-[11px] mt-0.5 font-sans">
                Lift-on / Lift-off (LoLo) fees cover equipment costs (Reach Stackers, Top Loaders, RTGs) to lift laden or empty containers on/off trailers and rail chassis at container yards and CFS gates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                FIATA &amp; Port Tariff Standard
              </span>
            </div>
          </div>

          {/* Inline LoLo Issue Ticket Form */}
          {isLoloFormOpen && (
            <div className="rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden font-mono text-xs">
              <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="font-bold text-sm">
                    Issue Container LoLo Gate Lift Ticket
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLoloFormOpen(false)}
                  className="p-1 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateLoloTicket} className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-neutral-500 mb-1">Container Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PCXU1002910"
                      value={loloContainerNo}
                      onChange={e => setLoloContainerNo(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Container Size / Type *</label>
                    <select
                      value={loloContainerType}
                      onChange={e => setLoloContainerType(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    >
                      <option>20GP</option>
                      <option>40GP</option>
                      <option>40HC</option>
                      <option>45HC</option>
                      <option>20RF</option>
                      <option>40RF</option>
                      <option>20FR</option>
                      <option>40FR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Laden vs Empty *</label>
                    <select
                      value={loloStatus}
                      onChange={e => setLoloStatus(e.target.value as 'Laden' | 'Empty')}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                    >
                      <option value="Laden">Laden (Full Cargo Box)</option>
                      <option value="Empty">Empty (Tare Box Return)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Lift Operation Type *</label>
                    <select
                      value={loloLiftType}
                      onChange={e => setLoloLiftType(e.target.value as LoloLiftType)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    >
                      <option>Inbound Lift-Off (Trailer to Ground)</option>
                      <option>Outbound Lift-On (Ground to Chassis)</option>
                      <option>Yard Restack / Shift</option>
                      <option>CFS Destuffing / Stuffing Lift</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-neutral-500 mb-1">Lifting Equipment</label>
                    <select
                      value={loloEquipmentType}
                      onChange={e => setLoloEquipmentType(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    >
                      <option>Reach Stacker</option>
                      <option>Top Loader</option>
                      <option>RTG Crane</option>
                      <option>Heavy Forklift</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Equipment ID / Fleet #</label>
                    <input
                      type="text"
                      value={loloEquipmentId}
                      onChange={e => setLoloEquipmentId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Crane Operator Name</label>
                    <input
                      type="text"
                      value={loloOperatorName}
                      onChange={e => setLoloOperatorName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Calculated LoLo Fee ($ USD)</label>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                      ${calculateStandardLoloFee(loloContainerType, loloStatus === 'Laden', loloLiftType)} USD
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-500 mb-1">Truck Trailer Plate Number</label>
                    <input
                      type="text"
                      value={loloTruckNo}
                      onChange={e => setLoloTruckNo(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Haulier / Transporter Company</label>
                    <input
                      type="text"
                      value={loloTransporter}
                      onChange={e => setLoloTransporter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Payment / Billing Settlement</label>
                    <select
                      value={loloPaymentMode}
                      onChange={e => setLoloPaymentMode(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    >
                      <option>Billed to Invoice</option>
                      <option>Prepaid by Shipper</option>
                      <option>Cash at Gate</option>
                      <option>Included in D/O</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-500 mb-1">Operational Remarks / Stacking Slot</label>
                  <input
                    type="text"
                    value={loloRemarks}
                    onChange={e => setLoloRemarks(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsLoloFormOpen(false)}
                    className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Generate &amp; Print LoLo Lift Ticket
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LoLo Tariff Cards */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3 font-mono text-xs">
            <span className="font-bold text-neutral-900 dark:text-white text-sm block">
              Official LoLo (Lift-on / Lift-off) Standard Tariff Schedule
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {loloTariffs.map(t => (
                <div key={t.id} className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                  <div className="font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-1">
                    {t.category}
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">20ft Laden Lift:</span>
                      <span className="font-bold">${t.rateLaden20} {t.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">40ft/40HC Laden Lift:</span>
                      <span className="font-bold">${t.rateLaden40} {t.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">20ft Empty Lift:</span>
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">${t.rateEmpty20} {t.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">40ft Empty Lift:</span>
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">${t.rateEmpty40} {t.currency}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-1 text-[10px] text-neutral-400">
                      <span>Restack Shift: ${t.restackFee}</span>
                      <span>Hazmat: +${t.hazardousSurcharge}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LoLo Tickets Logbook Table */}
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden font-mono text-xs">
            <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-neutral-900 dark:text-white">
                LoLo Terminal Gate Logbook ({filteredLoloTickets.length} Movements)
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={loloFilterLiftType}
                  onChange={e => setLoloFilterLiftType(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[11px]"
                >
                  <option value="All">All Lift Operations</option>
                  <option value="Inbound Lift-Off (Trailer to Ground)">Inbound Lift-Off</option>
                  <option value="Outbound Lift-On (Ground to Chassis)">Outbound Lift-On</option>
                  <option value="Yard Restack / Shift">Yard Restack</option>
                  <option value="CFS Destuffing / Stuffing Lift">CFS Stuffing/Destuffing</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                    <th className="py-3 px-4">Ticket Ref / Time</th>
                    <th className="py-3 px-4">Container &amp; Type</th>
                    <th className="py-3 px-4">Lift Operation</th>
                    <th className="py-3 px-4">Equipment &amp; Operator</th>
                    <th className="py-3 px-4">Truck &amp; Haulier</th>
                    <th className="py-3 px-4">LoLo Fee</th>
                    <th className="py-3 px-4 text-center">Settlement</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredLoloTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-900 dark:text-white">{ticket.ticketNo}</div>
                        <div className="text-[10px] text-neutral-400">{ticket.timestamp}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-900 dark:text-white">{ticket.containerNo}</div>
                        <div className="text-[10px] text-neutral-400">
                          {ticket.containerType} · <span className={ticket.status === 'Laden' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-neutral-400'}>{ticket.status}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="font-semibold text-[11px] text-neutral-900 dark:text-white truncate">
                          {ticket.liftType}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">{ticket.depotName}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-800 dark:text-neutral-200">
                          {ticket.equipmentType} ({ticket.equipmentId})
                        </div>
                        <div className="text-[10px] text-neutral-400">Op: {ticket.operatorName}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-900 dark:text-white">{ticket.truckNo}</div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">{ticket.transporter}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          ${ticket.loloFeeUsd} USD
                        </div>
                        <div className="text-[10px] text-neutral-400">{ticket.paymentMode}</div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ticket.isPaid
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {ticket.isPaid ? 'Settled / Paid' : 'Pending Invoice'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLoloForView(ticket)}
                          className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                        >
                          View Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DEPOT FACILITIES & CAPACITY MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'facilities' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouseFacilities.map(fac => {
              const utilPercent = Math.round((fac.occupiedCbm / fac.capacityCbm) * 100);
              return (
                <div key={fac.id} className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">{fac.locode}</span>
                      <h3 className="font-bold text-base text-neutral-900 dark:text-white font-sans">{fac.name}</h3>
                      <span className="text-[11px] text-neutral-500">{fac.city}</span>
                    </div>
                    {fac.bondedCertified && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Bonded Certified
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-500">Volumetric Utilization:</span>
                      <span className="font-bold">{fac.occupiedCbm.toLocaleString()} / {fac.capacityCbm.toLocaleString()} CBM ({utilPercent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          utilPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${utilPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Ground Slots</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{fac.groundSlotsTeu} TEU</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Active Cranes</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{fac.reachStackers} Reach Stackers</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Storage Zones</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{fac.zonesCount} Zones</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-neutral-400 bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                    Security Profile: {fac.securityLevel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warehouse Receipt Inspection Modal */}
      {selectedReceiptForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Official Warehouse Receipt</span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">{selectedReceiptForView.receiptNo}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptForView(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
              <div>
                <span className="text-[10px] text-neutral-400 block">Client / Shipper</span>
                <span className="font-bold text-neutral-900 dark:text-white font-sans">{selectedReceiptForView.clientName}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Storage Classification</span>
                <span className="font-bold text-neutral-900 dark:text-white">{selectedReceiptForView.storageType}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Inbound Date</span>
                <span className="font-bold text-neutral-900 dark:text-white">{selectedReceiptForView.inDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Associated Container</span>
                <span className="font-bold text-neutral-900 dark:text-white">{selectedReceiptForView.associatedContainerNo || 'N/A (Loose Cargo)'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">Cargo Description</span>
              <p className="font-sans text-neutral-800 dark:text-neutral-200">{selectedReceiptForView.cargoDesc}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-b border-neutral-200 dark:border-neutral-800 py-3 text-[11px]">
              <div>
                <span className="text-[10px] text-neutral-400 block">Package Quantity</span>
                <span className="font-bold">{selectedReceiptForView.packageCount}x {selectedReceiptForView.packageType}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Volume &amp; Weight</span>
                <span className="font-bold">{selectedReceiptForView.cbmVolume} CBM / {selectedReceiptForView.grossWeightKg.toLocaleString()} KG</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Accrued Storage Fees</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${selectedReceiptForView.accruedChargesUsd} USD</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-neutral-500">
                Depot Location: {selectedReceiptForView.bayLocation}
              </span>
              <button
                type="button"
                onClick={() => setSelectedReceiptForView(null)}
                className="px-4 py-2 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LoLo Ticket Inspection Modal */}
      {selectedLoloForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Container Gate LoLo Pass</span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">{selectedLoloForView.ticketNo}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLoloForView(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Container:</span>
                <span className="font-bold text-sm text-neutral-900 dark:text-white">{selectedLoloForView.containerNo} ({selectedLoloForView.containerType} · {selectedLoloForView.status})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Operation:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{selectedLoloForView.liftType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Equipment / Crane:</span>
                <span className="font-bold">{selectedLoloForView.equipmentType} ({selectedLoloForView.equipmentId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Crane Operator:</span>
                <span className="font-bold">{selectedLoloForView.operatorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Haulier / Truck:</span>
                <span className="font-bold">{selectedLoloForView.truckNo} ({selectedLoloForView.transporter})</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-2 text-sm">
                <span className="font-bold text-neutral-900 dark:text-white">LoLo Tariff Fee:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${selectedLoloForView.loloFeeUsd} USD</span>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500">
              Remarks: {selectedLoloForView.remarks || 'Standard gate crane lift executed.'}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setSelectedLoloForView(null)}
                className="px-4 py-2 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold cursor-pointer"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
