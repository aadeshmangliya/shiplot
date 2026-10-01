import React, { useState } from 'react';
import { WorkspaceCompany, PortalPermissionConfig } from '../../types/shipping';
import {
  Building2,
  Shield,
  Sliders,
  Check,
  ToggleLeft,
  ToggleRight,
  Ship,
  Clock,
  FileText,
  DollarSign,
  Package,
  AlertTriangle,
  UserCheck,
  Plus,
  RefreshCw,
  Info,
} from 'lucide-react';

interface NvoccSettingsViewProps {
  currentWorkspace: WorkspaceCompany;
  permissions: PortalPermissionConfig[];
  onTogglePermission: (roleId: string, permissionKey: keyof PortalPermissionConfig['permissions']) => void;
  onUpdateWorkspace?: (updated: WorkspaceCompany) => void;
}

export const NvoccSettingsView: React.FC<NvoccSettingsViewProps> = ({
  currentWorkspace,
  permissions,
  onTogglePermission,
  onUpdateWorkspace,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('finance_staff');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedRoleConfig = permissions.find((p) => p.roleId === selectedRoleId) || permissions[0];

  const handleToggle = (permKey: keyof PortalPermissionConfig['permissions'], permTitle: string) => {
    onTogglePermission(selectedRoleId, permKey);
    const newValue = !selectedRoleConfig.permissions[permKey];
    setToastMessage(
      `Permission updated: "${permTitle}" is now ${newValue ? 'ENABLED' : 'DISABLED'} for ${selectedRoleConfig.roleName}`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const permissionItems: {
    key: keyof PortalPermissionConfig['permissions'];
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'aisTracking',
      title: 'Satellite AIS Vessel Tracking Live Map',
      description: 'Grant access to real-time vessel coordinates, speeds, headings, and nautical charts.',
      icon: <Ship className="w-4 h-4 text-blue-500" />,
    },
    {
      key: 'profitMargins',
      title: 'Carrier Buy Rates & Spot Freight Margin',
      description: 'Display confidential liner contract costs, internal markup yields, and profit spreads.',
      icon: <DollarSign className="w-4 h-4 text-emerald-500" />,
    },
    {
      key: 'demurrageOverride',
      title: 'Demurrage Free Time Override & Waiver',
      description: 'Permit user to grant detention waivers and extend port free storage days for customers.',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
    },
    {
      key: 'mblManagement',
      title: 'Master Ocean Bill of Lading (MBL) Access',
      description: 'View and execute carrier Master B/L instructions and original liner documentation.',
      icon: <FileText className="w-4 h-4 text-indigo-500" />,
    },
    {
      key: 'hblGeneration',
      title: 'House Bill of Lading (HBL) Issuance',
      description: 'Generate, sign, and telex-release customer House B/Ls under NVOCC FMC license.',
      icon: <FileText className="w-4 h-4 text-neutral-500" />,
    },
    {
      key: 'cfsConsolidation',
      title: 'CFS Warehouse Consolidation Desk',
      description: 'Manage LCL groupage box stuffing, container CBM capacity, and CFS cut-off hours.',
      icon: <Package className="w-4 h-4 text-purple-500" />,
    },
    {
      key: 'customsHolds',
      title: 'Customs Examination & Hold Clearance',
      description: 'View and update customs hold codes, VACIS exams, and CBP/border agency inspections.',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
    },
    {
      key: 'carrierContracts',
      title: 'Direct Ocean Liner Slot Charters',
      description: 'Allocate contracted TEU slots across MSC, Maersk, CMA CGM, and ONE service loops.',
      icon: <Ship className="w-4 h-4 text-cyan-500" />,
    },
    {
      key: 'ledgerInvoicing',
      title: 'Freight Invoicing & Receivables Ledger',
      description: 'Issue ocean freight invoices, collect local handling fees, and record payment settlement.',
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
    },
    {
      key: 'extraTelemetry',
      title: 'Advanced Nautical Telemetry & Weather',
      description: 'Expose live sea wave heights, wind knots, typhoon warnings, and canal convoy queuing.',
      icon: <Sliders className="w-4 h-4 text-sky-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="p-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg shadow-lg flex items-center justify-between text-xs font-mono animate-fade-in border border-neutral-700">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white dark:hover:text-black ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* NVOCC Company Header Banner */}
      <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              NVOCC CARRIER SETTINGS
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              FMC FMC-NVOCC License · Multi-Portal RBAC Controller
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {currentWorkspace.name} Settings & Portal Permission Manager
          </h2>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Configure isolated client portals, sub-agent accounts, and customized feature visibility across Finance, Forwarders, and Shippers.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-right">
            <span className="text-[10px] text-neutral-400 block">NVOCC License</span>
            <span className="font-bold text-neutral-900 dark:text-white">{currentWorkspace.registrationNo}</span>
          </div>
          <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-right">
            <span className="text-[10px] text-neutral-400 block">HQ Operations</span>
            <span className="font-bold text-neutral-900 dark:text-white">{currentWorkspace.hqCity}</span>
          </div>
        </div>
      </div>

      {/* Main Section: Sub-Portals & Role Permission Manager */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                PORTAL PERMISSION TOGGLES (RBAC)
              </span>
              <span className="text-xs text-neutral-400">· Dynamic Feature Access Controller</span>
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
              Select Portal / Role to Configure Visible Modules
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Changes apply immediately across user sessions</span>
          </div>
        </div>

        {/* Roles / Portals Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {permissions.map((p) => {
            const isSelected = p.roleId === selectedRoleId;
            return (
              <button
                key={p.roleId}
                onClick={() => setSelectedRoleId(p.roleId)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                    {p.roleCategory}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-neutral-900 dark:text-white" />}
                </div>

                <div className="font-bold text-xs text-neutral-900 dark:text-white mt-1.5 truncate">
                  {p.roleName.split(' ')[0]} {p.roleName.split(' ')[1] || ''}
                </div>

                <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">
                  {Object.values(p.permissions).filter(Boolean).length} Active Features
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Role Configuration Detail Panel */}
        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white font-sans">
                  {selectedRoleConfig.roleName}
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                  {selectedRoleConfig.roleCategory}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                {selectedRoleConfig.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">
                {selectedRoleId === 'finance_staff' ? 'Finance Persona Customization' : 'Customized Role'}
              </span>
            </div>
          </div>

          {/* Toggle Switches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissionItems.map((item) => {
              const isEnabled = selectedRoleConfig.permissions[item.key];
              return (
                <div
                  key={item.key}
                  className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                    isEnabled
                      ? 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 shadow-xs'
                      : 'bg-neutral-100/60 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900 dark:text-white font-sans">
                          {item.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                            isEnabled
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {isEnabled ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Toggle Switch Button */}
                  <button
                    type="button"
                    onClick={() => handleToggle(item.key, item.title)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                    role="switch"
                    aria-checked={isEnabled}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-neutral-900 shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional NVOCC Policy & Fleet Configurations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ocean Carrier Slot Allocation Contracts */}
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <span className="font-bold text-xs font-mono uppercase text-neutral-500">
              Contracted Ocean Liner Charters
            </span>
            <span className="text-xs text-neutral-400 font-mono">Q3/Q4 Active</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 dark:text-white">MSC Service Contract #SC-881902</span>
                <div className="text-[11px] text-neutral-400">TP-EB Pacific Route · 580 TEUs / Mo</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold">
                TIER 1 PREFERRED
              </span>
            </div>

            <div className="p-2.5 rounded border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 dark:text-white">Maersk Line Agreement #ML-99014</span>
                <div className="text-[11px] text-neutral-400">Asia-Europe Loop · 410 TEUs / Mo</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-[10px]">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Demurrage & Detention Tariff Defaults */}
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <span className="font-bold text-xs font-mono uppercase text-neutral-500">
              Demurrage & Detention Tariff Guard
            </span>
            <span className="text-xs text-neutral-400 font-mono">FMC Enforced</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">Dry Cargo Free Days</span>
              <span className="font-bold text-sm text-neutral-900 dark:text-white">7 Calendar Days</span>
            </div>
            <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">Reefer Box Free Days</span>
              <span className="font-bold text-sm text-neutral-900 dark:text-white">4 Calendar Days</span>
            </div>
            <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">Standard Per-Diem Fee</span>
              <span className="font-bold text-sm text-neutral-900 dark:text-white">$165.00 / Box / Day</span>
            </div>
            <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">Overdue Tier 2 (&gt;5d)</span>
              <span className="font-bold text-sm text-rose-600 dark:text-rose-400">$245.00 / Box / Day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
