import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Plus,
  Ship,
  Search,
  Check,
  XCircle,
  DollarSign,
  Box,
  Boxes,
  X,
  Eye,
  Building2,
  MapPin,
  Scale,
  Warehouse,
  FileText
} from 'lucide-react';
import { FclBookingForm } from '../components/forms/FclBookingForm';
import { LclBookingForm } from '../components/forms/LclBookingForm';

export const BookingsPage: React.FC = () => {
  const { bookings, approveBooking } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Inline Form State (No popup)
  const [activeInlineForm, setActiveInlineForm] = useState<'NONE' | 'FCL' | 'LCL'>('NONE');

  // Detail Modal for Inspection
  const [selectedBookingForView, setSelectedBookingForView] = useState<Booking | null>(null);

  const filtered = bookings.filter(b => {
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (filterType !== 'All' && b.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.bookingNo.toLowerCase().includes(q) ||
        b.shipper.toLowerCase().includes(q) ||
        b.consignee.toLowerCase().includes(q) ||
        b.pol.toLowerCase().includes(q) ||
        b.pod.toLowerCase().includes(q) ||
        b.carrier.toLowerCase().includes(q) ||
        (b.cargoDesc && b.cargoDesc.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              COMMERCIAL BOOKING DESK
            </span>
            <span className="text-xs font-mono text-neutral-400">
              SOLAS & FIATA Compliant
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1.5 font-sans">
            Ocean Freight Bookings & Slot Allocation Matrix
          </h1>

          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage FCL container slots, LCL CFS groupage cargo bookings, carrier line approvals, and equipment reservations.
          </p>
        </div>

        {/* Action Buttons: FCL & LCL Distinct Creators */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveInlineForm(activeInlineForm === 'FCL' ? 'NONE' : 'FCL')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs cursor-pointer ${
              activeInlineForm === 'FCL'
                ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
                : 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950'
            }`}
          >
            {activeInlineForm === 'FCL' ? (
              <>
                <X className="w-4 h-4" />
                <span>Close FCL Form</span>
              </>
            ) : (
              <>
                <Box className="w-4 h-4" />
                <span>+ New FCL Booking</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveInlineForm(activeInlineForm === 'LCL' ? 'NONE' : 'LCL')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs cursor-pointer ${
              activeInlineForm === 'LCL'
                ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
                : 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white'
            }`}
          >
            {activeInlineForm === 'LCL' ? (
              <>
                <X className="w-4 h-4" />
                <span>Close LCL Form</span>
              </>
            ) : (
              <>
                <Boxes className="w-4 h-4" />
                <span>+ New LCL Booking</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inline On-Page FCL Booking Form (No Popup) */}
      {activeInlineForm === 'FCL' && (
        <div className="space-y-2">
          <FclBookingForm
            onClose={() => setActiveInlineForm('NONE')}
            onBookingCreated={() => {
              setActiveInlineForm('NONE');
            }}
          />
        </div>
      )}

      {/* Inline On-Page LCL Booking Form (No Popup) */}
      {activeInlineForm === 'LCL' && (
        <div className="space-y-2">
          <LclBookingForm
            onClose={() => setActiveInlineForm('NONE')}
            onBookingCreated={() => {
              setActiveInlineForm('NONE');
            }}
          />
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row gap-3 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search booking number, shipper, consignee, carrier, or port..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            <option value="All">All Freight Modes (FCL &amp; LCL)</option>
            <option value="FCL">FCL (Full Container Load)</option>
            <option value="LCL">LCL (CFS Groupage)</option>
          </select>

          {/* Status Selector */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            <option value="All">All Booking Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved / Allocated</option>
          </select>
        </div>
      </div>

      {/* Bookings List Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-neutral-900 dark:text-white">
            Active Freight Bookings ({filtered.length})
          </span>
          <span className="text-[11px] text-neutral-400">
            Real-Time Carrier Space Allocation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                <th className="py-3 px-4">Booking Ref / Date</th>
                <th className="py-3 px-4">Shipper &amp; Consignee</th>
                <th className="py-3 px-4">Mode &amp; Cargo Spec</th>
                <th className="py-3 px-4">Origin / Dest (POL &rarr; POD)</th>
                <th className="py-3 px-4">Liner &amp; Vessel</th>
                <th className="py-3 px-4">Commercial Freight</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400 font-sans">
                    <CalendarCheck className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">No bookings found</p>
                    <p className="text-xs text-neutral-400 mt-1">Click &quot;+ New FCL Booking&quot; or &quot;+ New LCL Booking&quot; to issue a new slot confirmation.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(b => {
                  const isPending = b.status === 'Pending Review';
                  const isFcl = b.type === 'FCL';

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          {isFcl ? (
                            <Box className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Boxes className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          )}
                          <span>{b.bookingNo}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 font-normal">{b.requestDate}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-semibold text-neutral-900 dark:text-white font-sans truncate">{b.shipper}</div>
                        <div className="text-[10px] text-neutral-400 font-sans truncate">to {b.consignee}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-800 dark:text-neutral-200">
                          {b.containerQty}x {b.containerType}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {b.grossWeightKg ? `${b.grossWeightKg.toLocaleString()} KG` : ''}
                          {b.cbmVolume ? ` · ${b.cbmVolume} CBM` : ''}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="truncate max-w-[170px] font-medium">{b.pol} &rarr; {b.pod}</div>
                        <div className="text-[10px] text-neutral-400">ETD: {b.targetEtd}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-neutral-900 dark:text-white truncate max-w-[140px]">{b.carrier}</div>
                        <div className="text-[10px] text-neutral-400">{b.targetVessel}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                        ${b.totalFreightUsd.toLocaleString()} USD
                      </td>

                      <td className="py-3.5 px-4 text-center">
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

                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedBookingForView(b)}
                          className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                        >
                          View Details
                        </button>

                        {isPending && (
                          <button
                            onClick={() => approveBooking(b.id)}
                            className="px-3 py-1 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-sans font-medium text-[11px] rounded transition-colors cursor-pointer"
                          >
                            Approve
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

      {/* Booking Details Full Inspector Modal */}
      {selectedBookingForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">
                  {selectedBookingForView.type} Commercial Master Booking
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white font-sans mt-0.5">
                  Ref #{selectedBookingForView.bookingNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForView(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shipper */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Shipper / Exporter</span>
                <div className="font-bold text-neutral-900 dark:text-white text-sm font-sans">{selectedBookingForView.shipper}</div>
                {selectedBookingForView.shipperTaxId && (
                  <div className="text-[11px] text-neutral-500">Tax ID: {selectedBookingForView.shipperTaxId}</div>
                )}
                {selectedBookingForView.shipperAddress && (
                  <div className="text-[11px] text-neutral-500">{selectedBookingForView.shipperAddress}</div>
                )}
                {selectedBookingForView.shipperPhone && (
                  <div className="text-[11px] text-neutral-500">Tel: {selectedBookingForView.shipperPhone}</div>
                )}
              </div>

              {/* Consignee */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Consignee / Importer</span>
                <div className="font-bold text-neutral-900 dark:text-white text-sm font-sans">{selectedBookingForView.consignee}</div>
                {selectedBookingForView.consigneeTaxId && (
                  <div className="text-[11px] text-neutral-500">Tax ID: {selectedBookingForView.consigneeTaxId}</div>
                )}
                {selectedBookingForView.consigneeAddress && (
                  <div className="text-[11px] text-neutral-500">{selectedBookingForView.consigneeAddress}</div>
                )}
                {selectedBookingForView.consigneePhone && (
                  <div className="text-[11px] text-neutral-500">Tel: {selectedBookingForView.consigneePhone}</div>
                )}
              </div>
            </div>

            {/* Routing & Schedule */}
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block border-b border-neutral-100 dark:border-neutral-800 pb-1">
                Routing &amp; Schedule
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Port of Loading</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedBookingForView.pol}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Port of Discharge</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedBookingForView.pod}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Vessel &amp; Carrier</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedBookingForView.targetVessel} ({selectedBookingForView.carrier})</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Target ETD</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedBookingForView.targetEtd}</span>
                </div>
              </div>
            </div>

            {/* Cargo Particulars */}
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block border-b border-neutral-100 dark:border-neutral-800 pb-1">
                Cargo &amp; Freight Particulars
              </span>
              <div>
                <span className="text-[10px] text-neutral-400 block">Commodity Description</span>
                <p className="font-sans text-neutral-800 dark:text-neutral-200">{selectedBookingForView.cargoDesc}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Equipment / Allocation</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedBookingForView.containerType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Total Freight Amount</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${selectedBookingForView.totalFreightUsd.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Incoterms</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedBookingForView.incoterms || 'FOB'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Payment Terms</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedBookingForView.freightTerms || 'FREIGHT PREPAID'}</span>
                </div>
              </div>

              {/* Extended Operational Specs */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {selectedBookingForView.contractNo && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Contract / Co-Loader Ref</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedBookingForView.contractNo}</span>
                  </div>
                )}
                {selectedBookingForView.vgmKg && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">SOLAS VGM Weight</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedBookingForView.vgmKg.toLocaleString()} KG ({selectedBookingForView.vgmMethod || 'Method 1'})</span>
                  </div>
                )}
                {selectedBookingForView.revenueTons && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Billable Revenue Tons</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedBookingForView.revenueTons} RT ({selectedBookingForView.cbmVolume} CBM)</span>
                  </div>
                )}
                {selectedBookingForView.demurrageFreeDays !== undefined && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Free Time</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedBookingForView.demurrageFreeDays} Days Free</span>
                  </div>
                )}
                {selectedBookingForView.cfsOrigin && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Origin CFS Receiving</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 truncate block">{selectedBookingForView.cfsOrigin}</span>
                  </div>
                )}
                {selectedBookingForView.cfsDestination && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Dest CFS Hub</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 truncate block">{selectedBookingForView.cfsDestination}</span>
                  </div>
                )}
                {selectedBookingForView.emptyDepot && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Empty Depot</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 truncate block">{selectedBookingForView.emptyDepot}</span>
                  </div>
                )}
                {selectedBookingForView.blType && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">B/L Doc Format</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 truncate block">{selectedBookingForView.blType}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setSelectedBookingForView(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
