import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Ship,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Box,
  Anchor,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicTrackingPage: React.FC = () => {
  const { shipments, containers, currentCompany } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  // Default initial search
  const foundShipment = shipments.find(s => {
    if (!query) return false;
    const q = query.trim().toLowerCase();
    return (
      s.shipmentNo.toLowerCase() === q ||
      s.bookingNo.toLowerCase() === q
    );
  }) || shipments[0]; // fallback demo

  const foundContainer = containers.find(c => {
    if (!query) return false;
    const q = query.trim().toLowerCase();
    return c.containerNo.toLowerCase() === q;
  }) || containers[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const setExample = (term: string) => {
    setQuery(term);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans flex flex-col">
      {/* Public Navigation Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold shadow-xs">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">
                  {currentCompany.displayName || currentCompany.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                  PUBLIC TRACKING
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                Global Cargo & Ocean Container Visibility
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            >
              Sign In to Portal
            </Link>
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 shadow-xs transition-colors"
            >
              NVOCC Console
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <div className="bg-neutral-900 text-white dark:bg-neutral-900/60 py-12 px-4 sm:px-6 border-b border-neutral-800">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-Time Satellite AIS Vessel Tracking & Milestone Telemetry</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Track Your Ocean Consignment
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto font-sans">
            Enter your House Bill of Lading (HBL), Carrier Master B/L, Container Number, or Booking Reference for instantaneous cargo milestone tracing.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6">
            <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-neutral-950 p-2 rounded-xl shadow-xl border border-neutral-700">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Enter B/L Number, Container No (e.g. MSKU7829103), or Booking..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-sm font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 transition-colors cursor-pointer shrink-0"
              >
                Track Cargo
              </button>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-neutral-400">
            <span>Try sample searches:</span>
            <button
              onClick={() => setExample('SHP-2026-8804')}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white underline cursor-pointer"
            >
              SHP-2026-8804
            </button>
            <button
              onClick={() => setExample('MSKU7829103')}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white underline cursor-pointer"
            >
              MSKU7829103
            </button>
            <button
              onClick={() => setExample('BKG-4019')}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white underline cursor-pointer"
            >
              BKG-4019
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Results Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 space-y-6">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg sm:text-xl font-bold">
                  {foundShipment.shipmentNo}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                  {foundShipment.status}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {foundShipment.type} Ocean Consignment
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                Carrier: {foundShipment.carrier} · Vessel: {foundShipment.vesselName} (Voy: {foundShipment.voyageNo})
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Milestone Report</span>
            </button>
          </div>

          {/* Routing Corridor Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">
            <div>
              <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">Port of Loading (POL)</span>
              <span className="font-bold text-sm block mt-0.5">{foundShipment.pol}</span>
              <span className="text-[11px] text-neutral-500">ETD: {foundShipment.etd}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-neutral-400">TRANSIT DURATION</span>
              <div className="flex items-center gap-2 my-1">
                <div className="w-2 h-2 rounded-full bg-neutral-950 dark:bg-white" />
                <div className="w-16 sm:w-28 h-0.5 bg-neutral-300 dark:bg-neutral-700" />
                <Ship className="w-4 h-4 text-neutral-950 dark:text-white" />
                <div className="w-16 sm:w-28 h-0.5 bg-neutral-300 dark:bg-neutral-700" />
                <div className="w-2 h-2 rounded-full bg-neutral-950 dark:bg-white" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">ON SCHEDULE</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">Port of Discharge (POD)</span>
              <span className="font-bold text-sm block mt-0.5">{foundShipment.pod}</span>
              <span className="text-[11px] text-neutral-500">ETA: {foundShipment.eta}</span>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div>
            <h3 className="font-bold text-sm font-mono mb-4 uppercase text-neutral-800 dark:text-neutral-200">
              Cargo Movement Lifecycle Timeline
            </h3>
            <div className="relative border-l-2 border-neutral-300 dark:border-neutral-700 ml-4 space-y-6 pb-2">
              
              <div className="relative pl-6">
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-neutral-950 dark:bg-white border-2 border-white dark:border-neutral-950" />
                <div>
                  <span className="text-xs font-bold font-mono">1. Booking Confirmed & Equipment Allocated</span>
                  <span className="text-[11px] text-neutral-400 font-mono block">2026-09-18 · Electronic Booking Ref #{foundShipment.bookingNo}</span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans mt-0.5">
                    Carrier slot confirmed. Empty container released to shipper for stuffing.
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-neutral-950 dark:bg-white border-2 border-white dark:border-neutral-950" />
                <div>
                  <span className="text-xs font-bold font-mono">2. Terminal Gate-In & SOLAS VGM Verified</span>
                  <span className="text-[11px] text-neutral-400 font-mono block">2026-09-22 · Weighbridge Weight: {foundShipment.weightKg.toLocaleString()} KG</span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans mt-0.5">
                    Container received at terminal staging. Verified Gross Mass certified and submitted to maritime terminal.
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-neutral-950 dark:bg-white border-2 border-white dark:border-neutral-950" />
                <div>
                  <span className="text-xs font-bold font-mono">3. Loaded Onboard Ocean Vessel & Departed</span>
                  <span className="text-[11px] text-neutral-400 font-mono block">{foundShipment.etd} · Vessel: {foundShipment.vesselName}</span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans mt-0.5">
                    Container stowed onboard. Vessel departed POL and entered oceanic shipping corridor.
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-neutral-400 dark:bg-neutral-600 border-2 border-white dark:border-neutral-950" />
                <div>
                  <span className="text-xs font-bold font-mono text-neutral-500">4. Port of Discharge Arrival & Berth Assignment</span>
                  <span className="text-[11px] text-neutral-400 font-mono block">Expected {foundShipment.eta}</span>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">
                    Approaching destination waters. Customs IGM manifest submitted electronically.
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-neutral-400 dark:bg-neutral-600 border-2 border-white dark:border-neutral-950" />
                <div>
                  <span className="text-xs font-bold font-mono text-neutral-500">5. Customs Clearance & Delivery Order Release</span>
                  <span className="text-[11px] text-neutral-400 font-mono block">Post-Discharge</span>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">
                    Final discharge, Delivery Order (D.O.) issuance to consignee, and gate out dispatch.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Equipment Details Card */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 font-mono text-xs space-y-2">
            <span className="font-bold uppercase text-[11px] text-neutral-500 block">Manifested Equipment Details</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-neutral-400 block text-[10px]">CONTAINER NO</span>
                <span className="font-bold">{foundContainer.containerNo}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">ISO BOX TYPE</span>
                <span className="font-bold">{foundContainer.type}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">SEAL NUMBER</span>
                <span className="font-bold">{foundContainer.sealNo}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">GROSS WEIGHT</span>
                <span className="font-bold">{(foundContainer.grossWeightKg || 21450).toLocaleString()} KG</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-center text-xs font-mono text-neutral-500">
        <p>
          {currentCompany.displayName || currentCompany.name} · {currentCompany.address}
        </p>
        <p className="text-[11px] text-neutral-400 mt-1">
          Support Desk: {currentCompany.phone} · {currentCompany.email}
        </p>
      </footer>
    </div>
  );
};
