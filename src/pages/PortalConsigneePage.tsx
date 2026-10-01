import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Ship,
  Box,
  FileCheck,
  AlertTriangle,
  Download,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const PortalConsigneePage: React.FC = () => {
  const { shipments, containers, setSelectedShipmentForDetail, setSelectedShipmentForBl } = useApp();

  const importShipments = shipments.filter(s => s.direction === 'Import');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            CONSIGNEE PORTAL
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            Inbound Cargo & Delivery Order (D/O) Desk
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
          Importer / Consignee Inbound Tracking
        </h1>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">
          Track inbound container arrivals, CBP customs exam holds, and download Delivery Orders.
        </p>
      </div>

      {/* Inbound Shipments Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden p-5 space-y-4">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
          Inbound Import Consignments ({importShipments.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px]">
                <th className="py-2.5 px-3">Shipment Ref</th>
                <th className="py-2.5 px-3">Shipper Origin</th>
                <th className="py-2.5 px-3">Vessel & Voyage</th>
                <th className="py-2.5 px-3">Discharge Port</th>
                <th className="py-2.5 px-3">ETA Destination</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {importShipments.map(s => (
                <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                    {s.shipmentNo}
                  </td>
                  <td className="py-3 px-3 font-sans text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                    {s.shipper}
                  </td>
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                    <div>{s.vesselName}</div>
                    <div className="text-[10px] text-neutral-400">Voy: {s.voyageNo}</div>
                  </td>
                  <td className="py-3 px-3">
                    {s.pod} ({s.podCode})
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white">
                    {s.eta}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'Customs Hold'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedShipmentForDetail(s)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline text-[11px]"
                    >
                      ETA Detail
                    </button>
                    <button
                      onClick={() => setSelectedShipmentForBl(s)}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-sans text-[11px] font-medium rounded"
                    >
                      Delivery Order
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
