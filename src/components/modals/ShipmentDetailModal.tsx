import React from 'react';
import { Shipment } from '../../types';
import { X, Ship, FileText, CheckCircle2, Clock, Anchor, MapPin, Box, ArrowRight } from 'lucide-react';

interface Props {
  shipment: Shipment;
  onClose: () => void;
  onOpenBl: () => void;
}

export const ShipmentDetailModal: React.FC<Props> = ({ shipment, onClose, onOpenBl }) => {
  const milestones = [
    { label: 'Booking Confirmed', done: true, date: '2026-09-02' },
    { label: 'Documentation Approved', done: true, date: '2026-09-07' },
    { label: 'Cargo Received at CFS', done: true, date: '2026-09-09' },
    { label: 'Terminal Gate In', done: true, date: '2026-09-12' },
    { label: 'Container Loaded', done: true, date: '2026-09-14' },
    { label: 'Vessel Departed', done: true, date: shipment.etd },
    { label: 'Ocean Transit', done: true, date: 'In Progress' },
    { label: 'Arrival at Destination', done: shipment.status === 'Discharged' || shipment.status === 'Delivered', date: shipment.eta },
    { label: 'Customs Clearance', done: shipment.status === 'Delivered', date: 'Pending' },
    { label: 'Final Delivery Order', done: shipment.status === 'Delivered', date: 'Pending' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 bg-white dark:bg-neutral-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-neutral-900 dark:text-white font-mono">
                  {shipment.shipmentNo}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {shipment.type} · {shipment.direction}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {shipment.status}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 font-sans">
                Carrier: {shipment.carrier} · Vessel: {shipment.vesselName} (Voyage {shipment.voyageNo})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Route Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[11px] mb-1">
                <Anchor className="w-3.5 h-3.5 text-blue-500" />
                <span>Port of Loading (POL)</span>
              </div>
              <div className="font-bold text-sm text-neutral-900 dark:text-white">
                {shipment.pol} ({shipment.polCode})
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">ETD: {shipment.etd}</div>
              <div className="mt-2 text-neutral-700 dark:text-neutral-300">
                <strong className="text-neutral-900 dark:text-white">Shipper:</strong> {shipment.shipper}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[11px] mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Port of Discharge (POD)</span>
              </div>
              <div className="font-bold text-sm text-neutral-900 dark:text-white">
                {shipment.pod} ({shipment.podCode})
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">ETA: {shipment.eta}</div>
              <div className="mt-2 text-neutral-700 dark:text-neutral-300">
                <strong className="text-neutral-900 dark:text-white">Consignee:</strong> {shipment.consignee}
              </div>
            </div>
          </div>

          {/* Cargo & Containers summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-[10px] text-neutral-400 font-mono uppercase">Containers</span>
              <div className="font-bold text-base text-neutral-900 dark:text-white mt-1">
                {shipment.containersCount} Unit(s)
              </div>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-[10px] text-neutral-400 font-mono uppercase">Gross Weight</span>
              <div className="font-bold text-base text-neutral-900 dark:text-white mt-1">
                {shipment.weightKg.toLocaleString()} kg
              </div>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-[10px] text-neutral-400 font-mono uppercase">Volume</span>
              <div className="font-bold text-base text-neutral-900 dark:text-white mt-1">
                {shipment.cbmVolume ? `${shipment.cbmVolume} CBM` : 'Full Box'}
              </div>
            </div>
          </div>

          {/* Lifecycle Milestones */}
          <div>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-3">
              Shipment Lifecycle & Milestones
            </h4>
            <div className="space-y-2 border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 ml-2">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative flex items-center justify-between py-1">
                  <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 bg-white dark:bg-neutral-900 ${
                    m.done ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-400'
                  }`} />
                  <div className="flex items-center gap-2">
                    <span className={m.done ? 'font-medium text-neutral-900 dark:text-white' : 'text-neutral-400'}>
                      {m.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {m.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50">
          <button
            onClick={onOpenBl}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Generate / View Ocean Bill of Lading (B/L)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
