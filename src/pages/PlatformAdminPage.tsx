import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Company } from '../types';
import {
  Server,
  Building2,
  DollarSign,
  TrendingUp,
  Plus,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';

export const PlatformAdminPage: React.FC = () => {
  const {
    companies,
    toggleCompanyStatus,
    updateCompanyPlan,
    provisionCompany,
    auditLogs
  } = useApp();

  const [isProvisioningOpen, setIsProvisioningOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newReg, setNewReg] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newPlan, setNewPlan] = useState<Company['plan']>('Scale Pro');
  const [newEmail, setNewEmail] = useState('');

  const totalMrr = companies.reduce((s, c) => s + c.mrrUsd, 0);
  const totalUsers = companies.reduce((s, c) => s + c.usersCount, 0);
  const totalTeus = companies.reduce((s, c) => s + c.teusThisMonth, 0);

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = companies.length + 1;
    const newComp: Company = {
      id: `COMP-00${nextNum}`,
      name: newName,
      registrationNo: newReg,
      hqCity: newCity,
      country: newCountry,
      plan: newPlan,
      teusThisMonth: newPlan === 'Enterprise Plus' ? 1200 : newPlan === 'Scale Pro' ? 650 : 300,
      status: 'Active',
      usersCount: newPlan === 'Enterprise Plus' ? 24 : 12,
      mrrUsd: newPlan === 'Enterprise Plus' ? 4950 : newPlan === 'Scale Pro' ? 2850 : 1750,
      adminEmail: newEmail
    };

    provisionCompany(newComp);
    setIsProvisioningOpen(false);
    setNewName('');
    setNewReg('');
    setNewCity('');
    setNewEmail('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              SAAS PLATFORM PLANE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Root Super-Administrator
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Shiplot SaaS Tenant Administration & MRR
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage licensed NVOCC carrier tenants, subscription tiers, platform usage quotas, and security audit logs
          </p>
        </div>

        <button
          onClick={() => setIsProvisioningOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New NVOCC Carrier</span>
        </button>
      </div>

      {/* Global SaaS KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Total Monthly Recurring Revenue (MRR)</span>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            ${totalMrr.toLocaleString()} USD
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
            Across {companies.length} NVOCC carrier workspaces
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Active Tenant Workspaces</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {companies.filter(c => c.status === 'Active').length} Active
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {companies.filter(c => c.status === 'Suspended').length} Suspended (billing hold)
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Global Seat Licenses</span>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {totalUsers} Operators
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Internal ops, forwarders & finance desk
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Monthly Managed Quota</span>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            {totalTeus.toLocaleString()} TEUs
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Active container slots provisioned
          </span>
        </div>
      </div>

      {/* Provisioning Modal Form */}
      {isProvisioningOpen && (
        <div className="p-5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
              Provision New NVOCC Carrier Workspace
            </h3>
            <button
              onClick={() => setIsProvisioningOpen(false)}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleProvisionSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">Company Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Oceanic Lines (NVOCC)"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">FMC Registration No</label>
              <input
                type="text"
                required
                placeholder="US-FMC-NVOCC-xxxxx"
                value={newReg}
                onChange={e => setNewReg(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">HQ City</label>
              <input
                type="text"
                required
                placeholder="City, State"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">Subscription Plan</label>
              <select
                value={newPlan}
                onChange={e => setNewPlan(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="Growth">Growth ($1,750/mo - 600 TEU)</option>
                <option value="Scale Pro">Scale Pro ($2,850/mo - 1,200 TEU)</option>
                <option value="Enterprise Plus">Enterprise Plus ($4,950/mo - Unlimited)</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">Tenant Administrator Email</label>
              <input
                type="email"
                required
                placeholder="admin@carrier.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Deploy Workspace
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tenants Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
          Active Multi-Tenant Workspaces
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px]">
                <th className="py-2.5 px-3">Tenant ID</th>
                <th className="py-2.5 px-3">Carrier Legal Name</th>
                <th className="py-2.5 px-3">FMC License</th>
                <th className="py-2.5 px-3">HQ / Country</th>
                <th className="py-2.5 px-3">Plan / MRR</th>
                <th className="py-2.5 px-3">Throughput</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {companies.map(c => {
                const isActive = c.status === 'Active';
                return (
                  <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                      {c.id}
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-neutral-900 dark:text-white">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{c.adminEmail}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                      {c.registrationNo}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                      {c.hqCity}, {c.country}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-900 dark:text-white">{c.plan}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">${c.mrrUsd}/mo</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200">
                      {c.teusThisMonth} TEUs
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => toggleCompanyStatus(c.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium font-sans ${
                          isActive
                            ? 'border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
          Platform Security Audit Stream
        </h3>

        <div className="space-y-2">
          {auditLogs.map(log => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 text-xs font-mono flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-neutral-900 dark:text-white">
                  {log.action}
                </div>
                <div className="text-[11px] text-neutral-500">
                  Tenant: {log.tenantName} ({log.tenantId}) · User: {log.user}
                </div>
              </div>
              <span className="text-[10px] text-neutral-400">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
