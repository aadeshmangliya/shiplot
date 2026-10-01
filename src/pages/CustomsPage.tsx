import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  FileCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const CustomsPage: React.FC = () => {
  const { shipments, setSelectedShipmentForDetail } = useApp();
  const [clearedShipments, setClearedShipments] = useState<Record<string, boolean>>({});

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

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              CUSTOMS BORDER ENFORCEMENT
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              ACE / Automated Commercial Environment
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Customs Clearance, CBP Holds & Exam Stations
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage U.S. Customs (CBP) 1H/1C holds, Centralized Examination Stations (CES), and 7501 duty releases
          </p>
        </div>
      </div>

      {/* Holds Overview */}
      <div className="space-y-4">
        {customsHolds.map(hold => {
          const isReleased = clearedShipments[hold.id];
          return (
            <div
              key={hold.id}
              className={`p-5 rounded-xl border shadow-xs transition-all ${
                isReleased
                  ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20'
                  : 'border-rose-200 bg-white dark:bg-neutral-900 dark:border-rose-900/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className={`w-5 h-5 ${isReleased ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono text-neutral-900 dark:text-white">
                        {hold.shipmentNo} · Box: {hold.containerNo}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isReleased
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isReleased ? '1B CBP RELEASED' : hold.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {hold.agency} · Placed: {hold.holdDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isReleased ? (
                    <button
                      onClick={() => handleRelease(hold.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
    </div>
  );
};
