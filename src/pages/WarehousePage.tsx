import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WarehouseCargoItem } from '../types';
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
  Boxes
} from 'lucide-react';

export const WarehousePage: React.FC = () => {
  const { warehouseItems, addWarehouseItem, dispatchWarehouseItem, currentCompany } = useApp();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Bonded Storage' | 'General Dry Storage' | 'Temperature Controlled' | 'Yard Bulk Staging'>('All');
  const [search, setSearch] = useState('');
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);

  // Form State
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
      securityLevel: 'C-TPAT Tier 3 / Customs Bonded'
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
      securityLevel: 'Customs Supervised Warehouse'
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
      securityLevel: 'FDA Registered / Cold Chain 2-8°C'
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
      securityLevel: 'PSA Free Trade Zone (FTZ)'
    }
  ];

  const totalCbmStored = warehouseItems.reduce((acc, i) => acc + (i.status === 'Stored' ? i.cbmVolume : 0), 0);
  const totalAccruedStorage = warehouseItems.reduce((acc, i) => acc + (i.status === 'Stored' ? i.accruedChargesUsd : 0), 0);
  const activeConsignments = warehouseItems.filter(i => i.status === 'Stored').length;

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
      associatedContainerNo: associatedContainerNo.toUpperCase()
    };

    addWarehouseItem(newItem);
    setIsRegisterFormOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              WAREHOUSE & STORAGE LOGISTICS
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Bonded & CFS Storage Facilities
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            NVOCC Warehousing & Storage Facilities
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage commercial cargo storage, bonded customs holding, pallet racking, CFS groupage staging, and accrued storage fees
          </p>
        </div>

        <button
          onClick={() => setIsRegisterFormOpen(!isRegisterFormOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer ${
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
              <span>+ Register Inbound Storage</span>
            </>
          )}
        </button>
      </div>

      {/* On-Page Inline Inbound Storage Registration Form (Black & White, No Popup) */}
      {isRegisterFormOpen && (
        <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md overflow-hidden transition-all text-xs font-sans">
          <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Warehouse className="w-4 h-4" />
              <span className="font-mono font-bold text-sm">
                Register Inbound Cargo / Warehouse Receipt (WR)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="text-xs font-mono font-semibold px-2.5 py-1 rounded border border-neutral-700 dark:border-neutral-300 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Save as Draft</span>
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterFormOpen(false)}
                className="text-white dark:text-neutral-950 p-1 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {draftSavedMsg && (
            <div className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-5 py-1.5 text-xs font-mono flex items-center justify-between">
              <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> {draftSavedMsg}
              </span>
            </div>
          )}

          <form onSubmit={handleRegisterCargo} className="p-5 sm:p-6 space-y-4 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Client / Shipper Company *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pacific Precision Electronics Inc."
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-sans"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Storage Facility Hub *
                </label>
                <select
                  value={warehouseName}
                  onChange={e => setWarehouseName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-sans"
                >
                  {warehouseFacilities.map(f => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.locode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Storage Classification *
                </label>
                <select
                  value={storageType}
                  onChange={e => setStorageType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                >
                  <option value="Bonded Storage">Bonded Storage (Customs)</option>
                  <option value="General Dry Storage">General Dry Storage</option>
                  <option value="Temperature Controlled">Temperature Controlled (Cold Chain)</option>
                  <option value="Yard Bulk Staging">Yard Bulk Staging</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Volume (CBM / m³) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={cbmVolume}
                  onChange={e => setCbmVolume(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Packages Quantity *
                </label>
                <input
                  type="number"
                  required
                  value={packageCount}
                  onChange={e => setPackageCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Gross Weight (KG) *
                </label>
                <input
                  type="number"
                  required
                  value={grossWeightKg}
                  onChange={e => setGrossWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Assigned Bay / Rack Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bonded Zone A-08"
                  value={bayLocation}
                  onChange={e => setBayLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Daily Storage Rate ($ USD)
                </label>
                <input
                  type="number"
                  value={dailyRateUsd}
                  onChange={e => setDailyRateUsd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Associated Container No
                </label>
                <input
                  type="text"
                  placeholder="e.g. PCXU1002910"
                  value={associatedContainerNo}
                  onChange={e => setAssociatedContainerNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 uppercase"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Packaging Unit Type
                </label>
                <input
                  type="text"
                  value={packageType}
                  onChange={e => setPackageType(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Cargo Merchandise Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={cargoDesc}
                  onChange={e => setCargoDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 rounded text-xs font-mono font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded text-xs font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Issue Warehouse Receipt</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Storage Facilities Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {warehouseFacilities.map(f => {
          const utilPct = Math.round((f.occupiedCbm / f.capacityCbm) * 100);
          return (
            <div
              key={f.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {f.locode}
                </span>
                <span className="text-[10px] text-neutral-500">{f.city}</span>
              </div>
              <div>
                <h3 className="font-bold text-xs truncate" title={f.name}>{f.name}</h3>
                <span className="text-[10px] text-neutral-400 block">{f.securityLevel}</span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-neutral-500">Utilization:</span>
                  <span className="font-bold">{utilPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-neutral-950 dark:bg-white"
                    style={{ width: `${utilPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-neutral-400 block mt-1">
                  {f.occupiedCbm.toLocaleString()} / {f.capacityCbm.toLocaleString()} CBM
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Active Stored Consignments</span>
          <div className="text-2xl font-bold mt-1">{activeConsignments} Lots</div>
          <span className="text-[10px] text-neutral-400">Across 4 global hubs</span>
        </div>
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Total Stored Volume</span>
          <div className="text-2xl font-bold mt-1">{totalCbmStored.toFixed(1)} CBM</div>
          <span className="text-[10px] text-neutral-400">Consolidated cargo weight</span>
        </div>
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Accrued Storage Fees</span>
          <div className="text-2xl font-bold mt-1">${totalAccruedStorage.toLocaleString()}</div>
          <span className="text-[10px] text-neutral-400">Billable to shippers / consignees</span>
        </div>
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Bonded Customs Compliance</span>
          <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" />
            <span>100% Audit Ready</span>
          </div>
          <span className="text-[10px] text-neutral-400">FMC & US Customs Tier-3</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {(['All', 'Bonded Storage', 'General Dry Storage', 'Temperature Controlled', 'Yard Bulk Staging'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search receipt, client, bay, container..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Cargo Storage Inventory Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-500 uppercase">
                <th className="py-3 px-4">Receipt No & Date</th>
                <th className="py-3 px-3">Client & Cargo Description</th>
                <th className="py-3 px-3">Storage Type & Bay</th>
                <th className="py-3 px-3">Volume & Packages</th>
                <th className="py-3 px-3">Daily Rate & Accrual</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                    <div>{item.receiptNo}</div>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      In-Date: {item.inDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-neutral-900 dark:text-white">{item.clientName}</div>
                    <span className="text-[11px] text-neutral-500 font-sans block max-w-xs truncate">
                      {item.cargoDesc}
                    </span>
                    {item.associatedContainerNo && (
                      <span className="text-[10px] px-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        Box: {item.associatedContainerNo}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold block">{item.storageType}</span>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{item.bayLocation}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-neutral-900 dark:text-white">{item.cbmVolume} CBM</div>
                    <span className="text-[10px] text-neutral-400">
                      {item.packageCount} {item.packageType} · {(item.grossWeightKg).toLocaleString()} KG
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold">${item.accruedChargesUsd} USD</div>
                    <span className="text-[10px] text-neutral-400">
                      Rate: ${item.dailyRateUsd}/day
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                      item.status === 'Dispatched'
                        ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                        : item.status === 'Staged for Loading'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {/* Generate Gate Pass for Warehouse Outbound Dispatch */}
                    <button
                      onClick={() => navigate('/gatepass', {
                        state: { prefilledContainerNo: item.associatedContainerNo || 'PCXU1002910' }
                      })}
                      className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-[11px] font-mono font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                      title="Issue Dispatch Gate Pass"
                    >
                      <Ticket className="w-3 h-3" />
                      <span>Dispatch Pass</span>
                    </button>

                    {item.status === 'Stored' && (
                      <button
                        onClick={() => dispatchWarehouseItem(item.id)}
                        className="px-2 py-1 rounded text-[10px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white underline cursor-pointer"
                      >
                        Mark Dispatched
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
