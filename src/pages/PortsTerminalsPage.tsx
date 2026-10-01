import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Anchor,
  Search,
  MapPin,
  Ship,
  Layers,
  Clock,
  Compass,
  Building
} from 'lucide-react';

export const PortsTerminalsPage: React.FC = () => {
  const { ports, vessels } = useApp();
  const [search, setSearch] = useState('');

  const detailedPorts = [
    {
      code: 'USLAX',
      name: 'Port of Los Angeles',
      country: 'United States',
      terminals: ['Pier 400 (APM)', 'TraPac Berth 136-147', 'Fenix Marine Services Pier 300', 'WBCT Berths 100-102'],
      activeVessels: 12,
      congestionWaitDays: 0.8,
      coordinates: '33.74° N, 118.26° W',
      annualThroughputTeu: 10600000
    },
    {
      code: 'CNSHA',
      name: 'Port of Shanghai (Yangshan & Waigaoqiao)',
      country: 'China',
      terminals: ['Yangshan Deep-Water Phase I-IV', 'Waigaoqiao Container Terminals 1-5', 'Pudong International Container Terminal'],
      activeVessels: 48,
      congestionWaitDays: 1.2,
      coordinates: '30.63° N, 122.06° E',
      annualThroughputTeu: 49000000
    },
    {
      code: 'SGSIN',
      name: 'Singapore Megaport (Tuas & Pasir Panjang)',
      country: 'Singapore',
      terminals: ['Tuas Megaport Phase 1', 'Pasir Panjang Terminal 1-6', 'Tanjong Pagar & Keppel'],
      activeVessels: 34,
      congestionWaitDays: 0.5,
      coordinates: '1.29° N, 103.85° E',
      annualThroughputTeu: 39000000
    },
    {
      code: 'NLRTM',
      name: 'Port of Rotterdam',
      country: 'Netherlands',
      terminals: ['ECT Delta Terminal Maasvlakte', 'APM Terminals Maasvlakte II', 'Rotterdam World Gateway (RWG)'],
      activeVessels: 18,
      congestionWaitDays: 1.0,
      coordinates: '51.95° N, 4.14° E',
      annualThroughputTeu: 14500000
    },
    {
      code: 'DEHAM',
      name: 'Port of Hamburg',
      country: 'Germany',
      terminals: ['HHLA Container Terminal Burchardkai (CTB)', 'Eurogate Container Terminal Hamburg', 'HHLA Altenwerder (CTA)'],
      activeVessels: 11,
      congestionWaitDays: 1.5,
      coordinates: '53.53° N, 9.97° E',
      annualThroughputTeu: 8200000
    }
  ];

  const filtered = detailedPorts.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      return (
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q)
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
              UN/LOCODE INFRASTRUCTURE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Global Ocean Ports & Berthing Terminals
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Gateway LOCODE directory, terminal berthing windows, automated gate-in, and vessel congestion
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search port by LOCODE (e.g. USLAX, CNSHA), port name, or country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>
      </div>

      {/* Ports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div
            key={p.code}
            className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-base font-mono text-neutral-900 dark:text-white">
                  {p.code}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {p.country}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {p.name}
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Coords: {p.coordinates}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] text-neutral-400 block font-sans">Avg Berth Delay:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {p.congestionWaitDays} days wait
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-sans">Annual Volume:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {(p.annualThroughputTeu / 1000000).toFixed(1)}M TEUs
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                Active Terminals ({p.terminals.length})
              </span>
              <div className="space-y-1">
                {p.terminals.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded bg-neutral-50 dark:bg-neutral-800/50 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 truncate"
                  >
                    • {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
