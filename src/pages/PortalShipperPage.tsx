import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Ship,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  PackageCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export const PortalShipperPage: React.FC = () => {
  const { shipments, setIsNewBookingOpen, setSelectedShipmentForBl, setSelectedShipmentForDetail } = useApp();

  const exportShipments = shipments.filter(s => s.direction === 'Export');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Portal Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              CLIENT PORTAL
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Exporter / Shipper Workspace
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Shipper Outbound Freight Portal
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Submit export booking requests, upload commercial invoices, and monitor vessel departures.
          </p>
        </div>

        <button
          onClick={() => setIsNewBookingOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Booking Request</span>
        </button>
      </div>

      {/* Outbound Shipments Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden p-5 space-y-4">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
          Active Outbound Export Consignments ({exportShipments.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px]">
                <th className="py-2.5 px-3">Shipment Ref</th>
                <th className="py-2.5 px-3">Consignee</th>
                <th className="py-2.5 px-3">Vessel & Carrier</th>
                <th className="py-2.5 px-3">Route (POL → POD)</th>
                <th className="py-2.5 px-3">ETD Departure</th>
                <th className="py-2.5 px-3">Cargo Spec</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {exportShipments.map(s => (
                <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                    {s.shipmentNo}
                  </td>
                  <td className="py-3 px-3 font-sans text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                    {s.consignee}
                  </td>
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                    <div>{s.vesselName}</div>
                    <div className="text-[10px] text-neutral-400">{s.carrier}</div>
                  </td>
                  <td className="py-3 px-3">
                    {s.polCode} → {s.podCode}
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                    {s.etd}
                  </td>
                  <td className="py-3 px-3">
                    {s.type} ({s.weightKg.toLocaleString()} kg)
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedShipmentForDetail(s)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline text-[11px]"
                    >
                      Milestones
                    </button>
                    <button
                      onClick={() => setSelectedShipmentForBl(s)}
                      className="px-2.5 py-1 bg-blue-600 text-white font-sans text-[11px] font-medium rounded hover:bg-blue-500"
                    >
                      View B/L
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
