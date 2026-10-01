import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Shield,
  Check,
  X,
  Users,
  AlertCircle
} from 'lucide-react';

export const UsersRolesPage: React.FC = () => {
  const { roles, togglePermission, currentCompany } = useApp();
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0].roleId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentRole = roles.find(r => r.roleId === selectedRoleId) || roles[0];

  const permissionLabels: Record<string, { label: string; desc: string }> = {
    aisTracking: {
      label: 'Live AIS Satellite Vessel Telemetry',
      desc: 'Access live ship coordinates, GPS fixes, nautical speed knots, and sea state conditions'
    },
    demurrageOverride: {
      label: 'Demurrage Tariff & Free-Time Override',
      desc: 'Authority to extend container free-time or waive terminal detention charges'
    },
    mblManagement: {
      label: 'Ocean Carrier Master B/L (MBL) Editing',
      desc: 'Edit carrier-level Master Bills of Lading and direct EDI transmissions via INTTRA'
    },
    hblGeneration: {
      label: 'Negotiable Ocean House B/L (HBL) Issuance',
      desc: 'Generate, sign, and issue FMC-compliant negotiable FIATA House Bills of Lading'
    },
    profitMargins: {
      label: 'Carrier Cost & Commercial Profit Margins',
      desc: 'View buy/sell ocean freight spreads, carrier contract base rates, and net margin %'
    },
    cfsConsolidation: {
      label: 'CFS Groupage Lot & Stuffing Authorization',
      desc: 'Assign LCL cargo packages to shared ocean containers and authorize CFS stuffing'
    },
    customsHolds: {
      label: 'Customs Examination & 1B Hold Resolution',
      desc: 'Coordinate CBP exam stations (CES), file duty releases, and mark 1B clearance'
    },
    carrierContracts: {
      label: 'Ocean Carrier Annual Service Contracts',
      desc: 'Manage service contract tiers with MSC, Maersk, CMA CGM, ONE, and Hapag-Lloyd'
    },
    ledgerInvoicing: {
      label: 'Freight Receivables Ledger & Invoicing',
      desc: 'Create, issue, and reconcile commercial ocean freight invoices and payment receipts'
    },
    extraTelemetry: {
      label: 'Extended Port Congestion & AIS Raw Feeds',
      desc: 'Access terminal berthing wait times, pilotage boarding times, and weather telemetry'
    }
  };

  const handleToggle = (permKey: string) => {
    togglePermission(currentRole.roleId, permKey);
    const nextVal = !currentRole.permissions[permKey as keyof typeof currentRole.permissions];
    setToastMessage(`Updated: "${permissionLabels[permKey]?.label}" is now ${nextVal ? 'ENABLED' : 'DISABLED'} for ${currentRole.roleName}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              SECURITY & RBAC GOVERNANCE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Role-Based Access Control & Permission Matrix
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Configure granular capability flags for internal staff, forwarder desks, and external client portals
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center gap-2 transition-all">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {roles.map(r => (
          <button
            key={r.roleId}
            onClick={() => setSelectedRoleId(r.roleId)}
            className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
              r.roleId === selectedRoleId
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {r.roleName}
          </button>
        ))}
      </div>

      {/* Role Description Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white">
            {currentRole.roleName}
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
            {currentRole.roleCategory}
          </span>
        </div>
        <p className="text-xs text-neutral-500 font-sans">
          {currentRole.description}
        </p>
      </div>

      {/* Permission Toggles List */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
          Active Security Permissions
        </h4>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {Object.entries(permissionLabels).map(([key, info]) => {
            const isEnabled = !!currentRole.permissions[key as keyof typeof currentRole.permissions];
            return (
              <div
                key={key}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-white font-mono">
                    {info.label}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-sans mt-0.5">
                    {info.desc}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(key)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    isEnabled
                      ? 'bg-neutral-900 dark:bg-white justify-end'
                      : 'bg-neutral-200 dark:bg-neutral-700 justify-start'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      isEnabled
                        ? 'bg-white dark:bg-neutral-900'
                        : 'bg-white'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
