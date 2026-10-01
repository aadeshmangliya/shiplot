import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  ShieldCheck,
  Printer,
  Download,
  Search,
  CheckCircle,
  Ship,
  FileCheck
} from 'lucide-react';

export const BillOfLadingPage: React.FC = () => {
  const { shipments, setSelectedShipmentForBl, currentCompany } = useApp();
  const [search, setSearch] = useState('');

  const filtered = shipments.filter(s => {
    if (search) {
      const q = search.toLowerCase();
      return (
        s.shipmentNo.toLowerCase().includes(q) ||
        s.bookingNo.toLowerCase().includes(q) ||
        s.shipper.toLowerCase().includes(q) ||
        s.consignee.toLowerCase().includes(q)
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
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              FMC COMPLIANT DOCUMENTATION
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Ocean Negotiable B/L Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Ocean Bill of Lading (B/L) Generator & Archive
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Issue House Bills of Lading (HBL) and Master Bills (MBL) certified under FMC License #{currentCompany.registrationNo}
          </p>
        </div>
      </div>

      {/* FMC Compliance Banner */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <div className="font-bold text-blue-900 dark:text-blue-200">
              Federal Maritime Commission (FMC) Tariff Rate & Negotiable B/L Ready
            </div>
            <div className="text-[11px] text-blue-700 dark:text-blue-300 font-sans mt-0.5">
              Includes electronic transmission to ocean carriers (MSC, Maersk, CMA CGM) via EDIFACT 304 / INTTRA.
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search B/L by shipment ref, booking no, shipper or consignee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>
      </div>

      {/* Shipments Ready for B/L */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div
            key={s.id}
            className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                    HBL-{s.shipmentNo.replace('SHP-', '')}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Shipper:</span>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{s.shipper}</div>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Consignee:</span>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{s.consignee}</div>
                </div>
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-sans">Route:</span>
                    <div className="font-medium text-neutral-700 dark:text-neutral-300">{s.polCode} → {s.podCode}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-sans">Vessel / Voy:</span>
                    <div className="font-medium text-neutral-700 dark:text-neutral-300 truncate">{s.vesselName}</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedShipmentForBl(s)}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Preview & Print Ocean B/L</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
