import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Container } from '../types';
import {
  Box,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  Scale,
  DollarSign,
  FileCheck,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { OceanBookingInlineForm } from '../components/forms/OceanBookingInlineForm';

export const FclPage: React.FC = () => {
  const { containers, currentCompany } = useApp();
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [waiverRequested, setWaiverRequested] = useState<Record<string, boolean>>({});
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const filtered = containers.filter(c => {
    if (selectedRisk !== 'All' && c.demurrageRisk !== selectedRisk) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.containerNo.toLowerCase().includes(q) ||
        c.sealNo.toLowerCase().includes(q) ||
        c.vesselName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRequestWaiver = (id: string, containerNo: string) => {
    setWaiverRequested(prev => ({ ...prev, [id]: true }));
  };

  const criticalBoxes = containers.filter(c => c.demurrageRisk === 'critical').length;
  const warningBoxes = containers.filter(c => c.demurrageRisk === 'warning').length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              EQUIPMENT INVENTORY
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              SOLAS VGM Compliant
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            FCL Containers & Demurrage Management
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Monitor container turnaround times, demurrage free-time thresholds, and terminal detention risk
          </p>
        </div>

        <button
          onClick={() => setIsBookingFormOpen(!isBookingFormOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer ${
            isBookingFormOpen
              ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
              : 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950'
          }`}
        >
          {isBookingFormOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Booking Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>+ New FCL Booking</span>
            </>
          )}
        </button>
      </div>

      {/* On-Page Inline 5-Tab Booking Form (No Popup) */}
      {isBookingFormOpen && (
        <OceanBookingInlineForm
          mode="FCL"
          onClose={() => setIsBookingFormOpen(false)}
        />
      )}

      {/* Demurrage Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-neutral-400">Total FCL Fleet In Transit / Terminal</span>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {containers.length} Boxes
            </div>
          </div>
          <Box className="w-8 h-8 text-neutral-400" />
        </div>

        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-center justify-between">
          <div>
            <span className="text-rose-600 dark:text-rose-400 font-bold">Critical Demurrage Free Time</span>
            <div className="text-2xl font-bold mt-1 text-rose-700 dark:text-rose-300">
              {criticalBoxes} Box(es) ≤ 1 Day
            </div>
            <p className="text-[10px] text-rose-500 mt-0.5 font-sans">
              $275/day standard carrier detention tariff applies after expiration
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div>
            <span className="text-amber-600 dark:text-amber-400 font-bold">Free-Time Warning</span>
            <div className="text-2xl font-bold mt-1 text-amber-700 dark:text-amber-300">
              {warningBoxes} Box(es) ≤ 3 Days
            </div>
            <p className="text-[10px] text-amber-500 mt-0.5 font-sans">
              Coordinate terminal gate-out or consignee customs delivery order
            </p>
          </div>
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by container number, seal number, or vessel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
          >
            <option value="All">All Free-Time Risks</option>
            <option value="critical">Critical (≤ 1 Day)</option>
            <option value="warning">Warning (≤ 3 Days)</option>
            <option value="safe">Safe (&gt; 3 Days)</option>
          </select>
        </div>
      </div>

      {/* Containers List */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                <th className="py-3 px-4">Container ID</th>
                <th className="py-3 px-4">ISO Type</th>
                <th className="py-3 px-4">Seal No</th>
                <th className="py-3 px-4">Vessel / Voyage</th>
                <th className="py-3 px-4">POL → POD</th>
                <th className="py-3 px-4">VGM Weight</th>
                <th className="py-3 px-4">Demurrage Free Days</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map(c => {
                const isCrit = c.demurrageRisk === 'critical';
                const isWarn = c.demurrageRisk === 'warning';
                const isRequested = waiverRequested[c.id];

                return (
                  <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      {c.containerNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300 text-[10px]">
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                      {c.sealNo}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-800 dark:text-neutral-200">
                      <div>{c.vesselName}</div>
                      <div className="text-[10px] text-neutral-400">Voyage: {c.voyage}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-neutral-600 dark:text-neutral-400 max-w-[180px] truncate">
                      {c.pod}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-900 dark:text-white font-medium">
                        {c.grossWeightKg.toLocaleString()} kg
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        VGM: {c.vgmKg.toLocaleString()} kg
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold">
                        {c.daysRemaining} / {c.demurrageFreeDays} days
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Tariff: $275/day
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCrit
                            ? 'bg-rose-500 text-white animate-pulse'
                            : isWarn
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {c.demurrageRisk.toUpperCase()} ({c.daysRemaining}d)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isRequested ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-medium flex items-center gap-1 justify-end">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Waiver Pending</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRequestWaiver(c.id, c.containerNo)}
                          className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-sans text-[11px] transition-colors cursor-pointer"
                        >
                          Request Free-Time Extension
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
