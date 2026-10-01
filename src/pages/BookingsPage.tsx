import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Plus,
  Ship,
  Search,
  Check,
  XCircle,
  DollarSign
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { bookings, approveBooking, setIsNewBookingOpen } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = bookings.filter(b => {
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.bookingNo.toLowerCase().includes(q) ||
        b.shipper.toLowerCase().includes(q) ||
        b.pol.toLowerCase().includes(q) ||
        b.pod.toLowerCase().includes(q) ||
        b.carrier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              COMMERCIAL BOOKING DESK
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Freight Booking Requests & Slot Confirmations
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Review shipper space allocations, carrier line confirmations, and equipment positioning
          </p>
        </div>

        <button
          onClick={() => setIsNewBookingOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Freight Booking</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search booking number, shipper, carrier, or port..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
        >
          <option value="All">All Booking Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Approved">Approved</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                <th className="py-3 px-4">Booking No / Date</th>
                <th className="py-3 px-4">Shipper & Consignee</th>
                <th className="py-3 px-4">Mode & Equipment</th>
                <th className="py-3 px-4">Route & Target ETD</th>
                <th className="py-3 px-4">Carrier & Vessel</th>
                <th className="py-3 px-4">Freight Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map(b => {
                const isPending = b.status === 'Pending Review';
                return (
                  <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      <div>{b.bookingNo}</div>
                      <div className="text-[10px] text-neutral-400">{b.requestDate}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate">
                      <div className="font-semibold text-neutral-900 dark:text-white font-sans">{b.shipper}</div>
                      <div className="text-[10px] text-neutral-400 font-sans truncate">to {b.consignee}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-800 dark:text-neutral-200">
                        {b.containerQty}x {b.containerType}
                      </div>
                      <div className="text-[10px] text-neutral-400">{b.type} · {b.direction}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="truncate max-w-[170px]">{b.pol} → {b.pod}</div>
                      <div className="text-[10px] text-neutral-400">Target ETD: {b.targetEtd}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-900 dark:text-white">{b.carrier}</div>
                      <div className="text-[10px] text-neutral-400">{b.targetVessel}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      ${b.totalFreightUsd.toLocaleString()} USD
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPending
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isPending ? (
                        <button
                          onClick={() => approveBooking(b.id)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-medium text-[11px] rounded transition-colors ml-auto cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-sans">
                          Confirmed & Allocated
                        </span>
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
