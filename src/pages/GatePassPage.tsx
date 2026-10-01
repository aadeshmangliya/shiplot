import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GatePass, GatePassType, GatePassStatus } from '../types';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileCheck2,
  BookmarkCheck,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';

export const GatePassPage: React.FC = () => {
  const { gatePasses, addGatePass, updateGatePassStatus, currentCompany } = useApp();
  const location = useLocation();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Gate In' | 'Gate Out' | 'In-Transit' | 'Completed'>('All');
  const [search, setSearch] = useState('');
  const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);

  // Selected Gate Pass for detailed official Slip Print / View
  const [selectedPassForPrint, setSelectedPassForPrint] = useState<GatePass | null>(null);

  // Form State
  const [passType, setPassType] = useState<GatePassType>('Gate Out (Laden)');
  const [containerNo, setContainerNo] = useState('MSKU2019284');
  const [containerType, setContainerType] = useState('40HC');
  const [sealNo, setSealNo] = useState(`SL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [truckNo, setTruckNo] = useState('CA-9921X');
  const [driverName, setDriverName] = useState('Muhammad Tariq');
  const [driverPhone, setDriverPhone] = useState('+1-562-555-8912');
  const [driverLicense, setDriverLicense] = useState('DL-CA-992014');
  const [transporterCompany, setTransporterCompany] = useState('FastTrack Intermodal Hauliers Inc.');
  const [terminalOrDepot, setTerminalOrDepot] = useState('Port of Los Angeles Pier 400 Terminal');
  const [bookingOrBlNo, setBookingOrBlNo] = useState('HBL-2026-8819');
  const [tareWeight, setTareWeight] = useState(3820);
  const [grossWeight, setGrossWeight] = useState(22800);
  const [securityNotes, setSecurityNotes] = useState('High-security bolt seal checked. Container exterior clean, no physical damage.');

  // If navigated from container page with prefilled container number
  useEffect(() => {
    if (location.state && (location.state as any).prefilledContainerNo) {
      setContainerNo((location.state as any).prefilledContainerNo);
      setIsIssueFormOpen(true);
    }
  }, [location.state]);

  const totalCount = gatePasses.length;
  const gateInCount = gatePasses.filter(g => g.type.startsWith('Gate In')).length;
  const gateOutCount = gatePasses.filter(g => g.type.startsWith('Gate Out')).length;
  const inTransitCount = gatePasses.filter(g => g.status === 'In-Transit').length;
  const completedCount = gatePasses.filter(g => g.status === 'Completed').length;

  const filteredPasses = gatePasses.filter(g => {
    if (activeFilter === 'Gate In' && !g.type.startsWith('Gate In')) return false;
    if (activeFilter === 'Gate Out' && !g.type.startsWith('Gate Out')) return false;
    if (activeFilter === 'In-Transit' && g.status !== 'In-Transit') return false;
    if (activeFilter === 'Completed' && g.status !== 'Completed') return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        g.gatePassNo.toLowerCase().includes(q) ||
        g.containerNo.toLowerCase().includes(q) ||
        g.truckNo.toLowerCase().includes(q) ||
        g.driverName.toLowerCase().includes(q) ||
        g.transporterCompany.toLowerCase().includes(q) ||
        g.bookingOrBlNo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString();
    try {
      localStorage.setItem('shiplot_gatepass_draft', JSON.stringify({
        passType,
        containerNo,
        containerType,
        truckNo,
        driverName,
        driverPhone,
        transporterCompany,
        terminalOrDepot
      }));
    } catch {
      // ignore
    }
    setDraftSavedMsg(`Gate Pass draft saved at ${time}`);
    setTimeout(() => setDraftSavedMsg(null), 3000);
  };

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

    const newPass: GatePass = {
      id: `gp_${Date.now()}`,
      gatePassNo: `GP-2026-${idNum}`,
      type: passType,
      containerNo: containerNo.toUpperCase(),
      containerType,
      sealNo,
      truckNo: truckNo.toUpperCase(),
      driverName,
      driverPhone,
      driverLicense,
      transporterCompany,
      terminalOrDepot,
      bookingOrBlNo,
      issuedAt: nowStr,
      validUntil: 'Within 24 Hours of Issue',
      status: 'Approved',
      eirReference: `EIR-${idNum}`,
      tareWeightKg: Number(tareWeight),
      grossWeightKg: Number(grossWeight),
      securityNotes
    };

    addGatePass(newPass);
    setIsIssueFormOpen(false);
    setSelectedPassForPrint(newPass);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              TERMINAL & DEPOT DRAYAGE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              EIR & Gate Pass Verification
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Gate Pass (EIR) Management
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Issue and authorize electronic gate-in and gate-out passes for drayage trucks, intermodal drivers, and container yards
          </p>
        </div>

        <button
          onClick={() => setIsIssueFormOpen(!isIssueFormOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer ${
            isIssueFormOpen
              ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
              : 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950'
          }`}
        >
          {isIssueFormOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>+ Issue New Gate Pass</span>
            </>
          )}
        </button>
      </div>

      {/* On-Page Inline Issue Form (Black & White, No Popup) */}
      {isIssueFormOpen && (
        <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md overflow-hidden transition-all text-xs font-sans">
          <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Ticket className="w-4 h-4" />
              <span className="font-mono font-bold text-sm">
                Issue Electronic Container Gate Pass (EIR)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="text-xs font-mono font-semibold px-2.5 py-1 rounded border border-neutral-700 dark:border-neutral-300 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Save as Draft</span>
              </button>
              <button
                type="button"
                onClick={() => setIsIssueFormOpen(false)}
                className="text-white dark:text-neutral-950 p-1 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {draftSavedMsg && (
            <div className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-5 py-1.5 text-xs font-mono flex items-center justify-between">
              <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> {draftSavedMsg}
              </span>
            </div>
          )}

          <form onSubmit={handleCreatePass} className="p-5 sm:p-6 space-y-4 font-mono">
            {/* Form Section 1 */}
            <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              1. Gate Pass Authorization & Vehicle Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Gate Movement Type *
                </label>
                <select
                  value={passType}
                  onChange={e => setPassType(e.target.value as GatePassType)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                >
                  <option value="Gate Out (Laden)">Gate Out (Laden / Full)</option>
                  <option value="Gate In (Laden)">Gate In (Laden / Full)</option>
                  <option value="Gate Out (Empty)">Gate Out (Empty Container)</option>
                  <option value="Gate In (Empty)">Gate In (Empty Container)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Truck / Prime Mover License *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CA-7829X"
                  value={truckNo}
                  onChange={e => setTruckNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 uppercase font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Tariq"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Driver Phone Number
                </label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={e => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Driver Commercial License / ID
                </label>
                <input
                  type="text"
                  value={driverLicense}
                  onChange={e => setDriverLicense(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 uppercase"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Haulier / Transporter Company *
                </label>
                <input
                  type="text"
                  required
                  value={transporterCompany}
                  onChange={e => setTransporterCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Terminal / Depot / Warehouse Facility *
                </label>
                <input
                  type="text"
                  required
                  value={terminalOrDepot}
                  onChange={e => setTerminalOrDepot(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
            </div>

            {/* Form Section 2 */}
            <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mt-4">
              2. Container Equipment & Security Verification
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Container Number *
                </label>
                <input
                  type="text"
                  required
                  value={containerNo}
                  onChange={e => setContainerNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 uppercase font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  ISO Container Type *
                </label>
                <select
                  value={containerType}
                  onChange={e => setContainerType(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                >
                  <option value="40HC">40' High Cube (40HC)</option>
                  <option value="20GP">20' General Purpose (20GP)</option>
                  <option value="40GP">40' Standard Dry (40GP)</option>
                  <option value="40RF">40' Temperature Reefer (40RF)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  High-Security Seal No *
                </label>
                <input
                  type="text"
                  required
                  value={sealNo}
                  onChange={e => setSealNo(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Booking / Bill of Lading Ref *
                </label>
                <input
                  type="text"
                  required
                  value={bookingOrBlNo}
                  onChange={e => setBookingOrBlNo(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Tare Weight (KG)
                </label>
                <input
                  type="number"
                  value={tareWeight}
                  onChange={e => setTareWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Gross Scale Weight (KG)
                </label>
                <input
                  type="number"
                  value={grossWeight}
                  onChange={e => setGrossWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Security Inspection / Condition Notes
                </label>
                <input
                  type="text"
                  value={securityNotes}
                  onChange={e => setSecurityNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 rounded text-xs font-mono font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded text-xs font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Issue & Print Gate Pass</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
        <button
          onClick={() => setActiveFilter('All')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'All'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">Total Gate Passes</span>
            <Ticket className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{totalCount}</div>
          <span className="text-[10px] opacity-60">All electronic passes</span>
        </button>

        <button
          onClick={() => setActiveFilter('Gate Out')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'Gate Out'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">Gate Out</span>
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{gateOutCount}</div>
          <span className="text-[10px] opacity-60">Exiting yard / terminal</span>
        </button>

        <button
          onClick={() => setActiveFilter('Gate In')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'Gate In'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">Gate In</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{gateInCount}</div>
          <span className="text-[10px] opacity-60">Entering yard / terminal</span>
        </button>

        <button
          onClick={() => setActiveFilter('In-Transit')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'In-Transit'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">In-Transit</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{inTransitCount}</div>
          <span className="text-[10px] opacity-60">Truck on road</span>
        </button>

        <button
          onClick={() => setActiveFilter('Completed')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer col-span-2 lg:col-span-1 ${
            activeFilter === 'Completed'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider opacity-70">Completed</span>
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{completedCount}</div>
          <span className="text-[10px] opacity-60">Gating confirmed</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {(['All', 'Gate Out', 'Gate In', 'In-Transit', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab === 'All' ? 'All Passes' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search pass no, container, truck, driver..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Gate Passes Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-500 uppercase">
                <th className="py-3 px-4">Pass No & Type</th>
                <th className="py-3 px-3">Container & Seal</th>
                <th className="py-3 px-3">Truck & Driver</th>
                <th className="py-3 px-3">Facility / Terminal</th>
                <th className="py-3 px-3">Issued Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
              {filteredPasses.map(gp => (
                <tr key={gp.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                    <div>{gp.gatePassNo}</div>
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {gp.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-neutral-900 dark:text-white">{gp.containerNo} ({gp.containerType})</div>
                    <span className="text-[10px] text-neutral-400">
                      Seal: {gp.sealNo} · Ref: {gp.bookingOrBlNo}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold">{gp.truckNo}</div>
                    <div className="text-[11px] text-neutral-500 font-sans">
                      {gp.driverName} ({gp.transporterCompany})
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-sans text-xs">
                    <div className="truncate max-w-xs">{gp.terminalOrDepot}</div>
                  </td>
                  <td className="py-3.5 px-3 text-[11px] text-neutral-500">
                    {gp.issuedAt}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                      gp.status === 'Completed'
                        ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                        : gp.status === 'In-Transit'
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                        : 'border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {gp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {/* View & Print Slip */}
                    <button
                      onClick={() => setSelectedPassForPrint(gp)}
                      className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Slip</span>
                    </button>

                    {gp.status !== 'Completed' && (
                      <button
                        onClick={() => updateGatePassStatus(gp.id, 'Completed')}
                        className="px-2 py-1 rounded text-[10px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white underline cursor-pointer"
                      >
                        Confirm Gate In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Black & White Printable Gate Pass Slip Drawer */}
      {selectedPassForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white text-black p-6 sm:p-8 rounded-lg max-w-2xl w-full border-2 border-black shadow-2xl space-y-6 font-mono print:border-none print:shadow-none print:p-0">
            
            {/* Header with FMC License */}
            <div className="border-b-2 border-black pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                  {currentCompany.name.replace(' (NVOCC)', '')}
                </h2>
                <div className="text-[11px] font-medium text-neutral-700">
                  FMC License: {currentCompany.registrationNo} · Equipment Interchange Receipt (EIR)
                </div>
                <div className="text-[11px] text-neutral-600">
                  Terminal Drayage Gate Pass Authorization Slip
                </div>
              </div>
              <div className="text-right">
                <div className="border-2 border-black px-3 py-1 font-black text-sm uppercase">
                  {selectedPassForPrint.type}
                </div>
                <div className="text-[10px] mt-1 font-bold">
                  PASS NO: {selectedPassForPrint.gatePassNo}
                </div>
              </div>
            </div>

            {/* Verification Barcode & QR Box */}
            <div className="p-3 border border-black bg-neutral-50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold block">BARCODE TOKEN / SECURITY HASH:</span>
                <span className="font-mono text-sm tracking-widest block font-bold">
                  ||| | | |||| || ||| || ||| {selectedPassForPrint.gatePassNo.replace('GP-', '')}
                </span>
                <span className="text-[10px] text-neutral-600">
                  Issued: {selectedPassForPrint.issuedAt} · Valid: {selectedPassForPrint.validUntil}
                </span>
              </div>
              <div className="w-14 h-14 border border-black flex items-center justify-center bg-white">
                <QrCode className="w-10 h-10 text-black" />
              </div>
            </div>

            {/* Container and Vehicle Particulars Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-black p-4">
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">Container Number</div>
                <div className="text-sm font-black">{selectedPassForPrint.containerNo}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">ISO Type & Size</div>
                <div className="text-sm font-bold">{selectedPassForPrint.containerType} Standard Marine</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">High Security Seal No</div>
                <div className="font-bold">{selectedPassForPrint.sealNo}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">Booking / B/L Reference</div>
                <div className="font-bold">{selectedPassForPrint.bookingOrBlNo}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">Truck / Prime Mover License</div>
                <div className="font-black text-sm">{selectedPassForPrint.truckNo}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">Driver Name & Phone</div>
                <div className="font-bold">{selectedPassForPrint.driverName} ({selectedPassForPrint.driverPhone})</div>
              </div>
              <div className="col-span-2 space-y-1 border-t border-neutral-300 pt-2">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">Transporter Haulier Company</div>
                <div className="font-semibold">{selectedPassForPrint.transporterCompany}</div>
              </div>
              <div className="col-span-2 space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">Destination Facility / Terminal</div>
                <div className="font-semibold">{selectedPassForPrint.terminalOrDepot}</div>
              </div>
              <div className="col-span-2 space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase font-bold">Security & Weight Scale Verification</div>
                <div className="text-[11px] text-neutral-700">
                  Gross: {(selectedPassForPrint.grossWeightKg || 22800).toLocaleString()} KG · Tare: {(selectedPassForPrint.tareWeightKg || 3820).toLocaleString()} KG · Notes: {selectedPassForPrint.securityNotes}
                </div>
              </div>
            </div>

            {/* Official Sign-off Signature Boxes */}
            <div className="grid grid-cols-3 gap-3 text-[10px] pt-2">
              <div className="border-t border-black pt-1">
                <span className="block font-bold">Driver Signature</span>
                <span className="text-neutral-500 mt-6 block">Sign: ___________________</span>
              </div>
              <div className="border-t border-black pt-1">
                <span className="block font-bold">Weighbridge Scale Officer</span>
                <span className="text-neutral-500 mt-6 block">Sign: ___________________</span>
              </div>
              <div className="border-t border-black pt-1">
                <span className="block font-bold">Terminal Gate Security</span>
                <span className="text-neutral-500 mt-6 block">Stamp: [VERIFIED GATE PASS]</span>
              </div>
            </div>

            {/* Print & Close Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-300 print:hidden">
              <button
                onClick={() => setSelectedPassForPrint(null)}
                className="px-4 py-2 border border-black font-bold text-xs hover:bg-neutral-100 cursor-pointer"
              >
                Close Slip
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-black text-white font-bold text-xs hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip (PDF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
