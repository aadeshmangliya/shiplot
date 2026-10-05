import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Warehouse,
  Plus,
  ArrowRight,
  Package,
  Layers,
  FileCheck2,
  Scale,
  X
} from 'lucide-react';
import { LclBookingForm } from '../components/forms/LclBookingForm';

export const LclPage: React.FC = () => {
  const { shipments, setSelectedShipmentForBl, setSelectedShipmentForDetail } = useApp();
  const [selectedHub, setSelectedHub] = useState('All');
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const lclShipments = shipments.filter(s => s.type === 'LCL');

  const cfsDepots = [
    {
      id: 'cfs_01',
      name: 'Pacific Crest Pier 400 CFS Packing Facility',
      locode: 'USLAX-CFS1',
      city: 'Los Angeles, CA',
      capacityCbm: 14500,
      currentUtilization: '74%',
      activeGroupageLots: 8
    },
    {
      id: 'cfs_02',
      name: 'Waigaoqiao Ocean Groupage Depot #4',
      locode: 'CNSHA-CFS4',
      city: 'Shanghai, China',
      capacityCbm: 22000,
      currentUtilization: '82%',
      activeGroupageLots: 14
    },
    {
      id: 'cfs_03',
      name: 'Keppel Distripark CFS Ocean Consolidation Hub',
      locode: 'SGSIN-CFS2',
      city: 'Singapore',
      capacityCbm: 18500,
      currentUtilization: '68%',
      activeGroupageLots: 9
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              CFS CONSOLIDATION & GROUPAGE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              LCL / Co-Loading Desk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            LCL Groupage & CFS Packing Depots
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage multi-shipper cargo groupage, Master B/L stuffing, and Container Freight Station de-consolidation
          </p>
        </div>

        <button
          onClick={() => setIsBookingFormOpen(!isBookingFormOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer ${
            isBookingFormOpen
              ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
              : 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950'
          }`}
        >
          {isBookingFormOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Booking Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>+ New LCL Booking</span>
            </>
          )}
        </button>
      </div>

      {/* On-Page Inline 5-Tab Booking Form (No Popup) */}
      {isBookingFormOpen && (
        <LclBookingForm
          onClose={() => setIsBookingFormOpen(false)}
        />
      )}

      {/* CFS Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cfsDepots.map(depot => (
          <div
            key={depot.id}
            className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Warehouse className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300">
                {depot.locode}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {depot.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">{depot.city}</p>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-400">Capacity CBM</span>
                <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                  {depot.capacityCbm.toLocaleString()} CBM
                </div>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400">Utilization</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {depot.currentUtilization}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LCL Cargo Consolidations Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Active LCL Consignments & House B/Ls
            </h3>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
              Less-than-container-load cargo stuffed into shared 40HC ocean containers
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
            {lclShipments.length} Active LCL Consignments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px]">
                <th className="py-2.5 px-3">House B/L Ref</th>
                <th className="py-2.5 px-3">Shipper / Exporter</th>
                <th className="py-2.5 px-3">Consignee</th>
                <th className="py-2.5 px-3">Route (POL → POD)</th>
                <th className="py-2.5 px-3">Volume (CBM)</th>
                <th className="py-2.5 px-3">Weight (KG)</th>
                <th className="py-2.5 px-3">Master Vessel</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {lclShipments.map(s => (
                <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                    {s.shipmentNo}
                  </td>
                  <td className="py-3 px-3 font-sans max-w-[180px] truncate text-neutral-800 dark:text-neutral-200 font-medium">
                    {s.shipper}
                  </td>
                  <td className="py-3 px-3 font-sans max-w-[180px] truncate text-neutral-600 dark:text-neutral-400">
                    {s.consignee}
                  </td>
                  <td className="py-3 px-3">
                    {s.polCode} → {s.podCode}
                  </td>
                  <td className="py-3 px-3 font-bold text-purple-600 dark:text-purple-400">
                    {s.cbmVolume || 11.2} CBM
                  </td>
                  <td className="py-3 px-3">
                    {s.weightKg.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                    {s.vesselName} ({s.voyageNo})
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedShipmentForDetail(s)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline text-[11px]"
                    >
                      CFS Lot
                    </button>
                    <button
                      onClick={() => setSelectedShipmentForBl(s)}
                      className="px-2.5 py-1 rounded bg-blue-600 text-white font-sans text-[11px] font-medium hover:bg-blue-500"
                    >
                      House B/L
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
