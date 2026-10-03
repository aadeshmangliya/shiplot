import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PortCall, SofEvent } from '../types';
import { initialAgencyPartners } from '../mock/data';
import {
  Ship,
  Anchor,
  Clock,
  CheckCircle2,
  Calendar,
  Search,
  Plus,
  FileCheck2,
  FileText,
  ShieldCheck,
  Building2,
  Users2,
  MapPin,
  Eye,
  Printer,
  X,
  Layers,
  Check
} from 'lucide-react';

export const ShippingAgencyPage: React.FC = () => {
  const { portCalls, updatePortCall, currentCompany } = useApp();

  const [activeTab, setActiveTab] = useState<'PortCalls' | 'DailyLog' | 'Principals' | 'Clearances'>('PortCalls');
  const [selectedCallId, setSelectedCallId] = useState<string>(portCalls[0]?.id || '');
  const [search, setSearch] = useState('');
  const [newEventText, setNewEventText] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<SofEvent['category']>('Cargo Ops');
  const [selectedClearanceDoc, setSelectedClearanceDoc] = useState<{ type: 'Inward Port Clearance' | 'Outward Sailing Clearance' | 'Departure Notice'; call: PortCall } | null>(null);

  const activeCall = portCalls.find(p => p.id === selectedCallId) || portCalls[0];

  const handleAddSofEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventText || !activeCall) return;

    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newSof: SofEvent = {
      id: `sof_${Date.now()}`,
      timestamp: timeStr,
      event: newEventText,
      category: newEventCategory,
      remarks: `Recorded by duty agent for ${activeCall.vesselName}`
    };

    updatePortCall(activeCall.id, {
      sofEvents: [newSof, ...activeCall.sofEvents]
    });
    setNewEventText('');
  };

  const handleGrantClearance = (callId: string, type: 'port' | 'sailing') => {
    if (type === 'port') {
      updatePortCall(callId, { portClearanceStatus: 'Granted' });
    } else {
      updatePortCall(callId, { sailingClearanceStatus: 'Granted' });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              MARITIME AGENCY DESK
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold">
              Port Husbandry & SOF Operations
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Shipping Agency Operations & Port Call Management
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage principal overseas lines, vessel ETA/ETB/ETD berth assignments, Statement of Facts (SOF) daily logs, and Port / Sailing Clearances
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('PortCalls')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'PortCalls'
              ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Anchor className="w-4 h-4" />
          <span>Port Call Monitoring (ETA/ETB/ETD)</span>
        </button>

        <button
          onClick={() => setActiveTab('DailyLog')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'DailyLog'
              ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Daily Operations Log (Statement of Facts / SOF)</span>
        </button>

        <button
          onClick={() => setActiveTab('Principals')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'Principals'
              ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>Principals, Owners & Charterers</span>
        </button>

        <button
          onClick={() => setActiveTab('Clearances')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'Clearances'
              ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Port & Sailing Clearance Certificates</span>
        </button>
      </div>

      {/* TAB 1: PORT CALL MANAGEMENT */}
      {activeTab === 'PortCalls' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portCalls.map(pc => (
              <div
                key={pc.id}
                onClick={() => setSelectedCallId(pc.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  selectedCallId === pc.id
                    ? 'border-neutral-950 dark:border-white bg-white dark:bg-neutral-900 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                      {pc.callId}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      Berth: {pc.berthNo}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    pc.status === 'Berthed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {pc.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-mono">{pc.vesselName}</h3>
                  <p className="text-xs text-neutral-500 font-sans">
                    Voyage: {pc.voyage} · Line: {pc.carrier} · Principal: {pc.principalName}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">ETA</span>
                    <span className="font-bold">{pc.eta}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">ETB (Berthing)</span>
                    <span className="font-bold">{pc.etb}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">ETD</span>
                    <span className="font-bold">{pc.etd}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-neutral-500">
                  <span>Terminal: {pc.terminalName}</span>
                  <span>NOR: {pc.noticeOfReadinessTendered || 'Pending'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DAILY OPERATIONS LOG (STATEMENT OF FACTS) */}
      {activeTab === 'DailyLog' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Active Vessel Call Selected</span>
                <span className="text-sm font-bold">{activeCall.vesselName} — Voyage {activeCall.voyage} ({activeCall.portName})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Switch Call:</span>
                <select
                  value={selectedCallId}
                  onChange={e => setSelectedCallId(e.target.value)}
                  className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                >
                  {portCalls.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.vesselName} ({p.callId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Add Event Form */}
            <form onSubmit={handleAddSofEvent} className="flex flex-col sm:flex-row gap-2 pt-1">
              <select
                value={newEventCategory}
                onChange={e => setNewEventCategory(e.target.value as any)}
                className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs font-mono shrink-0"
              >
                <option value="Cargo Ops">Cargo Operations</option>
                <option value="Berthing">Berthing & Tugs</option>
                <option value="Navigation">Navigation & Pilotage</option>
                <option value="Customs/Clearance">Customs & Clearance</option>
                <option value="Bunkering">Bunkering & Water</option>
              </select>
              <input
                type="text"
                placeholder="Log event (e.g. Commenced discharging Hatch 2; Pilot boarded; Draft survey completed)..."
                value={newEventText}
                onChange={e => setNewEventText(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold hover:bg-neutral-800 text-xs font-mono cursor-pointer shrink-0"
              >
                + Append SOF Event
              </button>
            </form>
          </div>

          {/* Statement of Facts Event Log */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between font-mono">
              <span className="font-bold text-xs uppercase">Statement of Facts (SOF) Chronological Log</span>
              <span className="text-xs text-neutral-500">{activeCall.sofEvents.length} Recorded Events</span>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-xs">
              {activeCall.sofEvents.map(ev => (
                <div key={ev.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-white">{ev.timestamp}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                        {ev.category}
                      </span>
                    </div>
                    <p className="font-sans text-neutral-800 dark:text-neutral-200">{ev.event}</p>
                    {ev.remarks && (
                      <span className="text-[11px] text-neutral-500 font-sans block">{ev.remarks}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRINCIPALS, SHIP OWNERS & CHARTERERS */}
      {activeTab === 'Principals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {initialAgencyPartners.map(p => (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 uppercase">
                    {p.category}
                  </span>
                  <span className="text-[10px] text-neutral-400">{p.monthlyTeu} TEU/mo</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-mono">{p.name}</h3>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">{p.hq}</p>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1 text-[11px]">
                  <div className="text-neutral-500">Contact: {p.contact}</div>
                  <div className="text-neutral-500">Commercial Terms: {p.creditTerms}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PORT & SAILING CLEARANCE CERTIFICATES */}
      {activeTab === 'Clearances' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 text-[11px] text-neutral-500 uppercase">
                    <th className="py-3 px-4">Port Call / Vessel</th>
                    <th className="py-3 px-3">Port & Terminal</th>
                    <th className="py-3 px-3">Inward Port Clearance</th>
                    <th className="py-3 px-3">Outward Sailing Clearance</th>
                    <th className="py-3 px-4 text-right">Certificate Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {portCalls.map(pc => (
                    <tr key={pc.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4 font-bold">
                        <div>{pc.vesselName}</div>
                        <span className="text-[10px] text-neutral-400 font-normal">Call ID: {pc.callId} · Voy: {pc.voyage}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div>{pc.portName}</div>
                        <span className="text-[10px] text-neutral-400">{pc.terminalName} (Berth {pc.berthNo})</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                          pc.portClearanceStatus === 'Granted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {pc.portClearanceStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                          pc.sailingClearanceStatus === 'Granted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                        }`}>
                          {pc.sailingClearanceStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedClearanceDoc({ type: 'Inward Port Clearance', call: pc })}
                          className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 text-[11px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Port Clearance</span>
                        </button>
                        <button
                          onClick={() => setSelectedClearanceDoc({ type: 'Outward Sailing Clearance', call: pc })}
                          className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 text-[11px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Sailing Clearance</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official Clearance Certificate Drawer / Modal */}
      {selectedClearanceDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white text-black p-6 sm:p-8 rounded-lg max-w-2xl w-full border-2 border-black shadow-2xl space-y-5 font-mono print:border-none print:shadow-none print:p-0 my-auto">
            {/* Header */}
            <div className="border-b-2 border-black pb-3 text-center">
              <h1 className="text-base font-black uppercase">
                {currentCompany.displayName || currentCompany.name}
              </h1>
              <div className="text-[10px] text-neutral-700">
                Port Husbandry & Vessel Agency Division · {selectedClearanceDoc.call.portName}
              </div>
              <div className="text-sm font-bold uppercase mt-2 border-2 border-black py-1 bg-neutral-50 inline-block px-4">
                CERTIFICATE OF {selectedClearanceDoc.type.toUpperCase()}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 text-xs border border-black p-4 bg-neutral-50">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-bold">Vessel Name</span>
                  <span className="font-black text-sm">{selectedClearanceDoc.call.vesselName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-bold">IMO / Call ID</span>
                  <span className="font-bold">{selectedClearanceDoc.call.imo} ({selectedClearanceDoc.call.callId})</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-bold">Voyage</span>
                  <span className="font-bold">{selectedClearanceDoc.call.voyage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-bold">Terminal / Berth</span>
                  <span className="font-bold">{selectedClearanceDoc.call.terminalName} (Berth {selectedClearanceDoc.call.berthNo})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-300 text-[11px] text-neutral-700 space-y-1">
                <p>
                  This certifies that all port dues, pilotage assessments, customs manifests, and terminal handling obligations have been settled in accordance with Port Authority regulations.
                </p>
                <p>
                  Official permission is hereby granted for {selectedClearanceDoc.type === 'Outward Sailing Clearance' ? 'unmooring and departure from port territorial waters.' : 'entry into port waters, berthing, and cargo operations.'}
                </p>
              </div>
            </div>

            {/* Sign-offs */}
            <div className="grid grid-cols-2 gap-4 text-[10px] pt-3">
              <div className="border-t border-black pt-1">
                <span className="block font-bold">Port Health & Harbour Master</span>
                <span className="text-neutral-500 mt-6 block">Stamp: [AUTHORITY CLEARED]</span>
              </div>
              <div className="border-t border-black pt-1">
                <span className="block font-bold">Shipping Agency Officer</span>
                <span className="text-neutral-500 mt-6 block font-bold text-neutral-900">
                  {currentCompany.displayName || currentCompany.name}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-black print:hidden">
              <button
                onClick={() => setSelectedClearanceDoc(null)}
                className="px-4 py-2 border border-black text-xs font-bold hover:bg-neutral-100 cursor-pointer"
              >
                Close Certificate
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
