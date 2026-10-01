import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shipment } from '../types';
import {
  Ship,
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  ArrowUpDown,
  Download,
  AlertCircle
} from 'lucide-react';

export const ShipmentsPage: React.FC = () => {
  const {
    shipments,
    setSelectedShipmentForDetail,
    setSelectedShipmentForBl,
    setIsNewBookingOpen,
    searchQuery: globalSearch
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'FCL' | 'LCL'>('All');
  const [filterDirection, setFilterDirection] = useState<'All' | 'Export' | 'Import'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const query = (localSearch || globalSearch).toLowerCase();

  const filtered = shipments.filter(s => {
    if (filterType !== 'All' && s.type !== filterType) return false;
    if (filterDirection !== 'All' && s.direction !== filterDirection) return false;
    if (filterStatus !== 'All' && s.status !== filterStatus) return false;
    if (query) {
      const match =
        s.shipmentNo.toLowerCase().includes(query) ||
        s.bookingNo.toLowerCase().includes(query) ||
        s.shipper.toLowerCase().includes(query) ||
        s.consignee.toLowerCase().includes(query) ||
        s.polCode.toLowerCase().includes(query) ||
        s.podCode.toLowerCase().includes(query) ||
        s.vesselName.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Ocean Consignments & Bills of Lading
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Active multi-modal FCL & LCL cargo routes under NVOCC carriage
          </p>
        </div>

        <button
          onClick={() => setIsNewBookingOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Ocean Booking</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by Ref, Shipper, Consignee, Vessel, or LOCODE..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Mode Filter */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
            >
              <option value="All">All Modes (FCL / LCL)</option>
              <option value="FCL">FCL (Full Container)</option>
              <option value="LCL">LCL (Consolidation)</option>
            </select>

            {/* Direction Filter */}
            <select
              value={filterDirection}
              onChange={e => setFilterDirection(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
            >
              <option value="All">All Directions</option>
              <option value="Export">Export</option>
              <option value="Import">Import</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
            >
              <option value="All">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="Loaded">Loaded</option>
              <option value="Customs Hold">Customs Hold</option>
              <option value="Booking Confirmed">Booking Confirmed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                <th className="py-3 px-4">Shipment / Bkg</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Shipper & Consignee</th>
                <th className="py-3 px-4">Ocean Vessel / Voy</th>
                <th className="py-3 px-4">Port Pair</th>
                <th className="py-3 px-4">ETD / ETA</th>
                <th className="py-3 px-4">Weight / Vol</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-400 font-sans">
                    No consignments found matching the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 dark:text-white">
                        {s.shipmentNo}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {s.bookingNo}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {s.type} · {s.direction}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="font-sans font-semibold text-neutral-900 dark:text-white truncate">
                        {s.shipper}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-sans truncate">
                        to: {s.consignee}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                      <div className="font-medium">{s.vesselName}</div>
                      <div className="text-[10px] text-neutral-400">{s.carrier} ({s.voyageNo})</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {s.polCode} → {s.podCode}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[130px]">
                        {s.pod}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 text-[11px]">
                      <div>D: {s.etd}</div>
                      <div>A: {s.eta}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{s.weightKg.toLocaleString()} kg</div>
                      <div className="text-[10px] text-neutral-400">
                        {s.type === 'FCL' ? `${s.containersCount} Box(es)` : `${s.cbmVolume || 12} CBM`}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          s.status === 'Customs Hold'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedShipmentForDetail(s)}
                        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline text-[11px] font-sans"
                      >
                        Lifecycle
                      </button>
                      <button
                        onClick={() => setSelectedShipmentForBl(s)}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-sans text-[11px] font-medium transition-colors"
                      >
                        Ocean B/L
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
