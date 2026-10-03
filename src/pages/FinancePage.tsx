import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DisbursementAccount, DebitCreditNote } from '../types';
import {
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Download,
  CreditCard,
  BookOpen,
  Scale,
  Landmark,
  Wallet,
  Receipt,
  FileSpreadsheet,
  Printer,
  X,
  Building2,
  Ship,
  Eye,
  Plus,
  CheckCircle2,
  TrendingUp,
  Filter
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const {
    invoices,
    recordPayment,
    ledgerEntries,
    disbursementAccounts,
    debitCreditNotes,
    currentCompany
  } = useApp();

  type FinanceTab = 'invoices' | 'ledger' | 'cash_bank' | 'trial_balance' | 'aging' | 'disbursements' | 'notes';
  const [activeTab, setActiveTab] = useState<FinanceTab>('invoices');

  // Filter States
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [cashBankFilter, setCashBankFilter] = useState<'All' | 'Bank' | 'Cash'>('All');

  // Selected Documents for Modal / Print
  const [selectedDisbursement, setSelectedDisbursement] = useState<DisbursementAccount | null>(null);
  const [selectedNote, setSelectedNote] = useState<DebitCreditNote | null>(null);

  // Invoices Calculations
  const totalBilled = invoices.reduce((s, i) => s + i.total, 0);
  const paidTotal = invoices.filter(i => i.paymentStatus === 'Paid').reduce((s, i) => s + i.total, 0);
  const unpaidTotal = totalBilled - paidTotal;

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
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

  // Filtered Ledger
  const filteredLedger = ledgerEntries.filter(entry => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      entry.voucherNo.toLowerCase().includes(q) ||
      entry.accountTitle.toLowerCase().includes(q) ||
      entry.accountCode.includes(q) ||
      (entry.entityName && entry.entityName.toLowerCase().includes(q)) ||
      (entry.vesselVoyage && entry.vesselVoyage.toLowerCase().includes(q))
    );
  });

  // Cash / Bank Book Entries
  const cashBankEntries = ledgerEntries.filter(entry => {
    if (cashBankFilter === 'Bank') {
      return entry.voucherType === 'BPV' || entry.voucherType === 'BRV';
    }
    if (cashBankFilter === 'Cash') {
      return entry.voucherType === 'CPV' || entry.voucherType === 'CRV';
    }
    return ['BPV', 'BRV', 'CPV', 'CRV'].includes(entry.voucherType);
  }).filter(entry => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      entry.voucherNo.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      (entry.entityName && entry.entityName.toLowerCase().includes(q))
    );
  });

  // Trial Balance Aggregation
  const trialBalanceMap = new Map<string, { code: string; title: string; type: string; debit: number; credit: number }>();
  ledgerEntries.forEach(entry => {
    const existing = trialBalanceMap.get(entry.accountCode) || {
      code: entry.accountCode,
      title: entry.accountTitle,
      type: entry.accountType,
      debit: 0,
      credit: 0
    };
    existing.debit += entry.debit;
    existing.credit += entry.credit;
    trialBalanceMap.set(entry.accountCode, existing);
  });
  const trialBalanceList = Array.from(trialBalanceMap.values()).sort((a, b) => a.code.localeCompare(b.code));
  const totalDebit = trialBalanceList.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = trialBalanceList.reduce((sum, item) => sum + item.credit, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              ACCOUNTS & FINANCIAL SUITE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              FMC & SRS Compliant
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Agency Accounts, General Ledger & Disbursements
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Commercial ocean freight billing, double-entry general ledger, trial balance, and PDA/FDA cost-recovery
          </p>
        </div>
      </div>

      {/* Financial KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400 text-[11px]">Total Billed Freight</span>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            ${totalBilled.toLocaleString()} USD
          </div>
          <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Ocean invoices & line tariffs</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400 text-[11px]">Reconciled Receipts</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ${paidTotal.toLocaleString()} USD
          </div>
          <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Cleared via Bank BRV vouchers</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400 text-[11px]">Outstanding Receivables</span>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            ${unpaidTotal.toLocaleString()} USD
          </div>
          <p className="text-[10px] text-neutral-500 font-sans mt-0.5">{invoices.filter(i => i.paymentStatus !== 'Paid').length} open bills pending collection</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400 text-[11px]">Principal PDA Advance Funds</span>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            ${disbursementAccounts.reduce((sum, d) => sum + d.advanceReceived, 0).toLocaleString()} USD
          </div>
          <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Active port call disbursements</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto space-x-2 text-xs font-mono">
        {[
          { id: 'invoices', label: 'Commercial Invoices', icon: Receipt },
          { id: 'ledger', label: 'General Ledger', icon: BookOpen },
          { id: 'cash_bank', label: 'Cash & Bank Book', icon: Landmark },
          { id: 'trial_balance', label: 'Trial Balance', icon: Scale },
          { id: 'aging', label: 'AR & AP Aging', icon: Clock },
          { id: 'disbursements', label: 'PDA & FDA Accounts', icon: FileSpreadsheet },
          { id: 'notes', label: 'Debit & Credit Notes', icon: CreditCard }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as FinanceTab)}
              className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'invoices'
                ? 'Search invoice number, shipment ref, or client...'
                : activeTab === 'ledger' || activeTab === 'cash_bank'
                ? 'Search voucher number, account title, vessel or party...'
                : 'Search accounts, references or notes...'
            }
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>

        {activeTab === 'invoices' && (
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
        )}

        {activeTab === 'cash_bank' && (
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-mono">
            {(['All', 'Bank', 'Cash'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setCashBankFilter(mode)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  cashBankFilter === mode
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {mode} Book
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
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
                {filteredInvoices.map(inv => {
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
      )}

      {/* TAB 2: GENERAL LEDGER */}
      {activeTab === 'ledger' && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs font-mono">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white">Double-Entry General Ledger</span>
              <span className="text-neutral-500 ml-2">({filteredLedger.length} voucher postings)</span>
            </div>
            <div className="text-neutral-400 text-[11px]">
              Vouchers: JV (Journal), BPV (Bank Payment), BRV (Bank Receipt), CPV/CRV (Cash)
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-100/60 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Voucher #</th>
                  <th className="py-3 px-3">Account Code & Title</th>
                  <th className="py-3 px-3">Particulars / Narration</th>
                  <th className="py-3 px-3">Entity / Vessel</th>
                  <th className="py-3 px-3 text-right">Debit ($)</th>
                  <th className="py-3 px-3 text-right">Credit ($)</th>
                  <th className="py-3 px-3 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredLedger.map(entry => (
                  <tr key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-3 text-neutral-500 whitespace-nowrap">{entry.date}</td>
                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] mr-1 text-neutral-600 dark:text-neutral-400">
                        {entry.voucherType}
                      </span>
                      {entry.voucherNo}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-900 dark:text-white">{entry.accountTitle}</div>
                      <div className="text-[10px] text-neutral-400">Code: {entry.accountCode} · {entry.accountType}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300 max-w-[280px]">
                      {entry.description}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-neutral-500">
                      <div>{entry.entityName || '—'}</div>
                      {entry.vesselVoyage && <div className="text-[10px] text-blue-500">{entry.vesselVoyage}</div>}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-neutral-900 dark:text-white">
                      {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-neutral-900 dark:text-white">
                      {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ${entry.runningBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CASH & BANK BOOK */}
      {activeTab === 'cash_bank' && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs font-mono">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-neutral-900 dark:text-white">
                {cashBankFilter === 'All' ? 'Combined Cash & Bank Book' : `${cashBankFilter} Book Register`}
              </span>
            </div>
            <div className="text-neutral-500 text-[11px]">
              Showing receipts (CRV/BRV) and disbursements (CPV/BPV)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-100/60 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Voucher Type & #</th>
                  <th className="py-3 px-4">Bank / Cash Account</th>
                  <th className="py-3 px-4">Party / Beneficiary</th>
                  <th className="py-3 px-4">Narration</th>
                  <th className="py-3 px-4 text-right">Receipts / In ($)</th>
                  <th className="py-3 px-4 text-right">Payments / Out ($)</th>
                  <th className="py-3 px-4 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {cashBankEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3.5 px-4 text-neutral-500">{entry.date}</td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] mr-1.5 font-bold ${
                        entry.voucherType.endsWith('RV')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {entry.voucherType}
                      </span>
                      {entry.voucherNo}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-800 dark:text-neutral-200">
                      {entry.accountTitle}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-900 dark:text-white font-medium">
                      {entry.entityName || 'General Treasury'}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 text-[11px] max-w-[240px]">
                      {entry.description}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {entry.debit > 0 ? `+$${entry.debit.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-600 dark:text-rose-400">
                      {entry.credit > 0 ? `-$${entry.credit.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-neutral-900 dark:text-white">
                      ${entry.runningBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TRIAL BALANCE */}
      {activeTab === 'trial_balance' && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs font-mono">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white">Trial Balance Statement</span>
              <span className="text-neutral-500 ml-2">As of {new Date().toISOString().split('T')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                totalDebit === totalCredit
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {totalDebit === totalCredit ? 'BALANCED' : 'VARIANCE DETECTED'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-100/60 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Title / Classification</th>
                  <th className="py-3 px-4">Account Type</th>
                  <th className="py-3 px-4 text-right">Debit Balance ($)</th>
                  <th className="py-3 px-4 text-right">Credit Balance ($)</th>
                  <th className="py-3 px-4 text-right">Net Balance ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {trialBalanceList.map(item => {
                  const net = item.debit - item.credit;
                  return (
                    <tr key={item.code} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{item.code}</td>
                      <td className="py-3 px-4 text-neutral-900 dark:text-white font-medium">{item.title}</td>
                      <td className="py-3 px-4 text-neutral-500 text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white">
                        {item.debit > 0 ? `$${item.debit.toLocaleString()}` : '0.00'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white">
                        {item.credit > 0 ? `$${item.credit.toLocaleString()}` : '0.00'}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'}`}>
                        ${Math.abs(net).toLocaleString()} {net >= 0 ? 'Dr' : 'Cr'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-900 dark:text-white border-t-2 border-neutral-300 dark:border-neutral-700">
                  <td colSpan={3} className="py-3.5 px-4 text-right uppercase tracking-wider">
                    Total Trial Balance
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400">
                    ${totalDebit.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400">
                    ${totalCredit.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right text-neutral-500">
                    $0.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AGING & OUTSTANDING (AR / AP) */}
      {activeTab === 'aging' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Accounts Receivable (AR) */}
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Customer Receivables (AR) Aging</h3>
                  <p className="text-[11px] text-neutral-500 font-mono">Uncollected freight & per-diem charges</p>
                </div>
                <span className="font-bold text-rose-600 text-sm font-mono">${unpaidTotal.toLocaleString()}</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="text-neutral-500">Current (0 - 15 days)</span>
                  <span className="font-bold text-emerald-600">$18,450 (42%)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="text-neutral-500">16 - 30 days</span>
                  <span className="font-bold text-blue-600">$14,200 (33%)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="text-neutral-500">31 - 60 days</span>
                  <span className="font-bold text-amber-600">$7,850 (18%)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="text-neutral-500">60+ days (Overdue)</span>
                  <span className="font-bold text-rose-600">$3,100 (7%)</span>
                </div>
              </div>
            </div>

            {/* Accounts Payable (AP) */}
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Carrier & Vendor Payables (AP)</h3>
                  <p className="text-[11px] text-neutral-500 font-mono">Ocean slots, port dues & terminal handling</p>
                </div>
                <span className="font-bold text-neutral-900 dark:text-white text-sm font-mono">$64,300</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="text-neutral-500">Terminal Operators (KICT/QICT/PICT)</span>
                  <span className="font-bold text-neutral-900 dark:text-white">$28,500</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="text-neutral-500">Ocean Lines (MSC / Maersk / CMA)</span>
                  <span className="font-bold text-neutral-900 dark:text-white">$24,800</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="text-neutral-500">Harbour Pilots & Tug Operators</span>
                  <span className="font-bold text-neutral-900 dark:text-white">$11,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DISBURSEMENT ACCOUNTS (PDA / FDA) */}
      {activeTab === 'disbursements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white font-mono">
                Principal Disbursement Accounts (PDA / FDA)
              </h2>
              <p className="text-xs text-neutral-500 font-mono">
                Port call cost-recovery, pilotage, tugs, berth hire, and agency fee accounting for vessel owners
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                    <th className="py-3 px-4">Account #</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Vessel / Voyage</th>
                    <th className="py-3 px-4">Principal (Owner/Charterer)</th>
                    <th className="py-3 px-4">Port</th>
                    <th className="py-3 px-4 text-right">Total Est / Actual</th>
                    <th className="py-3 px-4 text-right">Advance Received</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {disbursementAccounts.map(account => (
                    <tr key={account.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                        {account.accountNo}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          account.type === 'PDA'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {account.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900 dark:text-white">{account.vesselName}</div>
                        <div className="text-[10px] text-neutral-400">Voyage: {account.voyage}</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans font-medium text-neutral-900 dark:text-white">
                        {account.principalName}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                        {account.portName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-900 dark:text-white">
                        ${account.totalDisbursement.toLocaleString()} {account.currency}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        ${account.advanceReceived.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-900 dark:text-white">
                        ${account.balanceDue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                          {account.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedDisbursement(account)}
                          className="px-2.5 py-1 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          View PDA Sheet
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

      {/* TAB 7: DEBIT & CREDIT NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                    <th className="py-3 px-4">Note #</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Party & Role</th>
                    <th className="py-3 px-4">Reference Doc</th>
                    <th className="py-3 px-4">Reason / Particulars</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {debitCreditNotes.map(note => (
                    <tr key={note.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                        {note.noteNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          note.type === 'Debit Note'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {note.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500">{note.issueDate}</td>
                      <td className="py-3.5 px-4 font-sans font-medium text-neutral-900 dark:text-white">
                        <div>{note.partyName}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{note.partyRole}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                        {note.referenceDoc}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 max-w-[240px]">
                        {note.reason}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-900 dark:text-white">
                        ${note.amount.toLocaleString()} {note.currency}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold">
                          {note.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedNote(note)}
                          className="px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Print Note
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

      {/* DISBURSEMENT ACCOUNT (PDA / FDA) MODAL & PRINT VIEW */}
      {selectedDisbursement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col font-mono text-xs">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-800/40">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-neutral-900 dark:text-white" />
                <span className="font-bold text-neutral-900 dark:text-white">
                  {selectedDisbursement.type === 'PDA' ? 'Proforma Disbursement Account (PDA)' : 'Final Disbursement Account (FDA)'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-[10px]">
                  {selectedDisbursement.accountNo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Statement</span>
                </button>
                <button
                  onClick={() => setSelectedDisbursement(null)}
                  className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div>
                  <div className="text-base font-bold text-neutral-900 dark:text-white uppercase">
                    {currentCompany.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-sans">
                    Shipping Agency & Vessel Husbandry Desk · FMC #{currentCompany.registrationNo}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-sans">
                    Port: {selectedDisbursement.portName}
                  </div>
                </div>
                <div className="text-right text-[11px] space-y-0.5">
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">
                    {selectedDisbursement.accountNo}
                  </div>
                  <div className="text-neutral-500">ETA: {selectedDisbursement.eta}</div>
                  <div className="text-neutral-500">ETD: {selectedDisbursement.etd}</div>
                  <div className="text-neutral-500">Status: <strong className="text-emerald-600">{selectedDisbursement.status}</strong></div>
                </div>
              </div>

              {/* Vessel & Principal Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 text-[11px]">
                <div>
                  <span className="text-neutral-400 block text-[10px]">VESSEL & VOYAGE</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {selectedDisbursement.vesselName} (Voy: {selectedDisbursement.voyage})
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">ACCOUNT OF PRINCIPAL (OWNER / CHARTERER)</span>
                  <span className="font-bold text-neutral-900 dark:text-white font-sans">
                    {selectedDisbursement.principalName}
                  </span>
                </div>
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="space-y-2">
                <span className="font-bold text-neutral-900 dark:text-white">Itemized Port Tariff & Disbursements</span>
                <table className="w-full text-left border border-neutral-200 dark:border-neutral-800">
                  <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-500 uppercase">
                    <tr>
                      <th className="py-2 px-3">Item #</th>
                      <th className="py-2 px-3">Tariff Head / Service Description</th>
                      <th className="py-2 px-3 text-right">Amount (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    <tr>
                      <td className="py-2 px-3">1</td>
                      <td className="py-2 px-3">Pilotage & Navigation Dues (Inward / Outward)</td>
                      <td className="py-2 px-3 text-right">${selectedDisbursement.pilotageDues.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">2</td>
                      <td className="py-2 px-3">Harbour Towage & Tugs Assistance</td>
                      <td className="py-2 px-3 text-right">${selectedDisbursement.towageAndTugs.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">3</td>
                      <td className="py-2 px-3">Port Berth Hire & Mooring Dues</td>
                      <td className="py-2 px-3 text-right">${selectedDisbursement.portBerthHire.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">4</td>
                      <td className="py-2 px-3">Customs Light Dues & Port Health Formalities</td>
                      <td className="py-2 px-3 text-right">${(selectedDisbursement.customsLightDues + selectedDisbursement.immigrationFormalities).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">5</td>
                      <td className="py-2 px-3">Stevedoring & Cargo Gear Supervision</td>
                      <td className="py-2 px-3 text-right">${selectedDisbursement.stevedoringOps.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">6</td>
                      <td className="py-2 px-3">Fresh Water Supply & Husbandry Provisions</td>
                      <td className="py-2 px-3 text-right">${selectedDisbursement.freshWaterProvision.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">7</td>
                      <td className="py-2 px-3 font-semibold">Shipping Agency Attendance Fee</td>
                      <td className="py-2 px-3 text-right font-semibold">${selectedDisbursement.agencyFee.toLocaleString()}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-neutral-50 dark:bg-neutral-800/80 font-bold border-t border-neutral-200 dark:border-neutral-800">
                      <td colSpan={2} className="py-2.5 px-3 text-right">TOTAL DISBURSEMENT (A)</td>
                      <td className="py-2.5 px-3 text-right">${selectedDisbursement.totalDisbursement.toLocaleString()} USD</td>
                    </tr>
                    <tr className="text-emerald-600 dark:text-emerald-400 font-bold">
                      <td colSpan={2} className="py-2 px-3 text-right">LESS: ADVANCE REMITTANCE RECEIVED (B)</td>
                      <td className="py-2 px-3 text-right">-${selectedDisbursement.advanceReceived.toLocaleString()} USD</td>
                    </tr>
                    <tr className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold">
                      <td colSpan={2} className="py-2.5 px-3 text-right">NET BALANCE DUE / (REFUNDABLE) (A - B)</td>
                      <td className="py-2.5 px-3 text-right">${selectedDisbursement.balanceDue.toLocaleString()} USD</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEBIT / CREDIT NOTE MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl max-w-xl w-full p-6 font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-900 dark:text-white" />
                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                  {selectedNote.type} — {selectedNote.noteNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-400">Issue Date:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{selectedNote.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Party / Entity:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{selectedNote.partyName} ({selectedNote.partyRole})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Reference Doc:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedNote.referenceDoc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Vessel / Voyage:</span>
                <span className="text-neutral-700 dark:text-neutral-300">{selectedNote.vesselVoyage}</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <span className="text-neutral-400 text-[10px] block">REASON / ADJUSTMENT DETAILS</span>
                <p className="text-neutral-800 dark:text-neutral-200 font-sans text-xs">{selectedNote.reason}</p>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold">
                <span>ADJUSTMENT AMOUNT:</span>
                <span className="text-base">${selectedNote.amount.toLocaleString()} {selectedNote.currency}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold cursor-pointer"
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
