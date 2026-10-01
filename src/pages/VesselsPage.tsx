import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Ship,
  Navigation,
  Compass,
  Anchor,
  Search,
  Wind,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VesselsPage: React.FC = () => {
  const { vessels } = useApp();
  const navigate = useNavigate();
  const [carrierFilter, setCarrierFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = vessels.filter(v => {
    if (carrierFilter !== 'All' && v.carrier !== carrierFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.imo.toLowerCase().includes(q) ||
        v.originPort.toLowerCase().includes(q) ||
        v.destinationPort.toLowerCase().includes(q)
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
              COMMERCIAL OCEAN LINERS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Global Container Vessel Fleet & Schedules
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Real-time tracking of partner ocean carrier container ships carrying NVOCC cargo
          </p>
        </div>

        <button
          onClick={() => navigate('/tracking')}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Interactive AIS Map</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search vessel by name, IMO number, or port..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>

        <select
          value={carrierFilter}
          onChange={e => setCarrierFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
        >
          <option value="All">All Carriers</option>
          <option value="MSC">MSC</option>
          <option value="Maersk Line">Maersk Line</option>
          <option value="CMA CGM">CMA CGM</option>
          <option value="ONE Line">ONE Line</option>
          <option value="Hapag-Lloyd">Hapag-Lloyd</option>
          <option value="Evergreen Marine">Evergreen Marine</option>
        </select>
      </div>

      {/* Vessels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(v => (
          <div
            key={v.id}
            className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                    {v.name}
                  </h3>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  IMO: {v.imo} · Flag: {v.flag} · Voy: {v.voyage}
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                {v.carrier}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-400 block font-sans">Route Passage:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {v.originPortCode} → {v.destinationPortCode}
                </span>
                <div className="text-[10px] text-neutral-400 mt-0.5 truncate">{v.destinationPort}</div>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-sans">Telemetry Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {v.status} · {v.currentSpeedKnots} kts
                </span>
                <div className="text-[10px] text-neutral-400 mt-0.5">ETA: {v.eta}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 text-xs font-mono flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400">TEU Capacity & Load</span>
                <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                  {v.currentTeuLoad.toLocaleString()} / {v.capacityTeu.toLocaleString()} TEU ({Math.round((v.currentTeuLoad / v.capacityTeu) * 100)}%)
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400">Delay</span>
                <div className="font-bold text-neutral-700 dark:text-neutral-300 mt-0.5">
                  {v.delayHours > 0 ? `+${v.delayHours} hrs delay` : 'On Schedule'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
