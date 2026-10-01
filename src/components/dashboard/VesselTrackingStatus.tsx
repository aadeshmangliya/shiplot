import React, { useState } from 'react';
import { Vessel, VesselStatus } from '../../types/shipping';
import { ACTIVE_VESSELS } from '../../mock/shippingData';
import {
  Ship,
  Navigation,
  Compass,
  MapPin,
  Clock,
  Wind,
  Anchor,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface VesselTrackingStatusProps {
  onSelectVessel?: (vessel: Vessel) => void;
}

export const VesselTrackingStatus: React.FC<VesselTrackingStatusProps> = ({ onSelectVessel }) => {
  const [vessels, setVessels] = useState<Vessel[]>(ACTIVE_VESSELS);
  const [selectedVesselId, setSelectedVesselId] = useState<string>(ACTIVE_VESSELS[0].id);
  const [statusFilter, setStatusFilter] = useState<'All' | VesselStatus>('All');

  const selectedVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0];

  const filteredVessels = vessels.filter((v) => {
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: VesselStatus) => {
    switch (status) {
      case 'At Sea':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Approaching':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Berthed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Anchored':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Delayed':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-4">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              AIS TELEMETRY
            </span>
            <span className="text-xs text-neutral-400">· Real-Time Satellite Container Fleet Tracking</span>
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Active Vessel Tracking & Voyage Status
          </h2>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-mono">
          {(['All', 'At Sea', 'Berthed', 'Approaching', 'Anchored'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === st
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Vessel Fleet Directory on Left, Selected Vessel Live Telemetry on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {filteredVessels.map((v) => (
            <div
              key={v.id}
              onClick={() => {
                setSelectedVesselId(v.id);
                if (onSelectVessel) onSelectVessel(v);
              }}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all text-xs ${
                v.id === selectedVessel.id
                  ? 'border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-800/80 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {v.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {v.voyage}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    Carrier: {v.carrier} · IMO: {v.imo}
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(v.status)}`}>
                  {v.status}
                </span>
              </div>

              {/* Progress and Route */}
              <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {v.originPortCode} → {v.destinationPortCode}
                </span>
                <span className="text-neutral-500">
                  {v.currentSpeedKnots} kts · {v.progressPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Active Vessel Telemetry Display (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-950 text-white rounded-lg p-5 border border-neutral-800 flex flex-col justify-between space-y-4">
          <div>
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono tracking-tight text-white">
                    {selectedVessel.name}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    Flag: {selectedVessel.flag}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(selectedVessel.status)}`}>
                    {selectedVessel.status}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-mono mt-0.5">
                  Voyage: {selectedVessel.voyage} · Line: {selectedVessel.carrier} · MMSI: {selectedVessel.mmsi}
                </div>
              </div>

              <div className="text-right text-xs font-mono">
                <div className="text-neutral-400">Destination Arrival (ETA)</div>
                <div className="font-bold text-emerald-400">{selectedVessel.eta}</div>
              </div>
            </div>

            {/* Vessel Visual Corridor Position */}
            <div className="my-4 p-4 rounded bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Navigation className="w-3.5 h-3.5" />
                  CURRENT AIS LOCATION
                </span>
                <span>LAT {selectedVessel.lat}°N · LON {selectedVessel.lng}°E</span>
              </div>

              <div className="text-xs text-white font-medium">
                {selectedVessel.currentPortOrSea}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span>{selectedVessel.originPort} ({selectedVessel.originPortCode})</span>
                  <span>{selectedVessel.destinationPort} ({selectedVessel.destinationPortCode})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${selectedVessel.progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                  <span>ETD: {selectedVessel.etd}</span>
                  <span>Voyage Progress: {selectedVessel.progressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Vessel Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400 text-[10px] block">Vessel Speed</span>
                <span className="font-bold text-white text-sm">{selectedVessel.currentSpeedKnots} knots</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400 text-[10px] block">Heading Course</span>
                <span className="font-bold text-white text-sm">{selectedVessel.headingDegrees}° TRUE</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400 text-[10px] block">Capacity Stowed</span>
                <span className="font-bold text-white text-sm">
                  {selectedVessel.currentTeuLoad.toLocaleString()} TEU
                </span>
              </div>
              <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400 text-[10px] block">Sea Condition</span>
                <span className="font-bold text-white text-xs truncate block">{selectedVessel.weatherCondition.split('(')[0]}</span>
              </div>
            </div>
          </div>

          {/* Port Rotation sequence */}
          <div className="pt-3 border-t border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <Anchor className="w-3.5 h-3.5" />
              Scheduled Port Call Sequence
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              {selectedVessel.portRotation.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border ${
                    p.status === 'completed'
                      ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
                      : p.status === 'current'
                      ? 'bg-blue-950/60 border-blue-500/60 text-white font-semibold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="truncate font-bold">{p.locode}</div>
                  <div className="text-[10px] text-neutral-400 truncate">{p.port.split('(')[0]}</div>
                  <div className="text-[9px] text-neutral-500 mt-1">ETA: {p.eta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
