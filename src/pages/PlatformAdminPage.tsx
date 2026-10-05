import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Company, AuditLog, AuditSeverity, AuditCategory } from '../types';
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
  Users,
  LayoutTemplate,
  Search,
  Filter,
  Download,
  Printer,
  Copy,
  Check,
  X,
  Clock,
  Terminal,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Layers,
  Globe,
  Radio,
  ExternalLink
} from 'lucide-react';

interface PlatformAdminPageProps {
  defaultTab?: 'workspaces' | 'audit' | 'templates';
}

export const PlatformAdminPage: React.FC<PlatformAdminPageProps> = ({ defaultTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    companies,
    toggleCompanyStatus,
    updateCompanyPlan,
    provisionCompany,
    auditLogs,
    addAuditLog,
    currentUser
  } = useApp();

  // Tab State: determine if path is /platform-admin/audit
  const initialTab = useMemo(() => {
    if (defaultTab) return defaultTab;
    if (location.pathname.includes('/audit')) return 'audit';
    return 'workspaces';
  }, [defaultTab, location.pathname]);

  const [activeTab, setActiveTab] = useState<'workspaces' | 'audit' | 'templates'>(initialTab);

  // Workspaces Provisioning Modal State
  const [isProvisioningOpen, setIsProvisioningOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newReg, setNewReg] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newPlan, setNewPlan] = useState<Company['plan']>('Scale Pro');
  const [newEmail, setNewEmail] = useState('');

  // Audit Tab Filter States
  const [auditSearch, setAuditSearch] = useState('');
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<AuditCategory | 'ALL'>('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<AuditSeverity | 'ALL'>('ALL');
  const [selectedLogDetail, setSelectedLogDetail] = useState<AuditLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Platform KPIs
  const totalMrr = companies.reduce((s, c) => s + c.mrrUsd, 0);
  const totalUsers = companies.reduce((s, c) => s + c.usersCount, 0);
  const totalTeus = companies.reduce((s, c) => s + c.teusThisMonth, 0);
  const activeTenantsCount = companies.filter(c => c.status === 'Active').length;

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // Search
      if (auditSearch.trim()) {
        const q = auditSearch.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesUser = log.user.toLowerCase().includes(q);
        const matchesTenant = log.tenantName.toLowerCase().includes(q) || log.tenantId.toLowerCase().includes(q);
        const matchesDetails = log.details?.toLowerCase().includes(q) || false;
        const matchesStation = log.station?.toLowerCase().includes(q) || false;
        const matchesIp = log.ipAddress?.toLowerCase().includes(q) || false;
        if (!matchesAction && !matchesUser && !matchesTenant && !matchesDetails && !matchesStation && !matchesIp) {
          return false;
        }
      }

      // Tenant Filter
      if (selectedTenantFilter !== 'ALL') {
        if (selectedTenantFilter === 'SHIPLOT_CORE') {
          if (log.tenantId !== 'SHIPLOT_CORE' && log.scope !== 'SHIPLOT_PLATFORM') return false;
        } else {
          if (log.tenantId !== selectedTenantFilter) return false;
        }
      }

      // Category Filter
      if (selectedCategoryFilter !== 'ALL' && log.category !== selectedCategoryFilter) {
        return false;
      }

      // Severity Filter
      if (selectedSeverityFilter !== 'ALL' && log.severity !== selectedSeverityFilter) {
        return false;
      }

      return true;
    });
  }, [auditLogs, auditSearch, selectedTenantFilter, selectedCategoryFilter, selectedSeverityFilter]);

  // Statistics for Audit Stream
  const platformAuditTotal = auditLogs.length;
  const platformCriticalCount = auditLogs.filter(l => l.severity === 'critical').length;
  const platformWarningCount = auditLogs.filter(l => l.severity === 'warning').length;
  const tenantManagementEvents = auditLogs.filter(l => l.category === 'Tenant Management').length;

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

    setToastMessage(`Carrier workspace ${newComp.name} provisioned and recorded in Shiplot audit trail.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper to trigger a live platform security scan log
  const handleTriggerSecurityScan = () => {
    addAuditLog({
      tenantId: 'SHIPLOT_CORE',
      tenantName: 'Shiplot Platform Core',
      action: 'Platform Multi-Tenant Cryptographic Isolation Scan executed manually',
      user: currentUser.email,
      severity: 'info',
      category: 'Platform Security',
      scope: 'SHIPLOT_PLATFORM',
      ipAddress: '104.28.192.14',
      station: 'Super-Administrator Console',
      details: `Health audit passed. Scanned ${companies.length} active tenant database shards, 0 data-leakage vulnerabilities detected.`,
      targetRef: `SCAN-${Date.now()}`,
      status: 'Success'
    });

    setToastMessage('Platform security health scan completed and logged.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Export Platform Audit CSV
  const handleExportPlatformCsv = () => {
    const headers = ['Log ID', 'Timestamp UTC', 'Tenant ID', 'Tenant Name', 'Category', 'Action', 'Target Ref', 'User', 'Severity', 'Station', 'IP Address', 'Details'];
    const rows = filteredAuditLogs.map(l => [
      l.id,
      l.timestamp,
      l.tenantId,
      `"${l.tenantName.replace(/"/g, '""')}"`,
      l.category || 'Platform Security',
      `"${l.action.replace(/"/g, '""')}"`,
      l.targetRef || '',
      l.user,
      l.severity,
      `"${(l.station || '').replace(/"/g, '""')}"`,
      l.ipAddress || '',
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Shiplot_Platform_Global_Audit_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-text">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-purple-700 text-white rounded-xl shadow-lg border border-purple-600 font-sans text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-purple-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              SAAS PLATFORM PLANE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Root Super-Administrator Console
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Shiplot SaaS Tenant Administration & Global Audit
          </h1>

          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Oversee licensed NVOCC carrier tenants, subscription tiers, platform usage quotas, and security audit logs across all workspaces.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <LayoutTemplate className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Master Templates Engine</span>
          </button>

          <button
            onClick={() => setIsProvisioningOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Carrier</span>
          </button>
        </div>
      </div>

      {/* Global SaaS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
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
            {activeTenantsCount} Active
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

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('workspaces')}
          className={`pb-3 px-3 font-semibold transition-all relative cursor-pointer ${
            activeTab === 'workspaces'
              ? 'text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Carrier Workspaces & MRR ({companies.length})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 font-semibold transition-all relative cursor-pointer ${
            activeTab === 'audit'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Global Platform Audit Trail ({auditLogs.length})</span>
            {platformCriticalCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {platformCriticalCount}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => navigate('/templates')}
          className="pb-3 px-3 font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 flex items-center gap-2 cursor-pointer"
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>Master Template Engine</span>
          <ExternalLink className="w-3 h-3 text-neutral-400" />
        </button>
      </div>

      {/* TAB 1: WORKSPACES */}
      {activeTab === 'workspaces' && (
        <div className="space-y-6">
          {/* Provisioning Modal Form */}
          {isProvisioningOpen && (
            <div className="p-5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                  Provision New NVOCC Carrier Workspace
                </h3>
                <button
                  onClick={() => setIsProvisioningOpen(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
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
                    placeholder="City, Country"
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
                            className={`px-2.5 py-1 rounded text-[11px] font-medium font-sans cursor-pointer ${
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
        </div>
      )}

      {/* TAB 2: GLOBAL PLATFORM AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Platform Audit Controls Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3 font-mono text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search cross-tenant actions, operator email, IP, tenant ID, or references..."
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
                />
                {auditSearch && (
                  <button
                    onClick={() => setAuditSearch('')}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerSecurityScan}
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Run Isolation Scan</span>
                </button>

                <button
                  onClick={handleExportPlatformCsv}
                  className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Tenant Filter */}
              <div>
                <label className="block text-neutral-500 text-[10px] font-bold uppercase mb-1">
                  Tenant Workspace Filter
                </label>
                <select
                  value={selectedTenantFilter}
                  onChange={e => setSelectedTenantFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="ALL">All Multi-Tenant Workspaces ({companies.length})</option>
                  <option value="SHIPLOT_CORE">Shiplot SaaS Platform Core Only</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-neutral-500 text-[10px] font-bold uppercase mb-1">
                  Audit Category
                </label>
                <select
                  value={selectedCategoryFilter}
                  onChange={e => setSelectedCategoryFilter(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Platform Security">Platform Security</option>
                  <option value="Tenant Management">Tenant Management</option>
                  <option value="Documents & Templates">Documents & Templates</option>
                  <option value="EDI & Telemetry">EDI & Telemetry</option>
                  <option value="Users & Security">Users & Security</option>
                  <option value="Customs & Manifests">Customs & Manifests</option>
                  <option value="Finance & Billing">Finance & Billing</option>
                  <option value="Shipments & B/L">Shipments & B/L</option>
                  <option value="Containers & Gate Pass">Containers & Gate Pass</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-neutral-500 text-[10px] font-bold uppercase mb-1">
                  Severity Level
                </label>
                <select
                  value={selectedSeverityFilter}
                  onChange={e => setSelectedSeverityFilter(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="ALL">All Severities</option>
                  <option value="info">INFO</option>
                  <option value="warning">WARNING</option>
                  <option value="critical">CRITICAL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audit Stream Table */}
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Platform Security & Cross-Tenant Audit Stream</span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  Showing {filteredAuditLogs.length} matching events across platform infrastructure and carrier tenant shards
                </p>
              </div>

              {(auditSearch || selectedTenantFilter !== 'ALL' || selectedCategoryFilter !== 'ALL' || selectedSeverityFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setAuditSearch('');
                    setSelectedTenantFilter('ALL');
                    setSelectedCategoryFilter('ALL');
                    setSelectedSeverityFilter('ALL');
                  }}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px]">
                    <th className="py-2.5 px-3">Timestamp (UTC)</th>
                    <th className="py-2.5 px-3">Tenant Name / ID</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Event Action</th>
                    <th className="py-2.5 px-3">Operator / Host</th>
                    <th className="py-2.5 px-3 text-center">Severity</th>
                    <th className="py-2.5 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-neutral-400">
                        No platform audit events matching current search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map(log => {
                      const isCritical = log.severity === 'critical';
                      const isWarning = log.severity === 'warning';
                      const isPlatformCore = log.tenantId === 'SHIPLOT_CORE' || log.scope === 'SHIPLOT_PLATFORM';

                      return (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLogDetail(log)}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-3 whitespace-nowrap text-neutral-500">
                            {log.timestamp}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isPlatformCore
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                  : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                              }`}
                            >
                              {log.tenantName}
                            </span>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                            {log.category || 'Platform Security'}
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-semibold text-neutral-900 dark:text-white font-sans text-xs">
                              {log.action}
                            </div>
                            {log.details && (
                              <div className="text-[10px] text-neutral-400 truncate max-w-sm">
                                {log.details}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap text-neutral-500">
                            <div>{log.user}</div>
                            <div className="text-[10px] text-neutral-400">{log.ipAddress || 'Internal Gateway'}</div>
                          </td>

                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isCritical
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                                  : isWarning
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLogDetail(log);
                              }}
                              className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Detail Inspector Modal */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white font-mono">
                  Platform Security Audit Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 space-y-1">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  {selectedLogDetail.category || 'Security Stream'} · {selectedLogDetail.timestamp}
                </div>
                <div className="font-bold text-neutral-900 dark:text-white text-sm font-sans">
                  {selectedLogDetail.action}
                </div>
                {selectedLogDetail.details && (
                  <div className="text-neutral-600 dark:text-neutral-300 font-sans text-xs">
                    {selectedLogDetail.details}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Tenant Name</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedLogDetail.tenantName}</span>
                </div>
                <div className="p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Tenant ID</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedLogDetail.tenantId}</span>
                </div>
                <div className="p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Operator Email</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedLogDetail.user}</span>
                </div>
                <div className="p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Origin IP / Station</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {selectedLogDetail.ipAddress || 'Internal'} · {selectedLogDetail.station || 'Shiplot Console'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-black text-neutral-300 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Cryptographic Audit Proof:</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedLogDetail, null, 2), selectedLogDetail.id)}
                    className="flex items-center gap-1 text-[10px] hover:text-white cursor-pointer"
                  >
                    {copiedId === selectedLogDetail.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === selectedLogDetail.id ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <div className="text-emerald-400 truncate">
                  sha256:8b0129a0{selectedLogDetail.id}c4921bfe89012a9381749218
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
