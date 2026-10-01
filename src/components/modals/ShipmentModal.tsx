import React from 'react';
import { ShipmentItem } from '../../types/shipping';
import {
  X,
  Ship,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  CircleDot,
  Container,
  Package,
} from 'lucide-react';

interface ShipmentModalProps {
  shipment: ShipmentItem;
  onClose: () => void;
  onOpenBl?: () => void;
}

export const ShipmentModal: React.FC<ShipmentModalProps> = ({
  shipment,
  onClose,
  onOpenBl,
}) => {
  const timelineStages = [
    { label: 'Booking', done: true, time: '2026-09-02' },
    { label: 'Documentation', done: true, time: '2026-09-07' },
    { label: 'Cargo Received', done: true, time: '2026-09-09' },
    { label: 'Gate In', done: true, time: '2026-09-12' },
    { label: 'Loaded', done: true, time: '2026-09-14' },
    { label: 'Vessel Departed', done: true, time: '2026-09-15' },
    { label: 'In Transit', done: true, time: 'Current' },
    { label: 'Vessel Arrived', done: false, time: shipment.eta },
    { label: 'Customs Cleared', done: false, time: 'Pending' },
    { label: 'Discharged', done: false, time: 'Pending' },
    { label: 'Delivered', done: false, time: 'Pending' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-base text-neutral-900 dark:text-white">
              {shipment.shipmentNo}
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              {shipment.type}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              {shipment.direction}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Milestone timeline */}
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-mono">
              Shipment Lifecycle Milestones
            </div>
            <div className="flex items-center gap-1 overflow-x-auto py-2">
              {timelineStages.map((st, i) => (
                <div key={i} className="flex items-center shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono ${
                      st.label === 'In Transit'
                        ? 'bg-blue-600 text-white font-bold'
                        : st.done
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        : 'text-neutral-400'
                    }`}
                  >
                    {st.done ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    ) : st.label === 'In Transit' ? (
                      <CircleDot className="w-3 h-3 text-white shrink-0 animate-pulse" />
                    ) : (
                      <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                    )}
                    <span>{st.label}</span>
                  </div>
                  {i < timelineStages.length - 1 && (
                    <div className="w-2.5 h-0.5 bg-neutral-200 dark:bg-neutral-800 mx-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Route Card */}
          <div className="p-4 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-neutral-400 text-[11px] block font-mono">Port of Loading (POL)</span>
              <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block font-mono">
                {shipment.pol} ({shipment.polCode})
              </span>
              <span className="text-neutral-500 text-[11px] font-mono">ETD: {shipment.etd}</span>
            </div>

            <div>
              <span className="text-neutral-400 text-[11px] block font-mono">Port of Discharge (POD)</span>
              <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block font-mono">
                {shipment.pod} ({shipment.podCode})
              </span>
              <span className="text-neutral-500 text-[11px] font-mono">ETA: {shipment.eta}</span>
            </div>

            <div>
              <span className="text-neutral-400 text-[11px] block font-mono">Ocean Liner & Vessel</span>
              <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block">
                {shipment.vesselName}
              </span>
              <span className="text-neutral-500 text-[11px] font-mono">
                Voyage: {shipment.voyageNo} · {shipment.carrier}
              </span>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded border border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block font-mono">
                Shipper / Exporter
              </span>
              <div className="font-bold text-neutral-900 dark:text-white mt-1">
                {shipment.shipper}
              </div>
            </div>

            <div className="p-3.5 rounded border border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block font-mono">
                Consignee / Importer
              </span>
              <div className="font-bold text-neutral-900 dark:text-white mt-1">
                {shipment.consignee}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
          {onOpenBl ? (
            <button
              onClick={onOpenBl}
              className="px-3.5 py-1.5 text-xs font-medium rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90"
            >
              Generate Bill of Lading (B/L)
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200"
          >
            Close File
          </button>
        </div>
      </div>
    </div>
  );
};
