import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vessel } from '../types';
import {
  Compass,
  Navigation,
  Anchor,
  Clock,
  MapPin,
  Wind,
  CheckCircle2,
  AlertCircle,
  Ship,
  Search
} from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const { vessels, shipments, setSelectedShipmentForDetail } = useApp();
  const [selectedVesselId, setSelectedVesselId] = useState(vessels[0].id);
  const [search, setSearch] = useState('');

  const currentVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];
  const relatedShipments = shipments.filter(s => s.vesselName.toLowerCase() === currentVessel.name.toLowerCase());

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              SATELLITE AIS CORRIDOR
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Live Marine Telemetry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            AIS Live Vessel Tracking & Ocean Fleet
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Real-time coordinates, nautical speed knots, port rotation schedules, and weather telemetry
          </p>
        </div>
      </div>

      {/* Main Visualizer + Vessel Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Vessel Selector List */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
            Active Container Fleet ({vessels.length})
          </div>

          <div className="space-y-2">
            {vessels.map(v => {
              const isSelected = v.id === currentVessel.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVesselId(v.id)}
                  className={`p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/40 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {v.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                      {v.carrier}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    {v.originPortCode} → {v.destinationPortCode} · {v.voyage}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400">
                    <span>{v.status}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {v.currentSpeedKnots} kts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Vessel Detail & Port Rotation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Telemetry Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                    {currentVessel.name}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    IMO: {currentVessel.imo}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {currentVessel.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  MMSI: {currentVessel.mmsi} · Flag: {currentVessel.flag} · Carrier: {currentVessel.carrier} ({currentVessel.carrierCode})
                </p>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="text-neutral-400">ETA Destination</span>
                <div className="font-bold text-neutral-900 dark:text-white text-sm">
                  {currentVessel.eta}
                </div>
              </div>
            </div>

            {/* Vessel Corridor Radar / Telemetry stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400">Coordinates</span>
                <div className="font-bold text-neutral-900 dark:text-white mt-1">
                  {currentVessel.lat.toFixed(2)}°N, {currentVessel.lng.toFixed(2)}°E
                </div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400">Current Speed</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {currentVessel.currentSpeedKnots} kts (HDG {currentVessel.headingDegrees}°)
                </div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400">Capacity & Load</span>
                <div className="font-bold text-neutral-900 dark:text-white mt-1">
                  {currentVessel.currentTeuLoad.toLocaleString()} / {currentVessel.capacityTeu.toLocaleString()} TEU
                </div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400">Weather & Sea State</span>
                <div className="font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                  {currentVessel.weatherCondition}
                </div>
              </div>
            </div>

            {/* Route Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-500 font-bold">{currentVessel.originPort} ({currentVessel.originPortCode})</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{currentVessel.progressPercent}% Transit</span>
                <span className="text-neutral-500 font-bold">{currentVessel.destinationPort} ({currentVessel.destinationPortCode})</span>
              </div>
              <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  style={{ width: `${currentVessel.progressPercent}%` }}
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                />
              </div>
              <div className="text-[11px] text-neutral-400 font-mono text-center pt-1">
                Current Location: {currentVessel.currentPortOrSea}
              </div>
            </div>
          </div>

          {/* Port Rotation Schedule */}
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
              Port Rotation Schedule & Berthing Sequence
            </h4>

            <div className="space-y-3">
              {currentVessel.portRotation.map((pr, idx) => {
                const isCompleted = pr.status === 'completed';
                const isCurrent = pr.status === 'current';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30'
                        : isCompleted
                        ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/20'
                        : 'border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">
                          {pr.port} ({pr.locode})
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          ETA: {pr.eta} · ETD: {pr.etd}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : isCurrent
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'
                      }`}
                    >
                      {pr.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
