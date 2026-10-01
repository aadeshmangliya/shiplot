import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Download,
  CreditCard
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { invoices, recordPayment } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  const totalBilled = invoices.reduce((s, i) => s + i.total, 0);
  const paidTotal = invoices.filter(i => i.paymentStatus === 'Paid').reduce((s, i) => s + i.total, 0);
  const unpaidTotal = totalBilled - paidTotal;

  const filtered = invoices.filter(inv => {
    if (filterStatus !== 'All' && inv.paymentStatus !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.shipmentNo.toLowerCase().includes(q) ||
        inv.billTo.toLowerCase().includes(q)
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
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              FREIGHT RECEIVABLES & PER-DIEM
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Freight Billing, Invoicing & Demurrage Ledger
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Commercial ocean freight invoices, port terminal handling charges, and per-diem detention ledger
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-xs text-neutral-400">Total Billed Invoices</span>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            ${totalBilled.toLocaleString()} USD
          </div>
          <p className="text-[11px] text-neutral-500 font-sans mt-0.5">All ocean routes and container charges</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Collected Revenue</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ${paidTotal.toLocaleString()} USD
          </div>
          <p className="text-[11px] text-neutral-500 font-sans mt-0.5">Reconciled via wire / ACH transfer</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Outstanding Receivables</span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            ${unpaidTotal.toLocaleString()} USD
          </div>
          <p className="text-[11px] text-neutral-500 font-sans mt-0.5">{invoices.filter(i => i.paymentStatus !== 'Paid').length} open invoice(s)</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search invoice number, shipment ref, or billed client..."
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
          <option value="All">All Invoices</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Shipment Ref</th>
                <th className="py-3 px-4">Bill To (Party)</th>
                <th className="py-3 px-4">Charge Category</th>
                <th className="py-3 px-4">Issue & Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map(inv => {
                const isPaid = inv.paymentStatus === 'Paid';
                return (
                  <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                      {inv.shipmentNo}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-neutral-900 dark:text-white max-w-[200px] truncate">
                      <div>{inv.billTo}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{inv.billToRole}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                      {inv.type}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                      <div>Iss: {inv.issueDate}</div>
                      <div>Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      ${inv.total.toLocaleString()} {inv.currency}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {inv.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isPaid ? (
                        <button
                          onClick={() => recordPayment(inv.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-[11px] font-medium rounded transition-colors cursor-pointer"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-sans">
                          Settled
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
