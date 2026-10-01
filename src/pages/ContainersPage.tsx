import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Container } from '../types';
import {
  Box,
  Ship,
  Anchor,
  Warehouse,
  BookmarkCheck,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Check,
  X,
  FileCheck2,
  Ticket,
  Scale,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ContainersPage: React.FC = () => {
  const { containers, addContainer, updateContainerLocation, currentCompany } = useApp();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Booked' | 'At Sea' | 'At Port' | 'In Warehouse'>('All');
  const [search, setSearch] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);

  // New Container Form State
  const [newContainerNo, setNewContainerNo] = useState(`PCXU${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [newSealNo, setNewSealNo] = useState(`SL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [newType, setNewType] = useState('40HC');
  const [newOwnership, setNewOwnership] = useState<'SOC' | 'COC'>('SOC');
  const [newStatus, setNewStatus] = useState<Container['locationStatus']>('In Warehouse');
  const [newLocation, setNewLocation] = useState('Pacific Crest Central Warehouse, Bay 2');
  const [newClientOwner, setNewClientOwner] = useState('Pacific Precision Electronics Inc.');
  const [newTareWeight, setNewTareWeight] = useState(3820);
  const [newMaxPayload, setNewMaxPayload] = useState(28600);
  const [newGrossWeight, setNewGrossWeight] = useState(12500);

  // KPI calculations
  const totalCount = containers.length;
  const bookedCount = containers.filter(c => c.locationStatus === 'Booked').length;
  const atSeaCount = containers.filter(c => c.locationStatus === 'At Sea').length;
  const atPortCount = containers.filter(c => c.locationStatus === 'At Port').length;
  const inWarehouseCount = containers.filter(c => c.locationStatus === 'In Warehouse').length;

  const filteredContainers = containers.filter(c => {
    if (activeFilter !== 'All' && c.locationStatus !== activeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.containerNo.toLowerCase().includes(q) ||
        c.sealNo.toLowerCase().includes(q) ||
        (c.currentLocation && c.currentLocation.toLowerCase().includes(q)) ||
        (c.clientOwner && c.clientOwner.toLowerCase().includes(q)) ||
        c.vesselName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString();
    try {
      localStorage.setItem('shiplot_container_draft', JSON.stringify({
        newContainerNo,
        newType,
        newOwnership,
        newStatus,
        newLocation,
        newClientOwner
      }));
    } catch {
      // ignore
    }
    setDraftSavedMsg(`Container registration draft saved at ${time}`);
    setTimeout(() => setDraftSavedMsg(null), 3000);
  };

  const handleCreateContainer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCnt: Container = {
      id: `cnt_${Date.now()}`,
      containerNo: newContainerNo.toUpperCase(),
      sealNo: newSealNo,
      type: newType,
      vesselName: newStatus === 'At Sea' ? 'MSC Oscar' : newLocation,
      voyage: 'INV-2026',
      pol: 'Port of Los Angeles (USLAX)',
      pod: 'Port of Shanghai (CNSHA)',
      status: newStatus === 'At Sea' ? 'In Transit' : newStatus === 'At Port' ? 'Discharged' : 'Gated Out',
      demurrageFreeDays: 14,
      daysRemaining: 14,
      demurrageRisk: 'safe',
      grossWeightKg: Number(newGrossWeight),
      vgmKg: Number(newGrossWeight) + Number(newTareWeight),
      locationStatus: newStatus,
      ownership: newOwnership,
      currentLocation: newLocation,
      tareWeightKg: Number(newTareWeight),
      maxPayloadKg: Number(newMaxPayload),
      clientOwner: newClientOwner
    };

    addContainer(newCnt);
    setIsAddFormOpen(false);
  };

  const handleMoveStatus = (id: string, nextStatus: Container['locationStatus'], defaultLoc: string) => {
    updateContainerLocation(id, nextStatus, defaultLoc);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              CONTAINER FLEET & ASSETS
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              SOC & COC Fleet Inventory
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Container Fleet Management
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Real-time status tracking of container assets across Bookings, Sea Voyage, Port Terminals, and Warehouse Depots
          </p>
        </div>

        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer ${
            isAddFormOpen
              ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
              : 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950'
          }`}
        >
          {isAddFormOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>+ Register Container</span>
            </>
          )}
        </button>
      </div>

      {/* On-Page Inline Container Registration Form (Black & White, No Popup) */}
      {isAddFormOpen && (
        <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md overflow-hidden transition-all text-xs font-sans">
          <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Box className="w-4 h-4" />
              <span className="font-mono font-bold text-sm">
                Add Container Asset to Fleet Inventory
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
                onClick={() => setIsAddFormOpen(false)}
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

          <form onSubmit={handleCreateContainer} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Container Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PCXU7890123"
                  value={newContainerNo}
                  onChange={e => setNewContainerNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  ISO Container Type *
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                >
                  <option value="40HC">40' High Cube (40HC)</option>
                  <option value="20GP">20' General Purpose (20GP)</option>
                  <option value="40GP">40' Standard Dry (40GP)</option>
                  <option value="40RF">40' Temperature Reefer (40RF)</option>
                  <option value="45HC">45' High Cube Palletwide (45HC)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Ownership Type *
                </label>
                <select
                  value={newOwnership}
                  onChange={e => setNewOwnership(e.target.value as any)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                >
                  <option value="SOC">SOC (Shipper Owned Container)</option>
                  <option value="COC">COC (Carrier Owned Container)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Current Status *
                </label>
                <select
                  value={newStatus}
                  onChange={e => {
                    const st = e.target.value as Container['locationStatus'];
                    setNewStatus(st);
                    if (st === 'In Warehouse') setNewLocation('Pacific Crest Central Warehouse, Bay 2');
                    else if (st === 'At Port') setNewLocation('Port of Los Angeles Pier 400 Terminal');
                    else if (st === 'At Sea') setNewLocation('At Sea: Trans-Pacific Ocean Route');
                    else if (st === 'Booked') setNewLocation('Allocated to Booking · Awaiting Pickup');
                  }}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                >
                  <option value="In Warehouse">In Warehouse (Warehouse mai hai)</option>
                  <option value="At Port">At Port (Port mai para hai)</option>
                  <option value="At Sea">At Sea (Sea mai chal raha hai)</option>
                  <option value="Booked">Booked (Booked hai)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Current Location / Facility / Vessel *
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Client / Owner Company *
                </label>
                <input
                  type="text"
                  required
                  value={newClientOwner}
                  onChange={e => setNewClientOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Tare Weight (KG)
                </label>
                <input
                  type="number"
                  value={newTareWeight}
                  onChange={e => setNewTareWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Max Payload (KG)
                </label>
                <input
                  type="number"
                  value={newMaxPayload}
                  onChange={e => setNewMaxPayload(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Seal Number
                </label>
                <input
                  type="text"
                  value={newSealNo}
                  onChange={e => setNewSealNo(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Gross Weight (KG)
                </label>
                <input
                  type="number"
                  value={newGrossWeight}
                  onChange={e => setNewGrossWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
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
                <span>Save Container Asset</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards: Requested Statuses (Booked, At Sea, At Port, In Warehouse) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
        {/* Total Fleet */}
        <button
          onClick={() => setActiveFilter('All')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'All'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">Total Fleet</span>
            <Box className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{totalCount}</div>
          <span className="text-[10px] opacity-60">Containers registered</span>
        </button>

        {/* Booked */}
        <button
          onClick={() => setActiveFilter('Booked')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'Booked'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">Booked</span>
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{bookedCount}</div>
          <span className="text-[10px] opacity-60">Allocated to shipments</span>
        </button>

        {/* At Sea */}
        <button
          onClick={() => setActiveFilter('At Sea')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'At Sea'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">At Sea (Sailing)</span>
            <Ship className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{atSeaCount}</div>
          <span className="text-[10px] opacity-60">Active ocean transit</span>
        </button>

        {/* At Port */}
        <button
          onClick={() => setActiveFilter('At Port')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'At Port'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">At Port (Terminal)</span>
            <Anchor className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{atPortCount}</div>
          <span className="text-[10px] opacity-60">Terminal berths / stacks</span>
        </button>

        {/* In Warehouse */}
        <button
          onClick={() => setActiveFilter('In Warehouse')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer col-span-2 lg:col-span-1 ${
            activeFilter === 'In Warehouse'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">In Warehouse (Depot)</span>
            <Warehouse className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{inWarehouseCount}</div>
          <span className="text-[10px] opacity-60">NVOCC / client yards</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {(['All', 'Booked', 'At Sea', 'At Port', 'In Warehouse'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab === 'All' ? 'All Containers' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search container, seal, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Containers Fleet Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-500 uppercase">
                <th className="py-3 px-4">Container ID</th>
                <th className="py-3 px-3">Type & Ownership</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Current Location / Vessel</th>
                <th className="py-3 px-3">Client / Owner</th>
                <th className="py-3 px-3">Weights (Tare / Payload)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
              {filteredContainers.map(c => {
                let badgeClass = 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
                if (c.locationStatus === 'At Sea') badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                else if (c.locationStatus === 'At Port') badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                else if (c.locationStatus === 'In Warehouse') badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
                else if (c.locationStatus === 'Booked') badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

                return (
                  <tr key={c.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      <div>{c.containerNo}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        Seal: {c.sealNo}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold">{c.type}</div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
                        {c.ownership || 'SOC'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${badgeClass}`}>
                        {c.locationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate max-w-xs">{c.currentLocation || c.vesselName}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono block mt-0.5">
                        Route: {c.pol} → {c.pod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-sans text-xs">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {c.clientOwner || 'Pacific Precision Electronics'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[11px]">
                      <div>Gross: {(c.grossWeightKg || 18000).toLocaleString()} kg</div>
                      <div className="text-neutral-400 text-[10px]">
                        Tare: {(c.tareWeightKg || 3820).toLocaleString()} kg
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {/* One-click Issue Gate Pass */}
                      <button
                        onClick={() => navigate('/gatepass', { state: { prefilledContainerNo: c.containerNo } })}
                        className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-[11px] font-mono font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Issue Gate In / Gate Out Pass"
                      >
                        <Ticket className="w-3 h-3" />
                        <span>Gate Pass</span>
                      </button>

                      {/* Move location quick status */}
                      {c.locationStatus !== 'In Warehouse' && (
                        <button
                          onClick={() => handleMoveStatus(c.id, 'In Warehouse', 'Pacific Crest Central Warehouse Bay 4')}
                          className="px-2 py-1 rounded text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline cursor-pointer"
                          title="Move to Warehouse Storage"
                        >
                          To Warehouse
                        </button>
                      )}
                      {c.locationStatus !== 'At Port' && (
                        <button
                          onClick={() => handleMoveStatus(c.id, 'At Port', 'Port of Los Angeles Pier 400 Terminal')}
                          className="px-2 py-1 rounded text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline cursor-pointer"
                          title="Move to Port Terminal"
                        >
                          To Port
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
