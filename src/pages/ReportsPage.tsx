import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Percent,
  DollarSign,
  Box,
  Boxes,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  Ship,
  Anchor,
  FileCheck2,
  FileText,
  Users2,
  Calendar,
  Layers,
  Printer
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    monthlyMetrics,
    currentCompany,
    vessels,
    portCalls,
    shipments,
    deliveryOrders,
    igms,
    egms,
    ledgerEntries,
    invoices,
    disbursementAccounts
  } = useApp();

  type ReportType =
    | 'vessel_call'
    | 'voyage'
    | 'bl_register'
    | 'do_register'
    | 'igm_register'
    | 'egm_register'
    | 'customer_ledger'
    | 'vendor_ledger'
    | 'freight_revenue'
    | 'agency_revenue'
    | 'voyage_profit'
    | 'monthly_summary';

  const [activeReport, setActiveReport] = useState<ReportType>('vessel_call');
  const [search, setSearch] = useState('');

  // Calculations for summary metrics
  const totalRev = monthlyMetrics.reduce((s, m) => s + m.revenueUsd, 0);
  const totalCost = monthlyMetrics.reduce((s, m) => s + m.freightCostUsd, 0);
  const grossProfit = totalRev - totalCost;
  const marginPercent = Math.round((grossProfit / totalRev) * 100);

  const reportRegisters = [
    { id: 'vessel_call', label: 'Vessel Call Register', icon: Anchor, category: 'Operations' },
    { id: 'voyage', label: 'Voyage Register', icon: Ship, category: 'Operations' },
    { id: 'bl_register', label: 'B/L Register', icon: FileText, category: 'Documentation' },
    { id: 'do_register', label: 'D.O. Register', icon: FileCheck2, category: 'Documentation' },
    { id: 'igm_register', label: 'IGM Manifest Register', icon: FileSpreadsheet, category: 'Customs' },
    { id: 'egm_register', label: 'EGM Manifest Register', icon: FileSpreadsheet, category: 'Customs' },
    { id: 'customer_ledger', label: 'Customer Ledger', icon: Users2, category: 'Finance' },
    { id: 'vendor_ledger', label: 'Vendor Ledger', icon: DollarSign, category: 'Finance' },
    { id: 'freight_revenue', label: 'Freight Revenue Report', icon: TrendingUp, category: 'Commercial' },
    { id: 'agency_revenue', label: 'Agency Revenue & PDA', icon: Layers, category: 'Commercial' },
    { id: 'voyage_profit', label: 'Profit by Voyage', icon: BarChart3, category: 'Commercial' },
    { id: 'monthly_summary', label: 'Monthly Business Summary', icon: Calendar, category: 'Executive' }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              OPERATIONAL & STATUTORY REGISTERS
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              SRS Section 10
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Shipping Registers & Throughput Intelligence
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Statutory vessel call logs, manifest filing registers, freight receivables, and voyage profit summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ register: activeReport, timestamp: new Date().toISOString() }));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `${activeReport}_register.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-mono font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV/JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Total B/Ls Issued</span>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {shipments.length} B/Ls
          </div>
          <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">Under {currentCompany.name}</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Active Vessel Calls</span>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {portCalls.length} Port Calls
          </div>
          <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">KPT, QICT & Regional Ports</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Delivery Orders (D.O.)</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {deliveryOrders.length} D.O.s
          </div>
          <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">Issued & surrendered</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Gross Freight Margin</span>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            ${(grossProfit / 1000).toFixed(0)}k ({marginPercent}%)
          </div>
          <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">Annual NVOCC spread</span>
        </div>
      </div>

      {/* Register Selector Grid */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Select Statutory Register / Report:
          </span>
          <span className="text-[11px] font-mono text-neutral-500">12 Registers Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {reportRegisters.map(reg => {
            const Icon = reg.icon;
            const isActive = activeReport === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => {
                  setActiveReport(reg.id as ReportType);
                  setSearch('');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-mono transition-all text-left cursor-pointer ${
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-bold shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{reg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={`Filter entries in ${reportRegisters.find(r => r.id === activeReport)?.label}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>
      </div>

      {/* REGISTER DISPLAY TABLES */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        {/* 1. VESSEL CALL REGISTER */}
        {activeReport === 'vessel_call' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">Call ID</th>
                  <th className="py-3 px-4">Vessel Name</th>
                  <th className="py-3 px-4">Voyage</th>
                  <th className="py-3 px-4">Port & Terminal</th>
                  <th className="py-3 px-4">Berth #</th>
                  <th className="py-3 px-4">ETA / ETB / ETD</th>
                  <th className="py-3 px-4">Principal / Line</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {portCalls
                  .filter(c => !search || c.vesselName.toLowerCase().includes(search.toLowerCase()) || c.callId.toLowerCase().includes(search.toLowerCase()))
                  .map(call => (
                    <tr key={call.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{call.callId}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">{call.vesselName}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{call.voyage}</td>
                      <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">{call.portName} ({call.terminalName})</td>
                      <td className="py-3 px-4 font-bold">{call.berthNo}</td>
                      <td className="py-3 px-4 text-[11px] text-neutral-500">
                        <div>ETA: {call.eta}</div>
                        <div>ETD: {call.etd}</div>
                      </td>
                      <td className="py-3 px-4 font-sans">{call.principalName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold">
                          {call.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. VOYAGE REGISTER */}
        {activeReport === 'voyage' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">Vessel</th>
                  <th className="py-3 px-4">Voyage #</th>
                  <th className="py-3 px-4">Origin Port</th>
                  <th className="py-3 px-4">Destination Port</th>
                  <th className="py-3 px-4">Departure (ETD)</th>
                  <th className="py-3 px-4">Arrival (ETA)</th>
                  <th className="py-3 px-4">Speed / Telemetry</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {vessels
                  .filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.voyage.toLowerCase().includes(search.toLowerCase()))
                  .map(v => (
                    <tr key={v.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{v.name}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">{v.voyage}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{v.originPort} ({v.originPortCode})</td>
                      <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">{v.destinationPort} ({v.destinationPortCode})</td>
                      <td className="py-3 px-4 text-neutral-500">{v.etd}</td>
                      <td className="py-3 px-4 text-neutral-500">{v.eta}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">{v.currentSpeedKnots} kts</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. B/L REGISTER */}
        {activeReport === 'bl_register' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">B/L Number</th>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Shipper</th>
                  <th className="py-3 px-4">Consignee</th>
                  <th className="py-3 px-4">POL → POD</th>
                  <th className="py-3 px-4">Vessel / Voyage</th>
                  <th className="py-3 px-4">Weight (KG)</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {shipments
                  .filter(s => !search || s.shipmentNo.toLowerCase().includes(search.toLowerCase()) || s.shipper.toLowerCase().includes(search.toLowerCase()) || s.consignee.toLowerCase().includes(search.toLowerCase()))
                  .map(shp => (
                    <tr key={shp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{shp.shipmentNo}</td>
                      <td className="py-3 px-4 text-neutral-500">{shp.bookingNo}</td>
                      <td className="py-3 px-4 font-sans text-neutral-800 dark:text-neutral-200 max-w-[180px] truncate">{shp.shipper}</td>
                      <td className="py-3 px-4 font-sans text-neutral-800 dark:text-neutral-200 max-w-[180px] truncate">{shp.consignee}</td>
                      <td className="py-3 px-4">{shp.pol} → {shp.pod}</td>
                      <td className="py-3 px-4 text-neutral-500">{shp.vesselName} ({shp.voyageNo})</td>
                      <td className="py-3 px-4 font-bold">{shp.weightKg.toLocaleString()} kg</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold">
                          {shp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. D.O. REGISTER */}
        {activeReport === 'do_register' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">D.O. Number</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Validity Date</th>
                  <th className="py-3 px-4">B/L Ref (MBL/HBL)</th>
                  <th className="py-3 px-4">Issued To (Agent)</th>
                  <th className="py-3 px-4">Consignee</th>
                  <th className="py-3 px-4">Containers Count</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {deliveryOrders
                  .filter(d => !search || d.doNumber.toLowerCase().includes(search.toLowerCase()) || d.consigneeName.toLowerCase().includes(search.toLowerCase()))
                  .map(d => (
                    <tr key={d.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{d.doNumber}</td>
                      <td className="py-3 px-4 text-neutral-500">{d.issueDate}</td>
                      <td className="py-3 px-4 font-bold text-rose-600">{d.validityDate}</td>
                      <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">{d.hblNumber}</td>
                      <td className="py-3 px-4 font-sans max-w-[200px] truncate">{d.issuedTo}</td>
                      <td className="py-3 px-4 font-sans max-w-[180px] truncate">{d.consigneeName}</td>
                      <td className="py-3 px-4 font-bold">{d.containers.length} Cntr(s)</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. IGM REGISTER */}
        {activeReport === 'igm_register' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">IGM Number</th>
                  <th className="py-3 px-4">Vessel / IMO</th>
                  <th className="py-3 px-4">Voyage</th>
                  <th className="py-3 px-4">Arrival Port & Terminal</th>
                  <th className="py-3 px-4">Filing Date</th>
                  <th className="py-3 px-4">Total B/Ls</th>
                  <th className="py-3 px-4">Total Weight (KG)</th>
                  <th className="py-3 px-4">WeBOC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {igms
                  .filter(i => !search || i.igmNumber.toLowerCase().includes(search.toLowerCase()) || i.vesselName.toLowerCase().includes(search.toLowerCase()))
                  .map(igm => (
                    <tr key={igm.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{igm.igmNumber}</td>
                      <td className="py-3 px-4 font-semibold">{igm.vesselName} ({igm.imoNumber})</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{igm.voyageNumber}</td>
                      <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">{igm.portOfArrival} ({igm.terminalName})</td>
                      <td className="py-3 px-4 text-neutral-500">{igm.filingDate}</td>
                      <td className="py-3 px-4 font-bold">{igm.totalBls}</td>
                      <td className="py-3 px-4 font-bold">{igm.totalGrossWeightKg.toLocaleString()} kg</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                          {igm.webocFilingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. EGM REGISTER */}
        {activeReport === 'egm_register' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">EGM Number</th>
                  <th className="py-3 px-4">Vessel / IMO</th>
                  <th className="py-3 px-4">Voyage</th>
                  <th className="py-3 px-4">Port of Departure</th>
                  <th className="py-3 px-4">Sailing Date</th>
                  <th className="py-3 px-4">Containers Stuffed</th>
                  <th className="py-3 px-4">Total Weight (KG)</th>
                  <th className="py-3 px-4">WeBOC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {egms
                  .filter(e => !search || e.egmNumber.toLowerCase().includes(search.toLowerCase()) || e.vesselName.toLowerCase().includes(search.toLowerCase()))
                  .map(egm => (
                    <tr key={egm.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{egm.egmNumber}</td>
                      <td className="py-3 px-4 font-semibold">{egm.vesselName} ({egm.imoNumber})</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{egm.voyageNumber}</td>
                      <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">{egm.portOfLoading}</td>
                      <td className="py-3 px-4 text-neutral-500">{egm.sailingDate}</td>
                      <td className="py-3 px-4 font-bold">{egm.totalContainers}</td>
                      <td className="py-3 px-4 font-bold">{egm.totalGrossWeightKg.toLocaleString()} kg</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                          {egm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. CUSTOMER LEDGER */}
        {activeReport === 'customer_ledger' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Voucher / Invoice #</th>
                  <th className="py-3 px-4">Particulars</th>
                  <th className="py-3 px-4 text-right">Debit ($)</th>
                  <th className="py-3 px-4 text-right">Credit ($)</th>
                  <th className="py-3 px-4 text-right">Balance ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {ledgerEntries
                  .filter(e => e.accountType === 'Asset' || e.accountType === 'Revenue')
                  .map(e => (
                    <tr key={e.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 text-neutral-500">{e.date}</td>
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white font-sans">{e.entityName || 'Trade Client'}</td>
                      <td className="py-3 px-4 font-mono">{e.voucherNo}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 max-w-[240px] truncate">{e.description}</td>
                      <td className="py-3 px-4 text-right font-bold">{e.debit > 0 ? `$${e.debit.toLocaleString()}` : '—'}</td>
                      <td className="py-3 px-4 text-right font-bold">{e.credit > 0 ? `$${e.credit.toLocaleString()}` : '—'}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">${e.runningBalance.toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. VENDOR LEDGER */}
        {activeReport === 'vendor_ledger' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Vendor / Line / Terminal</th>
                  <th className="py-3 px-4">Voucher #</th>
                  <th className="py-3 px-4">Narration</th>
                  <th className="py-3 px-4 text-right">Bill Amount ($)</th>
                  <th className="py-3 px-4 text-right">Payment ($)</th>
                  <th className="py-3 px-4 text-right">Outstanding ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {ledgerEntries
                  .filter(e => e.accountType === 'Expense' || e.accountType === 'Liability')
                  .map(e => (
                    <tr key={e.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 text-neutral-500">{e.date}</td>
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white font-sans">{e.entityName || 'Vendor'}</td>
                      <td className="py-3 px-4 font-mono">{e.voucherNo}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 max-w-[240px] truncate">{e.description}</td>
                      <td className="py-3 px-4 text-right font-bold">{e.debit > 0 ? `$${e.debit.toLocaleString()}` : '—'}</td>
                      <td className="py-3 px-4 text-right font-bold text-rose-600">{e.credit > 0 ? `$${e.credit.toLocaleString()}` : '—'}</td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white">${e.runningBalance.toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 9. FREIGHT REVENUE REPORT */}
        {activeReport === 'freight_revenue' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Shipment Ref</th>
                  <th className="py-3 px-4">Billed Party</th>
                  <th className="py-3 px-4">Freight Type</th>
                  <th className="py-3 px-4 text-right">Subtotal ($)</th>
                  <th className="py-3 px-4 text-right">Tax / Surcharge</th>
                  <th className="py-3 px-4 text-right">Total Net Revenue</th>
                  <th className="py-3 px-4">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{inv.invoiceNo}</td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{inv.shipmentNo}</td>
                    <td className="py-3 px-4 font-sans">{inv.billTo}</td>
                    <td className="py-3 px-4">{inv.type}</td>
                    <td className="py-3 px-4 text-right">${inv.subtotal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">${inv.tax.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">${inv.total.toLocaleString()} USD</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 10. AGENCY REVENUE & PDA */}
        {activeReport === 'agency_revenue' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">Disbursement Account</th>
                  <th className="py-3 px-4">Principal (Owner/Charterer)</th>
                  <th className="py-3 px-4">Vessel / Port</th>
                  <th className="py-3 px-4 text-right">Agency Fee (Revenue)</th>
                  <th className="py-3 px-4 text-right">Total Port Disbursements</th>
                  <th className="py-3 px-4 text-right">Advance Received</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {disbursementAccounts.map(d => (
                  <tr key={d.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{d.accountNo} ({d.type})</td>
                    <td className="py-3 px-4 font-sans font-semibold">{d.principalName}</td>
                    <td className="py-3 px-4">{d.vesselName} ({d.portName})</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">${d.agencyFee.toLocaleString()} USD</td>
                    <td className="py-3 px-4 text-right">${d.totalDisbursement.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">${d.advanceReceived.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white">${d.balanceDue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 11. PROFIT BY VOYAGE */}
        {activeReport === 'voyage_profit' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">Voyage Code</th>
                  <th className="py-3 px-4">Vessel Name</th>
                  <th className="py-3 px-4">Corridor (POL → POD)</th>
                  <th className="py-3 px-4 text-right">Gross Freight Revenue</th>
                  <th className="py-3 px-4 text-right">Carrier Slot Cost</th>
                  <th className="py-3 px-4 text-right">Port & Husbandry</th>
                  <th className="py-3 px-4 text-right">Net Profit ($)</th>
                  <th className="py-3 px-4 text-right">Net Margin (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {[
                  { voyage: 'MS-2640W', vessel: 'MSC Oscar', corridor: 'USLAX → PKBQM', rev: 142000, cost: 98000, port: 12500 },
                  { voyage: 'MK-1892E', vessel: 'Maersk Mc-Kinney Moller', corridor: 'CNSHA → PKKHI', rev: 188000, cost: 132000, port: 15200 },
                  { voyage: 'CA-9920S', vessel: 'CMA CGM Palais Royal', corridor: 'SGSIN → USNYC', rev: 165000, cost: 114000, port: 14000 },
                  { voyage: 'HL-4412W', vessel: 'Hapag Al Jmeliyah', corridor: 'DEHAM → USLAX', rev: 124000, cost: 89000, port: 10800 }
                ].map((v, idx) => {
                  const net = v.rev - (v.cost + v.port);
                  const margin = Math.round((net / v.rev) * 100);
                  return (
                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{v.voyage}</td>
                      <td className="py-3 px-4 font-semibold">{v.vessel}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{v.corridor}</td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white">${v.rev.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-neutral-500">${v.cost.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-neutral-500">${v.port.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">${net.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 12. MONTHLY BUSINESS SUMMARY */}
        {activeReport === 'monthly_summary' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">FCL Volume (TEU)</th>
                  <th className="py-3 px-4">LCL Volume (CBM)</th>
                  <th className="py-3 px-4">Direction Split</th>
                  <th className="py-3 px-4 text-right">Revenue (USD)</th>
                  <th className="py-3 px-4 text-right">Carrier Cost (USD)</th>
                  <th className="py-3 px-4 text-right">Gross Margin</th>
                  <th className="py-3 px-4 text-right">Schedule Reliability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {monthlyMetrics.map((m, idx) => {
                  const profit = m.revenueUsd - m.freightCostUsd;
                  const margin = Math.round((profit / m.revenueUsd) * 100);
                  return (
                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">{m.month} 2026</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">{m.fclTeu} TEU</td>
                      <td className="py-3 px-4 text-purple-600">{m.lclCbm} CBM</td>
                      <td className="py-3 px-4 text-neutral-600">{m.exportTeu} Exp / {m.importTeu} Imp</td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white">${m.revenueUsd.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-neutral-500">${m.freightCostUsd.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">${profit.toLocaleString()} ({margin}%)</td>
                      <td className="py-3 px-4 text-right font-bold">{m.onTimePercent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
