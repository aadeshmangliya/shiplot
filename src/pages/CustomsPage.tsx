import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialPakistanCustomsCases, PakistanCustomsCase } from '../mock/srsMockData';
import {
  ShieldAlert,
  FileCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Globe2,
  FileText,
  CreditCard,
  Building2,
  Check
} from 'lucide-react';

export const CustomsPage: React.FC = () => {
  const { shipments, setSelectedShipmentForDetail } = useApp();
  const [clearedShipments, setClearedShipments] = useState<Record<string, boolean>>({});
  const [jurisdiction, setJurisdiction] = useState<'All' | 'Pakistan' | 'US'>('Pakistan');
  const [pkCases, setPkCases] = useState<PakistanCustomsCase[]>(initialPakistanCustomsCases);

  const customsHolds = [
    {
      id: 'cst_01',
      shipmentNo: 'SHP-2026-8804',
      containerNo: 'CMAU9182371',
      shipper: 'SunPower Photovoltaics (Wuxi) Co. Ltd.',
      consignee: 'California Clean Energy Systems Inc.',
      agency: 'U.S. Customs and Border Protection (CBP)',
      examType: '1C Intensive Physical Cargo Exam',
      location: 'Price Transfer CES (Long Beach, CA)',
      reason: 'Anti-Dumping / Countervailing Duty (AD/CVD) Silicon Classification Audit',
      holdDate: '2026-09-28',
      status: 'In Examination',
      severity: 'high'
    },
    {
      id: 'cst_02',
      shipmentNo: 'SHP-2026-8835',
      containerNo: 'HLXU6629104',
      shipper: 'Rhine Valley Precision Engineering GmbH',
      consignee: 'Midwest Advanced Manufacturing Corp.',
      agency: 'CBP / Partner Government Agency (PGA - FDA)',
      examType: 'VACIS Non-Intrusive Gamma X-Ray',
      location: 'APM Terminals Port of New York',
      reason: 'Routine agricultural soil & packaging wood inspection (ISPM-15)',
      holdDate: '2026-09-30',
      status: 'Queued for X-Ray',
      severity: 'medium'
    }
  ];

  const handleRelease = (id: string) => {
    setClearedShipments(prev => ({ ...prev, [id]: true }));
  };

  const handleClearPkCase = (id: string) => {
    setPkCases(prev =>
      prev.map(c => (c.id === id ? { ...c, clearanceStatus: 'Out of Charge (Cleared)', psidPaymentStatus: 'Paid via 1Link' } : c))
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              CUSTOMS BORDER CLEARANCE
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WeBOC Ready (Pakistan FBR Architecture)</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Customs Clearance, WeBOC Goods Declarations & Border Holds
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage Pakistan Customs WeBOC electronic clearance channels, Goods Declarations (GD), duty assessments, and U.S. CBP CES examinations
          </p>
        </div>

        {/* Jurisdiction Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono">
          <button
            onClick={() => setJurisdiction('Pakistan')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              jurisdiction === 'Pakistan'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Pakistan (WeBOC / FBR)
          </button>
          <button
            onClick={() => setJurisdiction('US')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              jurisdiction === 'US'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            United States (CBP ACE)
          </button>
          <button
            onClick={() => setJurisdiction('All')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              jurisdiction === 'All'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Jurisdictions
          </button>
        </div>
      </div>

      {/* Pakistan Customs WeBOC Architectural Integration Notice Banner */}
      {(jurisdiction === 'Pakistan' || jurisdiction === 'All') && (
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-neutral-950 dark:text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Pakistan Customs WeBOC (Web Based One Customs) — Architecture Status: WeBOC Ready</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              API & EDI GATEWAY STAGED
            </span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 font-sans text-xs">
            This module is fully architected and data-modeled for seamless electronic integration with Pakistan Customs (FBR WeBOC system). It supports Goods Declarations (GDs) across Green, Yellow, and Red channels, automated NTN verification, customs tariff duty calculations, and 1Link PSID e-payments across Karachi Port (KPT East/West Wharf), Port Qasim (QICT), SAPT, and Gwadar Port.
          </p>
        </div>
      )}

      {/* PAKISTAN WEbOC CASES */}
      {(jurisdiction === 'Pakistan' || jurisdiction === 'All') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Pakistan Customs (WeBOC) Goods Declarations & Clearance Ledger
            </h2>
            <span className="text-xs text-neutral-400">{pkCases.length} Active Filings</span>
          </div>

          {pkCases.map(c => {
            const isCleared = c.clearanceStatus === 'Out of Charge (Cleared)';
            let channelColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            if (c.channel.includes('Yellow')) channelColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            if (c.channel.includes('Red')) channelColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

            return (
              <div
                key={c.id}
                className={`p-5 rounded-xl border transition-all shadow-xs space-y-4 ${
                  isCleared
                    ? 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                    : 'border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono text-neutral-950 dark:text-white">
                        GD #{c.gdNumber}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${channelColor}`}>
                        {c.channel}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {c.portStation}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono block mt-0.5">
                      IGM: {c.igmNumber} · B/L: {c.blNumber} · Container: {c.containerNo} · NTN: {c.ntnNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCleared ? (
                      <button
                        onClick={() => handleClearPkCase(c.id)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-mono text-xs font-bold transition-colors cursor-pointer"
                      >
                        Issue Out of Charge (Clearance)
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Out of Charge (Gate Pass Ready)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Consignee Importer:</span>
                    <span className="font-bold">{c.consignee}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">HS Tariff Code:</span>
                    <span className="font-semibold">{c.hsCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Declared Value (C&F):</span>
                    <span className="font-bold">PKR {c.declaredValuePkr.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Total Customs Duty & Taxes:</span>
                    <span className="font-bold">PKR {c.totalDutyPkr.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-x-3">
                    <span>CD: PKR {c.customsDutyPkr.toLocaleString()}</span>
                    <span>ST: PKR {c.salesTaxPkr.toLocaleString()}</span>
                    <span>IT: PKR {c.incomeTaxPkr.toLocaleString()}</span>
                    <span>ACD/RD: PKR {c.acdAndRdPkr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">1Link PSID: {c.psidNumber}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      c.psidPaymentStatus.includes('Paid')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {c.psidPaymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* US CBP HOLDS SECTION */}
      {(jurisdiction === 'US' || jurisdiction === 'All') && (
        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between font-mono">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              U.S. Customs and Border Protection (CBP ACE) Holds & CES Exams
            </h2>
            <span className="text-xs text-neutral-400">{customsHolds.length} Recorded Holds</span>
          </div>

          {customsHolds.map(hold => {
            const isReleased = clearedShipments[hold.id];
            return (
              <div
                key={hold.id}
                className={`p-5 rounded-xl border shadow-xs transition-all ${
                  isReleased
                    ? 'border-neutral-300 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900'
                    : 'border-neutral-400 bg-white dark:bg-neutral-900 dark:border-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className={`w-5 h-5 ${isReleased ? 'text-emerald-500' : 'text-neutral-950 dark:text-white'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm font-mono text-neutral-900 dark:text-white">
                          {hold.shipmentNo} · Box: {hold.containerNo}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            isReleased
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          {isReleased ? '1B CBP RELEASED' : hold.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {hold.agency} · Placed: {hold.holdDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isReleased ? (
                      <button
                        onClick={() => handleRelease(hold.id)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-mono text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        Record 1B Customs Release
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Ready for Terminal Pick-Up</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-sans">Exam Type:</span>
                    <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{hold.examType}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-sans">Examination Station (CES):</span>
                    <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{hold.location}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-sans">Shipper / Origin:</span>
                    <div className="text-neutral-700 dark:text-neutral-300 mt-0.5 truncate">{hold.shipper}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-sans">Consignee Receiver:</span>
                    <div className="text-neutral-700 dark:text-neutral-300 mt-0.5 truncate">{hold.consignee}</div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 text-[11px] text-neutral-600 dark:text-neutral-300 font-mono flex items-center justify-between">
                  <span>
                    <strong>CBP Audit Flag:</strong> {hold.reason}
                  </span>
                  <span className="text-neutral-400">EDI 350 Release Notification Pending</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
