import React, { useState } from 'react';
import { BookingItem, InvoiceItem, ConsolidationItem } from '../../types/shipping';
import {
  CalendarCheck,
  DollarSign,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

interface BookingsAndFinanceProps {
  bookings: BookingItem[];
  invoices: InvoiceItem[];
  consolidations: ConsolidationItem[];
  currentRole: string;
  onApproveBooking: (id: string) => void;
  onRecordPayment: (id: string) => void;
  onOpenNewBooking: () => void;
}

export const BookingsAndFinance: React.FC<BookingsAndFinanceProps> = ({
  bookings,
  invoices,
  consolidations,
  currentRole,
  onApproveBooking,
  onRecordPayment,
  onOpenNewBooking,
}) => {
  const [tab, setTab] = useState<'bookings' | 'consolidations' | 'invoices'>('bookings');

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              COMMERCIAL DESK
            </span>
            <span className="text-xs text-neutral-400">· Freight Booking & Financial Settlement</span>
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Bookings, LCL Consolidations & Freight Ledger
          </h2>
        </div>

        {/* Segmented controls */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm">
          <button
            onClick={() => setTab('bookings')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              tab === 'bookings'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setTab('consolidations')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              tab === 'consolidations'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            LCL Consols ({consolidations.length})
          </button>

          <button
            onClick={() => setTab('invoices')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              tab === 'invoices'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Invoices & Billing ({invoices.length})
          </button>
        </div>
      </div>

      {/* Role Context Notice */}
      <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
          <UserCheck className="w-4 h-4 text-neutral-400" />
          <span>
            Active Portal View: <strong className="text-neutral-900 dark:text-white">{currentRole.replace('_', ' ').toUpperCase()}</strong>
          </span>
        </div>
        <span className="text-[11px] text-neutral-400 hidden sm:inline">
          Role-Based Access Control Active · Isolated Tenant Ledger
        </span>
      </div>

      {/* TAB 1: BOOKINGS */}
      {tab === 'bookings' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-neutral-500">
              Pending and Approved Freight Booking Requests
            </span>
            <button
              onClick={onOpenNewBooking}
              className="px-3 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded font-semibold text-xs hover:opacity-90"
            >
              + Create Booking Request
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-2.5 px-3">Booking No / Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Shipper → Consignee</th>
                  <th className="py-2.5 px-3">Route (POL → POD)</th>
                  <th className="py-2.5 px-3">Cargo Spec</th>
                  <th className="py-2.5 px-3">Est. Freight</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900 dark:text-white">{b.bookingNo}</div>
                      <div className="text-[11px] text-neutral-400">{b.requestDate}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold">
                        {b.type} · {b.direction}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-neutral-900 dark:text-white truncate max-w-[160px]">
                        {b.shipper}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-[160px]">
                        To: {b.consignee}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div>{b.pol.split('(')[1]?.replace(')', '') || b.pol} → {b.pod.split('(')[1]?.replace(')', '') || b.pod}</div>
                      <div className="text-[10px] text-neutral-400">ETD: {b.targetEtd}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div>{b.type === 'FCL' ? `${b.containerQty}x ${b.containerType}` : `${b.cbm} CBM`}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[140px] font-sans">
                        {b.cargoDesc}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                      ${b.totalFreightUsd.toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] border ${
                          b.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {b.status === 'Pending Review' ? (
                        <button
                          onClick={() => onApproveBooking(b.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-sans font-medium"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-sans">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CONSOLIDATIONS */}
      {tab === 'consolidations' && (
        <div className="space-y-3">
          <div className="text-xs font-mono text-neutral-500">
            LCL Groupage Containers & CFS Stuffing Depots
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consolidations.map((csl) => {
              const utilPercent = Math.round((csl.allocatedCbm / csl.maxCapacityCbm) * 100);
              return (
                <div
                  key={csl.id}
                  className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-3 text-xs font-mono"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm">
                        {csl.consolNo}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Box: {csl.containerNo} ({csl.containerType}) · MBL: {csl.masterBlNo}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px]">
                      {csl.status}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="font-bold text-neutral-800 dark:text-neutral-200">
                      {csl.pol} → {csl.pod}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-sans mt-0.5">
                      CFS: {csl.cfsOrigin} → {csl.cfsDestination}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">
                      Vessel: {csl.vesselName} ({csl.voyage}) · Cut-off: {csl.cutOffDate}
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-neutral-500">CBM Utilization Capacity</span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {csl.allocatedCbm} / {csl.maxCapacityCbm} m³ ({utilPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full ${
                          utilPercent > 90 ? 'bg-amber-500' : 'bg-neutral-900 dark:bg-white'
                        }`}
                        style={{ width: `${utilPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>{csl.houseCount} Consignee House B/Ls packed</span>
                      <span>{(csl.maxCapacityCbm - csl.allocatedCbm).toFixed(1)} CBM available</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: INVOICES */}
      {tab === 'invoices' && (
        <div className="space-y-3">
          <div className="text-xs font-mono text-neutral-500">
            Ocean Freight Invoices, Per-Diem Charges, and Receivable Ledgers
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-2.5 px-3">Invoice No / Ref</th>
                  <th className="py-2.5 px-3">Billed Party</th>
                  <th className="py-2.5 px-3">Service Category</th>
                  <th className="py-2.5 px-3">Dates (Issue → Due)</th>
                  <th className="py-2.5 px-3">Amount Due</th>
                  <th className="py-2.5 px-3">Payment Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900 dark:text-white">{inv.invoiceNo}</div>
                      <div className="text-[11px] text-neutral-400">{inv.shipmentNo}</div>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-neutral-900 dark:text-white truncate max-w-[160px]">
                        {inv.billTo}
                      </div>
                      <div className="text-[11px] text-neutral-400">Role: {inv.billToRole}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span>{inv.type}</span>
                    </td>

                    <td className="py-3 px-3">
                      <div>Issued: {inv.issueDate}</div>
                      <div className="text-[11px] text-neutral-400">Due: {inv.dueDate}</div>
                    </td>

                    <td className="py-3 px-3 font-bold tabular-nums text-neutral-900 dark:text-white">
                      ${inv.total.toLocaleString()} {inv.currency}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] border ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200'
                            : inv.paymentStatus === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {inv.paymentStatus !== 'Paid' ? (
                        <button
                          onClick={() => onRecordPayment(inv.id)}
                          className="px-2.5 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded text-[11px] font-sans font-medium"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
