import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Ship,
  Box,
  Boxes,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Anchor,
  Navigation,
  Compass,
  CheckCircle2,
  CalendarCheck,
  FileCheck2,
  FileSpreadsheet,
  Clock,
  ArrowDownLeft,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const {
    currentCompany,
    shipments,
    containers,
    vessels,
    bookings,
    invoices,
    monthlyMetrics,
    portCalls,
    deliveryOrders,
    igms,
    egms,
    setSelectedShipmentForDetail,
    setSelectedShipmentForBl,
    setIsNewBookingOpen
  } = useApp();

  const navigate = useNavigate();

  const totalShipments = shipments.length;
  const fclCount = shipments.filter(s => s.type === 'FCL').length;
  const lclCount = shipments.filter(s => s.type === 'LCL').length;
  const criticalDemurrage = containers.filter(c => c.demurrageRisk === 'critical').length;
  const warningDemurrage = containers.filter(c => c.demurrageRisk === 'warning').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending Review').length;
  const unpaidTotal = invoices
    .filter(i => i.paymentStatus !== 'Paid')
    .reduce((sum, i) => sum + i.total, 0);

  // Agency & Operations Widgets (SRS Section 9)
  const todayArrivals = portCalls.filter(p => p.status === 'Berthed' || p.status === 'At Anchorage');
  const todayDepartures = portCalls.filter(p => p.status === 'Operations Completed' || p.status === 'Sailed');
  const pendingDoCount = deliveryOrders.filter(d => d.status === 'Issued').length;
  const pendingIgmCount = igms.filter(i => i.webocFilingStatus === 'Draft' || i.webocFilingStatus === 'Submitted').length;
  const pendingEgmCount = egms.filter(e => e.status === 'Draft' || e.status === 'Filed').length;
  const overdueInvoicesCount = invoices.filter(i => i.paymentStatus === 'Overdue').length;

  const kpis = [
    {
      label: 'Active Consignments',
      value: totalShipments,
      sub: `${fclCount} FCL · ${lclCount} LCL ocean routes`,
      icon: Ship,
      color: 'text-blue-600 dark:text-blue-400',
      action: () => navigate('/shipments')
    },
    {
      label: 'Demurrage Alerts',
      value: criticalDemurrage + warningDemurrage,
      sub: `${criticalDemurrage} critical · free time expiring`,
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      badge: criticalDemurrage > 0 ? 'CRITICAL' : undefined,
      action: () => navigate('/fcl')
    },
    {
      label: 'Pending Bookings',
      value: pendingBookings,
      sub: 'Awaiting carrier approval & slot allocation',
      icon: CalendarCheck,
      color: 'text-amber-600 dark:text-amber-400',
      action: () => navigate('/bookings')
    },
    {
      label: 'Outstanding Freight',
      value: `$${unpaidTotal.toLocaleString()}`,
      sub: `${invoices.filter(i => i.paymentStatus !== 'Paid').length} uncollected invoices`,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      action: () => navigate('/finance')
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Tenant Banner if Suspended */}
      {currentCompany.status === 'Suspended' && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>
              <strong>Tenant Suspended:</strong> Billing payment failed for {currentCompany.name}. Access is in read-only mode.
            </span>
          </div>
          <button
            onClick={() => navigate('/platform-admin')}
            className="px-2.5 py-1 rounded bg-rose-600 text-white font-semibold text-[11px]"
          >
            Resolve in Platform Admin
          </button>
        </div>
      )}

      {/* Header Overview Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              NVOCC CARRIER OPERATING SYSTEM
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              FMC #{currentCompany.registrationNo}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1.5">
            {currentCompany.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Global ocean freight management, container demurrage tracking, and automated FMC Bill of Lading generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            + Create Booking Request
          </button>
          <button
            onClick={() => navigate('/bill-of-lading')}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Generate Ocean B/L
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.action}
              className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 font-sans">
                  {kpi.label}
                </span>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 group-hover:scale-105 transition-transform">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white font-mono">
                  {kpi.value}
                </span>
                {kpi.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {kpi.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 truncate font-mono">
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* SRS Section 9: Shipping Agency, Port Calls & Customs Compliance Widgets */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-neutral-900 dark:text-white" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Port Operations, Manifests & Revenue Watch
              </h3>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
              Real-time vessel arrivals/departures, delivery orders, customs manifest queues, and collection alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/agency')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
            >
              Port Call Management →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          {/* Today's Vessel Arrivals */}
          <div
            onClick={() => navigate('/agency')}
            className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-[10px]">ARRIVALS TODAY</span>
              <Anchor className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {todayArrivals.length} Call(s)
            </div>
            <div className="text-[10px] text-neutral-500 truncate mt-0.5">
              {todayArrivals[0]?.vesselName || 'No incoming today'}
            </div>
          </div>

          {/* Today's Vessel Departures */}
          <div
            onClick={() => navigate('/agency')}
            className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-[10px]">DEPARTURES</span>
              <Ship className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {todayDepartures.length} Vessel(s)
            </div>
            <div className="text-[10px] text-neutral-500 truncate mt-0.5">
              {todayDepartures[0]?.vesselName || 'All berthed / ready'}
            </div>
          </div>

          {/* Pending Delivery Orders */}
          <div
            onClick={() => navigate('/delivery-order')}
            className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-[10px]">PENDING D.O.</span>
              <FileCheck2 className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {pendingDoCount} Active
            </div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
              Manage D.O. →
            </div>
          </div>

          {/* Pending IGM Manifests */}
          <div
            onClick={() => navigate('/manifest')}
            className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-[10px]">PENDING IGM</span>
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {pendingIgmCount} Inward
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
              WeBOC Queue →
            </div>
          </div>

          {/* Pending EGM Manifests */}
          <div
            onClick={() => navigate('/manifest')}
            className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-[10px]">PENDING EGM</span>
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {pendingEgmCount} Outward
            </div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
              Customs Filing →
            </div>
          </div>

          {/* Overdue Customer Invoices */}
          <div
            onClick={() => navigate('/finance')}
            className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-[10px]">OVERDUE BILLS</span>
              <DollarSign className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {overdueInvoicesCount} Invoices
            </div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">
              Review Ledger →
            </div>
          </div>
        </div>
      </div>

      {/* Volume Chart & Demurrage Risk Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Volume Bars */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Monthly Throughput (TEUs & CBM)
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                Full Container Load (FCL TEU) vs Less than Container Load (LCL Groupage CBM)
              </p>
            </div>
            <button
              onClick={() => navigate('/reports')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
            >
              View Full Analytics →
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {monthlyMetrics.slice(-6).map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{m.month} 2026</span>
                  <div className="flex gap-4 text-[11px]">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{m.fclTeu} TEU</span>
                    <span className="text-purple-600 dark:text-purple-400">{m.lclCbm} CBM</span>
                    <span className="text-neutral-400">${(m.revenueUsd / 1000).toFixed(0)}k Rev</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex overflow-hidden">
                  <div
                    style={{ width: `${(m.fclTeu / 1600) * 100}%` }}
                    className="bg-blue-600 dark:bg-blue-500"
                    title={`${m.fclTeu} FCL TEUs`}
                  />
                  <div
                    style={{ width: `${(m.lclCbm / 6000) * 30}%` }}
                    className="bg-purple-500 dark:bg-purple-400"
                    title={`${m.lclCbm} LCL CBM`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demurrage Tracker Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Demurrage Watch
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                Free-time expiration & per-diem risk
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
              {containers.length} Boxes
            </span>
          </div>

          <div className="space-y-3">
            {containers.map(c => {
              const isCrit = c.demurrageRisk === 'critical';
              const isWarn = c.demurrageRisk === 'warning';
              return (
                <div
                  key={c.id}
                  onClick={() => navigate('/fcl')}
                  className={`p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                    isCrit
                      ? 'border-rose-300 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/30'
                      : isWarn
                      ? 'border-amber-300 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-neutral-900 dark:text-white">
                      {c.containerNo}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isCrit
                          ? 'bg-rose-500 text-white'
                          : isWarn
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {c.daysRemaining} days left
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono mt-1.5">
                    <span>{c.type} · Seal: {c.sealNo}</span>
                    <span>{c.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/fcl')}
            className="w-full py-2 text-center rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Manage Container Demurrage →
          </button>
        </div>
      </div>

      {/* Live Ocean Vessels Snapshot */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Live Ocean Fleet & AIS Telemetry
            </h3>
          </div>
          <button
            onClick={() => navigate('/vessels')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
          >
            Full AIS Map & Telemetry →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vessels.slice(0, 3).map(v => (
            <div
              key={v.id}
              onClick={() => navigate('/vessels')}
              className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-neutral-900 dark:text-white">
                  {v.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {v.carrier}
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {v.originPortCode} → {v.destinationPortCode} · Voyage: {v.voyage}
              </div>
              <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-neutral-200 dark:border-neutral-700/60">
                <span className="text-neutral-400">ETA: {v.eta.split(' ')[0]}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {v.currentSpeedKnots} kts · {v.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Shipments Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Recent Consignments & Bills of Lading
            </h3>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
              Ocean shipments under {currentCompany.name}
            </p>
          </div>
          <button
            onClick={() => navigate('/shipments')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
          >
            All Shipments ({shipments.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px]">
                <th className="py-2.5 px-3">Shipment Ref</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Shipper / Consignee</th>
                <th className="py-2.5 px-3">Vessel / Voyage</th>
                <th className="py-2.5 px-3">Route (POL → POD)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {shipments.slice(0, 5).map(s => (
                <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                    {s.shipmentNo}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px]">
                      {s.type} · {s.direction}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-[200px] truncate font-sans text-neutral-700 dark:text-neutral-300">
                    <div className="font-semibold">{s.shipper}</div>
                    <div className="text-[10px] text-neutral-400 truncate">to {s.consignee}</div>
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                    <div>{s.vesselName}</div>
                    <div className="text-[10px] text-neutral-400">Voy: {s.voyageNo}</div>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="font-mono font-semibold">{s.polCode}</span> → <span className="font-mono font-semibold">{s.podCode}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedShipmentForDetail(s)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline text-[11px]"
                    >
                      Lifecycle
                    </button>
                    <button
                      onClick={() => setSelectedShipmentForBl(s)}
                      className="px-2 py-1 rounded bg-blue-600 text-white font-sans text-[11px] font-medium hover:bg-blue-500"
                    >
                      B/L
                    </button>
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
