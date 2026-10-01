import React, { useState } from 'react';
import { WorkspaceCompany, PlatformAuditLog } from '../../types/shipping';
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Server,
  Plus,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
  Globe,
  Radio,
  FileCheck,
  X,
} from 'lucide-react';

interface ShiplotAdminPortalProps {
  companies: WorkspaceCompany[];
  auditLogs: PlatformAuditLog[];
  onToggleCompanyStatus: (id: string) => void;
  onUpgradePlan: (id: string, newPlan: string) => void;
  onProvisionCompany: (newComp: WorkspaceCompany) => void;
}

export const ShiplotAdminPortal: React.FC<ShiplotAdminPortalProps> = ({
  companies,
  auditLogs,
  onToggleCompanyStatus,
  onUpgradePlan,
  onProvisionCompany,
}) => {
  const [activeTab, setActiveTab] = useState<'companies' | 'subscriptions' | 'audit' | 'gateway'>('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);

  // New company form state
  const [newName, setNewName] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newPlan, setNewPlan] = useState('Scale Pro');
  const [newEmail, setNewEmail] = useState('');
  const [newTeus, setNewTeus] = useState(1000);

  const totalMrr = companies
    .filter((c) => c.status === 'Active')
    .reduce((sum, c) => sum + (c.mrrUsd || 2500), 0);
  const totalTeus = companies.reduce((sum, c) => sum + c.teusThisMonth, 0);
  const activeCompanies = companies.filter((c) => c.status === 'Active').length;
  const totalUsers = companies.reduce((sum, c) => sum + (c.usersCount || 10), 0);

  const filteredCompanies = companies.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.registrationNo.toLowerCase().includes(q) ||
      c.hqCity.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    );
  });

  const handleCreateCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRegNo) return;

    const newCompany: WorkspaceCompany = {
      id: `COMP-00${companies.length + 1}`,
      name: newName,
      registrationNo: newRegNo,
      hqCity: newCity || 'New York, NY',
      country: newCountry,
      plan: newPlan,
      teusThisMonth: Number(newTeus),
      status: 'Active',
      usersCount: 15,
      mrrUsd: newPlan === 'Enterprise Plus' ? 4950 : newPlan === 'Scale Pro' ? 2850 : 1750,
      adminEmail: newEmail || `ops@${newName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    };

    onProvisionCompany(newCompany);
    setIsProvisionOpen(false);
    // Reset form
    setNewName('');
    setNewRegNo('');
    setNewCity('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* SaaS Admin Banner */}
      <div className="p-5 rounded-lg bg-neutral-950 text-white border border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-neutral-900">
              SHIPLOT PLATFORM CONTROL PLANE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Provider Multi-Tenant Root Administration
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight mt-1">
            Global SaaS Operations & NVOCC Tenant Fleet
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Manage licensed NVOCC forwarders, tenant quota limits, subscription billing, carrier EDI feeds, and audit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProvisionOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-950 hover:bg-neutral-100 rounded text-xs font-mono font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New NVOCC</span>
          </button>
        </div>
      </div>

      {/* SaaS Executive KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Active NVOCC Tenants</span>
            <Building2 className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            {activeCompanies} / {companies.length}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            {companies.filter((c) => c.status === 'Suspended').length} Suspended accounts
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Monthly Recurring (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalMrr.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            ARR Run-rate: ${(totalMrr * 12).toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Global Container Quota</span>
            <Server className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            {totalTeus.toLocaleString()} TEUs
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            Across 14 international trade corridors
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Platform EDI Gateway</span>
            <Radio className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            99.98%
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
            INTTRA & DCSA Live Connected
          </div>
        </div>
      </div>

      {/* Main SaaS Control Tabs */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-4">
        {/* Nav Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm">
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${
                activeTab === 'companies'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              NVOCC Client Companies ({companies.length})
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${
                activeTab === 'subscriptions'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Subscription Plans & Pricing
            </button>

            <button
              onClick={() => setActiveTab('gateway')}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${
                activeTab === 'gateway'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Ocean EDI Gateway & Integrations
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${
                activeTab === 'audit'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Security Audit Trail ({auditLogs.length})
            </button>
          </div>

          {activeTab === 'companies' && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search tenant name or FMC lic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
              />
            </div>
          )}
        </div>

        {/* TAB 1: COMPANIES DIRECTORY & STATUS MANAGEMENT */}
        {activeTab === 'companies' && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Tenant ID / Name</th>
                    <th className="py-2.5 px-3">FMC / Authority Lic</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Subscription Plan</th>
                    <th className="py-2.5 px-3">Monthly TEUs</th>
                    <th className="py-2.5 px-3">MRR Rate</th>
                    <th className="py-2.5 px-3">Account Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredCompanies.map((c) => {
                    const isSuspended = c.status === 'Suspended';
                    return (
                      <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="py-3 px-3">
                          <div className="font-bold text-neutral-900 dark:text-white">{c.name}</div>
                          <div className="text-[11px] text-neutral-400">
                            ID: {c.id} · Admin: {c.adminEmail}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {c.registrationNo}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div>{c.hqCity}</div>
                          <div className="text-[10px] text-neutral-400">{c.country}</div>
                        </td>

                        <td className="py-3 px-3">
                          <select
                            value={c.plan}
                            onChange={(e) => onUpgradePlan(c.id, e.target.value)}
                            className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white font-mono focus:outline-none"
                          >
                            <option value="Starter">Starter</option>
                            <option value="Growth">Growth</option>
                            <option value="Scale Pro">Scale Pro</option>
                            <option value="Enterprise Plus">Enterprise Plus</option>
                          </select>
                        </td>

                        <td className="py-3 px-3 font-bold tabular-nums text-neutral-900 dark:text-white">
                          {c.teusThisMonth.toLocaleString()} TEU
                        </td>

                        <td className="py-3 px-3 font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                          ${c.mrrUsd || 2850}/mo
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] border font-bold ${
                              isSuspended
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onToggleCompanyStatus(c.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-colors ${
                              isSuspended
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SUBSCRIPTION PLANS & TIERS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">Growth Plan</span>
                    <div className="text-[11px] text-neutral-400 font-sans">For boutique freight forwarders</div>
                  </div>
                  <span className="text-base font-bold text-neutral-900 dark:text-white">$1,750 / mo</span>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700 text-[11px] font-sans">
                  <div className="py-1.5 flex justify-between"><span>Max Monthly Throughput</span><strong>750 TEU</strong></div>
                  <div className="py-1.5 flex justify-between"><span>Forwarder & Staff Seats</span><strong>15 Seats</strong></div>
                  <div className="py-1.5 flex justify-between"><span>Carrier EDI Feeds</span><strong>2 Liners</strong></div>
                  <div className="py-1.5 flex justify-between"><span>Demurrage Guard</span><strong>Included</strong></div>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-neutral-900 dark:border-white bg-white dark:bg-neutral-900 space-y-3 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">Scale Pro</span>
                    <span className="ml-2 px-1.5 py-0.2 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[9px] font-bold">POPULAR</span>
                    <div className="text-[11px] text-neutral-400 font-sans">For regional NVOCC carriers</div>
                  </div>
                  <span className="text-base font-bold text-neutral-900 dark:text-white">$2,850 / mo</span>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800 text-[11px] font-sans">
                  <div className="py-1.5 flex justify-between"><span>Max Monthly Throughput</span><strong>2,000 TEU</strong></div>
                  <div className="py-1.5 flex justify-between"><span>Forwarder & Staff Seats</span><strong>40 Seats</strong></div>
                  <div className="py-1.5 flex justify-between"><span>Carrier EDI Feeds</span><strong>All Major 10 Liners</strong></div>
                  <div className="py-1.5 flex justify-between"><span>AIS Satellite Map</span><strong>Included (Real-time)</strong></div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">Enterprise Plus</span>
                    <div className="text-[11px] text-neutral-400 font-sans">Global multi-branch NVOCCs</div>
                  </div>
                  <span className="text-base font-bold text-neutral-900 dark:text-white">$4,950 / mo</span>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700 text-[11px] font-sans">
                  <div className="py-1.5 flex justify-between"><span>Max Monthly Throughput</span><strong>Unlimited TEU</strong></div>
                  <div className="py-1.5 flex justify-between"><span>Forwarder & Staff Seats</span><strong>Unlimited</strong></div>
                  <div className="py-1.5 flex justify-between"><span>Custom SLA & EDI</span><strong>Dedicated Tunnel</strong></div>
                  <div className="py-1.5 flex justify-between"><span>White-label Shipper URL</span><strong>Included</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OCEAN EDI GATEWAY & INTEGRATIONS */}
        {activeTab === 'gateway' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 dark:text-white">INTTRA Ocean Network Gateway</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold">
                    CONNECTED
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Live EDI 300 (Reservation), 304 (Shipping Instructions), and 310 (Freight Receipt and Invoice) pipeline.
                </p>
                <div className="text-[10px] text-neutral-400">Latency: 28ms · Last heartbeat: 10s ago</div>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 dark:text-white">DCSA Electronic Bill of Lading (eBL)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Digital Container Shipping Association compliant cryptographic title transfer and tokenization protocol.
                </p>
                <div className="text-[10px] text-neutral-400">Standards: DCSA Open API v2.2.0</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2 px-3">Timestamp (UTC)</th>
                    <th className="py-2 px-3">Tenant Name</th>
                    <th className="py-2 px-3">Audit Action Event</th>
                    <th className="py-2 px-3">Operator User</th>
                    <th className="py-2 px-3">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-3 text-neutral-400">{log.timestamp}</td>
                      <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-white">{log.tenantName}</td>
                      <td className="py-2.5 px-3 text-neutral-700 dark:text-neutral-300">{log.action}</td>
                      <td className="py-2.5 px-3 text-neutral-500">{log.user}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            log.severity === 'critical'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                              : log.severity === 'warning'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                          }`}
                        >
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* PROVISION NEW NVOCC COMPANY MODAL */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans">
                  Provision New NVOCC Workspace
                </h3>
              </div>
              <button
                onClick={() => setIsProvisionOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="p-5 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-500 mb-1">NVOCC Company Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Oceanic Logistics Corp."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">FMC / Authority License No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. US-FMC-NVOCC-99410"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 mb-1">HQ Port / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Los Angeles, CA"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 mb-1">Country</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 mb-1">Subscription Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Growth">Growth</option>
                    <option value="Scale Pro">Scale Pro</option>
                    <option value="Enterprise Plus">Enterprise Plus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 mb-1">Initial TEU Slot Quota</label>
                  <input
                    type="number"
                    value={newTeus}
                    onChange={(e) => setNewTeus(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">NVOCC Admin Email</label>
                <input
                  type="email"
                  placeholder="admin@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2 bg-neutral-50 dark:bg-neutral-950 rounded">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold font-sans"
                >
                  Provision & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
